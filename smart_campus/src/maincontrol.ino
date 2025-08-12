#include <Arduino.h>
#include "wifi_manager.h"
#include "ir_controller.h"
#include "serial_interface.h"
void setup() {
  Serial.begin(115200);
  wifi_init();
  ir_init();
  serial_init();
  Serial.println("Sistema pronto!");
}

void loop() {
  wifi_loop();
  ir_loop();
  serial_loop(); // se precisar fazer algo no loop do Wi-Fi
}

