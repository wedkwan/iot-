import api from './api';

// Temperatura
export const getTemperaturaSala = (sala: string) => {
  return api.get(`/${sala}/temperatura`);
};

export const getHistoricoTemperatura = (sala: string, horas: number = 24) => {
  return api.get(`/${sala}/temperatura/historico?horas=${horas}`);
};

// Consumo
export const getConsumoDashboard = (sala: string) => {
  return api.get(`/${sala}/consumo/dashboard`);
};

export const getConsumoSemana = (sala: string) => {
  return api.get(`/${sala}/consumo/semana`);
};

export const getConsumoHoje = (sala: string) => {
  return api.get(`/${sala}/consumo/hoje`);
};

export const getConsumoHora = (sala: string) => {
  return api.get(`/${sala}/consumo/hora`);
}

// Salas
export const getStatusSalas = () => {
  return api.get('/salas/status');
};

export const getMetricasSala = (sala: string) => {
  return api.get(`/${sala}/metricas`);
};

export const getTodasSalas = () => {
  return api.get('/salas');
};