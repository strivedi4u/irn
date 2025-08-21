package com.naveen.irn.config;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Configuration;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;

import javax.sql.DataSource;
@Configuration
public class SalesDataSourceConfig {

    @Bean
    @ConfigurationProperties("spring.datasource.sales")
    public DataSourceProperties salesDataSourceProperties() {
        return new DataSourceProperties();
    }

    @Bean
    public DataSource salesDataSource() {
        return salesDataSourceProperties().initializeDataSourceBuilder().build();
    }

    @Bean(name = "salesJdbcTemplate")
    public JdbcTemplate salesJdbcTemplate(@Qualifier("salesDataSource") DataSource dataSource) {
        return new JdbcTemplate(dataSource);
    }


}

