import  pool  from "../config/bd.js";

export const getUmidadeSala = async (req, res) => {
    try {
        const { sala } = req.params;
        
        const [rows] = await pool.query(`
            SELECT 
                ROUND(l.valor, 2) as umidade,
                l.timestamp as ultima_leitura
            FROM leitura l 
            JOIN sensor sens ON l.sensorId = sens.id 
            JOIN sala s ON sens.salaId = s.id 
            WHERE s.nome = ? 
            AND l.tipo = 'umidade'
            ORDER BY l.timestamp DESC 
            LIMIT 1
        `, [sala]);
        
        res.json({
            success: true,
            sala: sala,
            umidade: rows[0]?.umidade || null,
            ultima_leitura: rows[0]?.ultima_leitura || null,
            unidade: '%'
        });
    } catch (error) {
        console.error('Erro umidade:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

export const getHistoricoUmidade = async (req, res) => {
    try {
        const { sala } = req.params;
        const { horas = 24 } = req.query;
        
        const [rows] = await pool.query(`
            SELECT 
                l.timestamp as time,
                ROUND(l.valor, 2) as value
            FROM leitura l 
            JOIN sensor sens ON l.sensorId = sens.id 
            JOIN sala s ON sens.salaId = s.id 
            WHERE s.nome = ? 
            AND l.tipo = 'umidade'
            AND l.timestamp >= DATE_SUB(NOW(), INTERVAL ? HOUR)
            ORDER BY l.timestamp DESC
            LIMIT 100
        `, [sala, horas]);
        
        res.json({
            success: true,
            sala: sala,
            periodo: `${horas} horas`,
            historico: rows
        });
    } catch (error) {
        console.error('Erro histórico umidade:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};