#include "consumo.h"
#include <ArduinoJson.h>

EnergyMonitor SCT013;

const float TENSAO = 220.0;        
const float CALIBRACAO = 2.00;     // para SCT-013-000 (30A)
unsigned long ultimaPublicacao = 0;
const unsigned long INTERVALO_PUBLICACAO = 2000; 

void consumo_init() {
  Serial.println("Inicializando sensor de consumo...");
  SCT013.current(CURRENT_SENSOR_PIN, CALIBRACAO);
  Serial.println("Sensor de consumo inicializado");
}

void consumo_loop() {
  unsigned long agora = millis();
  if (agora - ultimaPublicacao < INTERVALO_PUBLICACAO) {
    return; // ainda não é hora de publicar
  }
  ultimaPublicacao = agora;
    
 
  

  float corrente = SCT013.calcIrms(4096);
  float potencia = TENSAO * corrente;

  // Evita leituras negativas ou ruído muito baixo
  if (corrente < 0.05) corrente = 0.0;
  if (potencia < 1.0) potencia = 0.0;
  Serial.printf("Corrente: %.2f A, Potência: %.2f W\n", corrente, potencia);
  StaticJsonDocument<200> doc;
  doc["device_id"] = DEVICE_ID;
  doc["local"] = LOCAL;
  doc["corrente_A"] = corrente;     
  doc["potencia_W"] = potencia;
  doc["tensao_V"] = TENSAO;
  doc["timestamp"] = millis() / 1000;

  char payload[256];
  serializeJson(doc, payload);
  
  String topico = "smartcampus/" + String(LOCAL) + "/consumo";
  client.publish(topico.c_str(), payload);
}