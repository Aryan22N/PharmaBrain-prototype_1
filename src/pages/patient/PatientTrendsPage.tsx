import React from 'react';
import { useHealthStore } from '../../lib/health-store';
import { TrendChart } from '../../components/charts/TrendChart';
import {
  TrendingUp,
  AlertCircle,
  Database,
  Calendar,
  Layers,
  Info,
  CheckCircle2,
} from 'lucide-react';

export const PatientTrendsPage: React.FC = () => {
  const { trends } = useHealthStore();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold text-slate-900">Longitudinal Vitals & Lab Trends</h1>
          <span className="text-xs bg-teal-50 text-teal-800 border border-teal-200 px-2 py-0.5 rounded font-semibold">
            Recharts Visualizations
          </span>
        </div>
        <p className="text-xs text-slate-500">
          Multi-year trajectory analysis for glycemic indicators, cardiovascular pressures, and somatic measurements.
        </p>
      </div>

      {/* Required Cautious Trend Disclaimer from prompt */}
      <div
        id="trends-cautious-disclaimer"
        className="p-4 bg-amber-50 rounded-xl border border-amber-300 shadow-xs flex items-start gap-3.5"
      >
        <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs text-amber-950">
          <span className="font-bold text-sm">Medical Trend Interpretation Notice</span>
          <p className="leading-relaxed">
            Trends are calculated using the available discrete data points in this record. They should be interpreted
            by a healthcare professional in the context of the patient's full clinical picture.
          </p>
        </div>
      </div>

      {/* Grid of 4 Recharts Visualizations & Insight Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {trends.map((trend) => (
          <div
            key={trend.id}
            className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              {/* Card Header */}
              <div className="flex items-start justify-between gap-2 pb-2 border-b border-slate-100">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{trend.title}</h3>
                  <span className="text-[11px] text-slate-500">
                    Clinical Target / Normal Range: <strong className="text-slate-800">{trend.targetRange}</strong>
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-base font-bold text-teal-900">
                    {trend.data[trend.data.length - 1].value} {trend.unit}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Latest: {trend.data[trend.data.length - 1].date}
                  </div>
                </div>
              </div>

              {/* Main Recharts Graph */}
              <div className="pt-2">
                <TrendChart trend={trend} />
              </div>
            </div>

            {/* Insight Card Section Required by prompt */}
            <div className="pt-3 border-t border-slate-100 space-y-2.5">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-2">
                <div className="flex items-center justify-between text-slate-700 font-medium">
                  <span className="flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5 text-slate-400" />
                    Records Used: <strong className="text-slate-900">{trend.recordsUsed} points</strong>
                  </span>
                  <span className="flex items-center gap-1.5 text-slate-500 font-mono text-[11px]">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    Updated: {trend.lastUpdated}
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-700 text-[11px] pt-1 border-t border-slate-200/60">
                  <span className="flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5 text-teal-700" />
                    Method: <span className="font-semibold text-teal-900">{trend.method}</span>
                  </span>
                  <span className="text-slate-500">ABDM FHIR Observational Mapping</span>
                </div>

                <div className="text-xs text-slate-700 pt-1 leading-relaxed bg-white p-2 rounded border border-slate-200/80">
                  <span className="font-bold text-slate-900">Algorithmic Interpretation: </span>
                  {trend.interpretation}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
