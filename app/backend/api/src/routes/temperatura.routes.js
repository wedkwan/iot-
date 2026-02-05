import Router  from 'express';
import {
  getTemperaturaSala,
  getHistoricoTemperatura,
  getMediaTemperatura,
  getClimaSala,
} from "../controllers/temperatura.controller.js";

const router = Router();


router.get('/:sala/temperatura', getTemperaturaSala);
router.get('/:sala/temperatura/historico', getHistoricoTemperatura);
router.get('/:sala/temperatura/media', getMediaTemperatura);
router.get('/:sala/clima', getClimaSala);



export default router