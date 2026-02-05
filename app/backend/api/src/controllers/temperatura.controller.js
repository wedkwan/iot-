import pool from "./../config/bd.js"

export const getTemperaturaSala = async (req, res) => {
    try {
        const { sala } = req.params;
        
        const [rows] = await pool.query(`
            SELECT 
                ROUND(l.valor, 2) as temperatura,
                l.timestamp as ultima_leitura
            FROM leitura l 
            JOIN sensor sens ON l.sensorId = sens.id 
            JOIN sala s ON sens.salaId = s.id 
            WHERE s.nome = ? 
            AND l.tipo = 'temperatura'
            ORDER BY l.timestamp DESC 
            LIMIT 1
        `, [sala]);
        
        res.json({
            success: true,
            sala: sala,
            temperatura: rows[0]?.temperatura || null,
            ultima_leitura: rows[0]?.ultima_leitura || null,
            unidade: '°C'
        });
    } catch (error) {
        console.error('Erro temperatura:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

export const getHistoricoTemperatura = async (req, res) => {
    try {
        const { sala } = req.params;
        const { horas = 24, limite = 100 } = req.query;
        
        const [rows] = await pool.query(`
            SELECT 
                l.timestamp as time,
                ROUND(l.valor, 2) as value
            FROM leitura l 
            JOIN sensor sens ON l.sensorId = sens.id 
            JOIN sala s ON sens.salaId = s.id 
            WHERE s.nome = ? 
            AND l.tipo = 'temperatura'
            AND l.timestamp >= DATE_SUB(NOW(), INTERVAL ? HOUR)
            ORDER BY l.timestamp DESC
            LIMIT ?
        `, [sala, horas, limite]);
        
        res.json({
            success: true,
            sala: sala,
            periodo: `${horas} horas`,
            historico: rows
        });
    } catch (error) {
        console.error('Erro histórico temperatura:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

export const getMediaTemperatura = async (req, res) => {
    try {
        const { sala } = req.params;
        const { periodo = 'dia' } = req.query;
        
        const [rows] = await pool.query(`
            SELECT 
                ROUND(AVG(l.valor), 2) as media_temperatura,
                MIN(l.valor) as minima,
                MAX(l.valor) as maxima
            FROM leitura l 
            JOIN sensor sens ON l.sensorId = sens.id 
            JOIN sala s ON sens.salaId = s.id 
            WHERE s.nome = ? 
            AND l.tipo = 'temperatura'
            AND l.timestamp >= DATE_SUB(NOW(), INTERVAL 1 ${periodo.toUpperCase()})
        `, [sala]);
        
        res.json({
            success: true,
            sala: sala,
            periodo: periodo,
            media: rows[0]?.media_temperatura || null,
            minima: rows[0]?.minima || null,
            maxima: rows[0]?.maxima || null
        });
    } catch (error) {
        console.error('Erro média temperatura:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};



export const getClimaSala = async (req, res) => {
    try {
        const { sala } = req.params;
        
        const [rows] = await pool.query(`
            SELECT 
                MAX(CASE WHEN l.tipo = 'temperatura' THEN l.valor END) as temperatura,
                MAX(CASE WHEN l.tipo = 'umidade' THEN l.valor END) as umidade,
                MAX(l.timestamp) as ultima_leitura
            FROM leitura l 
            JOIN sensor sens ON l.sensorId = sens.id 
            JOIN sala s ON sens.salaId = s.id 
            WHERE s.nome = ? 
            AND l.tipo IN ('temperatura', 'umidade')
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
            temperatura: rows[0]?.temperatura || null,
            umidade: rows[0]?.umidade || null,
            ultima_leitura: rows[0]?.ultima_leitura || null,
            conforto: calcularConforto(rows[0]?.temperatura, rows[0]?.umidade)
        });
    } catch (error) {
        console.error('Erro clima:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};



// Função auxiliar
function calcularConforto(temperatura, umidade) {
    if (!temperatura || !umidade) return 'desconhecido';
    
    if (temperatura >= 22 && temperatura <= 26 && 
        umidade >= 40 && umidade <= 60) {
        return 'confortável';
    } else if (temperatura > 26 || umidade > 70) {
        return 'desconfortável';
    } else {
        return 'aceitável';
    }
}