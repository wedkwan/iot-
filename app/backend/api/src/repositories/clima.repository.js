import pool from "../configs/db.js";

export async function TemperaturaSala(sala) {
    try {
        const [rows] = await pool.query(`
            SELECT 
                ROUND(l.valor, 2) AS temperatura,
                l.timestamp AS ultima_leitura
            FROM leitura l
            JOIN sensor s ON l.sensorId = s.id
            JOIN sala sa ON s.salaId = sa.id
            WHERE sa.nome = ?
            AND l.tipo = 'temperatura'
            ORDER BY l.timestamp DESC
            LIMIT 1
        `, [sala]);
        return rows[0];
    }
        
    catch (error) {
        console.error("Erro ao buscar temperatura da sala:", error);
        throw error;
    }
}

export async function MediaTemperatura(sala){
    try {
        const [rows] = await pool.query(`
            SELECT
                ROUND(l.valor, 2) AS media_temperatura,
                MIN(l.valor) AS minima,
                MAX(l.valor) AS maxima
            FROM leitura l , 
            JOIN sensor s ON l.sensorId = s.id
            JOIN sala sa ON s.salaId = sa.id
            WHERE sa.nome = ?
            AND l.tipo = 'temperatura'
            AND l.timestamp >= DATE_SUB(NOW(), INTERVAL 1 HOUR)
        `,[sala]);
        return rows[0];
    } catch (error) {
        console.error("Erro ao calcular média de temperatura:", error);
        throw error;
    }

}

export async function HistoricoTemperatura(sala, horas , limit ){
    try {
        const [rows] = await pool.query(`
            SELECT
                l.timestamp as time, 
                ROUND(l.valor, 2) AS value
            FROM leitura l
            JOIN sensor s ON l.sensorId = s.id
            JOIN sala sa ON s.salaId = sa.id
            WHERE sa.nome = ?
            AND l.tipo = 'temperatura'
            AND l.timestamp >= DATE_SUB(NOW(), INTERVAL ? HOUR)
            ORDER BY l.timestamp DESC
            LIMIT ?
        `,[sala, horas , limit]);
        return rows;
    } catch (error) {
        console.error("Erro ao buscar histórico de temperatura:", error);
        throw error;
    }
}








export async function ClimaSala(sala){
    try {
        const [rows] = await pool.query(`
            SELECT
                MAX(CASE WHEN l.tipo = 'temperatura' THEN l.valor END) AS temperatura,
                MAX(CASE WHEN l.tipo = 'umidade' THEN l.valor END) AS umidade,
                MAX(l.timestamp) AS ultima_leitura
            FROM leitura l
            JOIN sensor s ON l.sensorId = s.id
            JOIN sala sa ON s.salaId = sa.id
            WHERE sa.nome = ?
            ANd l.tipo IN ('temperatura', 'umidade')
            AND l.timestamp = (
                SELECT MAX(timestamp)             
                FROM leitura l2
                WHERE l2.sensorId = l.sensorId
                AND l2.tipo = l.tipo
            )
            
        `,[sala]);
        return rows[0];
            
    } catch (error) {
        console.error("Erro ao buscar clima da sala:", error);
        throw error;
    }
}







const clima= await TemperaturaSala("LABF04");

console.log(clima);
