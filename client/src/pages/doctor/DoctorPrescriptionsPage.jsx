import React, { useState, useEffect } from 'react';
import PrescriptionCard from '../../components/medical/PrescriptionCard';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import api from '../../services/api';
import { Pill } from 'lucide-react';

export const DoctorPrescriptionsPage = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const res = await api.get('/prescriptions');
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

  if (loading) return <LoadingSkeleton count={3} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-card">
        <span className="text-xs uppercase font-bold tracking-wider text-medivault-700">Prescription Register</span>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">Issued Prescriptions</h1>
        <p className="text-xs text-slate-500 mt-1 max-w-xl">
          Electronic prescription records issued by your clinical practice to authorized patients.
        </p>
      </div>

      {prescriptions.length === 0 ? (
        <EmptyState
          icon={Pill}
          title="No issued prescriptions"
          description="Prescriptions you prescribe during patient encounters will appear here."
        />
      ) : (
        <div className="space-y-6">
          {prescriptions.map((p) => (
            <PrescriptionCard key={p._id} prescription={p} isDoctor={true} />
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorPrescriptionsPage;
