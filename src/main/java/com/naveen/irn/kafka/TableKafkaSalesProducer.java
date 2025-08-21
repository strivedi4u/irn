package com.naveen.irn.kafka;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.naveen.irn.sql.IrnSqls;
import jakarta.annotation.PostConstruct;
import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.kafka.core.KafkaAdmin;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.net.Socket;
import java.util.List;
import java.util.Map;

@Service
public class TableKafkaSalesProducer {

    private static final String TOPIC = "oracle-table-sales-topic";

    private static volatile String latestBackupJson = "[]";

    public static String getLatestBackupJson() {
        return latestBackupJson;
    }

    @Autowired
    @Qualifier("salesJdbcTemplate")
    private org.springframework.jdbc.core.JdbcTemplate JdbcTemplate;

    @Autowired
    private KafkaTemplate<String, String> kafkaTemplate;

    @Autowired
    private KafkaAdmin kafkaAdmin;

    private final ObjectMapper objectMapper = new ObjectMapper();

    private boolean isKafkaAvailable() {
        try (Socket socket = new Socket("localhost", 9092)) {
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    @Scheduled(fixedDelay = 3000)
    public void fetchAndSendTableData() {
        System.out.println("Scheduled fetchAndSendTableData started (Sales).");
        if (!isKafkaAvailable()) {
            System.out.println("Kafka broker is not available at localhost:9092. Skipping send. Please start your local Kafka server.");
            return;
        }
        String sql = IrnSqls.SALES_IRN_SQL;
        System.out.println("Executing SQL for Kafka Sales producer: " + sql);
        List<Map<String, Object>> rows = JdbcTemplate.queryForList(sql);
        System.out.println("Fetched " + rows.size() + " rows from DB for Kafka (Sales).");
        try {
            String json = objectMapper.writeValueAsString(rows);
            System.out.println("Sending data to Kafka topic: " + TOPIC);
            kafkaTemplate.send(TOPIC, json).get();
            latestBackupJson = json;
            System.out.println("Data sent to Kafka and backup updated (Sales).");
        } catch (Exception e) {
            System.out.println("Error sending data to Kafka, sending empty array (Sales).");
            e.printStackTrace();
            try {
                kafkaTemplate.send(TOPIC, "[]").get();
            } catch (Exception ex) {
                System.out.println("Failed to send empty array to Kafka (Sales).");
                ex.printStackTrace();
            }
            latestBackupJson = "[]";
        }
    }

    @PostConstruct
    public void createTopicIfNotExists() {
        System.out.println("Checking/creating Kafka topic: " + TOPIC);
        if (!isKafkaAvailable()) {
            System.out.println("Kafka broker is not available at localhost:9092. Skipping topic creation. Please start your local Kafka server.");
            return;
        }
        try {
            kafkaAdmin.createOrModifyTopics(new NewTopic(TOPIC, 1, (short) 1));
            System.out.println("Topic checked/created: " + TOPIC);
        } catch (Exception e) {
            if (isKafkaAvailable()) {
                System.out.println("Topic may already exist or error occurred during topic creation (Sales).");
                e.printStackTrace();
            } else {
                System.out.println("Kafka broker became unavailable during topic creation (Sales). Skipping stack trace.");
            }
        }
    }
}

