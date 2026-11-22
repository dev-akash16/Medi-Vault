import React, { useState, useEffect } from 'react';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { HeartPulse, Plus, Calendar, Stethoscope, Clock } from 'lucide-react';

export const ConditionsPage = () => {
  const [conditions, setConditions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [formData, setFormData] = useState({
    conditionName: '',
    description: '',
    diagnosisDate: new Date().toISOString().split('T')[0],
    status: 'Active',
    severity: 'Moderate',
    treatmentPlan: '',
    notes: '',
  });

  const fetchConditions = async () => {
    try {
      const res = await api.get('/patients/me/conditions');
      if (res.data.success) {
        setConditions(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConditions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.conditionName.trim()) {
      toast.error('Condition name is required.');
      return;
    }

    setModalLoading(true);
    try {
      const res = await api.post('/patients/me/conditions', formData);
      if (res.data.success) {
        toast.success('Medical condition recorded successfully!');
        fetchConditions();
        setShowModal(false);
        setFormData({
          conditionName: '',
          description: '',
          diagnosisDate: new Date().toISOString().split('T')[0],
          status: 'Active',
          severity: 'Moderate',
          treatmentPlan: '',
          notes: '',
        });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to record condition.');
    } finally {
      setModalLoading(false);
    }
  };

  const statuses = ['All', 'Active', 'Under Treatment', 'Controlled', 'Resolved', 'Chronic'];

  const filtered = conditions.filter((c) => {
    if (filter === 'All') return true;
    return c.status.toLowerCase() === filter.toLowerCase();
  });

  if (loading) return <LoadingSkeleton count={3} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-card flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-medivault-700">Diagnosis Register</span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">Medical Conditions & Diseases</h1>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            Documented acute, chronic, and historically managed diagnoses under active care.
          </p>
        </div>

        <Button variant="primary" size="md" icon={Plus} onClick={() => setShowModal(true)}>
          Record Medical Condition
        </Button>
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

      {/* List */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={HeartPulse}
          title="No conditions recorded"
          description="Medical conditions diagnosed by your doctors will appear here."
          actionText="Add Condition"
          onAction={() => setShowModal(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.map((c) => (
            <div key={c._id} className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-card space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">{c.conditionName}</h3>
                    <Badge variant={c.status}>{c.status}</Badge>
                  </div>
                  {c.description && <p className="text-xs text-slate-500 mt-1">{c.description}</p>}
                </div>
                <Badge variant={c.severity} size="sm">{c.severity}</Badge>
              </div>

              {c.treatmentPlan && (
                <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-700">
                  <strong className="text-slate-900 block font-semibold mb-0.5">Treatment Plan:</strong>
                  <p className="leading-relaxed">{c.treatmentPlan}</p>
                </div>
              )}

              <div className="pt-2 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
                <span>
                  {c.treatingDoctorName ? `Physician: Dr. ${c.treatingDoctorName}` : 'Self-documented'}
                </span>
                <span className="flex items-center gap-1 font-mono text-[11px]">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(c.diagnosisDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      {showModal && (
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title="Record Medical Condition"
          subtitle="Document an active, under-treatment, or chronic diagnosis"
          maxWidth="max-w-lg"
        >
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Condition / Disease Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Essential Hypertension"
                value={formData.conditionName}
                onChange={(e) => setFormData({ ...formData, conditionName: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
                >
                  <option value="Active">Active</option>
                  <option value="Under Treatment">Under Treatment</option>
                  <option value="Controlled">Controlled</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Chronic">Chronic</option>
                  <option value="Historical">Historical</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Severity</label>
                <select
                  value={formData.severity}
                  onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
                >
                  <option value="Mild">Mild</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Severe">Severe</option>
                  <option value="Not Specified">Not Specified</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Diagnosis Date</label>
              <input
                type="date"
                value={formData.diagnosisDate}
                onChange={(e) => setFormData({ ...formData, diagnosisDate: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Description / Clinical Context</label>
              <textarea
                rows={2}
                placeholder="Brief clinical description of presentation"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Current Treatment Plan</label>
              <textarea
                rows={2}
                placeholder="Prescribed therapies, lifestyle directions, medication regimen"
                value={formData.treatmentPlan}
                onChange={(e) => setFormData({ ...formData, treatmentPlan: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
              <Button variant="secondary" size="sm" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" loading={modalLoading}>
                Save Condition
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default ConditionsPage;
