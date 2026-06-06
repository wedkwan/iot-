import pool from "../configs/db.js";

export async function upsertConsumoDiario(sensorId, kwh) {
  await pool.query(
    `INSERT INTO consumodiario (sensorId, data, consumo_kwh, atualizadoEm)
     VALUES (?, CURDATE(), ?, NOW())
     ON DUPLICATE KEY UPDATE
       consumo_kwh  = consumo_kwh + VALUES(consumo_kwh),
       atualizadoEm = NOW()`,
    [sensorId, kwh]
  );
}