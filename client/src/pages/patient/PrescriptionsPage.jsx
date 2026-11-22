import React, { useState, useEffect } from 'react';
import PrescriptionCard from '../../components/medical/PrescriptionCard';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import api from '../../services/api';
import { Pill } from 'lucide-react';

export const PrescriptionsPage = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

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

  const statuses = ['All', 'Active', 'Completed', 'Discontinued'];

  const filtered = prescriptions.filter((p) => {
    if (filter === 'All') return true;
    return p.status.toLowerCase() === filter.toLowerCase();
  });

  if (loading) return <LoadingSkeleton count={3} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-card">
        <span className="text-xs uppercase font-bold tracking-wider text-medivault-700">Official Prescriptions</span>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">Prescriptions</h1>
        <p className="text-xs text-slate-500 mt-1 max-w-xl">
          Electronic prescriptions issued by your attending physicians, with exact dosage instructions, refill eligibility, and print capability.
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

      {filtered.length === 0 ? (
        <EmptyState
          icon={Pill}
          title="No prescriptions found"
          description="Prescriptions issued by your doctors during consultations will be stored here permanently."
        />
      ) : (
        <div className="space-y-6">
          {filtered.map((p) => (
            <PrescriptionCard key={p._id} prescription={p} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PrescriptionsPage;
