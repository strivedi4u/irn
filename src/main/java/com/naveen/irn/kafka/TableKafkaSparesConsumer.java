package com.naveen.irn.kafka;

import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.util.concurrent.atomic.AtomicReference;

@Service
public class TableKafkaSparesConsumer {

    private final AtomicReference<String> latestData = new AtomicReference<>("[]");

    @KafkaListener(topics = "oracle-table-spares-topic", groupId = "irn-spares-group")
    public void listen(ConsumerRecord<String, String> record) {
        latestData.set(record.value());
    }


    public String getLatestData() {
        try {
            String data = latestData.get();
            if (data == null || data.trim().isEmpty() || "[]".equals(data.trim())) {
                String backup = TableKafkaSparesProducer.getLatestBackupJson();
                if (backup == null || backup.trim().isEmpty()) {
                    return null; // Return null to indicate no Kafka data
                }
                return backup;
            }
            return data;
        } catch (Exception e) {
            // On any Kafka error, return null to trigger DB fallback
            return null;
        }
    }
}