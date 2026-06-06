#include <Arduino.h>
#include "configs.h"
#include "wifi.h"
#include "mqtt.h"  
#include <ArduinoJson.h>

const int pin = PIR_SENSOR_PIN; // GPIO 17  

bool movimentoAtual = false;
bool movimentoConfirmado = false;
bool ultimoEstadoPublicado = false;  

unsigned long inicioDetectado = 0;
const unsigned long TEMPO_CONFIRMAR = 3000; // 3 segundos
unsigned long tempoOcioso = 0;
const unsigned long TEMPO_OCIOSO_PUBLICAR = 10000; // 10s sem movimento publica false
#include <ArduinoJson.h>  // Instale a biblioteca ArduinoJson

void verificarMovimento() {
  bool leituraSensor = digitalRead(pin);
  unsigned long agora = millis();

  if (leituraSensor == HIGH) {
    if (!movimentoAtual) {
      movimentoAtual = true;
      inicioDetectado = agora;
      Serial.println("Movimento detectado - confirmando...");
    }

    if (!movimentoConfirmado && (agora - inicioDetectado) >= TEMPO_CONFIRMAR) {
      movimentoConfirmado = true;
      Serial.println("Movimento CONFIRMADO! (3s contínuos)");

      // Prepara JSON
      StaticJsonDocument<96> doc;
      doc["presenca"] = true;
      doc["device"] = DEVICE_ID;
      doc["local"] = LOCAL;
      
      char buffer[96];
      serializeJson(doc, buffer);
      
      String topico = String("smartcampus/") + LOCAL + "/movimento";
      client.publish(topico.c_str(), buffer);
      ultimoEstadoPublicado = true;
    }
  } 
  else {
    if (movimentoAtual) {
      if (!movimentoConfirmado) {
        Serial.println("Movimento descartado - durou menos de 3s");
      }
      movimentoAtual = false;
      tempoOcioso = agora;
    }

    if (movimentoConfirmado && (agora - tempoOcioso) >= TEMPO_OCIOSO_PUBLICAR) {
      movimentoConfirmado = false;
      Serial.println("Sala vazia - publicando false");

      StaticJsonDocument<96> doc;
      doc["presenca"] = false;
      doc["device"] = DEVICE_ID;
      doc["local"] = LOCAL;
      
      char buffer[96];
      serializeJson(doc, buffer);
      
      String topico = String("smartcampus/") + LOCAL + "/movimento";
      client.publish(topico.c_str(), buffer);
      ultimoEstadoPublicado = false;
    }
  }
}

void setup() {
  Serial.begin(115200);  
  wifi_init();
  mqtt_setup(); 
  pinMode(pin, INPUT);
  tempoOcioso = millis();  
  Serial.println("Sensor PIR iniciado - Aguardando 3s de movimento confirmado");
}

void loop() {
  verificarMovimento();
  mqtt_loop();
  wifi_loop();
  delay(50);  
}