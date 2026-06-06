import { processarTemperatura } from "./handlers/temperatura.handler.js";
import { processarConsumo }     from "./handlers/consumo.handler.js";
import { processarComandos }    from "./handlers/comandos.handler.js";

const queue = [];
let processing = false;

export function enqueue(tipo, topic, data) {
  queue.push({ tipo, topic, data, tentativas: 0 });
  console.log(`Enfileirado [${tipo}] — fila: ${queue.length} item(s)`);
  if (!processing) processQueue();
}

async function processQueue() {
  processing = true;

  while (queue.length > 0) {
    const item = queue[0];

    try {
      if (item.tipo === "temperatura") await processarTemperatura(item.data);
      if (item.tipo === "corrente")    await processarConsumo(item.data);
      if (item.tipo === "comandos")    await processarComandos(item.data);

      queue.shift();
      console.log(`[${item.tipo}] processado — fila: ${queue.length} item(s)`);

    } catch (err) {
      item.tentativas++;
      console.error(`Tentativa ${item.tentativas}/5 falhou [${item.tipo}]: ${err.message}`);

      if (item.tentativas >= 5) {
        console.error(`Descartando após 5 tentativas:`, item.data);
        queue.shift();
      } else {
        await sleep(2000 * item.tentativas);
      }
    }
  }

  processing = false;
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));