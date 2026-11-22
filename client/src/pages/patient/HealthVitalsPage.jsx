import React, { useState, useEffect } from 'react';
import VitalsChart from '../../components/medical/VitalsChart';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import AddVitalsModal from '../../components/forms/AddVitalsModal';
import api from '../../services/api';
import { Activity, Plus, Calendar, Scale, Heart } from 'lucide-react';

export const HealthVitalsPage = () => {
  const [measurements, setMeasurements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const fetchVitals = async () => {
    try {
      const res = await api.get('/vitals?days=365');
      if (res.data.success) {
        setMeasurements(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVitals();
  }, []);

  if (loading) return <LoadingSkeleton count={3} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-card flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-medivault-700">Biometric Tracking</span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">Health Vitals & Measurements</h1>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            Track blood pressure, heart rate, weight, BMI, and glucose over time. Clearly distinguishing clinical doctor exams from home device entries.
          </p>
        </div>

        <Button variant="primary" size="md" icon={Plus} onClick={() => setShowModal(true)}>
          Record Measurement
        </Button>
      </div>

      {/* Recharts Analytics Component */}
      <VitalsChart measurements={measurements} />

      {/* Historical Measurements Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-card p-6">
        <h3 className="text-base font-bold text-slate-900 mb-4">Measurement Log History</h3>

        {measurements.length === 0 ? (
          <EmptyState
            icon={Activity}
            title="No measurements recorded"
            description="Start recording regular blood pressure and health readings."
            actionText="Record Vitals"
            onAction={() => setShowModal(true)}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50/50">
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Blood Pressure</th>
                  <th className="py-2.5 px-3">Heart Rate</th>
                  <th className="py-2.5 px-3">Temp</th>
                  <th className="py-2.5 px-3">Weight & BMI</th>
                  <th className="py-2.5 px-3">Source & Attending</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[...measurements].reverse().map((m) => (
                  <tr key={m._id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3 px-3 font-semibold text-slate-900 whitespace-nowrap">
                      {new Date(m.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="py-3 px-3">
                      {m.systolicBP ? (
                        <strong className="text-slate-900">
                          {m.systolicBP}/{m.diastolicBP || 80}{' '}
                          <span className="font-normal text-slate-400">mmHg</span>
                        </strong>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="py-3 px-3">
                      {m.heartRate ? `${m.heartRate} bpm` : '—'}
                    </td>
                    <td className="py-3 px-3">
                      {m.temperature ? `${m.temperature}°F` : '—'}
                    </td>
                    <td className="py-3 px-3">
                      {m.weight ? `${m.weight} kg` : '—'}{' '}
                      {m.bmi && <span className="text-slate-400 font-mono text-[11px]">(BMI {m.bmi})</span>}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700">
                        {m.source}
                      </span>
                      {m.doctorName && (
                        <span className="text-[10px] text-slate-500 block mt-0.5">{m.doctorName}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <AddVitalsModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSuccess={fetchVitals}
        />
      )}
    </div>
  );
};

export default HealthVitalsPage;
