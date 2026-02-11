import React, { useState, useEffect } from 'react';
import { getTodasSalas } from '../services/services_temps'

interface Sala {
  id: number;
  nome: string;
  total_sensores: number;
}

interface SalaSelectorProps {
  salaSelecionada: string;
  onSalaChange: (sala: string) => void;
}

const SalaSelector: React.FC<SalaSelectorProps> = ({ salaSelecionada, onSalaChange }) => {
  const [salas, setSalas] = useState<Sala[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarSalas();
  }, []);

  const carregarSalas = async () => {
    try {
      const resposta = await getTodasSalas();
      setSalas(resposta.data.salas);
    } catch (erro) {
      console.error('Erro ao carregar salas:', erro);
    } finally {
      setCarregando(false);
    }
  };

  if (carregando) {
    return (
      <div className="p-4 text-center text-text-secondary">
        Carregando salas...
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {salas.map((sala) => (
        <button
          key={sala.id}
          onClick={() => onSalaChange(sala.nome)}
          className={`px-4 py-2 rounded-lg transition-colors ${
            salaSelecionada === sala.nome
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
          }`}
        >
          {sala.nome}
          {sala.total_sensores > 0 && (
            <span className="ml-2 text-xs bg-white/20 px-1.5 py-0.5 rounded">
              {sala.total_sensores}
            </span>
          )}
        </button>
      ))}
    </div>
  );
};

export default SalaSelector;