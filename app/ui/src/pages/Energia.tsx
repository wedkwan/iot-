import React, { useState, useEffect } from 'react';
import SalaSelector from '../components/Salaseletor';
import { getConsumoDashboard, getConsumoSemana } from '../services/services_temps';
import GraficoBarrasEnergia from '../components/GraficoBarrasEnergia';

interface ConsumoDashboard {
  hoje: {
    corrente_media: number;
    consumo_kwh: number;
    custo: number;
  };
  semana: {
    corrente_media: number;
    consumo_kwh: number;
    custo: number;
  };
  mes: {
    corrente_media: number;
    consumo_kwh: number;
    custo: number;
  };
}

interface ConsumoSemana {
  data: string;
  consumo_kwh: number;
  corrente_media: number;
}

const Energia: React.FC = () => {
  const [salaSelecionada, setSalaSelecionada] = useState<string>('LABF04');
  const [periodo, setPeriodo] = useState<'hoje' | 'semana' | 'mes'>('semana');
  const [dashboard, setDashboard] = useState<ConsumoDashboard | null>(null);
  const [consumoSemana, setConsumoSemana] = useState<ConsumoSemana[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarDadosEnergia();
  }, [salaSelecionada, periodo]);

  const carregarDadosEnergia = async () => {
    setCarregando(true);
    try {
      // Carrega dashboard
      const respostaDashboard = await getConsumoDashboard(salaSelecionada);
      setDashboard(respostaDashboard.data.dashboard);

      // Carrega dados da semana para o gráfico
      const respostaSemana = await getConsumoSemana(salaSelecionada);
      setConsumoSemana(respostaSemana.data.dias || []);
    } catch (erro) {
      console.error('Erro ao carregar dados de energia:', erro);
    } finally {
      setCarregando(false);
    }
  };

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const calcularTotalConsumo = () => {
    if (periodo === 'hoje') return dashboard?.hoje.consumo_kwh || 0;
    if (periodo === 'semana') return dashboard?.semana.consumo_kwh || 0;
    return dashboard?.mes.consumo_kwh || 0;
  };

  const calcularVariacao = () => {
    // Simulação de variação - na prática viria da API
    return '+10%';
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-secondary dark:text-white mb-2">
          Consumo de Energia
        </h1>
        <p className="text-text-secondary dark:text-gray-400">
          Monitoramento detalhado do consumo energético das salas
        </p>
      </div>

      <SalaSelector 
        salaSelecionada={salaSelecionada} 
        onSalaChange={setSalaSelecionada} 
      />

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-3xl font-bold tracking-tight text-secondary dark:text-white">
          Consumo de Energia
        </h2>
        <div className="flex items-center gap-2 rounded-lg bg-gray-200/60 dark:bg-gray-800/60 p-1">
          <button
            onClick={() => setPeriodo('hoje')}
            className={`rounded px-3 py-1.5 text-sm font-semibold transition-colors ${
              periodo === 'hoje'
                ? 'bg-white text-accent shadow-sm dark:bg-gray-900 dark:text-accent'
                : 'text-gray-500 hover:bg-white/60 hover:text-secondary dark:text-gray-400 dark:hover:bg-gray-900/60'
            }`}
          >
            Hoje
          </button>
          <button
            onClick={() => setPeriodo('semana')}
            className={`rounded px-3 py-1.5 text-sm font-semibold transition-colors ${
              periodo === 'semana'
                ? 'bg-white text-accent shadow-sm dark:bg-gray-900 dark:text-accent'
                : 'text-gray-500 hover:bg-white/60 hover:text-secondary dark:text-gray-400 dark:hover:bg-gray-900/60'
            }`}
          >
            Esta Semana
          </button>
          <button
            onClick={() => setPeriodo('mes')}
            className={`rounded px-3 py-1.5 text-sm font-semibold transition-colors ${
              periodo === 'mes'
                ? 'bg-white text-accent shadow-sm dark:bg-gray-900 dark:text-accent'
                : 'text-gray-500 hover:bg-white/60 hover:text-secondary dark:text-gray-400 dark:hover:bg-gray-900/60'
            }`}
          >
            Este Mês
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 mb-8">
        {/* Gráfico de Consumo */}
        <div className="card p-6 lg:col-span-2">
          <div className="mb-4 flex items-baseline justify-between">
            <div>
              <p className="text-sm font-medium text-text-secondary dark:text-gray-400">
                Consumo de Energia
              </p>
              <p className="text-3xl font-bold text-text-primary dark:text-white">
                {calcularTotalConsumo().toFixed(1)} kWh
              </p>
            </div>
            <div className="flex items-center gap-1">
              <p className="text-sm text-text-secondary dark:text-gray-400">
                {periodo === 'hoje' ? 'Hoje' : periodo === 'semana' ? 'Esta Semana' : 'Este Mês'}
              </p>
              <p className="text-sm font-bold text-primary">{calcularVariacao()}</p>
            </div>
          </div>

          {carregando ? (
            <div className="h-48 flex items-center justify-center text-text-secondary">
              Carregando gráfico...
            </div>
          ) : (
            <div className="h-48">
              <GraficoBarrasEnergia 
                data={consumoSemana}
                periodo={periodo}
              />
            </div>
          )}
        </div>

        {/* Detalhes do Consumo */}
        <div className="card p-6 space-y-6">
          <h3 className="text-lg font-semibold text-secondary dark:text-white">Detalhes</h3>
          
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <p className="text-text-secondary dark:text-gray-400">Consumo Total</p>
              <p className="font-medium text-text-primary dark:text-white">
                {calcularTotalConsumo().toFixed(1)} kWh
              </p>
            </div>
            
            <div className="flex justify-between text-sm">
              <p className="text-text-secondary dark:text-gray-400">Consumo Médio</p>
              <p className="font-medium text-text-primary dark:text-white">
                {(calcularTotalConsumo() / (periodo === 'hoje' ? 1 : periodo === 'semana' ? 7 : 30)).toFixed(1)} kWh/dia
              </p>
            </div>
            
            <div className="flex justify-between text-sm">
              <p className="text-text-secondary dark:text-gray-400">Pico de Consumo</p>
              <p className="font-bold text-accent">
                {Math.max(...consumoSemana.map(d => d.consumo_kwh)).toFixed(1)} kWh
              </p>
            </div>
            
            <div className="flex justify-between text-sm">
              <p className="text-text-secondary dark:text-gray-400">Menor Consumo</p>
              <p className="font-bold text-primary">
                {Math.min(...consumoSemana.map(d => d.consumo_kwh)).toFixed(1)} kWh
              </p>
            </div>
            
            <div className="flex justify-between text-sm">
              <p className="text-text-secondary dark:text-gray-400">Custo Estimado</p>
              <p className="font-bold text-secondary">
                {formatarMoeda(
                  periodo === 'hoje' ? dashboard?.hoje.custo || 0 :
                  periodo === 'semana' ? dashboard?.semana.custo || 0 :
                  dashboard?.mes.custo || 0
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabela de Histórico */}
      <div className="card">
        <h3 className="border-b border-border-light dark:border-border-dark p-4 text-lg font-semibold text-secondary dark:text-white">
          Histórico de Consumo
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border-light dark:divide-border-dark">
            <thead className="bg-secondary/5 dark:bg-gray-800/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-secondary/80 dark:text-gray-400">
                  Data
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-secondary/80 dark:text-gray-400">
                  Consumo (kWh)
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-secondary/80 dark:text-gray-400">
                  Corrente Média (A)
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-secondary/80 dark:text-gray-400">
                  Custo Estimado
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light dark:divide-border-dark bg-white dark:bg-gray-900">
              {consumoSemana.map((dia, index) => (
                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-text-primary dark:text-white">
                    {new Date(dia.data).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-text-secondary dark:text-gray-400">
                    {dia.consumo_kwh.toFixed(1)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-text-secondary dark:text-gray-400">
                    {dia.corrente_media.toFixed(1)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                    {formatarMoeda(dia.consumo_kwh * 0.80)}
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

export default Energia;