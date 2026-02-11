import React, { useState, useEffect } from 'react';
import SalaSelector from '../components/Salaseletor';
import { getMetricasSala } from '../services/services_temps';
import GraficoConsumo from '../components/GraficoConsumo';
import BotoesControle from '../components/BotoesControle';
import { TrasmitirComando } from "../services/services_controll";

interface MetricasSala {
  temperatura: number;
  umidade: number;
  corrente: number;
  ultima_atualizacao: string;
}

const Dashboard: React.FC = () => {
  const [salaSelecionada, setSalaSelecionada] = useState<string>('LABF04');
  const [metricas, setMetricas] = useState<MetricasSala | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [temperatura, setTemperatura] = useState(24);
  
  // Estados para controle do ar condicionado
  const [ligado, setLigado] = useState(true);
  const [modo, setModo] = useState<'cool' | 'heat' | 'fan'>('cool');
  const [oscilacao, setOscilacao] = useState(false);
  const [timer, setTimer] = useState(false);
  const [modoSono, setModoSono] = useState(false);
  const [velocidadeVentilador, setVelocidadeVentilador] = useState(2);

  useEffect(() => {
    carregarMetricasSala();
    const intervalo = setInterval(carregarMetricasSala, 30000);
    return () => clearInterval(intervalo);
  }, [salaSelecionada]);

  const carregarMetricasSala = async () => {
    try {
      const resposta = await getMetricasSala(salaSelecionada);
      setMetricas(resposta.data);
      if (resposta.data.temperatura) {
        setTemperatura(Math.round(resposta.data.temperatura));
      }
    } catch (erro) {
      console.error('Erro ao carregar métricas:', erro);
    } finally {
      setCarregando(false);
    }
  };

  // Funções de controle do ar condicionado
  const enviarComando = async (comando: string) => {
    try {
      const mapaComandos: Record<string, string> = {
        'ligar': '0',
        'desligar': '1',
        'temp+': '2',
        'temp-': '3',
        'fan': '4',
        'oscilacao': '5',
        'timer': '6',
        'sono': '7',
      };

      const indice = mapaComandos[comando];
      if (indice) {
        await TrasmitirComando({ indice });
        console.log(`✅ Comando ${comando} enviado para ${salaSelecionada}`);
      }
    } catch (erro) {
      console.error('❌ Erro ao enviar comando:', erro);
    }
  };

  const ligarDesligar = async () => {
    const novoEstado = !ligado;
    setLigado(novoEstado);
    await enviarComando(novoEstado ? 'ligar' : 'desligar');
  };

  const aumentarTemperatura = async () => {
    const novoValor = Math.min(temperatura + 1, 30);
    setTemperatura(novoValor);
    await enviarComando('temp+');
  };

  const diminuirTemperatura = async () => {
    const novoValor = Math.max(temperatura - 1, 16);
    setTemperatura(novoValor);
    await enviarComando('temp-');
  };

  const trocarModo = async () => {
    const modos = ['cool', 'heat', 'fan'] as const;
    const index = modos.indexOf(modo);
    const novoModo = modos[(index + 1) % modos.length];
    setModo(novoModo);
    // Se tiver comando específico para modo, descomente abaixo
    // await enviarComando('modo');
  };

  const toggleOscilacao = async () => {
    const novoEstado = !oscilacao;
    setOscilacao(novoEstado);
    await enviarComando('oscilacao');
  };

  const toggleTimer = async () => {
    const novoEstado = !timer;
    setTimer(novoEstado);
    await enviarComando('timer');
  };

  const toggleModoSono = async () => {
    const novoEstado = !modoSono;
    setModoSono(novoEstado);
    await enviarComando('sono');
  };

  const aumentarVentilador = async () => {
    const novoValor = velocidadeVentilador >= 4 ? 1 : velocidadeVentilador + 1;
    setVelocidadeVentilador(novoValor);
    await enviarComando('fan');
  };

  const diminuirVentilador = async () => {
    const novoValor = velocidadeVentilador <= 1 ? 4 : velocidadeVentilador - 1;
    setVelocidadeVentilador(novoValor);
    await enviarComando('fan');
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-secondary dark:text-white mb-2">
          Painel de Controle
        </h1>
        <p className="text-text-secondary dark:text-gray-400">
          Monitoramento e controle do ar condicionado em tempo real
        </p>
      </div>

      <SalaSelector 
        salaSelecionada={salaSelecionada} 
        onSalaChange={setSalaSelecionada} 
      />

      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        {/* Card de Controle do Ar Condicionado - AGORA FUNCIONAL */}
        <div className="card p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-text-primary dark:text-white">
              Ar Condicionado - {salaSelecionada}
            </h2>
            <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
              ligado 
                ? 'bg-primary/10 text-primary' 
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
            }`}>
              {ligado ? 'Ligado' : 'Desligado'}
            </span>
          </div>

          {/* Temperatura Central */}
          <div className="flex flex-col items-center justify-center mb-8">
            <div className="flex items-center justify-center w-64 h-64 rounded-full border-[16px] border-gray-100 dark:border-gray-800 relative mb-6">
              <div className="text-center">
                <p className="text-7xl font-bold text-primary">{temperatura}°</p>
                <p className="text-lg text-text-secondary dark:text-gray-400 mt-1">
                  {modo === 'cool' ? '❄️ Resfriando' : modo === 'heat' ? '☀️ Aquecendo' : '🌀 Ventilando'}
                </p>
              </div>
            </div>

            {/* Controles de Temperatura */}
            <div className="flex items-center justify-center gap-6 mb-8">
              <button 
                onClick={diminuirTemperatura}
                disabled={!ligado}
                className="flex items-center justify-center w-14 h-14 rounded-full bg-white dark:bg-gray-700 border border-border-light dark:border-border-dark hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined text-3xl text-text-secondary dark:text-gray-300">
                  remove
                </span>
              </button>
              <span className="text-2xl font-semibold text-text-primary dark:text-white">Temperatura</span>
              <button 
                onClick={aumentarTemperatura}
                disabled={!ligado}
                className="flex items-center justify-center w-14 h-14 rounded-full bg-white dark:bg-gray-700 border border-border-light dark:border-border-dark hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined text-3xl text-text-secondary dark:text-gray-300">
                  add
                </span>
              </button>
            </div>
          </div>

          {/* Botões de Controle Principais */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button 
              onClick={ligarDesligar}
              className={`flex items-center justify-center gap-3 py-4 px-6 rounded-full font-semibold text-lg transition-colors ${
                ligado 
                  ? 'bg-red-500 hover:bg-red-600 text-white' 
                  : 'bg-primary hover:bg-[#267a29] text-white'
              }`}
            >
              <span className="material-symbols-outlined">
                {ligado ? 'power_off' : 'power_settings_new'}
              </span>
              <span>{ligado ? 'Desligar' : 'Ligar'}</span>
            </button>
            
            <button 
              onClick={trocarModo}
              disabled={!ligado}
              className="flex items-center justify-center gap-3 py-4 px-6 rounded-full card text-text-secondary dark:text-gray-300 font-semibold text-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              <span className="material-symbols-outlined">mode_fan</span>
              <span>
                {modo === 'cool' ? '❄️ Resfriar' : modo === 'heat' ? '☀️ Aquecer' : '🌀 Ventilar'}
              </span>
            </button>
          </div>

          {/* Botões Secundários */}
          <div className="grid grid-cols-3 gap-4">
            <button 
              onClick={aumentarVentilador}
              disabled={!ligado}
              className={`flex flex-col items-center justify-center p-4 rounded-lg transition-colors h-24 ${
                velocidadeVentilador > 1 
                  ? 'bg-primary text-white' 
                  : 'card text-text-secondary dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
              } disabled:opacity-50`}
            >
              <span className="material-symbols-outlined text-3xl">
                {velocidadeVentilador === 1 ? 'toys_fan' : 'fan'}
              </span>
              <span className="text-base font-medium mt-1">Ventilador</span>
              <span className="text-xs mt-1">{velocidadeVentilador}</span>
            </button>
            
            <button 
              onClick={toggleOscilacao}
              disabled={!ligado}
              className={`flex flex-col items-center justify-center p-4 rounded-lg transition-colors h-24 ${
                oscilacao 
                  ? 'bg-primary text-white' 
                  : 'card text-text-secondary dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
              } disabled:opacity-50`}
            >
              <span className="material-symbols-outlined text-3xl">airwave</span>
              <span className="text-base font-medium mt-1">Oscilação</span>
              <span className="text-xs mt-1">{oscilacao ? 'Ativo' : 'Inativo'}</span>
            </button>
            
            <button 
              onClick={toggleTimer}
              disabled={!ligado}
              className={`flex flex-col items-center justify-center p-4 rounded-lg transition-colors h-24 ${
                timer 
                  ? 'bg-primary text-white' 
                  : 'card text-text-secondary dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
              } disabled:opacity-50`}
            >
              <span className="material-symbols-outlined text-3xl">timer</span>
              <span className="text-base font-medium mt-1">Timer</span>
              <span className="text-xs mt-1">{timer ? 'Ativo' : 'Inativo'}</span>
            </button>
            
            <button 
              onClick={toggleModoSono}
              disabled={!ligado}
              className={`flex flex-col items-center justify-center p-4 rounded-lg transition-colors h-24 ${
                modoSono 
                  ? 'bg-primary text-white' 
                  : 'card text-text-secondary dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
              } disabled:opacity-50`}
            >
              <span className="material-symbols-outlined text-3xl">bedtime</span>
              <span className="text-base font-medium mt-1">Modo Sono</span>
              <span className="text-xs mt-1">{modoSono ? 'Ativo' : 'Inativo'}</span>
            </button>
          </div>
        </div>

        {/* Card de Métricas */}
        <div className="space-y-8">
          <div className="card p-8">
            <h3 className="text-2xl font-bold text-text-primary dark:text-white mb-6">
              Métricas da Sala
            </h3>
            
            {carregando ? (
              <div className="text-center py-8 text-text-secondary">Carregando métricas...</div>
            ) : metricas ? (
              <div className="grid grid-cols-2 gap-6">
                <div className="metric-card">
                  <p className="metric-label">Temperatura</p>
                  <p className="metric-value">{metricas.temperatura || '--'}°C</p>
                </div>
                <div className="metric-card">
                  <p className="metric-label">Umidade</p>
                  <p className="metric-value">{metricas.umidade || '--'}%</p>
                </div>
                <div className="metric-card">
                  <p className="metric-label">Corrente</p>
                  <p className="metric-value">{metricas.corrente || '--'}A</p>
                </div>
                <div className="metric-card">
                  <p className="metric-label">Última Atualização</p>
                  <p className="metric-value text-lg">
                    {metricas.ultima_atualizacao 
                      ? new Date(metricas.ultima_atualizacao).toLocaleTimeString('pt-BR')
                      : '--'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-red-500">
                Erro ao carregar métricas
              </div>
            )}
          </div>

          {/* Card de Consumo */}
          <div className="card p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-text-secondary dark:text-gray-400">Consumo Diário</p>
                <p className="text-4xl font-bold text-text-primary dark:text-white mt-1">12.5 kWh</p>
              </div>
              <div className="text-sm text-text-secondary dark:text-gray-400">Últimos 7 Dias</div>
            </div>
            <GraficoConsumo />
          </div>
        </div>
      </div>

      {/* Botões de Controle Dinâmicos */}
      <div className="card p-6">
        <h3 className="text-2xl font-bold text-secondary mb-6">Controles Avançados</h3>
        <BotoesControle sala={salaSelecionada} />
      </div>
    </div>
  );
};

export default Dashboard;