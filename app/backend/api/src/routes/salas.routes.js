import express from 'express';
import {
  getTodasSalas,
  getSalasStatus,
  getMetricasTodasSalas, getMetricasSala
} from '../controllers/salas.controller.js';

const router = express.Router();

router.get('/salas', getTodasSalas);
router.get('/salas/status', getSalasStatus);
router.get('/salas/metricas', getMetricasTodasSalas);
router.get('/:sala/metricas', getMetricasSala); 


export default router;