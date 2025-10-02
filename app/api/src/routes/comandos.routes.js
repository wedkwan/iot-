import { Router } from "express";
import { get_comandos, 
    listar_comandos, 
    transmitir_comandos} 
from "../controllers/comandos.controller.js";



const comandosRoutes = Router()

comandosRoutes.post("/listar" , listar_comandos )
comandosRoutes.get("/" , get_comandos )
comandosRoutes.post("/retransmitir" , transmitir_comandos)



export default comandosRoutes