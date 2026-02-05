import  pool  from "../configs/db.js";

export async function  findorcreateSensor(deviceId , tipo , salaId) {
   const [rows] = await pool.query("SELECT * FROM sensor WHERE deviceId = ? AND tipo = ?",[deviceId, tipo]);
   if (rows.length > 0) 
return rows[0].id;
   const [result] = await pool.query("INSERT INTO sensor (tipo, deviceId , salaId) VALUES (?,?,?)",
   [tipo ,deviceId, salaId])
   return result.insertId;
} 

