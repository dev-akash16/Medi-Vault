import React, { useState, useEffect } from 'react';
import LabReportCard from '../../components/medical/LabReportCard';
import Button from '../../components/common/Button';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import UploadReportModal from '../../components/forms/UploadReportModal';
import api from '../../services/api';
import { FileCheck, Plus, UploadCloud } from 'lucide-react';

export const LabReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [showUploadModal, setShowUploadModal] = useState(false);

  const fetchReports = async () => {
    try {
      const res = await api.get('/patients/me/reports');
      if (res.data.success) {
        setReports(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const types = [
    'All',
    'Blood test',
    'CBC',
    'Lipid profile',
    'Blood glucose',
    'Thyroid',
    'Urine test',
    'X-ray',
    'MRI',
    'CT scan',
    'Ultrasound',
    'ECG',
  ];

  const filtered = reports.filter((r) => {
    if (filter === 'All') return true;
    return r.testType?.toLowerCase() === filter.toLowerCase();
  });

  if (loading) return <LoadingSkeleton count={3} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-card flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-medivault-700">Diagnostic Vault</span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">Laboratory & Diagnostic Reports</h1>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            Verified laboratory tests, imaging reports, and pathology panels with interactive AI educational explanations.
          </p>
        </div>

        <Button variant="primary" size="md" icon={UploadCloud} onClick={() => setShowUploadModal(true)}>
          Upload Diagnostic Report
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 bg-white p-3 rounded-2xl border border-slate-100">
        {types.map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
              filter === t
                ? 'bg-medivault-800 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={FileCheck}
          title="No diagnostic reports found"
          description="Uploaded blood tests, pathology panels, and imaging reports will be safely archived here."
          actionText="Upload Report"
          onAction={() => setShowUploadModal(true)}
        />
      ) : (
        <div className="space-y-6">
          {filtered.map((report) => (
            <LabReportCard key={report._id} report={report} />
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <UploadReportModal
          isOpen={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          onSuccess={fetchReports}
        />
      )}
    </div>
  );
};

export default LabReportsPage;
