// mqtt_interface.h
#ifndef MQTT_H
#define MQTT_H

#include <Arduino.h>
#include <WiFi.h>
#include <PubSubClient.h>
#include "configs.h"


extern const char* mqtt_server;
extern WiFiClient espClient;
extern PubSubClient client;

void mqtt_setup();
void mqtt_loop();


#endif