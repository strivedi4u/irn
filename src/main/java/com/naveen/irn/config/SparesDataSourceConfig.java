package com.naveen.irn.config;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;

import javax.sql.DataSource;

@Configuration
public class SparesDataSourceConfig {

    @Bean
    @ConfigurationProperties("spring.datasource.spares")
    public DataSourceProperties sparesDataSourceProperties() {
        return new DataSourceProperties();
    }

    @Bean
    public DataSource sparesDataSource() {
        return sparesDataSourceProperties().initializeDataSourceBuilder().build();
    }

    @Bean(name = "sparesJdbcTemplate")
    public JdbcTemplate sparesJdbcTemplate(@Qualifier("sparesDataSource") DataSource dataSource) {
        return new JdbcTemplate(dataSource);
    }


}
