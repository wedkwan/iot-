import express from 'express';
import { deletar_comandos, get_comandos, 
    listar_comandos, 
    transmitir_comandos} 
from "../controllers/comandos.controller.js";




const comandosRoutes = express.Router();



comandosRoutes.post("/:sala/listar" , listar_comandos );
comandosRoutes.get("/:sala" , get_comandos );
comandosRoutes.post("/:sala/retransmitir" , transmitir_comandos);
comandosRoutes.post("/:sala/apagar" , deletar_comandos)



export default comandosRoutes