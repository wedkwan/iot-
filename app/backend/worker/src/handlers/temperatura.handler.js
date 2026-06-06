import { createLeitura } from "../models/Leitura.js";
import { getSalaId, getSensorId } from "../cache.js";

export async function processarTemperatura(data) {
  const { device_id, local, temperatura, umidade } = data;

  if (!device_id || !local) throw new Error("Payload inválido: faltando device_id ou local");

  const salaId   = await getSalaId(local);
  const sensorId = await getSensorId(device_id, "ambiente", salaId);

  if (temperatura !== undefined) await createLeitura(sensorId, "temperatura", temperatura);
  if (umidade     !== undefined) await createLeitura(sensorId, "umidade",     umidade);

  console.log(`Temperatura salva: ${temperatura}°C | Umidade: ${umidade}%`);
}