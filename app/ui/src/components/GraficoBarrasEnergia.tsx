import React from 'react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ConsumoSemana {
  data: string;
  consumo_kwh: number;
  corrente_media: number;
}

interface GraficoBarrasEnergiaProps {
  data: ConsumoSemana[];
  periodo: 'hoje' | 'semana' | 'mes';
}

const GraficoBarrasEnergia: React.FC<GraficoBarrasEnergiaProps> = ({ data, periodo }) => {
  if (data.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-text-secondary">
        Nenhum dado disponível
      </div>
    );
  }

  const maxConsumo = Math.max(...data.map(d => d.consumo_kwh));
  const hoje = new Date();
  
  const formatarDia = (dataStr: string) => {
    const data = parseISO(dataStr);
    return format(data, 'EEE', { locale: ptBR });
  };

  const isHoje = (dataStr: string) => {
    const data = parseISO(dataStr);
    return format(data, 'yyyy-MM-dd') === format(hoje, 'yyyy-MM-dd');
  };

  return (
    <div className="h-full flex items-end justify-between gap-2 px-2">
      {data.map((dia, index) => {
        const altura = (dia.consumo_kwh / maxConsumo) * 100;
        const hojeFlag = isHoje(dia.data);
        
        return (
          <div key={index} className="flex flex-col items-center flex-1 h-full">
            <div className="w-full flex flex-col items-center justify-end h-full">
              <div className="w-full flex items-end">
                <div 
                  className={`
                    w-full rounded-t-lg transition-all duration-300
                    ${hojeFlag 
                      ? 'bg-primary shadow-lg shadow-primary/20' 
                      : 'bg-primary/20 dark:bg-primary/20 hover:bg-primary/30'
                    }
                  `}
                  style={{ height: `${altura}%` }}
                  title={`${dia.consumo_kwh.toFixed(1)} kWh`}
                />
              </div>
            </div>
            <div className="mt-2 text-center">
              <p className={`text-xs font-medium ${
                hojeFlag ? 'font-bold text-primary' : 'text-text-secondary dark:text-gray-400'
              }`}>
                {formatarDia(dia.data)}
              </p>
              <p className="text-xs text-text-secondary dark:text-gray-400 mt-1">
                {format(parseISO(dia.data), 'dd/MM', { locale: ptBR })}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default GraficoBarrasEnergia;