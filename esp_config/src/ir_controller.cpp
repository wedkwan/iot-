#include "ir_controller.h"
#include "ir_nvs.h"

const uint16_t RECV_PIN = 15;
const uint16_t SEND_PIN = 4;

IRrecv irrecv(RECV_PIN);
IRsend irsend(SEND_PIN);
decode_results results;

Comando comandos[10];
int total_comandos = 0;

bool esperandoNome = false;
char nomeDigitado[20];
uint32_t comandoCapturado = 0;
uint16_t bitsCapturado = 0;
decode_type_t protocoloCapturado= UNKNOWN;



void transmitir_comando(int indice) {
  if (indice < 0 || indice >= total_comandos) {
    Serial.println(F("Índice inválido."));
    return;
  }

  Comando c = comandos[indice];
  Serial.print(F("Transmitindo comando: "));
  Serial.println(c.nome);

  irrecv.disableIRIn();
  delay(100); // pequeno delay para garantir que receptor desligue

  switch (c.protocolo) {
  case NEC:
  case SAMSUNG:  // Samsung normalmente pode ser tratado como NEC
    irsend.sendNEC(c.value, c.bits);
    break;
  case SONY:
    irsend.sendSony(c.value, c.bits);
    break;
  case RC5:
    irsend.sendRC5(c.value, c.bits);
    break;
  case RC6:
    irsend.sendRC6(c.value, c.bits);
    break;
  default:
    Serial.println(F("Protocolo não suportado para transmissão."));
    break;
}


  delay(500);
  irrecv.enableIRIn();
  irrecv.resume();
}


void adicionarComando(const char* nome, uint32_t codigo, uint16_t bits, decode_type_t protocolo) {
  if (total_comandos >= 10) {
    Serial.println("Array de comandos cheio.");
    return;
  }
  strncpy(comandos[total_comandos].nome, nome, sizeof(comandos[total_comandos].nome));
  comandos[total_comandos].nome[sizeof(comandos[total_comandos].nome) - 1] = '\0';
  comandos[total_comandos].value = codigo;
  comandos[total_comandos].bits = bits;
  comandos[total_comandos].protocolo = protocolo;  // salva protocolo

  total_comandos++;

  salvarComandos_memoria(comandos, total_comandos);  // persistência NVS

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
      protocoloCapturado= results.decode_type;  // <-- capture o protocolo aqui
      esperandoNome = true;

      Serial.print(F("Comando recebido: 0x"));
      Serial.println(comandoCapturado, HEX);
      Serial.println(F("Digite nome para o comando:"));
    }
    irrecv.resume();
  }
}



