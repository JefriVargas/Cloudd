FROM openjdk:17-jdk-slim

RUN apt-get update && apt-get install -y maven
WORKDIR /app

COPY pom.xml .
RUN mvn dependency:go-offline

COPY src ./src

EXPOSE 8002

CMD ["mvn", "spring-boot:run"]
