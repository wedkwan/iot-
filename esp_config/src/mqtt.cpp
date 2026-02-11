#include "mqtt.h"


// WiFi

const char* mqtt_server = MQTT_BROKER;
WiFiClient espClient;
PubSubClient client(espClient);

void mqtt_reconnect() {
  while (!client.connected()) {
    if (client.connect("ESP32_IR")) {
      client.subscribe("smartcampus/comandos/#");
    } else {
      delay(2000);
    }
  }
}



void publicarListaComandos() {
    JsonDocument doc;
     doc["device_id"] = DEVICE_ID;
     doc["local"] = LOCAL;
    JsonArray array = doc["comandos"].to<JsonArray>();

    for (int i = 0; i < total_comandos; i++) {
        JsonObject cmd = array.add<JsonObject>();

        String nomeLimpo = String(comandos[i].nome);
        nomeLimpo.replace("\r", "");
        nomeLimpo.replace("\n", "");
        nomeLimpo.trim();

        cmd["id"] = i;
        cmd["nome"] = nomeLimpo;
    }

    char payload[1024];
    serializeJson(doc, payload);

    client.publish("smartcampus/comandos/resposta", payload);
    Serial.println(payload);
}





void callback(char* topic, byte* payload, unsigned int length) {
    String msg;
    for (unsigned int i = 0; i < length; i++) msg += (char)payload[i];

    String topicStr = String(topic);

    if (topicStr == "smartcampus/comandos/listar") {
        // Lista todos os comandos com índice e nome
        publicarListaComandos();
        
      
    } else if (topicStr == "smartcampus/comandos/apagar") {
        apagarComandos();
        client.publish("smartcampus/comandos/resposta", "Todos os comandos apagados.");

    } else if (topicStr == "smartcampus/comandos/retransmitir") {
        int idx = msg.toInt();
        if (idx >= 0 && idx < total_comandos) {
            transmitir_comando(idx);
            String nomeComando = String(comandos[idx].nome);
            client.publish("smartcampus/comandos/resposta", ("Comando retransmitido: " + nomeComando).c_str());
        } else {
            client.publish("smartcampus/comandos/resposta", "Índice inválido");
        }

    }  
}


void mqtt_setup() {
  client.setServer(MQTT_BROKER, MQTT_PORT);
  client.setCallback(callback);
  client.setBufferSize(2048);
}

void mqtt_loop() {
  if (!client.connected()) mqtt_reconnect();
  client.loop();
}
