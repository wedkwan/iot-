import "dotenv/config";
import client from "./configs/mqtt.js";
import { enqueue } from "./queue.js";

const TOPICOS = {
  TEMPERATURA: /^smartcampus\/[^/]+\/temperatura$/,
  CORRENTE:    /^smartcampus\/[^/]+\/corrente$/,
  COMANDOS:    /^smartcampus\/comandos\/resposta$/,
};

client.subscribe("smartcampus/+/temperatura");
client.subscribe("smartcampus/+/corrente");
client.subscribe("smartcampus/comandos/resposta");

client.on("message", (topic, message) => {
  console.log(`Mensagem recebida [${topic}]`);

  try {
    const data = JSON.parse(message.toString());

    if (TOPICOS.TEMPERATURA.test(topic)) {
      enqueue("temperatura", topic, data);
    } else if (TOPICOS.CORRENTE.test(topic)) {
      enqueue("corrente", topic, data);
    } else if (TOPICOS.COMANDOS.test(topic)) {
      enqueue("comandos", topic, data);
    } else {
      console.warn(`Tópico não reconhecido: ${topic}`);
    }

  } catch {
    console.error(`Payload inválido no tópico: ${topic}`);
  }
});