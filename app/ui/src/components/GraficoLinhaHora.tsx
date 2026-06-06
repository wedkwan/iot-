import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface ConsumoHora {
  hora: number;
  corrente_media: number;
  potencia_media: number;
  consumo_kwh: number;
}

interface GraficoLinhaHoraProps {
  data: ConsumoHora[];
}

const GraficoLinhaHora: React.FC<GraficoLinhaHoraProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-text-secondary dark:text-gray-400">
        Sem leituras hoje ainda
      </div>
    );
  }

  const dadosFormatados = data.map(item => ({
    time: `${String(item.hora).padStart(2, '0')}:00`,
    potencia: Number(item.potencia_media.toFixed(0)),
    corrente: Number(item.corrente_media.toFixed(2)),
    consumo:  Number(item.consumo_kwh.toFixed(4))
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-border-light dark:border-border-dark space-y-1">
          <p className="text-sm font-semibold text-text-secondary dark:text-gray-400">
            {label}
          </p>
          <p className="text-sm text-text-primary dark:text-white">
            Potência: <span className="font-bold text-primary">{payload[0]?.value} W</span>
          </p>
          <p className="text-sm text-text-primary dark:text-white">
            Corrente: <span className="font-bold text-accent">{payload[1]?.value} A</span>
          </p>
          <p className="text-sm text-text-primary dark:text-white">
            Consumo: <span className="font-bold text-secondary">{payload[2]?.value} kWh</span>
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
          label={{ value: 'W', angle: -90, position: 'insideLeft' }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Line
          type="monotone"
          dataKey="potencia"
          stroke="#309633"
          strokeWidth={2}
          dot={{ stroke: '#309633', strokeWidth: 2, r: 3 }}
          activeDot={{ r: 6, fill: '#309633' }}
          name="Potência"
        />
        <Line
          type="monotone"
          dataKey="corrente"
          stroke="#f59e0b"
          strokeWidth={2}
          dot={{ stroke: '#f59e0b', strokeWidth: 2, r: 3 }}
          activeDot={{ r: 6, fill: '#f59e0b' }}
          name="Corrente"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default GraficoLinhaHora;