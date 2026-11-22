import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area,
} from 'recharts';
import { Activity, Heart, Scale, Droplet } from 'lucide-react';

export const VitalsChart = ({ measurements = [] }) => {
  const [metric, setMetric] = useState('bp'); // 'bp' | 'hr' | 'weight' | 'glucose'

  const formattedData = measurements.map((m) => ({
    date: new Date(m.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    timestamp: m.date,
    systolicBP: m.systolicBP,
    diastolicBP: m.diastolicBP,
    heartRate: m.heartRate,
    weight: m.weight,
    bloodGlucose: m.bloodGlucose,
    source: m.source,
    recordedBy: m.recordedBy,
  }));

  const metricsConfig = {
    bp: {
      label: 'Blood Pressure',
      icon: Activity,
      color: '#3B82F6',
      unit: 'mmHg',
      render: () => (
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={formattedData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} />
            <YAxis stroke="#94a3b8" fontSize={12} domain={[60, 160]} tickLine={false} />
            <Tooltip
              contentStyle={{ backgroundColor: '#0B1728', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
              itemStyle={{ color: '#fff' }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="systolicBP"
              name="Systolic (mmHg)"
              stroke="#3B82F6"
              strokeWidth={2.5}
              dot={{ r: 4, fill: '#3B82F6' }}
            />
            <Line
              type="monotone"
              dataKey="diastolicBP"
              name="Diastolic (mmHg)"
              stroke="#14B8A6"
              strokeWidth={2.5}
              dot={{ r: 4, fill: '#14B8A6' }}
            />
          </LineChart>
        </ResponsiveContainer>
      ),
    },
    hr: {
      label: 'Heart Rate',
      icon: Heart,
      color: '#EF4444',
      unit: 'bpm',
      render: () => (
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={formattedData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="hrGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} />
            <YAxis stroke="#94a3b8" fontSize={12} domain={[50, 110]} tickLine={false} />
            <Tooltip
              contentStyle={{ backgroundColor: '#0B1728', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
            />
            <Area
              type="monotone"
              dataKey="heartRate"
              name="Heart Rate (bpm)"
              stroke="#EF4444"
              strokeWidth={2.5}
              fill="url(#hrGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      ),
    },
    weight: {
      label: 'Body Weight',
      icon: Scale,
      color: '#8B5CF6',
      unit: 'kg',
      render: () => (
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={formattedData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} />
            <YAxis stroke="#94a3b8" fontSize={12} domain={['dataMin - 2', 'dataMax + 2']} tickLine={false} />
            <Tooltip
              contentStyle={{ backgroundColor: '#0B1728', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
            />
            <Line
              type="monotone"
              dataKey="weight"
              name="Weight (kg)"
              stroke="#8B5CF6"
              strokeWidth={2.5}
              dot={{ r: 4, fill: '#8B5CF6' }}
            />
          </LineChart>
        </ResponsiveContainer>
      ),
    },
    glucose: {
      label: 'Blood Glucose',
      icon: Droplet,
      color: '#F59E0B',
      unit: 'mg/dL',
      render: () => (
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={formattedData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} />
            <YAxis stroke="#94a3b8" fontSize={12} domain={[60, 160]} tickLine={false} />
            <Tooltip
              contentStyle={{ backgroundColor: '#0B1728', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
            />
            <Line
              type="monotone"
              dataKey="bloodGlucose"
              name="Glucose (mg/dL)"
              stroke="#F59E0B"
              strokeWidth={2.5}
              dot={{ r: 4, fill: '#F59E0B' }}
            />
          </LineChart>
        </ResponsiveContainer>
      ),
    },
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-card">
      {/* Header & Metric Selector Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-base font-bold text-slate-900">Health Vitals Trends</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Historical measurements recorded by healthcare providers and personal devices.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-xl border border-slate-100">
          {Object.entries(metricsConfig).map(([key, config]) => {
            const Icon = config.icon;
            const isSelected = metric === key;
            return (
              <button
                key={key}
                onClick={() => setMetric(key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  isSelected
                    ? 'bg-medivault-800 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{config.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Chart Render */}
      {formattedData.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-xs text-slate-400">
          No vitals readings recorded yet for this timeframe.
        </div>
      ) : (
        <div>
          {metricsConfig[metric].render()}
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>Source breakdown: Verified Clinical Exams vs Home Devices</span>
            <span>Educational tracking only. Not a standalone diagnostic determination.</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default VitalsChart;
