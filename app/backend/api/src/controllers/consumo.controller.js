import {
  consumoHoje,
  consumoSemana,
  consumoMes,
  consumoHora
} from "../services/consumo.service.js";

const TARIFA_KWH =0.80;

export async function getConsumoHoje(req, res) {
  try {
    const resultado = await consumoHoje(req.params.sala);
    res.json({ success: true, ...resultado });
  } catch (err) {
    console.error("Erro consumo hoje:", err);
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function getConsumoSemana(req, res) {
  try {
    const resultado = await consumoSemana(req.params.sala);
    res.json({ success: true, ...resultado });
  } catch (err) {
    console.error("Erro consumo semana:", err);
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function getConsumoMes(req, res) {
  try {
    const resultado = await consumoMes(req.params.sala);
    res.json({ success: true, ...resultado });
  } catch (err) {
    console.error("Erro consumo mês:", err);
    res.status(500).json({ success: false, error: err.message });
  }
}






export const getDashboardConsumo = async (req, res) => {
  
  try {
    const { sala } = req.params;

    const [hoje, semana, mes] = await Promise.all([
      consumoHoje(sala),
      consumoSemana(sala),
      consumoMes(sala)
    ]);
     
    const kwhHoje   = hoje?.consumo_kwh             || 0
    const kwhSemana = semana?.consumo_total_kwh     || 0
    const kwhMes    = mes?.consumo_total_kwh        || 0

    res.json({
      success: true,
      sala,
      dashboard: {
        hoje: {
          consumo_kwh:    Number(kwhHoje.toFixed(4)),
          custo_estimado: Number((kwhHoje * TARIFA_KWH).toFixed(2))
        },
        semana: {
          consumo_kwh:    Number(kwhSemana.toFixed(4)),
          custo_estimado: Number((kwhSemana * TARIFA_KWH).toFixed(2))
        },
        mes: {
          consumo_kwh:    Number(kwhMes.toFixed(4)),
          custo_estimado: Number((kwhMes * TARIFA_KWH).toFixed(2))
        }
      }
    });
  } catch (error) {
    console.error('Erro dashboard consumo:', error);
    res.status(500).json({ success: false, error: error.message });
  }



};



export async function getConsumoHora(req, res) {
  try {
    const resultado = await consumoHora(req.params.sala);
    res.json({ success: true, ...resultado });
  } catch (err) {
    console.error('Erro consumo hora:', err);
    res.status(500).json({ success: false, error: err.message });
  }
}