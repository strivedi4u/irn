package com.naveen.irn;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.boot.CommandLineRunner;

@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class})
@EnableScheduling
public class IrnApplication implements CommandLineRunner {

    public static void main(String[] args) {
        SpringApplication.run(IrnApplication.class, args);
    }

    @Override
    public void run(String... args) throws Exception {
        System.out.println("Application started");
    }
}
