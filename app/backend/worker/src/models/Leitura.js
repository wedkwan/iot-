import  pool  from "../configs/db.js";

export async function createLeitura(sensor_Id , tipo ,valor,) {
    try{
    await pool.query("INSERT INTO leitura (sensorId, tipo, valor) VALUES (?,?,?)",[sensor_Id,tipo,valor])
         
    } catch (err) {
        console.error("Erro ao criar leitura:", err);
        throw err;
    }
    
}


