import { getleitura } from "../models/Leitura.js";
import { pool } from "../config/bd.js";

export async function gettemp (req, res) {
  var temp = await getleitura () ;
  res.json({ temp });
}

export async function getMetricasSala(req, res) {
    try {
        const { sala } = req.params;
        
        const [rows] = await pool.query(`
            SELECT 
                l.tipo as metric, 
                ROUND(l.valor, 2) as value 
            FROM Leitura l 
            JOIN Sensor sens ON l.sensorId = sens.id 
            JOIN Sala s ON sens.salaId = s.id 
            WHERE s.nome = ? 
            AND l.timestamp = (
                SELECT MAX(timestamp) 
                FROM Leitura l2 
                WHERE l2.sensorId = l.sensorId 
                AND l2.tipo = l.tipo
            )
        `, [sala]);
        
        res.json({
            success: true,
            sala: sala,
            metricas: rows
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}