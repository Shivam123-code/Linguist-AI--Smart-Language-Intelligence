
import React from 'react';
import { DetectionResult } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface DetectionViewProps {
  result: DetectionResult;
}

const COLORS = ['#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe'];

const DetectionView: React.FC<DetectionViewProps> = ({ result }) => {
  const chartData = [
    { name: result.detectedLanguage, value: result.confidence * 100 },
    ...result.alternatives.map(alt => ({ name: alt.language, value: alt.confidence * 100 }))
  ].slice(0, 4);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider">Detected Language</h3>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-bold text-slate-900">{result.detectedLanguage}</span>
            <span className="text-sm font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded uppercase">{result.isoCode}</span>
          </div>
          {result.dialect && (
            <p className="mt-1 text-slate-600">
              <span className="font-semibold text-indigo-500">Dialect:</span> {result.dialect}
            </p>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right">
            <h3 className="text-sm font-medium text-slate-500">Confidence</h3>
            <span className={`text-2xl font-bold ${result.confidence > 0.8 ? 'text-emerald-500' : 'text-amber-500'}`}>
              {(result.confidence * 100).toFixed(1)}%
            </span>
          </div>
          <div className="h-16 w-16">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={18}
                  outerRadius={28}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 italic text-slate-700 text-sm">
        "{result.summary}"
      </div>

      <div>
        <h4 className="text-sm font-semibold text-slate-900 mb-3">Language Candidates</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {chartData.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-lg shadow-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx] }}></div>
                <span className="text-sm font-medium text-slate-700">{item.name}</span>
              </div>
              <span className="text-xs font-bold text-slate-400">{item.value.toFixed(1)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DetectionView;
