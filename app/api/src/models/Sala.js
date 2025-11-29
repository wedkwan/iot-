import { pool } from "../config/bd.js";


export async function findorcreateSala(nome){
    const [rowns] = await pool.query("SELECT id FROM Sala WHERE nome =?",[nome]);
    if (rowns.length > 0) 
    return rowns[0].id;
    const [result] = await pool.query("INSERT INTO Sala (nome) VALUES (?)",[nome]);
    return result.insertId;
    
}