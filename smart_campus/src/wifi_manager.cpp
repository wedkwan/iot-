#include "wifi_manager.h"
#include <WiFi.h>




const char* ssid = "DTEL_KAWAN";
const char* password = "01010111";

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
