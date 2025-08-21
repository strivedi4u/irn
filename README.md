# IRN (Iron Monitoring Platform)

<!-- Follow Button Section -->
<p align="right">
  <a href="https://github.com/strivedi4u/irn">
    <img src="https://img.shields.io/github/followers/strivedi4u?label=Follow&style=social" alt="Follow on GitHub">
  </a>
</p>

A modern, full-stack Spring Boot + React application for real-time iron inventory, sales, logistics, and operational monitoring. The platform integrates Oracle DB, Kafka, and WebSocket to deliver live dashboards and actionable insights for industrial operations.

## Features

- **Spring Boot Backend**
  - RESTful APIs for iron monitoring, sales, inventory, and logistics
  - Oracle DB integration (JDBC) for robust data management
  - Kafka messaging for real-time event streaming and updates
  - WebSocket support for live monitoring dashboards
  - Security via Spring Security
  - JSON serialization with Jackson

- **React Frontend**
  - Interactive dashboards for material, sales, spare, and logistics monitoring
  - Modular, reusable components (charts, cards, navigation)
  - Responsive, modern UI/UX for seamless monitoring experiences
  - Real-time, data-driven visualizations and alerts

## Project Structure

```
├── mvnw, mvnw.cmd           # Maven wrapper scripts
├── pom.xml                  # Maven build configuration
├── kafka-connect/           # Kafka connector configs
├── src/
│   ├── main/
│   │   ├── frontend/        # React app (dashboard, components, build, public)
│   │   ├── java/com/naveen/irn/ # Spring Boot source code
│   │   └── resources/       # Application properties
│   └── test/java/com/naveen/irn/ # Backend tests
├── target/                  # Build output
```

## Getting Started

### Prerequisites
- Java 17+
- Maven 3.8+
- Node.js v18.9.0+
- Oracle DB (for backend)
- Kafka (for messaging)

### Build & Run

#### 1. Backend (Spring Boot)
```powershell
# Build and run backend
./mvnw clean install
./mvnw spring-boot:run
```

#### 2. Frontend (React)
```powershell
cd src/main/frontend
npm install --legacy-peer-deps
npm run build
```

#### 3. Integration
- React build is auto-copied to Spring Boot static resources via Maven plugin.
- Access the monitoring dashboard at `http://localhost:8081/` after backend starts.

## Configuration
- **Database:** Configure Oracle DB in `src/main/resources/application.properties`.
- **Kafka:** Update Kafka settings in the same properties file and `kafka-connect/oracle-source-connector.json`.
- **Frontend:** Edit React configs in `src/main/frontend/` as needed.

## Key Technologies
- **Backend:** Spring Boot, Spring Web, Spring JDBC, Spring Kafka, WebSocket, Security, Jackson
- **Frontend:** React, Chart.js, Material UI (or similar), CSS Modules
- **Build:** Maven, frontend-maven-plugin

## Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss improvements or new monitoring features.

## License
This project is licensed under the Apache License 2.0. See [LICENSE](LICENSE) for details.

## Authors
- Naveen (Backend, Architecture)
- Shashank (Frontend, UI/UX)

---

For more details, see the source code and configuration files in this repository.
