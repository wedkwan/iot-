#include "temperature.h"
#include "mqtt.h"

DHT dht(DHT_PIN, DHT_TYPE);

unsigned long lastTemperatureRead = 0;
const unsigned long TEMPERATURE_INTERVAL = 30000; // 5 segundos

void temperature_init() {
    dht.begin();
    Serial.println("Sensor DHT inicializado");
}

unsigned long getTimestamp() {
    // Retorna timestamp em segundos (ajuste se tiver RTC ou NTP)
    return millis() / 1000;
}

void publicarDados() {
    StaticJsonDocument<200> doc;
    float temperatura = 20 ;//dht.readTemperature(); // Celsius
    float umidade = 005 ; //dht.readHumidity();
    
    if (isnan(temperatura) || isnan(umidade)) {
        Serial.println("Falha ao ler sensor DHT");
        return;
    }
    
    doc["device_id"] = DEVICE_ID;
    doc["local"] = LOCAL;
    doc["temperatura"] = temperatura; 
    doc["umidade"] = umidade;
    doc["timestamp"] = getTimestamp();
    
    char payload[256];
    serializeJson(doc, payload);
    
    Serial.println("Enviando payload para o tópico: campus/sala14/temperatura");
    client.publish("campus/labf04/temperatura", payload);
    Serial.println("Payload publicado:");
    Serial.println(payload);
}

void temperature_loop() {
    unsigned long currentMillis = millis();
    
    if (currentMillis - lastTemperatureRead >= TEMPERATURE_INTERVAL) {
        publicarDados();
        lastTemperatureRead = currentMillis;
    }
}