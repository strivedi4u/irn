package com.naveen.irn.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import com.naveen.irn.kafka.TableKafkaDmsConsumer;
import org.springframework.jdbc.core.JdbcTemplate;
import java.util.List;
import java.util.Map;
import com.naveen.irn.sql.IrnSqls;
import org.springframework.messaging.simp.SimpMessagingTemplate;

@RestController
public class DmsIRNController {

    @Autowired
    private TableKafkaDmsConsumer tableKafkaDmsConsumer;

    @Autowired
    @Qualifier("dmsJdbcTemplate")
    private JdbcTemplate jdbcTemplate;

    // Inject SimpMessagingTemplate for WebSocket messaging
    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    int a = 0;

    @GetMapping("/api/dms-irn")
    public Object getDmsIRN() {
        System.out.println("Received request for /api/dms-irn");
        try {
            String kafkaData = tableKafkaDmsConsumer.getLatestData();
            System.out.println("Fetched data from Kafka: " + kafkaData);
            if (kafkaData == null || kafkaData.trim().isEmpty() || "[]".equals(kafkaData.trim())) {
                a++;
                System.out.println("Kafka data is empty, fetching from DMS DB. Attempt: " + a);
                // Call ALTER SESSION before executing DMS query
                com.naveen.irn.sql.IrnSqls.setInvisibleIndexesSession(jdbcTemplate);
                System.out.println("Executing SQL: " + IrnSqls.DMS_IRN_SQL);
                List<Map<String, Object>> rows = jdbcTemplate.queryForList(IrnSqls.DMS_IRN_SQL);
                System.out.println("Fetched data from DMS DB: " + rows.size() + " rows");
                // Send data to WebSocket topic
                messagingTemplate.convertAndSend("/topic/dms-irn", rows);
                return rows;
            }
            System.out.println("Returning data from Kafka");
            // Send data to WebSocket topic
            messagingTemplate.convertAndSend("/topic/dms-irn", kafkaData);
            return kafkaData;
        } catch (Exception e) {
            a++;
            System.out.println("Error fetching from Kafka, fallback to DMS DB. Attempt: " + a);
            e.printStackTrace();
            System.out.println("Executing SQL (fallback): " + IrnSqls.DMS_IRN_SQL);
//            try {
//                // Call ALTER SESSION before executing DMS query (fallback)
//                com.naveen.irn.sql.IrnSqls.setInvisibleIndexesSession(jdbcTemplate);
//                List<Map<String, Object>> rows = jdbcTemplate.queryForList(IrnSqls.DMS_IRN_SQL);
//                System.out.println("Fetched data from DMS DB (fallback): " + rows.size() + " rows");
//                // Send data to WebSocket topic
//                messagingTemplate.convertAndSend("/topic/dms-irn", rows);
//                return rows;
//            } catch (Exception ex) {
//                System.out.println("DB fetch also failed, returning empty array.");
//                ex.printStackTrace();
//                // Send empty array to WebSocket topic
//                messagingTemplate.convertAndSend("/topic/dms-irn", new java.util.ArrayList<>());
//                return new java.util.ArrayList<>();
//            }
            return null;
        }
    }

    // Add this endpoint for testing WebSocket broadcast
    @PostMapping("/api/test-dms-irn-broadcast")
    public String testBroadcast(@RequestBody(required = false) Map<String, Object> payload) {
        String msg = payload != null ? payload.toString() : "Test message from backend";
        messagingTemplate.convertAndSend("/topic/dms-irn", msg);
        return "Broadcasted: " + msg;
    }

    // Broadcast the latest DMS IRN data to all WebSocket subscribers
    @PostMapping("/api/broadcast-dms-irn")
    public String broadcastLatestDmsIrn() {
        try {
            String kafkaData = tableKafkaDmsConsumer.getLatestData();
            List<Map<String, Object>> data;
            if (kafkaData == null || kafkaData.trim().isEmpty() || "[]".equals(kafkaData.trim())) {
                data = jdbcTemplate.queryForList(IrnSqls.DMS_IRN_SQL);
            } else {
                try {
                    data = new com.fasterxml.jackson.databind.ObjectMapper().readValue(kafkaData, List.class);
                } catch (Exception ex) {
                    data = new java.util.ArrayList<>();
                }
            }
            messagingTemplate.convertAndSend("/topic/dms-irn", data);
            return "Broadcasted latest DMS IRN data to /topic/dms-irn";
        } catch (Exception e) {
            return "Failed to broadcast: " + e.getMessage();
        }
    }
}
