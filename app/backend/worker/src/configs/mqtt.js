import mqtt from "mqtt";

const client = mqtt.connect(`mqtt://${process.env.MQTT_HOST || "mosquitto"}:${process.env.MQTT_PORT || 1883}`);


client.on("connect", () => {
  console.log("Conectado ao broker MQTT ");
  client.subscribe("smartcampus/+/+");
  
});

export default client
