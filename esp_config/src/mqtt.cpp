#include <WiFi.h>
#include <PubSubClient.h>
#include "ir_controller.h"
#include "ir_nvs.h"

// WiFi

const char* mqtt_server = "192.168.18.99";
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

void callback(char* topic, byte* payload, unsigned int length) {
    String msg;
    for (unsigned int i = 0; i < length; i++) msg += (char)payload[i];

    String topicStr = String(topic);

    if (topicStr == "smartcampus/comandos/listar") {
        // Lista todos os comandos com índice e nome
        String lista = "";
        for (int i = 0; i < total_comandos; i++) {
            lista += String(i) + ":" + String(comandos[i].nome) + ";";
        }
        client.publish("smartcampus/comandos/resposta", lista.c_str());

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

    } else if (topicStr == "smartcampus/comandos/novo") {
        int idx1 = msg.indexOf(',');
        int idx2 = msg.indexOf(',', idx1 + 1);
        int idx3 = msg.indexOf(',', idx2 + 1);

        if (idx1 != -1 && idx2 != -1 && idx3 != -1) {
            String nome = msg.substring(0, idx1);
            uint32_t codigo = msg.substring(idx1 + 1, idx2).toInt();
            uint16_t bits = msg.substring(idx2 + 1, idx3).toInt();
            decode_type_t protocolo = (decode_type_t)msg.substring(idx3 + 1).toInt();

            adicionarComando(nome.c_str(), codigo, bits, protocolo);
            client.publish("smartcampus/comandos/resposta", ("Comando adicionado: " + nome).c_str());
        } else {
            client.publish("smartcampus/comandos/resposta", "Formato inválido para novo comando.");
        }
    }
}


void mqtt_setup() {
  client.setServer(mqtt_server, 1883);
  client.setCallback(callback);
}

void mqtt_loop() {
  if (!client.connected()) mqtt_reconnect();
  client.loop();
}
