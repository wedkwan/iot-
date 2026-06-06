import {
  getConsumoHoje,
  getConsumoSemana,
  getConsumoMes,
  getConsumoHora
} from "../repositories/consumo.repository.js";

const TARIFA_KWH = Number(process.env.TARIFA_KWH) || 0.80;

export async function consumoHoje(sala) {
  const data = await getConsumoHoje(sala);
  const kwh  = data?.consumo_kwh || 0;

  return {
    sala,
    data:          new Date().toISOString().split("T")[0],
    consumo_kwh:   kwh,
    custo_estimado: Number((kwh * TARIFA_KWH).toFixed(2)),
    moeda:         "BRL"
  };
}

export async function consumoSemana(sala) {
  const dias  = await getConsumoSemana(sala);
  const total = dias.reduce((sum, d) => sum + Number(d.consumo_kwh), 0);

  return {
    sala,
    periodo:           "7_dias",
    consumo_total_kwh: Number(total.toFixed(4)),
    custo_total:       Number((total * TARIFA_KWH).toFixed(2)),
    moeda:             "BRL",
    dias
  };
}

export async function consumoMes(sala) {
  const dias  = await getConsumoMes(sala);
  const total = dias.reduce((sum, d) => sum + Number(d.consumo_kwh), 0);

  return {
    sala,
    periodo:           "30_dias",
    consumo_total_kwh: Number(total.toFixed(4)),
    custo_total:       Number((total * TARIFA_KWH).toFixed(2)),
    moeda:             "BRL",
    dias
  };
}



export async function consumoHora(sala) {
  const horas = await getConsumoHora(sala);
  return {
    sala,
    data: new Date().toISOString().split('T')[0],
    horas
  };
}