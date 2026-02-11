import React, { useState, useEffect } from 'react';
import SalaSelector from '../components/Salaseletor';
import { getTemperaturaSala, getHistoricoTemperatura } from '../services/services_temps';
import GraficoTemperatura from '../components/GraficoTemperatura';

interface HistoricoTemperatura {
  time: string;
  value: number;
}

const Temperatura: React.FC = () => {
  const [salaSelecionada, setSalaSelecionada] = useState<string>('LABF04');
  const [temperaturaAtual, setTemperaturaAtual] = useState<number | null>(null);
  const [historico, setHistorico] = useState<HistoricoTemperatura[]>([]);
  const [periodo, setPeriodo] = useState<'24h' | '7d' | '30d'>('24h');
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarDadosTemperatura();
  }, [salaSelecionada, periodo]);

  const carregarDadosTemperatura = async () => {
    setCarregando(true);
    try {
      // Carrega temperatura atual
      const respostaAtual = await getTemperaturaSala(salaSelecionada);
      setTemperaturaAtual(respostaAtual.data.temperatura);

      // Carrega histórico
      const horas = periodo === '24h' ? 24 : periodo === '7d' ? 168 : 720;
      const respostaHistorico = await getHistoricoTemperatura(salaSelecionada, horas);
      setHistorico(respostaHistorico.data.historico || []);
    } catch (erro) {
      console.error('Erro ao carregar dados de temperatura:', erro);
    } finally {
      setCarregando(false);
    }
  };

  const calcularEstatisticas = () => {
    if (historico.length === 0) return { media: 0, minima: 0, maxima: 0 };
    
    const valores = historico.map(item => item.value).filter(v => v != null);
    const media = valores.reduce((a, b) => a + b, 0) / valores.length;
    const minima = Math.min(...valores);
    const maxima = Math.max(...valores);
    
    return { media: Math.round(media * 10) / 10, minima, maxima };
  };

  const estatisticas = calcularEstatisticas();

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-secondary dark:text-white mb-2">
          Monitoramento de Temperatura
        </h1>
        <p className="text-text-secondary dark:text-gray-400">
          Acompanhe a temperatura em tempo real e histórico das salas
        </p>
      </div>

      <SalaSelector 
        salaSelecionada={salaSelecionada} 
        onSalaChange={setSalaSelecionada} 
      />

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Card de Temperatura Atual */}
        <div className="card p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-text-primary dark:text-white">
              Temperatura Atual - {salaSelecionada}
            </h2>
            <div className="flex items-center gap-2 rounded-lg bg-gray-100 dark:bg-gray-800 p-1">
              {(['24h', '7d', '30d'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriodo(p)}
                  className={`rounded px-3 py-1.5 text-sm font-semibold transition-colors ${
                    periodo === p
                      ? 'bg-white text-primary shadow-sm dark:bg-gray-900 dark:text-primary'
                      : 'text-gray-500 hover:bg-white/60 hover:text-secondary dark:text-gray-400 dark:hover:bg-gray-900/60'
                  }`}
                >
                  {p === '24h' ? '24 Horas' : p === '7d' ? '7 Dias' : '30 Dias'}
                </button>
              ))}
            </div>
          </div>

          {carregando ? (
            <div className="text-center py-12 text-text-secondary">
              Carregando dados de temperatura...
            </div>
          ) : (
            <div className="h-80">
              <GraficoTemperatura 
                data={historico.map(item => ({
                  time: new Date(item.time),
                  value: item.value
                }))}
                periodo={periodo}
              />
            </div>
          )}
        </div>

        {/* Card de Estatísticas */}
        <div className="card p-6 space-y-6">
          <h3 className="text-lg font-semibold text-secondary dark:text-white">Estatísticas</h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 rounded-lg bg-primary/5">
              <p className="text-text-secondary dark:text-gray-400">Temperatura Atual</p>
              <p className="text-2xl font-bold text-primary">
                {temperaturaAtual ? `${temperaturaAtual}°C` : '--'}
              </p>
            </div>
            
            <div className="flex justify-between text-sm">
              <p className="text-text-secondary dark:text-gray-400">Média do Período</p>
              <p className="font-medium text-text-primary dark:text-white">
                {estatisticas.media}°C
              </p>
            </div>
            
            <div className="flex justify-between text-sm">
              <p className="text-text-secondary dark:text-gray-400">Temperatura Mínima</p>
              <p className="font-bold text-primary">{estatisticas.minima}°C</p>
            </div>
            
            <div className="flex justify-between text-sm">
              <p className="text-text-secondary dark:text-gray-400">Temperatura Máxima</p>
              <p className="font-bold text-accent">{estatisticas.maxima}°C</p>
            </div>
          </div>

          {/* Status de Conforto */}
          <div className="mt-8 p-4 rounded-lg bg-secondary/5 border border-secondary/20">
            <p className="text-sm font-medium text-secondary mb-2">Status de Conforto</p>
            <p className="text-lg font-bold text-primary">
              {temperaturaAtual && temperaturaAtual >= 22 && temperaturaAtual <= 26 
                ? 'Confortável' 
                : temperaturaAtual && temperaturaAtual > 26 
                ? 'Quente - Ligar Ar' 
                : 'Frio - Desligar Ar'}
            </p>
          </div>
        </div>
      </div>

      {/* Tabela de Histórico */}
      <div className="card">
        <h3 className="border-b border-border-light dark:border-border-dark p-4 text-lg font-semibold text-secondary dark:text-white">
          Histórico de Temperatura
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border-light dark:divide-border-dark">
            <thead className="bg-secondary/5 dark:bg-gray-800/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-secondary/80 dark:text-gray-400">
                  Data/Hora
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-secondary/80 dark:text-gray-400">
                  Temperatura
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-secondary/80 dark:text-gray-400">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light dark:divide-border-dark bg-white dark:bg-gray-900">
              {historico.slice(0, 10).map((item, index) => (
                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-text-primary dark:text-white">
                    {new Date(item.time).toLocaleString('pt-BR')}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-text-secondary dark:text-gray-400">
                    {item.value}°C
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                      item.value >= 22 && item.value <= 26
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                        : item.value > 26
                        ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                    }`}>
                      {item.value >= 22 && item.value <= 26 ? 'Confortável' : item.value > 26 ? 'Quente' : 'Frio'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Temperatura;