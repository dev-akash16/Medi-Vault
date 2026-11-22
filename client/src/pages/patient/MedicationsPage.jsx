import React, { useState, useEffect } from 'react';
import Badge from '../../components/common/Badge';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import api from '../../services/api';
import { Pill, Clock, Calendar, CheckCircle2 } from 'lucide-react';

export const MedicationsPage = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('Active');

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const res = await api.get('/patients/me/prescriptions');
        if (res.data.success) {
          setPrescriptions(res.data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPrescriptions();
  }, []);

  // Flatten all medicines across prescriptions
  const allMeds = [];
  prescriptions.forEach((rx) => {
    rx.medicines?.forEach((m) => {
      allMeds.push({
        ...m,
        prescriptionId: rx.prescriptionId,
        diagnosisName: rx.diagnosisName,
        doctorName: rx.doctor?.user?.name || 'Physician',
        clinicName: rx.doctor?.clinicName || 'MediVault Clinic',
      });
    });
  });

  const statuses = ['All', 'Active', 'Completed', 'Discontinued'];

  const filteredMeds = allMeds.filter((m) => {
    if (filter === 'All') return true;
    return m.status?.toLowerCase() === filter.toLowerCase();
  });

  if (loading) return <LoadingSkeleton count={3} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-card">
        <span className="text-xs uppercase font-bold tracking-wider text-medivault-700">Pharmacotherapy Register</span>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">Medication Management</h1>
        <p className="text-xs text-slate-500 mt-1 max-w-xl">
          Complete itemized inventory of all active and historical medications, dosage instructions, and schedules.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 bg-white p-3 rounded-2xl border border-slate-100">
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
              filter === s
                ? 'bg-medivault-800 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {filteredMeds.length === 0 ? (
        <EmptyState
          icon={Pill}
          title="No medications found"
          description="Medications prescribed to you will appear here."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredMeds.map((med, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-card space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <Pill className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900">{med.name}</h4>
                    {med.brandName && (
                      <span className="text-xs text-slate-400">Brand: {med.brandName}</span>
                    )}
                  </div>
                </div>
                <Badge variant={med.status}>{med.status}</Badge>
              </div>

              <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 rounded-xl text-xs text-slate-700">
                <div>
                  <span className="text-slate-400 block text-[10px]">Dosage / Strength</span>
                  <strong className="text-slate-900">{med.dosage || med.strength}</strong> ({med.dosageForm})
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Frequency & Route</span>
                  <strong className="text-slate-900">{med.frequency}</strong> ({med.route})
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Course Duration</span>
                  <strong className="text-slate-900">{med.duration}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Timing</span>
                  <strong className="text-slate-900">{med.timing}</strong>
                </div>
              </div>

              {med.instructions && (
                <div className="text-xs text-slate-600">
                  <strong>Instructions: </strong>{med.instructions}
                </div>
              )}

              <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Prescribed by: Dr. {med.doctorName}</span>
                <span className="font-mono text-cyan-600 font-semibold">{med.prescriptionId}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MedicationsPage;
