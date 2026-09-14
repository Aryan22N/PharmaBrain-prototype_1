import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import { MetricTrend } from '../../types/health';

interface TrendChartProps {
  trend: MetricTrend;
  isMini?: boolean;
  height?: number;
}

export const TrendChart: React.FC<TrendChartProps> = ({ trend, isMini = false, height = 240 }) => {
  const isBp = trend.metric === 'blood_pressure';

  const chartData = trend.data.map((point) => ({
    date: point.date,
    value: point.value,
    secondaryValue: point.secondaryValue,
    source: point.source,
  }));

  if (isMini) {
    return (
      <div className="w-full h-20">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 8, left: 8, bottom: 5 }}>
            <Line
              type="monotone"
              dataKey="value"
              stroke="#0d9488"
              strokeWidth={2}
              dot={{ r: 2, fill: '#0d9488' }}
            />
            {isBp && (
              <Line
                type="monotone"
                dataKey="secondaryValue"
                stroke="#6366f1"
                strokeWidth={2}
                strokeDasharray="3 3"
                dot={{ r: 2, fill: '#6366f1' }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 12, right: 20, left: -10, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis
            dataKey="date"
            stroke="#64748b"
            fontSize={12}
            tickLine={false}
            tickMargin={8}
          />
          <YAxis
            stroke="#64748b"
            fontSize={12}
            domain={['dataMin - 10', 'dataMax + 10']}
            tickLine={false}
            tickMargin={8}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-slate-900 text-white p-2.5 rounded-md text-xs shadow-lg space-y-1">
                    <p className="font-semibold text-slate-300">Period: {label}</p>
                    <p className="text-teal-300 font-bold">
                      {trend.title}: {payload[0].value} {trend.unit}
                    </p>
                    {isBp && payload[1] && (
                      <p className="text-indigo-300 font-bold">
                        Diastolic: {payload[1].value} {trend.unit}
                      </p>
                    )}
                    <p className="text-[10px] text-slate-400">
                      Source: {payload[0].payload.source}
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Line
            type="monotone"
            name={isBp ? 'Systolic' : trend.title}
            dataKey="value"
            stroke="#0f766e"
            strokeWidth={2.5}
            activeDot={{ r: 5 }}
            dot={{ r: 3.5, fill: '#0f766e' }}
          />
          {isBp && (
            <Line
              type="monotone"
              name="Diastolic"
              dataKey="secondaryValue"
              stroke="#6366f1"
              strokeWidth={2.5}
              strokeDasharray="4 4"
              activeDot={{ r: 5 }}
              dot={{ r: 3.5, fill: '#6366f1' }}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
