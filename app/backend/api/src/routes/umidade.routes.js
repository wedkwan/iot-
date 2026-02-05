import express from 'express';
import {
  getUmidadeSala,
  getHistoricoUmidade
} from '../controllers/umidade.controller.js';

const router = express.Router();

router.get('/:sala/umidade', getUmidadeSala);
router.get('/:sala/umidade/historico', getHistoricoUmidade);

export default router;