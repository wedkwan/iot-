import { apagarComandos, listarComandos  , retransmitirComando ,pegarComandos  } from "../services/comandos.service.js";
import  pool  from "../config/bd.js"






export async function get_comandos(req, res) {
  try {
    const { sala } = req.params;

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

    res.json({
      comandos: rows
    });

  } catch (err) {
    console.log("Erro listarComandosSala:", err.message);
    res.status(500).json({ error: err.message });
  }
}



export function listar_comandos(req , res)  {
   listarComandos();
   res.json({msg: "pedido para listar comandos enviado"})
}

export async function deletar_comandos(res){
    apagarComandos();  
    try{
    const respostaESP = await esperarResposta("smartcampus/comandos/resposta", 5000); 
    res.json({ msg: respostaESP });
    } catch (err) {
    res.status(500).json({ error: err.message });
    }

}

export async function transmitir_comandos(req , res) {
    const {indice} = req.body;
    if (indice === undefined) return res.status(400).json({error:"Índice obrigatório"});
    try {
     retransmitirComando(indice)
     const resposta = await esperarResposta("smartcampus/comandos/resposta", 5000);
     res.json({msg: resposta});
    }catch(err) {
        res.status(500).json({error:err.message});
    }
}






