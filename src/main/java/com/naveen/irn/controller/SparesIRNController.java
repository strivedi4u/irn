package com.naveen.irn.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.naveen.irn.kafka.TableKafkaMaterialConsumer;
import com.naveen.irn.kafka.TableKafkaSparesConsumer;
import com.naveen.irn.sql.IrnSqls;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
public class SparesIRNController {


    @Autowired
    private TableKafkaSparesConsumer tableKafkaSparesConsumer;

    @Autowired
    @Qualifier("sparesJdbcTemplate") // Use the spares datasource
    private JdbcTemplate jdbcTemplate;

    // Inject SimpMessagingTemplate for WebSocket messaging
    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    private final ObjectMapper objectMapper = new ObjectMapper();

    int a = 0;

    @GetMapping("/api/spares-irn")
    public Object getSparesIRN() {
        System.out.println("Received request for /api/spares-irn");
        try {
            String kafkaData = tableKafkaSparesConsumer.getLatestData();
            System.out.println("Fetched data from Kafka: " + kafkaData);
            if (kafkaData == null || kafkaData.trim().isEmpty() || "[]".equals(kafkaData.trim())) {
                a++;
                System.out.println("Kafka data is empty, fetching from DB. Attempt: " + a);
                System.out.println("Executing SQL: " + IrnSqls.SPARES_IRN_SQL);
                List<Map<String, Object>> rows = jdbcTemplate.queryForList(IrnSqls.SPARES_IRN_SQL);
                System.out.println("Fetched data from DB: " + rows.size() + " rows");
                // Send data to WebSocket topic
                messagingTemplate.convertAndSend("/topic/spares-irn", rows);
                return rows;
            }
            System.out.println("Returning data from Kafka");
            // Parse kafkaData to List<Map<String, Object>> before returning and broadcasting
            List<Map<String, Object>> parsedData;
            try {
                parsedData = objectMapper.readValue(kafkaData, List.class);
            } catch (Exception ex) {
                parsedData = new java.util.ArrayList<>();
            }
            messagingTemplate.convertAndSend("/topic/spares-irn", parsedData);
            return parsedData;
        } catch (Exception e) {
            // On any error, fallback to DB
            a++;
            System.out.println("Error fetching from Kafka, fallback to DB. Attempt: " + a);
            e.printStackTrace();
            System.out.println("Executing SQL (fallback): " + IrnSqls.SPARES_IRN_SQL);
            try {
                List<Map<String, Object>> rows = jdbcTemplate.queryForList(IrnSqls.SPARES_IRN_SQL);
                System.out.println("Fetched data from DB (fallback): " + rows.size() + " rows");
                // Send data to WebSocket topic
                messagingTemplate.convertAndSend("/topic/spares-irn", rows);
                return rows;
            } catch (Exception ex) {
                System.out.println("DB fetch also failed, returning empty array.");
                ex.printStackTrace();
                // Send empty array to WebSocket topic
                messagingTemplate.convertAndSend("/topic/spares-irn", new java.util.ArrayList<>());
                return new java.util.ArrayList<>();
            }
        }
    }

    // Broadcast the latest Material IRN data to all WebSocket subscribers
    @PostMapping("/api/broadcast-spares-irn")
    public String broadcastLatestMaterialIrn() {
        try {
            String kafkaData = tableKafkaSparesConsumer.getLatestData();
            List<Map<String, Object>> data;
            if (kafkaData == null || kafkaData.trim().isEmpty() || "[]".equals(kafkaData.trim())) {
                data = jdbcTemplate.queryForList(IrnSqls.SPARES_IRN_SQL);
            } else {
                try {
                    data = objectMapper.readValue(kafkaData, List.class);
                } catch (Exception ex) {
                    data = new java.util.ArrayList<>();
                }
            }
            messagingTemplate.convertAndSend("/topic/spares-irn", data);
            return "Broadcasted latest Material IRN data to /topic/spares-irn";
        } catch (Exception e) {
            return "Failed to broadcast: " + e.getMessage();
        }
    }
}
