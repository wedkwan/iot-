import pool from '../configs/db.js';

export async function getConsumoHoje(sala) {
  const [rows] = await pool.query(
    `SELECT 
       cd.data,
       ROUND(SUM(cd.consumo_kwh), 4) as consumo_kwh
     FROM consumodiario cd
     JOIN sensor sens ON cd.sensorId = sens.id
     JOIN sala s      ON sens.salaId = s.id
     WHERE s.nome = ?
     AND cd.data = CURDATE()
     GROUP BY cd.data`,
    [sala]
  );
  return rows[0] || null;
}

export async function getConsumoSemana(sala) {
  const [rows] = await pool.query(
    `SELECT 
       cd.data,
       ROUND(SUM(cd.consumo_kwh), 4) as consumo_kwh
     FROM consumodiario cd
     JOIN sensor sens ON cd.sensorId = sens.id
     JOIN sala s      ON sens.salaId = s.id
     WHERE s.nome = ?
     AND cd.data >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
     GROUP BY cd.data
     ORDER BY cd.data`,
    [sala]
  );
  return rows;
}

export async function getConsumoMes(sala) {
  const [rows] = await pool.query(
    `SELECT 
       cd.data,
       ROUND(SUM(cd.consumo_kwh), 4) as consumo_kwh
     FROM consumodiario cd
     JOIN sensor sens ON cd.sensorId = sens.id
     JOIN sala s      ON sens.salaId = s.id
     WHERE s.nome = ?
     AND cd.data >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
     GROUP BY cd.data
     ORDER BY cd.data`,
    [sala]
  );
  return rows;
}








export const getCorrenteSala = async (req, res) => {
    try {
        const { sala } = req.params;
        
        const [rows] = await pool.query(`
            SELECT 
                ROUND(l.valor, 2) as corrente,
                l.timestamp as ultima_leitura
            FROM leitura l 
            JOIN sensor sens ON l.sensorId = sens.id 
            JOIN sala s ON sens.salaId = s.id 
            WHERE s.nome = ? 
            AND l.tipo = 'corrente'
            ORDER BY l.timestamp DESC 
            LIMIT 1
        `, [sala]);
        
        res.json({
            success: true,
            sala: sala,
            corrente: rows[0]?.corrente || null,
            ultima_leitura: rows[0]?.ultima_leitura || null,
            unidade: 'A'
        });
    } catch (error) {
        console.error('Erro corrente:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};



export async function getConsumoHora(sala) {
  const [rows] = await pool.query(
    `SELECT 
       HOUR(l.timestamp) as hora,
       ROUND(AVG(l.valor), 2) as corrente_media,
       ROUND(AVG(l.valor) * 220, 2) as potencia_media,
       ROUND(SUM(l.valor * 220 * (50/3600)) / 1000, 4) as consumo_kwh
     FROM leitura l
     JOIN sensor sens ON l.sensorId = sens.id
     JOIN sala s ON sens.salaId = s.id
     WHERE s.nome = ?
     AND l.tipo = 'corrente'
     AND DATE(l.timestamp) = CURDATE()
     GROUP BY HOUR(l.timestamp)
     ORDER BY hora`,
    [sala]
  );
  return rows;
}