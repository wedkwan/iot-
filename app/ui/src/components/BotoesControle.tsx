import React, { useEffect, useState } from "react";
import { listarComandosSala, TrasmitirComando } from "../services/services_controll";
type Comando = {   id: string;   nome: string; };
// Agora recebe a sala como prop
interface BotoesControleProps {
  sala: string;
}

const BotoesControle: React.FC<BotoesControleProps> = ({ sala }) => {
  const [lista, setLista] = useState<Comando[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [transmitindo, setTransmitindo] = useState<string | null>(null);
  const [ultimoComando, setUltimoComando] = useState<string | null>(null);

  useEffect(() => {
    carregarComandos();
  }, [sala]); // Recarrega quando a sala muda

  const carregarComandos = async () => {
    if (!sala) return;
    
    setCarregando(true);
    try {
      const response = await listarComandosSala(sala);
      setLista(response.data.comandos || []);
    } catch (error) {
      console.error(`Erro ao carregar comandos para ${sala}:`, error);
      setLista([]);
    } finally {
      setCarregando(false);
    }
  };

  const handleClique = async (indice: string, nome: string) => {
    setTransmitindo(indice);
    setUltimoComando(nome);
    
    try {
      await TrasmitirComando({ indice });
      
      // Feedback visual temporário
      setTimeout(() => {
        setTransmitindo(null);
      }, 1000);
      
    } catch (error) {
      console.error("Erro ao transmitir comando:", error);
      setTransmitindo(null);
    }
  };

  if (carregando) {
    return (
      <div className="p-8 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="mt-2 text-text-secondary dark:text-gray-400">
          Carregando comandos para {sala}...
        </p>
      </div>
    );
  }

  if (lista.length === 0) {
    return (
      <div className="p-8 text-center card">
        <span className="material-symbols-outlined text-4xl text-text-secondary dark:text-gray-400 mb-2">
          warning
        </span>
        <p className="text-text-secondary dark:text-gray-400">
          Nenhum comando disponível para {sala}
        </p>
        <button 
          onClick={carregarComandos}
          className="mt-4 px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-[#267a29] transition-colors"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-secondary dark:text-white">
            Controles do Ar Condicionado
          </h2>
          <p className="text-sm text-text-secondary dark:text-gray-400 mt-1">
            Sala: <span className="font-semibold text-primary">{sala}</span>
          </p>
        </div>
        
        {ultimoComando && (
          <div className="flex items-center gap-2 text-sm text-text-secondary dark:text-gray-400">
            <span className="material-symbols-outlined text-sm">schedule</span>
            Último: {ultimoComando}
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {lista.map((cmd) => (
          <button
            key={cmd.id}
            onClick={() => handleClique(cmd.id, cmd.nome)}
            disabled={transmitindo === cmd.id}
            className={`
              relative
              px-4 py-3 
              font-semibold 
              rounded-lg 
              transition-all 
              duration-200
              active:scale-95
              flex items-center justify-center
              min-h-[60px]
              ${
                transmitindo === cmd.indice
                  ? 'bg-primary/80 text-white cursor-wait'
                  : 'bg-primary text-white hover:bg-[#267a29] hover:shadow-md'
              }
            `}
            title={`Enviar comando: ${cmd.nome}`}
          >
            {transmitindo === cmd.indice ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Enviando...
              </>
            ) : (
              cmd.nome
            )}
          </button>
        ))}
      </div>
      
      <div className="mt-6 pt-6 border-t border-border-light dark:border-border-dark flex items-center justify-between">
        <p className="text-sm text-text-secondary dark:text-gray-400">
          {lista.length} comandos disponíveis para {sala}
        </p>
        <button 
          onClick={carregarComandos}
          className="text-sm text-primary hover:text-[#267a29] flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-base">refresh</span>
          Atualizar
        </button>
      </div>
    </div>
  );
};

export default BotoesControle;