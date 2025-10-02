import mqtt from "mqtt";

const client = mqtt.connect("mqtt://192.168.18.84:1883");


client.on("connect", () => {
  console.log("Conectado ao broker MQTT ");
  client.subscribe("smartcampus/comandos/resposta");
});

export default client
