import  pool  from "../config/bd.js"
export const getTodasSalas = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                s.id,
                s.nome,
                s.criadoEm,
                COUNT(DISTINCT sens.id) as total_sensores
            FROM sala s
            LEFT JOIN sensor sens ON s.id = sens.salaId
            GROUP BY s.id, s.nome
            ORDER BY s.nome
        `);
        
        res.json({
            success: true,
            total: rows.length,
            salas: rows
        });
    } catch (error) {
        console.error('Erro todas salas:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

export const getSalasStatus = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                s.nome as sala,
                MAX(CASE WHEN l.tipo = 'temperatura' THEN l.valor END) as temperatura,
                MAX(CASE WHEN l.tipo = 'umidade' THEN l.valor END) as umidade,
                MAX(CASE WHEN l.tipo = 'corrente' THEN l.valor END) as corrente,
                CASE 
                    WHEN MAX(CASE WHEN l.tipo = 'temperatura' THEN l.valor END) > 26 THEN 'quente'
                    WHEN MAX(CASE WHEN l.tipo = 'temperatura' THEN l.valor END) < 18 THEN 'frio'
                    ELSE 'normal'
                END as status_temperatura,
                CASE 
                    WHEN MAX(CASE WHEN l.tipo = 'corrente' THEN l.valor END) > 10 THEN 'sobrecarga'
                    ELSE 'normal'
                END as status_corrente
            FROM Sala s
            LEFT JOIN sensor sens ON s.id = sens.salaId
            LEFT JOIN leitura l ON sens.id = l.sensorId 
                AND l.timestamp = (
                    SELECT MAX(timestamp)
                    FROM leitura l2
                    WHERE l2.sensorId = l.sensorId 
                    AND l2.tipo = l.tipo
                )
            GROUP BY s.id, s.nome
            ORDER BY s.nome
        `);
        
        res.json({
            success: true,
            total: rows.length,
            salas: rows
        });
    } catch (error) {
        console.error('Erro status salas:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

export const getMetricasTodasSalas = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                s.nome as sala,
                MAX(CASE WHEN l.tipo = 'temperatura' THEN l.valor END) as temperatura,
                MAX(CASE WHEN l.tipo = 'umidade' THEN l.valor END) as umidade,
                MAX(CASE WHEN l.tipo = 'corrente' THEN l.valor END) as corrente,
                MAX(l.timestamp) as ultima_atualizacao
            FROM Sala s
            LEFT JOIN sensor sens ON s.id = sens.salaId
            LEFT JOIN leitura l ON sens.id = l.sensorId 
                AND l.timestamp = (
                    SELECT MAX(timestamp)
                    FROM leitura l2
                    WHERE l2.sensorId = l.sensorId 
                    AND l2.tipo = l.tipo
                )
            GROUP BY s.id, s.nome
            ORDER BY s.nome
        `);
        
        res.json({
            success: true,
            total: rows.length,
            salas: rows
        });
    } catch (error) {
        console.error('Erro métricas salas:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};


export const getMetricasSala = async (req, res) => {
    try {
        const { sala } = req.params;
        
        const [rows] = await pool.query(`
            SELECT 
                MAX(CASE WHEN l.tipo = 'temperatura' THEN l.valor END) as temperatura,
                MAX(CASE WHEN l.tipo = 'umidade' THEN l.valor END) as umidade,
                MAX(CASE WHEN l.tipo = 'corrente' THEN l.valor END) as corrente,
                MAX(l.timestamp) as ultima_atualizacao
            FROM leitura l 
            JOIN sensor sens ON l.sensorId = sens.id 
            JOIN sala s ON sens.salaId = s.id 
            WHERE s.nome = ? 
            AND l.timestamp = (
                SELECT MAX(timestamp)
                FROM leitura l2
                WHERE l2.sensorId = l.sensorId 
                AND l2.tipo = l.tipo
            )
        `, [sala]);
        
        res.json({
            success: true,
            sala: sala,
            ...rows[0],
            unidade_temperatura: '°C',
            unidade_umidade: '%',
            unidade_corrente: 'A'
        });
    } catch (error) {
        console.error('Erro métricas sala:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};