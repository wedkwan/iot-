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
