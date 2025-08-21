package com.naveen.irn.config;

import javax.sql.DataSource;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.beans.factory.annotation.Qualifier;

@Configuration
public class DmsDataSourceConfig {

    @Bean
    @ConfigurationProperties("spring.datasource.dms")
    public DataSourceProperties dmsDataSourceProperties() {
        return new DataSourceProperties();
    }

    @Bean
    public DataSource dmsDataSource() {
        return dmsDataSourceProperties().initializeDataSourceBuilder().build();
    }

    @Bean(name = "dmsJdbcTemplate")
    public JdbcTemplate dmsJdbcTemplate(@Qualifier("dmsDataSource") DataSource dataSource) {
        return new JdbcTemplate(dataSource);
    }
}
