import React, { useState, useEffect } from 'react';
import ConsultationCard from '../../components/medical/ConsultationCard';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import api from '../../services/api';
import { Stethoscope } from 'lucide-react';

export const ConsultationsPage = () => {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConsultations = async () => {
      try {
        const res = await api.get('/patients/me/consultations');
        if (res.data.success) {
          setConsultations(res.data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchConsultations();
  }, []);

  if (loading) return <LoadingSkeleton count={3} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-card">
        <span className="text-xs uppercase font-bold tracking-wider text-medivault-700">Clinical Encounters</span>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">My Medical Consultations</h1>
        <p className="text-xs text-slate-500 mt-1 max-w-xl">
          Historical records of every doctor consultation, clinical examination, assessment, and treatment plan. Permanent records are preserved and cannot be overwritten.
        </p>
      </div>

      {consultations.length === 0 ? (
        <EmptyState
          icon={Stethoscope}
          title="No completed consultations yet"
          description="When your authorized doctors conduct an in-person or telehealth consultation, the completed medical records will appear here."
        />
      ) : (
        <div className="space-y-6">
          {consultations.map((c) => (
            <ConsultationCard key={c._id} consultation={c} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ConsultationsPage;
