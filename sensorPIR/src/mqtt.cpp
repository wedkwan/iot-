#include "mqtt.h"


// WiFi

const char* mqtt_server = MQTT_BROKER;
WiFiClient espClient;
PubSubClient client(espClient);



void mqtt_reconnect() {
  static unsigned long lastAttempt = 0;

  if (millis() - lastAttempt > 5000) {
    lastAttempt = millis();

    Serial.println("Tentando conectar MQTT...");

    if (client.connect("ESP32_PIR")) {
      Serial.println("MQTT conectado!");
      client.subscribe("smartcampus/+/movimento/#");
    } else {
      Serial.println("Falha ao conectar MQTT");
    }
  }
}

void callback(char* topic, byte* payload, unsigned int length) {
 
}


void mqtt_setup() {
  client.setServer(MQTT_BROKER, MQTT_PORT);
  client.setCallback(callback);
  client.setBufferSize(2048);
}

void mqtt_loop() {
  if (WiFi.status() == WL_CONNECTED) {
  if (!client.connected()) {
    mqtt_reconnect();
  }
  client.loop();
  }
}