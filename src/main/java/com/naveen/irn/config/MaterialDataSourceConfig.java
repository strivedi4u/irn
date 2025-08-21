package com.naveen.irn.config;

import javax.sql.DataSource;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.beans.factory.annotation.Qualifier;

@Configuration
public class MaterialDataSourceConfig {

    @Bean
    @ConfigurationProperties("spring.datasource.material")
    public DataSourceProperties materialDataSourceProperties() {
        return new DataSourceProperties();
    }

    @Bean
    public DataSource materialDataSource() {
        return materialDataSourceProperties().initializeDataSourceBuilder().build();
    }

    @Bean(name = "materialJdbcTemplate")
    public JdbcTemplate materialJdbcTemplate(@Qualifier("materialDataSource") DataSource dataSource) {
        return new JdbcTemplate(dataSource);
    }

    // @Bean(name = "materialJdbcTemplate")
    // public JdbcTemplate materialJdbcTemplateLower(@Qualifier("materialDataSource") DataSource dataSource) {
    //     return new JdbcTemplate(dataSource);
    // }
}
