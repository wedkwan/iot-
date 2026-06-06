import pool from "../configs/db.js  ";

export async function listarComandos(sala) {
    try {
        const [rows] = await pool.query(`
            SELECT 
            c.comandoId AS id,
            c.nome
            FROM comandos c
            JOIN sensor s ON s.id = c.sensorId
            JOIN sala sa ON sa.id = s.salaId
            WHERE sa.nome = ?
            ORDER BY c.comandoId ASC
        `, [sala]);
        return rows;
    } catch (error) {
        console.error("Erro ao listar comandos:", error);
        throw error;
    }
}