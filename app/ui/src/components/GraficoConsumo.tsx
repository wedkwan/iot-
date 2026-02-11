import React from 'react';

const GraficoConsumo: React.FC = () => {
  const dados = [50, 40, 70, 60, 90, 30, 80]; // Dados de exemplo
  const dias = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
  const maxAltura = 120;

  return (
    <div className="h-56 flex items-end gap-4 sm:gap-6">
      {dados.map((valor, index) => {
        const altura = (valor / 100) * maxAltura;
        const isPico = valor === Math.max(...dados);
        
        return (
          <div key={index} className="flex flex-col flex-1 items-center gap-2">
            <div className="w-full h-full flex items-end">
              <div 
                className={`w-full rounded-t-lg transition-all duration-300 ${
                  isPico 
                    ? 'bg-primary shadow-lg shadow-primary/20' 
                    : 'bg-primary/20 dark:bg-primary/20 hover:bg-primary/30'
                }`}
                style={{ height: `${altura}px` }}
              />
            </div>
            <p className={`text-sm ${isPico ? 'font-bold text-primary' : 'text-text-secondary dark:text-gray-400'}`}>
              {dias[index]}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default GraficoConsumo;