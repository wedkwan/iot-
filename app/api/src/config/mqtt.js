import mqtt from "mqtt";

const client = mqtt.connect("mqtt://192.168.18.99:1883");


client.on("connect", () => {
  console.log("Conectado ao broker MQTT ");
  client.subscribe("smartcampus/+/+");
  
});

export default client
