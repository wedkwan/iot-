import { apagarComandos, listarComandos , esperarResposta , retransmitirComando ,  } from "../services/comandos.service.js";
import { pegarComandos } from "../services/comandos.service.js";
import { parseListaComandos } from "../utills/perselista.js";






export function get_comandos(req, res) {
  const listaBruta = pegarComandos()
  const lista = parseListaComandos(listaBruta)
  res.json({lista});
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





