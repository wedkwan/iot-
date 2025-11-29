import { pool } from "../config/bd.js";

export async function createLeitura(sensor_Id , tipo ,valor,) {
    try{
    await pool.query("INSERT INTO Leitura (sensorId, tipo, valor) VALUES (?,?,?)",[sensor_Id,tipo,valor])
         
    } catch (err) {
        console.error("Erro ao criar leitura:", err);
        throw err;
    }
    
}

export async function getleitura(){
    const [rowns] = await pool.query("SELECT * FROM Leitura"
)
    return rowns
}


