import { upsertComando } from "../models/Comandos.js";
import { getSalaId, getSensorId } from "../cache.js";

export async function processarComandos(data) {
  const { device_id, local, comandos } = data;

  if (!device_id || !local)     throw new Error("Payload inválido: faltando device_id ou local");
  if (!Array.isArray(comandos)) throw new Error("Comandos deve ser um array");

  const salaId   = await getSalaId(local);
  const sensorId = await getSensorId(device_id, "controle_ir", salaId);

  for (const cmd of comandos) {
    if (cmd.id === undefined || !cmd.nome) continue;
    await upsertComando(sensorId, cmd.id, cmd.nome.trim());
  }
}