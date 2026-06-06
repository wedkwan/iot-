import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ConsumoData {
  data: string;
  consumo_kwh: number;
}

interface GraficoLinhaEnergiaProps {
  data: ConsumoData[];
}

const GraficoLinhaEnergia: React.FC<GraficoLinhaEnergiaProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-text-secondary dark:text-gray-400">
        Nenhum dado disponível
      </div>
    );
  }

  const dadosFormatados = data.map(item => ({
    time: format(parseISO(item.data), 'dd/MM', { locale: ptBR }),
    value: Number(item.consumo_kwh.toFixed(3))
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-border-light dark:border-border-dark">
          <p className="text-sm text-text-secondary dark:text-gray-400">{label}</p>
          <p className="text-lg font-bold text-primary">{payload[0].value} kWh</p>
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
          label={{ value: 'kWh', angle: -90, position: 'insideLeft' }}
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

export default GraficoLinhaEnergia;