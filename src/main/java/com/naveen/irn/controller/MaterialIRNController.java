package com.naveen.irn.controller;

import com.naveen.irn.kafka.TableKafkaMaterialConsumer;
import com.naveen.irn.sql.IrnSqls;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.jdbc.core.JdbcTemplate;
import java.util.List;
import java.util.Map;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import com.fasterxml.jackson.databind.ObjectMapper;

@RestController
public class MaterialIRNController {

    @Autowired
    private TableKafkaMaterialConsumer tableKafkaMaterialConsumer;

    @Autowired
    @Qualifier("materialJdbcTemplate") // Use the material datasource
    private JdbcTemplate jdbcTemplate;

    // Inject SimpMessagingTemplate for WebSocket messaging
    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    private final ObjectMapper objectMapper = new ObjectMapper();

    int a = 0;

    @GetMapping("/api/material-irn")
    public Object getMaterialIRN() {
        System.out.println("Received request for /api/material-irn");
        try {
            String kafkaData = tableKafkaMaterialConsumer.getLatestData();
            System.out.println("Fetched data from Kafka: " + kafkaData);
            if (kafkaData == null || kafkaData.trim().isEmpty() || "[]".equals(kafkaData.trim())) {
                a++;
                System.out.println("Kafka data is empty, fetching from DB. Attempt: " + a);
                System.out.println("Executing SQL: " + IrnSqls.MATERIAL_IRN_SQL);
                List<Map<String, Object>> rows = jdbcTemplate.queryForList(IrnSqls.MATERIAL_IRN_SQL);
                System.out.println("Fetched data from DB: " + rows.size() + " rows");
                // Send data to WebSocket topic
                messagingTemplate.convertAndSend("/topic/material-irn", rows);
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
            messagingTemplate.convertAndSend("/topic/material-irn", parsedData);
            return parsedData;
        } catch (Exception e) {
            // On any error, fallback to DB
            a++;
            System.out.println("Error fetching from Kafka, fallback to DB. Attempt: " + a);
            e.printStackTrace();
            System.out.println("Executing SQL (fallback): " + IrnSqls.MATERIAL_IRN_SQL);
            try {
                List<Map<String, Object>> rows = jdbcTemplate.queryForList(IrnSqls.MATERIAL_IRN_SQL);
                System.out.println("Fetched data from DB (fallback): " + rows.size() + " rows");
                // Send data to WebSocket topic
                messagingTemplate.convertAndSend("/topic/material-irn", rows);
                return rows;
            } catch (Exception ex) {
                System.out.println("DB fetch also failed, returning empty array.");
                ex.printStackTrace();
                // Send empty array to WebSocket topic
                messagingTemplate.convertAndSend("/topic/material-irn", new java.util.ArrayList<>());
                return new java.util.ArrayList<>();
            }
        }
    }

    // Broadcast the latest Material IRN data to all WebSocket subscribers
    @PostMapping("/api/broadcast-material-irn")
    public String broadcastLatestMaterialIrn() {
        try {
            String kafkaData = tableKafkaMaterialConsumer.getLatestData();
            List<Map<String, Object>> data;
            if (kafkaData == null || kafkaData.trim().isEmpty() || "[]".equals(kafkaData.trim())) {
                data = jdbcTemplate.queryForList(IrnSqls.MATERIAL_IRN_SQL);
            } else {
                try {
                    data = objectMapper.readValue(kafkaData, List.class);
                } catch (Exception ex) {
                    data = new java.util.ArrayList<>();
                }
            }
            messagingTemplate.convertAndSend("/topic/material-irn", data);
            return "Broadcasted latest Material IRN data to /topic/material-irn";
        } catch (Exception e) {
            return "Failed to broadcast: " + e.getMessage();
        }
    }
}
