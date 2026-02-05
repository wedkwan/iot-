import pool from "../config/bd.js"

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

export const getHistoricoCorrente = async (req, res) => {
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
            AND l.tipo = 'corrente'
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
        console.error('Erro histórico corrente:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

export const getConsumoHoje = async (req, res) => {
    try {
        const { sala } = req.params;
        
        const [rows] = await pool.query(`
            SELECT 
                DATE(l.timestamp) as data,
                -- Estimativa: corrente * 220V * horas de uso (8h) / 1000
                ROUND(AVG(l.valor) * 220 * 8 / 1000, 2) as consumo_kwh,
                ROUND(AVG(l.valor), 2) as corrente_media
            FROM leitura l 
            JOIN sensor sens ON l.sensorId = sens.id 
            JOIN sala s ON sens.salaId = s.id 
            WHERE s.nome = ? 
            AND l.tipo = 'corrente'
            AND DATE(l.timestamp) = CURDATE()
        `, [sala]);
        
        const consumo = rows[0]?.consumo_kwh || 0;
        const custo = consumo * 0.80; // R$ 0,80/kWh
        
        res.json({
            success: true,
            sala: sala,
            data: new Date().toISOString().split('T')[0],
            consumo_kwh: consumo,
            corrente_media: rows[0]?.corrente_media || 0,
            custo_estimado: custo,
            moeda: 'BRL'
        });
    } catch (error) {
        console.error('Erro consumo hoje:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

export const getConsumoSemana = async (req, res) => {
    try {
        const { sala } = req.params;
        
        const [rows] = await pool.query(`
            SELECT 
                DATE(l.timestamp) as data,
                ROUND(AVG(l.valor) * 220 * 8 / 1000, 2) as consumo_kwh,
                ROUND(AVG(l.valor), 2) as corrente_media
            FROM Leitura l 
            JOIN Sensor sens ON l.sensorId = sens.id 
            JOIN Sala s ON sens.salaId = s.id 
            WHERE s.nome = ? 
            AND l.tipo = 'corrente'
            AND l.timestamp >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
            GROUP BY DATE(l.timestamp)
            ORDER BY data
        `, [sala]);
        
        const total = rows.reduce((sum, dia) => sum + dia.consumo_kwh, 0);
        
        res.json({
            success: true,
            sala: sala,
            periodo: '7_dias',
            consumo_total_kwh: total,
            dias: rows,
            custo_total: total * 0.80
        });
    } catch (error) {
        console.error('Erro consumo semana:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};




export const getDashboardConsumo = async (req, res) => {
    try {
        const { sala } = req.params;
        
        // Executa múltiplas queries em paralelo
        const [
            [hoje],
            [semana],
            [mes]
        ] = await Promise.all([
            pool.query(`
                SELECT AVG(valor) as media 
                FROM Leitura l
                JOIN Sensor sens ON l.sensorId = sens.id 
                JOIN Sala s ON sens.salaId = s.id 
                WHERE s.nome = ? 
                AND tipo = 'corrente'
                AND DATE(timestamp) = CURDATE()
            `, [sala]),
            
            pool.query(`
                SELECT AVG(valor) as media 
                FROM Leitura l
                JOIN Sensor sens ON l.sensorId = sens.id 
                JOIN Sala s ON sens.salaId = s.id 
                WHERE s.nome = ? 
                AND tipo = 'corrente'
                AND timestamp >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
            `, [sala]),
            
            pool.query(`
                SELECT AVG(valor) as media 
                FROM Leitura l
                JOIN Sensor sens ON l.sensorId = sens.id 
                JOIN Sala s ON sens.salaId = s.id 
                WHERE s.nome = ? 
                AND tipo = 'corrente'
                AND timestamp >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
            `, [sala])
        ]);
        
        const calcConsumo = (media) => (media || 0) * 220 * 8 / 1000;
        
        res.json({
            success: true,
            sala: sala,
            dashboard: {
                hoje: {
                    corrente_media: hoje[0]?.media || 0,
                    consumo_kwh: calcConsumo(hoje[0]?.media),
                    custo: calcConsumo(hoje[0]?.media) * 0.80
                },
                semana: {
                    corrente_media: semana[0]?.media || 0,
                    consumo_kwh: calcConsumo(semana[0]?.media) * 7,
                    custo: calcConsumo(semana[0]?.media) * 7 * 0.80
                },
                mes: {
                    corrente_media: mes[0]?.media || 0,
                    consumo_kwh: calcConsumo(mes[0]?.media) * 30,
                    custo: calcConsumo(mes[0]?.media) * 30 * 0.80
                }
            }
        });
    } catch (error) {
        console.error('Erro dashboard consumo:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};