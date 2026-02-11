import client from "./configs/mqtt.js";

import { findorcreateSala } from "./models/Sala.js";
import { findorcreateSensor } from "./models/Sensor.js";
import { createLeitura } from "./models/Leitura.js";

import { upsertComando } from "./models/Comandos.js";

client.subscribe("smartcampus/+/temperatura");
client.subscribe("smartcampus/comandos/resposta");

client.on("message", async (topic, message) => {
  console.log("Chegou mensagem MQTT no tópico:", topic);
  console.log("Mensagem bruta:", message.toString());

  try {
    const data = JSON.parse(message.toString());

    // ==============================
    // 1) TEMPERATURA / LEITURAS
    // ==============================
    if (topic.includes("/temperatura")) {
      const {
        device_id,
        local,
        temperatura,
        umidade,
        corrente,
        potencia
      } = data;

      const salaId = await findorcreateSala(local);
      const sensorId = await findorcreateSensor(device_id, "ambiente", salaId);

      if (temperatura !== undefined) {
        await createLeitura(sensorId, "temperatura", temperatura);
      }

      if (umidade !== undefined) {
        await createLeitura(sensorId, "umidade", umidade);
      }

      if (corrente !== undefined) {
        await createLeitura(sensorId, "corrente", corrente);
      }

      if (potencia !== undefined) {
        await createLeitura(sensorId, "potencia", potencia);
      }

      console.log("Leituras salvas com sucesso.");
    }

    // ==============================
    // 2) COMANDOS
    // ==============================
    if (topic.includes("/comandos/resposta")) {
     const { device_id, local, comandos } = data;

    if (!device_id || !local) {
     console.log("JSON inválido: faltando device_id ou local");
    return;
      }

    const salaId = await findorcreateSala(local);

    const sensorId = await findorcreateSensor(
      device_id,
      "controle_ir",
      salaId
    );

    if (!comandos || !Array.isArray(comandos)) {
      console.log("JSON recebido não tem array comandos");
      return;
    }

    for (const cmd of comandos) {
       if (cmd.id === undefined || !cmd.nome) continue;
         await upsertComando(sensorId, cmd.id, cmd.nome.trim());
    }

    console.log(`Comandos salvos no banco: ${local} (${device_id})`);
    }


  } catch (err) {
    console.log("Erro ao processar mqtt:", err.message);
  }
});
