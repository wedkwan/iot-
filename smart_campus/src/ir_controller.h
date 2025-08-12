#ifndef IR_CONTROLLER_H
#define IR_CONTROLLER_H

#include <IRremoteESP8266.h>
#include <IRrecv.h>
#include <IRsend.h>
#include <IRutils.h>

struct Comando {
  char nome[20];
  uint32_t value;
  uint16_t bits;
};

void ir_init();
void ir_loop();
void transmitir_comando(int indice);
void adicionarComando(const char* nome, uint32_t codigo, uint16_t bits);


extern Comando comandos[15];
extern int total_comandos;

extern bool esperandoNome;
extern char nomeDigitado[20];
extern uint32_t comandoCapturado;
extern uint16_t bitsCapturado;

#endif
