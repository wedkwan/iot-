import React, { useState, useEffect } from 'react';
import SalaSelector from '../components/Salaseletor';
import { getConsumoDashboard, getConsumoSemana , getConsumoHora } from '../services/services_temps';
import GraficoBarrasEnergia from '../components/GraficoBarrasEnergia';
import GraficolinhaEnergia from '../components/GraficoLinhaEnergia';
import GraficoLinhaHora from '../components/GraficoLinhaHora';

interface ConsumoDashboard {
  hoje: {
    consumo_kwh: number;
    custo_estimado: number;
  };
  semana: {
    consumo_kwh: number;
    custo_estimado: number;
  };
  mes: {
    consumo_kwh: number;
    custo_estimado: number;
  };
}

interface ConsumoSemana {
  data: string;
  consumo_kwh: number;
}

const Energia: React.FC = () => {
  const [salaSelecionada, setSalaSelecionada] = useState<string>('LABF04');
  const [periodo, setPeriodo] = useState<'hoje' | 'semana' | 'mes'>('semana');
  const [dashboard, setDashboard] = useState<ConsumoDashboard | null>(null);
  const [consumoSemana, setConsumoSemana] = useState<ConsumoSemana[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [consumoHora, setConsumoHora] = useState<{
  hora: number;
  corrente_media: number;
  potencia_media: number;
  consumo_kwh: number;
}[]>([]);

  useEffect(() => {
    carregarDadosEnergia();
  }, [salaSelecionada, periodo]);

  const carregarDadosEnergia = async () => {
    setCarregando(true);
    try {
      const respostaDashboard = await getConsumoDashboard(salaSelecionada);
      setDashboard(respostaDashboard.data.dashboard);


      const respostaSemana = await getConsumoSemana(salaSelecionada);
      setConsumoSemana(respostaSemana.data.dias || []);
      const respostaHora = await getConsumoHora(salaSelecionada);
      setConsumoHora(respostaHora.data.horas || []);
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
          {(['hoje', 'semana', 'mes'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriodo(p)}
              className={`rounded px-3 py-1.5 text-sm font-semibold transition-colors ${
                periodo === p
                  ? 'bg-white text-accent shadow-sm dark:bg-gray-900 dark:text-accent'
                  : 'text-gray-500 hover:bg-white/60 hover:text-secondary dark:text-gray-400 dark:hover:bg-gray-900/60'
              }`}
            >
              {p === 'hoje' ? 'Hoje' : p === 'semana' ? 'Esta Semana' : 'Este Mês'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 mb-8">
        {/* Gráfico */}
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
            <p className="text-sm text-text-secondary dark:text-gray-400">
              {periodo === 'hoje' ? 'Hoje' : periodo === 'semana' ? 'Esta Semana' : 'Este Mês'}
            </p>
          </div>

          {carregando ? (
            <div className="h-48 flex items-center justify-center text-text-secondary">
              Carregando gráfico...
            </div>
          ) : periodo === 'hoje' ? (
            <div className="h-48 flex items-center justify-center text-text-secondary dark:text-gray-400">
              <GraficoLinhaHora data={consumoHora} />
            </div>
          ) : periodo === 'mes' ? (
            <div className="h-48">
              <GraficolinhaEnergia data={consumoSemana} />
            </div>
          ) : (
            <div className="h-48">
              <GraficoBarrasEnergia data={consumoSemana} periodo={periodo} />
            </div>
          )}
        </div>

        {/* Detalhes */}
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
                {consumoSemana.length > 0
                  ? Math.max(...consumoSemana.map(d => d.consumo_kwh)).toFixed(1)
                  : '0.0'} kWh
              </p>
            </div>
            <div className="flex justify-between text-sm">
              <p className="text-text-secondary dark:text-gray-400">Menor Consumo</p>
              <p className="font-bold text-primary">
                {consumoSemana.length > 0
                  ? Math.min(...consumoSemana.map(d => d.consumo_kwh)).toFixed(1)
                  : '0.0'} kWh
              </p>
            </div>
            <div className="flex justify-between text-sm">
              <p className="text-text-secondary dark:text-gray-400">Custo Estimado</p>
              <p className="font-bold text-secondary">
                {formatarMoeda(
                  periodo === 'hoje' ? dashboard?.hoje.custo_estimado || 0 :
                  periodo === 'semana' ? dashboard?.semana.custo_estimado || 0 :
                  dashboard?.mes.custo_estimado || 0
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabela */}
      <div className="card">
        <h3 className="border-b border-border-light dark:border-border-dark p-4 text-lg font-semibold text-secondary dark:text-white">
          Histórico de Consumo
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border-light dark:divide-border-dark">
            <thead className="bg-secondary/5 dark:bg-gray-800/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-secondary/80 dark:text-gray-400">Data</th>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-secondary/80 dark:text-gray-400">Consumo (kWh)</th>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-secondary/80 dark:text-gray-400">Custo Estimado</th>
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