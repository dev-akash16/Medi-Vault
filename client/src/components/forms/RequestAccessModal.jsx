import React, { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { KeyRound, ShieldAlert } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export const RequestAccessModal = ({ isOpen, onClose, patientId, patientName, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [reason, setReason] = useState('');
  const [scopes, setScopes] = useState([
    'medical_history',
    'consultations',
    'prescriptions',
    'reports',
    'allergies',
    'vitals',
    'documents',
  ]);

  const allScopes = [
    { id: 'medical_history', label: 'Past Diseases & Surgeries' },
    { id: 'consultations', label: 'Previous Consultations & Notes' },
    { id: 'prescriptions', label: 'Prescriptions & Current Medications' },
    { id: 'reports', label: 'Diagnostic Laboratory Reports' },
    { id: 'allergies', label: 'Documented Allergies' },
    { id: 'vitals', label: 'Health Vitals History' },
    { id: 'documents', label: 'Medical Document Vault' },
  ];

  const toggleScope = (id) => {
    if (scopes.includes(id)) {
      setScopes(scopes.filter((s) => s !== id));
    } else {
      setScopes([...scopes, id]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason.trim()) {
      toast.error('Clinical reason for requesting access is required.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/access/request', {
        patientId,
        reason,
        requestedScopes: scopes,
      });

      if (res.data.success) {
        toast.success(res.data.message || 'Access request submitted to patient.');
        if (onSuccess) onSuccess(res.data.data);
        onClose();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit access request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Request Access: ${patientName || patientId}`}
      subtitle="Submit formal consent request to access patient medical records"
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 leading-relaxed">
          <p>
            MediVault mandates patient consent before medical history can be accessed. Once submitted, the patient receives an instant notification to approve or reject your request.
          </p>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">
            Clinical Reason for Access *
          </label>
          <textarea
            rows={3}
            required
            placeholder="Explain why accessing this patient's medical history is required for their clinical evaluation..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1.5">
            Requested Data Scopes
          </label>
          <div className="space-y-1.5">
            {allScopes.map((s) => (
              <label
                key={s.id}
                className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-50 hover:bg-slate-100/70 border border-slate-200/80 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={scopes.includes(s.id)}
                  onChange={() => toggleScope(s.id)}
                  className="rounded text-medivault-800 w-4 h-4"
                />
                <span className="font-medium text-slate-800">{s.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" loading={loading} icon={KeyRound}>
            Submit Access Request
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default RequestAccessModal;
