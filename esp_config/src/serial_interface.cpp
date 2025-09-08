#include "serial_interface.h"
#include "ir_controller.h"
#include "ir_nvs.h"

void serial_init() {
  
  Serial.println(F("Comandos:"));
  Serial.println(F(" l - listar comandos"));
  Serial.println(F(" r - retransmitir comando"));
  Serial.println(F(" apagar - apagar comandos"));
}

void listarComandos() {
  Serial.println(F("Comandos salvos:"));
  for (int i = 0; i < total_comandos; i++) {
    Serial.print(i);
    Serial.print(F(": "));
    Serial.println(comandos[i].nome);
  }
}
void serial_loop() {
  static enum { EsperandoComando, EsperandoNome, EsperandoIndice } estado = EsperandoComando;

  if (estado == EsperandoComando && Serial.available()) {
    String input = Serial.readStringUntil('\n');
    input.trim();  // remove espaços e quebras de linha

    if (input == "l") {
      listarComandos();
    } else if (input == "apagar") {
      apagarComandos();
    } else if (input == "r") {
      Serial.println(F("Digite o índice para retransmitir:"));
      estado = EsperandoIndice;
    } else {
      Serial.println(F("Comando inválido."));
    }
  } else if (estado == EsperandoNome && Serial.available()) {
    int len = Serial.readBytesUntil('\n', nomeDigitado, sizeof(nomeDigitado) - 1);
    nomeDigitado[len] = '\0';

    adicionarComando(nomeDigitado, comandoCapturado, bitsCapturado, protocoloCapturado);

    esperandoNome = false;
    estado = EsperandoComando;
  } else if (estado == EsperandoIndice && Serial.available()) {
    int idx = Serial.parseInt();
    transmitir_comando(idx);
    estado = EsperandoComando;
  }

  // Caso tenha um novo comando para nomear e estiver no estado correto
  if (esperandoNome && estado == EsperandoComando) {
    Serial.println(F("Digite nome para o comando:"));
    estado = EsperandoNome;
  }
}
