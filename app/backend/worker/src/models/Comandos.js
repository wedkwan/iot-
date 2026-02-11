
import  pool  from "../configs/db.js";
export async function upsertComando(sensorId, comandoId, nome) {


  //const nomeLimpo = nome.replace(/\r/g, "").trim();

  await pool.query(
    `
    INSERT INTO comandos (sensorId, comandoId, nome)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE nome = VALUES(nome)
    `,
    [sensorId, comandoId, nome]
  );
}