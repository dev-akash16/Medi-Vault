import React, { useState, useEffect } from 'react';
import {
  CheckCircle,
  XCircle,
  Shield,
  FileText,
  Building,
  Award,
  AlertTriangle,
  Clock,
  ExternalLink,
  Search,
} from 'lucide-react';
import api from '../../services/api';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import EmptyState from '../../components/common/EmptyState';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import toast from 'react-hot-toast';

export const DoctorVerificationPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [actionType, setActionType] = useState('approve'); // approve | reject
  const [remarks, setRemarks] = useState('');
  const [processing, setProcessing] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchPendingDoctors = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/doctors/pending');
      if (res.data.success) {
        setDoctors(res.data.data);
      }
    } catch (err) {
      toast.error('Failed to load pending doctor applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingDoctors();
  }, []);

  const openActionModal = (doctor, type) => {
    setSelectedDoctor(doctor);
    setActionType(type);
    setRemarks(
      type === 'approve'
        ? 'Medical credentials and registration verified against state healthcare council records.'
        : 'Incomplete or unverified registration documentation.'
    );
    setModalOpen(true);
  };

  const handleVerificationSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDoctor) return;

    setProcessing(true);
    try {
      const res = await api.post(`/admin/doctors/${selectedDoctor.doctorId || selectedDoctor._id}/verify`, {
        action: actionType,
        remarks,
      });

      if (res.data.success) {
        toast.success(
          actionType === 'approve'
            ? `Dr. ${selectedDoctor.user?.name || selectedDoctor.doctorId} verified successfully!`
            : `Application rejected for Dr. ${selectedDoctor.user?.name || selectedDoctor.doctorId}`
        );
        setModalOpen(false);
        fetchPendingDoctors();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Verification submission failed');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Shield className="w-6 h-6 text-medivault-700" />
            Doctor Credentials Verification
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Review professional medical licensure, hospital affiliations, and approve or reject clinical practitioner credentials.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3.5 h-3.5" />
            {doctors.length} Pending Approval
          </span>
        </div>
      </div>

      {loading ? (
        <LoadingSkeleton type="table" count={5} />
      ) : doctors.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-8">
          <EmptyState
            icon={CheckCircle}
            title="All Applications Cleared"
            description="There are currently no doctor credential applications awaiting administrative review."
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {doctors.map((doc) => (
            <div
              key={doc._id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:border-slate-300 transition-all flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6"
            >
              <div className="space-y-4 max-w-2xl">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-medivault-50 border border-medivault-200 flex items-center justify-center font-bold text-medivault-700 text-xl shrink-0">
                    {doc.user?.name ? doc.user.name.split(' ').map((n) => n[0]).join('').slice(0, 2) : 'DR'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-lg font-bold text-slate-900">Dr. {doc.user?.name}</h3>
                      <Badge variant="warning">Verification Pending</Badge>
                      <span className="text-xs font-mono font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        {doc.doctorId}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-medivault-600 mt-0.5">
                      {doc.specialization} &bull; {doc.qualifications}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {doc.user?.email} &bull; {doc.user?.phone || 'No phone provided'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                    <span className="text-slate-400 block font-medium">Medical License / Reg No</span>
                    <span className="font-semibold text-slate-800 text-sm mt-0.5 block font-mono">
                      {doc.registrationNumber || 'Not provided'}
                    </span>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                    <span className="text-slate-400 block font-medium">Experience</span>
                    <span className="font-semibold text-slate-800 text-sm mt-0.5 block">
                      {doc.experienceYears ? `${doc.experienceYears} Years` : 'N/A'}
                    </span>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                    <span className="text-slate-400 block font-medium">Clinic / Hospital</span>
                    <span className="font-semibold text-slate-800 text-sm mt-0.5 block truncate">
                      {doc.clinicName || 'Private Practice'}
                    </span>
                  </div>
                </div>

                {doc.consultationAddress && (
                  <p className="text-xs text-slate-600">
                    <strong className="text-slate-700">Practice Address:</strong> {doc.consultationAddress}
                  </p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row lg:flex-col gap-3 justify-center shrink-0 border-t lg:border-t-0 pt-4 lg:pt-0">
                <Button
                  variant="primary"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-2"
                  onClick={() => openActionModal(doc, 'approve')}
                >
                  <CheckCircle className="w-4 h-4" />
                  Approve Credentials
                </Button>
                <Button
                  variant="danger"
                  className="flex items-center justify-center gap-2"
                  onClick={() => openActionModal(doc, 'reject')}
                >
                  <XCircle className="w-4 h-4" />
                  Reject Application
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Approve / Reject Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={actionType === 'approve' ? 'Approve Medical Credentials' : 'Decline Doctor Verification'}
      >
        <form onSubmit={handleVerificationSubmit} className="space-y-4">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <p className="text-sm font-semibold text-slate-900">
              Doctor: <span className="font-bold">Dr. {selectedDoctor?.user?.name}</span> ({selectedDoctor?.doctorId})
            </p>
            <p className="text-xs text-slate-600 mt-1">
              Specialization: {selectedDoctor?.specialization} | License: {selectedDoctor?.registrationNumber}
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {actionType === 'approve' ? 'Audit & Approval Notes' : 'Reason for Rejection / Decline'}
            </label>
            <textarea
              required
              rows={3}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full text-sm rounded-xl border-slate-300 focus:border-medivault-500 focus:ring-medivault-500"
              placeholder={
                actionType === 'approve'
                  ? 'Confirm state medical council license verification details...'
                  : 'State why verification cannot be completed...'
              }
            />
          </div>

          <div className="text-xs text-slate-500 bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              {actionType === 'approve'
                ? 'Approving will grant this doctor the verified badge across MediVault, enabling them to request patient record access and create clinical prescriptions.'
                : 'Rejecting will flag this account as unverified. The practitioner will receive your remarks in their dashboard notifications.'}
            </span>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)} disabled={processing}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant={actionType === 'approve' ? 'primary' : 'danger'}
              className={actionType === 'approve' ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : ''}
              disabled={processing}
            >
              {processing
                ? 'Processing...'
                : actionType === 'approve'
                ? 'Confirm Approval'
                : 'Confirm Rejection'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default DoctorVerificationPage;
