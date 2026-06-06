import React from 'react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ConsumoData {
  data: string;
  consumo_kwh: number;
}

interface GraficoConsumoProps {
  data: ConsumoData[];
}

const GraficoConsumo: React.FC<GraficoConsumoProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-56 flex items-center justify-center text-text-secondary dark:text-gray-400">
        Nenhum dado disponível
      </div>
    );
  }

  const maxConsumo = Math.max(...data.map(d => d.consumo_kwh));
  const maxAltura = 120;

  return (
    <div className="h-56 flex items-end gap-4 sm:gap-6">
      {data.map((dia, index) => {
        const altura = (dia.consumo_kwh / maxConsumo) * maxAltura;
        const isPico = dia.consumo_kwh === maxConsumo;

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
                title={`${dia.consumo_kwh.toFixed(2)} kWh`}
              />
            </div>
            <p className={`text-sm ${
              isPico ? 'font-bold text-primary' : 'text-text-secondary dark:text-gray-400'
            }`}>
              {format(parseISO(dia.data), 'EEE', { locale: ptBR })}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default GraficoConsumo;