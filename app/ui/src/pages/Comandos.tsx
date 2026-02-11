import React, { useState } from 'react';
import SalaSelector from '../components/Salaseletor';
import BotoesControle from '../components/BotoesControle';
import { ApagarListaComandos } from '../services/services_controll';

const Comandos: React.FC = () => {
  const [salaSelecionada, setSalaSelecionada] = useState<string>('LABF04');
  const [mostrandoConfirmacao, setMostrandoConfirmacao] = useState(false);

  const handleApagarComandos = async () => {
    try {
      await ApagarListaComandos();
      alert('Lista de comandos apagada com sucesso!');
      setMostrandoConfirmacao(false);
      // Recarregar a página para atualizar os comandos
      window.location.reload();
    } catch (erro) {
      console.error('Erro ao apagar comandos:', erro);
      alert('Erro ao apagar comandos');
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-secondary dark:text-white mb-2">
          Controles do Ar Condicionado
        </h1>
        <p className="text-text-secondary dark:text-gray-400">
          Controle manual dos aparelhos de ar condicionado
        </p>
      </div>

      <SalaSelector 
        salaSelecionada={salaSelecionada} 
        onSalaChange={setSalaSelecionada} 
      />

      <div className="mb-6 p-6 card bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
        <div className="flex items-start gap-3">
          <span className="material-symbols-outlined text-yellow-600 dark:text-yellow-400 text-2xl">
            warning
          </span>
          <div>
            <h3 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-1">
              Atenção
            </h3>
            <p className="text-yellow-700 dark:text-yellow-400 text-sm">
              Os comandos enviados aqui controlam diretamente os aparelhos de ar condicionado. 
              Use com cuidado e apenas quando necessário.
            </p>
          </div>
        </div>
      </div>

      {/* Botões de Controle Dinâmicos */}
      <div className="mb-8">
       {/* Passa a sala como prop */}
       <BotoesControle sala={salaSelecionada} />
      </div>

      {/* Ações Administrativas */}
      <div className="card p-6">
        <h3 className="text-xl font-bold text-secondary dark:text-white mb-4">
          Ações Administrativas
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <div>
              <h4 className="font-semibold text-red-800 dark:text-red-300">
                Limpar Lista de Comandos
              </h4>
              <p className="text-sm text-red-700 dark:text-red-400 mt-1">
                Remove todos os comandos personalizados do sistema
              </p>
            </div>
            
            {mostrandoConfirmacao ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleApagarComandos}
                  className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
                >
                  Confirmar
                </button>
                <button
                  onClick={() => setMostrandoConfirmacao(false)}
                  className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            ) : (
              <button
                onClick={() => setMostrandoConfirmacao(true)}
                className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
              >
                Limpar Comandos
              </button>
            )}
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <div>
              <h4 className="font-semibold text-blue-800 dark:text-blue-300">
                Log de Comandos
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
                Visualize o histórico de comandos enviados
              </p>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
              Ver Log
            </button>
          </div>
        </div>
      </div>

      {/* Informações da Sala */}
      <div className="grid md:grid-cols-3 gap-6 mt-8">
        <div className="card p-6">
          <h4 className="font-semibold text-secondary dark:text-white mb-2">
            Sala Atual
          </h4>
          <p className="text-2xl font-bold text-primary">{salaSelecionada}</p>
          <p className="text-sm text-text-secondary dark:text-gray-400 mt-1">
            Laboratório de Informática
          </p>
        </div>
        
        <div className="card p-6">
          <h4 className="font-semibold text-secondary dark:text-white mb-2">
            Status do Sistema
          </h4>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <p className="font-medium text-green-600 dark:text-green-400">Conectado</p>
          </div>
          <p className="text-sm text-text-secondary dark:text-gray-400 mt-1">
            API e MQTT operacionais
          </p>
        </div>
        
        <div className="card p-6">
          <h4 className="font-semibold text-secondary dark:text-white mb-2">
            Último Comando
          </h4>
          <p className="text-lg font-medium text-text-primary dark:text-white">-</p>
          <p className="text-sm text-text-secondary dark:text-gray-400 mt-1">
            Nenhum comando recente
          </p>
        </div>
      </div>
    </div>
  );
};

export default Comandos;