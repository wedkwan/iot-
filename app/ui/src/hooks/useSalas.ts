import { useState, useEffect } from 'react';
import { getStatusSalas, getTodasSalas } from '../services/services_temps';

interface SalaStatus {
  sala: string;
  temperatura: number;
  umidade: number;
  corrente: number;
  status_temperatura: string;
  status_corrente: string;
}

interface SalaInfo {
  id: number;
  nome: string;
  criadoEm: string;
  total_sensores: number;
}

export const useSalas = () => {
  const [salasStatus, setSalasStatus] = useState<SalaStatus[]>([]);
  const [salasInfo, setSalasInfo] = useState<SalaInfo[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const carregarSalas = async () => {
    setCarregando(true);
    setErro(null);
    
    try {
      // Carrega status das salas
      const [respostaStatus, respostaInfo] = await Promise.all([
        getStatusSalas(),
        getTodasSalas()
      ]);
      
      setSalasStatus(respostaStatus.data.salas);
      setSalasInfo(respostaInfo.data.salas);
    } catch (err) {
      setErro('Erro ao carregar dados das salas');
      console.error('Erro no hook useSalas:', err);
    } finally {
      setCarregando(false);
    }
  };

  const obterSalaPorNome = (nome: string) => {
    return salasInfo.find(sala => sala.nome === nome);
  };

  const obterStatusSala = (nome: string) => {
    return salasStatus.find(sala => sala.sala === nome);
  };

  const obterSalaComStatus = (nome: string) => {
    const info = obterSalaPorNome(nome);
    const status = obterStatusSala(nome);
    
    return {
      ...info,
      ...status,
      temSensores: (info?.total_sensores || 0) > 0,
      estaAtiva: status?.temperatura != null
    };
  };

  useEffect(() => {
    carregarSalas();
    
    // Atualiza a cada 30 segundos
    const intervalo = setInterval(carregarSalas, 30000);
    return () => clearInterval(intervalo);
  }, []);

  return {
    salasStatus,
    salasInfo,
    carregando,
    erro,
    recarregar: carregarSalas,
    obterSalaPorNome,
    obterStatusSala,
    obterSalaComStatus
  };
};