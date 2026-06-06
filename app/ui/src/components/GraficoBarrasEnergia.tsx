import React from 'react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
interface ConsumoSemana {
  data: string;
  consumo_kwh: number;
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
    <div
      className="w-full flex items-end justify-between gap-1 px-2"
      style={{ height: '150px' }}
    >
      {data.map((dia, index) => {
        const altura = Math.max((dia.consumo_kwh / maxConsumo) * 100, 2);
        const hojeFlag = isHoje(dia.data);
        return (
          <div
            key={index}
            className="flex flex-col items-center flex-1"
            style={{ height: '100%' }}
          >
            {/* área da barra */}
            <div className="w-full flex items-end" style={{ height: '75%' }}>
              <div
                className={`
                  w-full rounded-t-lg transition-all duration-300
                  ${hojeFlag
                    ? 'bg-primary shadow-lg shadow-primary/20'
                    : 'bg-primary/20 dark:bg-primary/20 hover:bg-primary/30'
                  }
                `}
                style={{ height: `${altura}%`, minHeight: '4px' }}
                title={`${dia.consumo_kwh.toFixed(2)} kWh`}
              />
            </div>
            {/* label */}
            <div className="mt-1 text-center" style={{ height: '25%' }}>
              <p className={`text-xs font-medium ${
                hojeFlag ? 'font-bold text-primary' : 'text-text-secondary dark:text-gray-400'
              }`}>
                {formatarDia(dia.data)}
              </p>
              <p className="text-xs text-text-secondary dark:text-gray-400">
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