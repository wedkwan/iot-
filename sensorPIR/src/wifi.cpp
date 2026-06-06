#include "wifi.h"





const char* ssid = WIFI_SSID;
const char* password = WIFI_PASSWORD; 

void wifi_init() {
  WiFi.begin(ssid, password);
  Serial.println("Iniciando WiFi...");
}

void wifi_loop() {
  static unsigned long lastAttempt = 0;

  if (WiFi.status() != WL_CONNECTED) {
    if (millis() - lastAttempt > 5000) {
      lastAttempt = millis();

      Serial.println("WiFi desconectado, tentando reconectar...");
      WiFi.begin(ssid, password);
    }
  } else {
    static bool conectado = false;

    if (!conectado) {
      Serial.print("Conectado! IP: ");
      Serial.println(WiFi.localIP());
      conectado = true;
    }
  }
}