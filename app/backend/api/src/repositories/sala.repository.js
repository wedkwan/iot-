import pool from "../configs/db.js";
export async function TodasSalas() {
    try {
        const [rows] = await pool.query(`
            SELECT
                sa.id,
                sa.nome,
                sa.criadoEm,
                COUNT(DISTINCT s.id) as total_sensores
            FROM sala sa
            LEFT JOIN sensor s ON sa.id = s.salaId
            GROUP BY sa.id, sa.nome, sa.criadoEm
            ORDER BY sa.nome
        `);
        return rows;
    } catch (error) {
        console.error("Erro ao buscar todas as salas:", error);
        throw error;
    }
}

export async function StatusSalas() {
    try {
        const [rows] = await pool.query(`
            SELECT 
                sa.nome as sala,
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
            FROM Sala sa
            LEFT JOIN sensor s ON sa.id = s.salaId
            LEFT JOIN leitura l ON s.id = l.sensorId 
                AND l.timestamp = (
                    SELECT MAX(timestamp)
                    FROM leitura l2
                    WHERE l2.sensorId = l.sensorId 
                    AND l2.tipo = l.tipo
                )
            GROUP BY sa.id, sa.nome
            ORDER BY sa.nome
        `);
        return rows;
    } catch (error) {
        console.error("Erro ao buscar status das salas:", error);
        throw error;
    }
}


export async function MetricasTodasSalas() {
    try{
        const [rows] = await pool.query(`
            SELECT 
                sa.nome as sala,
                max(CASE WHEN l.tipo = 'temperatura' THEN l.valor END) as temperatura,
                max(CASE WHEN l.tipo = 'umidade' THEN l.valor END) as umidade,
                max(CASE WHEN l.tipo = 'corrente' THEN l.valor END) as corrente,
                max(l.timestamp) as ultima_leitura
            FROM sala sa
            LEFT JOIN sensor s ON sa.id = s.salaId
            LEFT JOIN leitura l ON s.id = l.sensorId
                    AND l.timestamp = (
                        SELECT MAX(timestamp)
                        FROM leitura l2                       
                        WHERE l2.sensorId = l.sensorId 
                        AND l2.tipo = l.tipo
                    )   
            GROUP BY sa.id, sa.nome
            ORDER BY sa.nome
        `);
        return rows;
    } catch (error) {
        console.error("Erro ao buscar métricas de todas as salas:", error);
        throw error;
    }
}


export async function metricaSala(sala){
    try{
        const [rows] = await pool.query(`
            SELECT 
                max(CASE WHEN l.tipo = 'temperatura' THEN l.valor END) as temperatura,
                max(CASE WHEN l.tipo = 'umidade' THEN l.valor END) as umidade,
                max(CASE WHEN l.tipo = 'corrente' THEN l.valor END) as corrente,
                max(l.timestamp) as ultima_leitura
            FROM leitura l
            LEFT JOIN sensor s ON l.sensorId = s.id
            LEFT JOIN sala sa ON s.salaId = sa.id
            WHERE sa.nome = ?
            AND l.timestamp = (
                SELECT MAX(timestamp)
                    FROM leitura l2                       
                    WHERE l2.sensorId = l.sensorId 
                    AND l2.tipo = l.tipo
                    ) 
          
        `, [sala]);
        return rows[0];
    } catch (error) {
        console.error("Erro ao buscar métricas da sala:", error);
        throw error;
    }
}