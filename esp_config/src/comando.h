#ifndef COMANDO_H
#define COMANDO_H

#include <IRremoteESP8266.h>
#include <IRutils.h>

struct Comando {
  char nome[20];
  uint32_t value;
  uint16_t bits;
  decode_type_t protocolo;
};

#endif
