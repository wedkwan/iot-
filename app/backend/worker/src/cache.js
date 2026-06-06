import { findorcreateSala } from "./models/Sala.js";
import { findorcreateSensor } from "./models/Sensor.js";

const cache = new Map();

export async function getSalaId(nome) {
  const key = `sala:${nome}`;
  if (cache.has(key)) return cache.get(key);

  const id = await findorcreateSala(nome);
  cache.set(key, id);
  return id;
}

export async function getSensorId(deviceId, tipo, salaId) {
  const key = `sensor:${deviceId}:${tipo}`;
  if (cache.has(key)) return cache.get(key);

  const id = await findorcreateSensor(deviceId, tipo, salaId);
  cache.set(key, id);
  return id;
}