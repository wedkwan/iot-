#include <Arduino.h>
#include "wifi_manager.h"
#include "ir_controller.h"
#include "serial_interface.h"
#include "mqtt.h"
#include "temperature.h"

void setup() {
  Serial.begin(115200);
  mqtt_setup();
  wifi_init();
  ir_init();
  serial_init();
  temperature_init();
  Serial.println("Device ID: " + String(DEVICE_ID));
  Serial.println("Local: " + String(LOCAL));
  Serial.println("Sistema pronto!");
}

void loop() {
  wifi_loop();
  ir_loop();
  mqtt_loop();
  
  serial_loop();
}

