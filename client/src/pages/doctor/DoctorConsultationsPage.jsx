import React, { useState, useEffect } from 'react';
import ConsultationCard from '../../components/medical/ConsultationCard';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { Stethoscope, Edit3 } from 'lucide-react';

export const DoctorConsultationsPage = () => {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Amend modal
  const [showAmendModal, setShowAmendModal] = useState(false);
  const [amendLoading, setAmendLoading] = useState(false);
  const [targetConsultation, setTargetConsultation] = useState(null);
  const [amendReason, setAmendReason] = useState('');
  const [amendNotes, setAmendNotes] = useState('');

  const fetchConsultations = async () => {
    try {
      const res = await api.get('/consultations');
      if (res.data.success) {
        setConsultations(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsultations();
  }, []);

  const handleAmendSubmit = async (e) => {
    e.preventDefault();
    if (!amendReason.trim()) {
      toast.error('Formal reason for amendment is required.');
      return;
    }

    setAmendLoading(true);
    try {
      const res = await api.post(`/consultations/${targetConsultation.consultationId}/amend`, {
        reason: amendReason,
        clinicalNotes: amendNotes,
      });

      if (res.data.success) {
        toast.success('Consultation amended with audit trail.');
        fetchConsultations();
        setShowAmendModal(false);
        setAmendReason('');
        setAmendNotes('');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to amend consultation.');
    } finally {
      setAmendLoading(false);
    }
  };

  if (loading) return <LoadingSkeleton count={3} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-card">
        <span className="text-xs uppercase font-bold tracking-wider text-medivault-700">Clinical Archive</span>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">Consultation History</h1>
        <p className="text-xs text-slate-500 mt-1 max-w-xl">
          Completed medical encounters and clinical examination records. All consultations are permanently preserved and auditable.
        </p>
      </div>

      {consultations.length === 0 ? (
        <EmptyState
          icon={Stethoscope}
          title="No completed consultations"
          description="When you complete consultations for your authorized patients, they will be preserved here."
        />
      ) : (
        <div className="space-y-6">
          {consultations.map((c) => (
            <div key={c._id} className="relative">
              <ConsultationCard consultation={c} isDoctor={true} />
              <div className="mt-2 flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  icon={Edit3}
                  className="text-xs text-amber-700 hover:bg-amber-50"
                  onClick={() => {
                    setTargetConsultation(c);
                    setAmendNotes(c.notes?.clinicalNotes || '');
                    setShowAmendModal(true);
                  }}
                >
                  Formally Amend Consultation Record
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Formal Amendment Modal */}
      {showAmendModal && targetConsultation && (
        <Modal
          isOpen={showAmendModal}
          onClose={() => setShowAmendModal(false)}
          title={`Amend Consultation ${targetConsultation.consultationId}`}
          subtitle="All amendments are recorded in the permanent audit trail with required justification"
          maxWidth="max-w-lg"
        >
          <form onSubmit={handleAmendSubmit} className="space-y-4 text-xs">
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900">
              <p>
                Medical ethics and MediVault security prevent silent overwriting of completed visits. Your name, timestamp, and stated reason will be permanently recorded alongside this amendment.
              </p>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Formal Reason for Clinical Amendment *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Laboratory results received after visit, corrected dosage"
                value={amendReason}
                onChange={(e) => setAmendReason(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Updated Clinical Assessment & Notes
              </label>
              <textarea
                rows={4}
                required
                value={amendNotes}
                onChange={(e) => setAmendNotes(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
              <Button variant="secondary" size="sm" onClick={() => setShowAmendModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" loading={amendLoading}>
                Commit Audited Amendment
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default DoctorConsultationsPage;
