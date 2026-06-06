#ifndef CONSUMO_H
#define CONSUMO_H   

#include <Arduino.h>
#include <ArduinoJson.h>
#include "configs.h"
#include "mqtt.h"
#include <EmonLib.h>

#define CURRENT_SENSOR_PIN 35
#define CURRENT_SENSOR_TYPE SCT013-000





void consumo_init();

void consumo_loop();




#endif