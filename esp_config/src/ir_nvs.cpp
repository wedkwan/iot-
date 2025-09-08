#include "ir_nvs.h"
#include <Preferences.h>

Preferences prefs;

void salvarComandos_memoria(const Comando comandos[], int total) {
  prefs.begin("ir-data", false);

  prefs.putInt("total", total);
  prefs.putBytes("comandos", comandos, sizeof(Comando) * total);

  prefs.end();
}

void carregarComandos_memoria(Comando comandos[], int &total) {
  prefs.begin("ir-data", true);

  total = prefs.getInt("total", 0);
  if(total > 0 && total <= 10) {  // 10 = tamanho máximo do array
    prefs.getBytes("comandos", comandos, sizeof(Comando) * total);
  } else {
    total = 0;
  }

  prefs.end();
}



void apagarComandos() {
  total_comandos = 0;

  // Limpa o array na RAM
  for (int i = 0; i < 10; i++) {
    comandos[i].nome[0] = '\0';
    comandos[i].value = 0;
    comandos[i].bits = 0;
    comandos[i].protocolo = UNKNOWN;
  }

  // Limpa os dados salvos na NVS
  prefs.begin("ir-data", false); // use o mesmo namespace "ir-data" que salvar/carregar
  prefs.clear();                 // Apaga todas as chaves dentro desse namespace
  prefs.end();

  Serial.println("Todos os comandos apagados (RAM + NVS).");
}


