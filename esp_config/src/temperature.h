#ifndef TEMPERATURE_H
#define TEMPERATURE_H

#include <Arduino.h>
#include <DHT.h>
#include <ArduinoJson.h>

// Definições do sensor DHT
#define DHT_PIN 12
#define DHT_TYPE DHT11


#define DEVICE_ID "ESP32_IR_01"
#define LOCAL "LABF04"

extern DHT dht;

void temperature_init();
void temperature_loop();
void publicarDados();

#endif