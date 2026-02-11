#include "wifi_manager.h"





const char* ssid = WIFI_SSID;
const char* password = WIFI_PASS; 

void wifi_init() {
  WiFi.begin(ssid, password);
  Serial.print("Conectando no WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println();
  Serial.print("Conectado! IP: ");
  Serial.println(WiFi.localIP());
  
}

void wifi_loop() {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi desconectado, tentando reconectar...");
    WiFi.reconnect();
  }
}
