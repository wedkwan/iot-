import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface PontoDado {
  time: Date;
  value: number;
}

interface GraficoTemperaturaProps {
  data: PontoDado[];
  periodo: '24h' | '7d' | '30d';
}

const GraficoTemperatura: React.FC<GraficoTemperaturaProps> = ({ data, periodo }) => {
  const formatarData = (date: Date) => {
    if (periodo === '24h') {
      return format(date, 'HH:mm', { locale: ptBR });
    } else if (periodo === '7d') {
      return format(date, 'dd/MM', { locale: ptBR });
    } else {
      return format(date, 'dd/MM', { locale: ptBR });
    }
  };

  const dadosFormatados = data.map(item => ({
    time: formatarData(item.time),
    value: item.value,
    dataCompleta: item.time
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-border-light dark:border-border-dark">
          <p className="text-sm text-text-secondary dark:text-gray-400">
            {label}
          </p>
          <p className="text-lg font-bold text-primary">
            {payload[0].value}°C
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={dadosFormatados}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis 
          dataKey="time" 
          stroke="#6b7280"
          fontSize={12}
        />
        <YAxis 
          stroke="#6b7280"
          fontSize={12}
          label={{ value: '°C', angle: -90, position: 'insideLeft' }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Line 
          type="monotone" 
          dataKey="value" 
          stroke="#309633" 
          strokeWidth={2}
          dot={{ stroke: '#309633', strokeWidth: 2, r: 3 }}
          activeDot={{ r: 6, fill: '#309633' }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default GraficoTemperatura;