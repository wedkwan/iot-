#ifndef IR_NVS_H
#define IR_NVS_H

#include <Arduino.h>
#include "comando.h" 
#include <Preferences.h>
#include "ir_controller.h"
  

void salvarComandos_memoria(const Comando comandos[], int total);
void carregarComandos_memoria(Comando comandos[], int &total);
void apagarComandos();
   

#endif
