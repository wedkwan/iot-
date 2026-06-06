import express from 'express';
import {
  getConsumoHoje,
  getConsumoSemana,
  getDashboardConsumo,
  getConsumoHora
} from '../controllers/consumo.controller.js';

const router = express.Router();


router.get('/:sala/consumo/hoje', getConsumoHoje);
router.get('/:sala/consumo/semana', getConsumoSemana);
router.get('/:sala/consumo/dashboard', getDashboardConsumo);
router.get('/:sala/consumo/hora', getConsumoHora);

export default router;