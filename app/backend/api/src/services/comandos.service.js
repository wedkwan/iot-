
import client from "../configs/mqtt.js";

let listaComandos  = ""
let ultimaResposta = "";

client.on("message", (topic, message) => {
  const msgStr = message.toString();
  if (topic === "smartcampus/comandos/resposta") {
    ultimaResposta = msgStr;
    if (msgStr.includes(";")) {
      listaComandos = msgStr;
    }
  }
});

export function pegarComandos() {
  return listaComandos
}


export function listarComandos(sala) {
  client.publish(`smartcampus/${sala}/comandos/listar`, "");
  
}

export function apagarComandos(sala) {
  client.publish(`smartcampus/${sala}/comandos/apagar`, "");
  
}

export function retransmitirComando(sala , indice) {
  client.publish(`smartcampus/${sala}/comandos/retransmitir`, String(indice));
}

export function esperarResposta(esp32Topic, timeout = 5000) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      client.removeListener('message', onMessage);
      reject(new Error('Tempo esgotado esperando resposta do ESP32'));
    }, timeout);

    const onMessage = (topic, message) => {
      if (topic.toString() === esp32Topic) {
        const msgStr = message.toString();
        clearTimeout(timer);
        client.removeListener('message', onMessage);
        resolve(msgStr);
      }
    };

    client.on('message', onMessage);
  });
}




