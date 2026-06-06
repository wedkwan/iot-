import { createLeitura, getUltimaLeitura } from "../models/Leitura.js";
import { upsertConsumoDiario } from "../models/Consumo.js";
import { getSalaId, getSensorId } from "../cache.js";

const TENSAO          = Number(process.env.TENSAO_REDE)         || 220;
const MAX_INTERVALO_H = Number(process.env.MAX_INTERVALO_HORAS) || 0.025;

export async function processarConsumo(data) {
  const { device_id, local, corrente } = data;

  if (!device_id || !local)  throw new Error("Payload inválido: faltando device_id ou local");
  if (corrente === undefined) throw new Error("Payload inválido: faltando corrente");

  const salaId   = await getSalaId(local);
  const sensorId = await getSensorId(device_id, "ambiente", salaId);

  // 1. Busca ANTES de salvar a nova
  const ultima = await getUltimaLeitura(sensorId, "potencia");

  // 2. Salva corrente e potência
  await createLeitura(sensorId, "corrente", corrente);
  const potencia = corrente * TENSAO;
  await createLeitura(sensorId, "potencia", potencia);

  // 3. Primeira leitura — sem intervalo ainda
  if (!ultima) {
    console.log("Primeira leitura, sem consumo calculado ainda");
    return;
  }
  const agora      = new Date();
  const deltaHoras = (agora - ultima.timestamp) / 1000 / 3600;

  if (deltaHoras <= 0) {
    console.warn("Delta negativo ou zero, pulando consumo");
    return;
  }

  if (deltaHoras > MAX_INTERVALO_H) {
    console.warn(`Intervalo grande (${deltaHoras.toFixed(2)}h), pulando consumo`);
    return;
  }

  const kwh = (potencia * deltaHoras) / 1000;
  await upsertConsumoDiario(sensorId, kwh);
  console.log(`Consumo calculado: ${kwh.toFixed(6)} kWh`);
}