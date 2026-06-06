import  pool  from "../configs/db.js";

export async function createLeitura(sensor_Id , tipo ,valor,) {
    try{
    await pool.query("INSERT INTO leitura (sensorId, tipo, valor) VALUES (?,?,?)",[sensor_Id,tipo,valor])
         
    } catch (err) {
        console.error("Erro ao criar leitura:", err);
        throw err;
    }
    
}

export async function getUltimaLeitura(sensorId, tipo) {
  const [rows] = await pool.query(
    `SELECT valor, timestamp 
     FROM leitura 
     WHERE sensorId = ? AND tipo = ? 
     ORDER BY timestamp DESC 
     LIMIT 1`,
    [sensorId, tipo]
  );

  if (rows.length === 0) return null;

  return {
    valor:     rows[0].valor,
    timestamp: new Date(rows[0].timestamp)
  };
}