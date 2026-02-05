import express from 'express';
import {
  getCorrenteSala,
  getHistoricoCorrente,
  getConsumoHoje,
  getConsumoSemana,
  getDashboardConsumo
} from '../controllers/consumo.controller.js';

const router = express.Router();

router.get('/:sala/corrente', getCorrenteSala);
router.get('/:sala/corrente/historico', getHistoricoCorrente);
router.get('/:sala/consumo/hoje', getConsumoHoje);
router.get('/:sala/consumo/semana', getConsumoSemana);
router.get('/:sala/consumo/dashboard', getDashboardConsumo);

export default router;