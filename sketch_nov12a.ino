#include <WiFi.h>
#include "DHT.h"
#include <PubSubCliente.h>
#include <ArduinoJson.h>


#define DHTPIN 14        // GPIO onde o sensor está conectado (mude se usar outro)
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);   // ou DHT22 se for outro modelo

// conf rede 

const char* ssid = "DTEL_KAWAN";
const char* password "01010111";

// conf mqtt broker 
const char* mqttServerIP = "10.35.10.166";
const int mqtt_port = 1838 ;

#define DeviceID = "ESP32-01"
#define Local = "F04"

WiFiClient espClient;
PubSubClient client(espClient);


void setup_wifi () {
  WiFi.begin(ssid, password);
  Serial.print("Conectando-se ao Wi-Fi");

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.print("Conectado! IP: ");
  Serial.println(WiFi.localIP());
}

void reconnect(){
     while (!client.connected()) {
    if (client.connect("DeviceID")) {
      Serial.println("conectando ao broker .. ")
      client.subscribe("campus/sala14/#");
    } else {
      delay(2000);
    }
  }
}



void publicarDados(){
  StaticJsonDocument<200> doc ;
  float temperatura = 20//dht.readTemperature(); // Celsius
  float umidade = 10 //dht.readHumidity();
  if (isnan(temperatura) || isnan(umidade)){
    println("falha ao ler sensor Dht");
    return ;
  }
  doc["divice_id"] = DeviceID;
  doc["Local"] = Local;
  doc["temperatura"] = temperatura ; 
  doc["umidade"] = umidade;
  doc[timestamp] = 
  char payload[256];
  serializeJson(doc , payload);
  serial.println("enviando payload para o topico ")
  client.publish("campus/sala14/temperatura" , payload)
  serial.println("payload publicada:")
  serial.println(payload)

}
void setup (){
  Serial.begin(115200);
  dht.begin();
  setup_wifi();
  client.setServer(mqttServerIP,mqtt_port);
}


void loop() {
 
 if (!client.connetcd()){
  reconnect();
 }
 client.loop();
 publicarDados();
 delay(30000)
}
