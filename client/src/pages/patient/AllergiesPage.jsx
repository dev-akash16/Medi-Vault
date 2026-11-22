import React, { useState, useEffect } from 'react';
import AllergyCard from '../../components/medical/AllergyCard';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { AlertCircle, Plus, ShieldAlert } from 'lucide-react';

export const AllergiesPage = () => {
  const [allergies, setAllergies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add modal
  const [showModal, setShowModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [formData, setFormData] = useState({
    allergyName: '',
    allergyType: 'Medication',
    reaction: '',
    severity: 'Moderate',
    identifiedBy: 'Physician Clinical Evaluation',
    notes: '',
  });

  const fetchAllergies = async () => {
    try {
      const res = await api.get('/patients/me/allergies');
      if (res.data.success) {
        setAllergies(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllergies();
  }, []);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/patients/me/allergies/${id}`);
      toast.success('Allergy record removed.');
      fetchAllergies();
    } catch (err) {
      toast.error('Failed to remove allergy.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.allergyName.trim() || !formData.reaction.trim()) {
      toast.error('Allergy name and reaction are required.');
      return;
    }

    setModalLoading(true);
    try {
      const res = await api.post('/patients/me/allergies', formData);
      if (res.data.success) {
        toast.success('Allergy documented successfully.');
        fetchAllergies();
        setShowModal(false);
        setFormData({
          allergyName: '',
          allergyType: 'Medication',
          reaction: '',
          severity: 'Moderate',
          identifiedBy: 'Physician Clinical Evaluation',
          notes: '',
        });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add allergy.');
    } finally {
      setModalLoading(false);
    }
  };

  if (loading) return <LoadingSkeleton count={3} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-card flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-rose-700">Safety & Critical Alerts</span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">Documented Allergies</h1>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            Critical allergy cautions are displayed prominently to all authorized doctors during consultations before medications are prescribed.
          </p>
        </div>

        <Button variant="danger" size="md" icon={Plus} onClick={() => setShowModal(true)}>
          Add Allergy Alert
        </Button>
      </div>

      {allergies.length === 0 ? (
        <EmptyState
          icon={AlertCircle}
          title="No allergies documented"
          description="Document any adverse reactions to drugs, foods, or environmental triggers."
          actionText="Add Allergy"
          onAction={() => setShowModal(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {allergies.map((allergy) => (
            <AllergyCard
              key={allergy._id}
              allergy={allergy}
              canDelete={true}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title="Document Allergy Alert"
          subtitle="Record adverse allergic reactions to protect clinical care"
          maxWidth="max-w-lg"
        >
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Substance / Allergy Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Penicillin, Amoxicillin, Peanuts"
                value={formData.allergyName}
                onChange={(e) => setFormData({ ...formData, allergyName: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Allergy Type</label>
                <select
                  value={formData.allergyType}
                  onChange={(e) => setFormData({ ...formData, allergyType: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                >
                  <option value="Medication">Medication / Drug</option>
                  <option value="Food">Food / Nut</option>
                  <option value="Environmental">Environmental</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Severity</label>
                <select
                  value={formData.severity}
                  onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                >
                  <option value="Mild">Mild</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Severe">Severe</option>
                  <option value="Life-threatening">Life-threatening (Anaphylaxis)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Reaction Symptoms *</label>
              <input
                type="text"
                required
                placeholder="e.g. Urticaria rash, bronchospasm, lip swelling"
                value={formData.reaction}
                onChange={(e) => setFormData({ ...formData, reaction: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Identified By</label>
              <input
                type="text"
                placeholder="e.g. Dr. Miller, Self-reported"
                value={formData.identifiedBy}
                onChange={(e) => setFormData({ ...formData, identifiedBy: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Clinical Notes & Action Guidance</label>
              <textarea
                rows={2}
                placeholder="e.g. Carry Epipen, avoid cephalosporins"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
              <Button variant="secondary" size="sm" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button variant="danger" type="submit" loading={modalLoading}>
                Save Allergy Record
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default AllergiesPage;
