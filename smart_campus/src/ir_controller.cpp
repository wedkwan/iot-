#include "ir_controller.h"
#include "ir_nvs.h"

const uint16_t RECV_PIN = 15;
const uint16_t SEND_PIN = 4;

IRrecv irrecv(RECV_PIN);
IRsend irsend(SEND_PIN);
decode_results results;

Comando comandos[15];
int total_comandos = 0;

bool esperandoNome = false;
char nomeDigitado[20];
uint32_t comandoCapturado = 0;
uint16_t bitsCapturado = 0;


void transmitir_comando(int indice) {
  if (indice < 0 || indice >= total_comandos) {
    Serial.println(F("Índice inválido."));
    return;
  }

  Comando c = comandos[indice];
  Serial.print(F("Transmitindo comando: "));
  Serial.println(c.nome);

  // Aqui você pode mudar para o protocolo correto se souber.
  irsend.sendNEC(c.value, c.bits);
}


void adicionarComando(const char* nome, uint32_t codigo, uint16_t bits) {
  if (total_comandos >= 15) {
    Serial.println("Array de comandos cheio.");
    return;
  }
  strncpy(comandos[total_comandos].nome, nome, sizeof(comandos[total_comandos].nome));
  comandos[total_comandos].nome[sizeof(comandos[total_comandos].nome) - 1] = '\0';
  comandos[total_comandos].value = codigo;
  comandos[total_comandos].bits = bits;
  total_comandos++;

  salvarComandos_memoria(comandos, total_comandos);  // função do storage.cpp para gravar na NVS

  Serial.println("Comando salvo e persistido.");
}



void ir_init() {
  irrecv.enableIRIn();
  irsend.begin();
  carregarComandos_memoria(comandos, total_comandos);
  Serial.printf("Total de comandos carregados: %d\n", total_comandos);
}

void ir_loop() {
  if (irrecv.decode(&results)) {
    if (!esperandoNome && total_comandos < 10) {
      comandoCapturado = results.value;
      bitsCapturado = results.bits;
      esperandoNome = true;

      Serial.print(F("Comando recebido: 0x"));
      Serial.println(comandoCapturado, HEX);
      Serial.println(F("Digite nome para o comando:"));
    }
    irrecv.resume();
  }
}


