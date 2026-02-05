import pool  from "../configs/db.js";


export async function findorcreateSala(nome){
    const [rowns] = await pool.query("SELECT id FROM sala WHERE nome =?",[nome]);
    if (rowns.length > 0) 
    return rowns[0].id;
    const [result] = await pool.query("INSERT INTO sala (nome) VALUES (?)",[nome]);
    return result.insertId;
    
}