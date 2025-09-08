
// mqtt_interface.h
#ifndef MQTT_INTERFACE_H
#define MQTT_INTERFACE_H

#include <Arduino.h>
#include <WiFi.h>
#include <PubSubClient.h>
#include "ir_controller.h"
#include "ir_nvs.h"


extern const char* mqtt_server;
extern WiFiClient espClient;
extern PubSubClient client;

void mqtt_setup();
void mqtt_loop();

#endif
