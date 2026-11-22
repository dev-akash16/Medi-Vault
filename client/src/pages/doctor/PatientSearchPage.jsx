import React, { useState } from 'react';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import RequestAccessModal from '../../components/forms/RequestAccessModal';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Search, KeyRound, Lock, ArrowRight, AlertTriangle, ShieldCheck, HeartPulse } from 'lucide-react';

export const PatientSearchPage = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const navigate = useNavigate();

  // Access request modal
  const [showAccessModal, setShowAccessModal] = useState(false);
  const [targetPatient, setTargetPatient] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) {
      toast.error('Please enter a Patient ID or patient name.');
      return;
    }

    setLoading(true);
    setSearched(true);
    try {
      const res = await api.get(`/doctors/search-patients?query=${encodeURIComponent(query.trim())}`);
      if (res.data.success) {
        setResults(res.data.data);
      }
    } catch (err) {
      toast.error('Patient search failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAccessModal = (pat) => {
    setTargetPatient(pat);
    setShowAccessModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-card">
        <span className="text-xs uppercase font-bold tracking-wider text-medivault-700">Patient Directory</span>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">Patient Search & Record Access</h1>
        <p className="text-xs text-slate-500 mt-1 max-w-xl">
          Search for patients by their unique Patient ID (e.g. MV-PAT-2026-0001) or name. Submit access requests with clinical justification to view medical history.
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mt-6 flex flex-wrap sm:flex-nowrap gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Enter Patient ID (e.g. MV-PAT-2026-0001) or patient name..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-medivault-500 transition"
            />
          </div>
          <Button variant="primary" size="lg" type="submit" loading={loading} icon={Search}>
            Search Patients
          </Button>
        </form>
      </div>

      {/* Results */}
      {searched && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
            Search Results ({results.length})
          </h3>

          {results.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
              No patient records found matching "{query}". Please verify the Patient ID.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {results.map((pat) => {
                const isAuthorized = pat.accessStatus === 'authorized';
                const isPending = pat.accessStatus === 'pending_request';

                return (
                  <div
                    key={pat.id || pat.patientId}
                    className="bg-white rounded-2xl border border-slate-200/90 shadow-card p-6 flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-base font-bold text-slate-900">{pat.name}</h4>
                          <span className="font-mono text-xs font-semibold text-cyan-700 block mt-0.5">
                            {pat.patientId}
                          </span>
                        </div>
                        {isAuthorized ? (
                          <Badge variant="verified">Authorized</Badge>
                        ) : isPending ? (
                          <Badge variant="pending">Consent Pending</Badge>
                        ) : (
                          <Badge variant="default">No Access</Badge>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 p-3 bg-slate-50 rounded-xl">
                        <div>
                          <span className="text-[10px] text-slate-400 block uppercase">Blood Group</span>
                          <strong className="text-slate-800">{pat.bloodGroup || 'A+'}</strong>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block uppercase">Gender</span>
                          <strong className="text-slate-800">{pat.gender || 'Not specified'}</strong>
                        </div>
                      </div>

                      {/* Medical alert previews */}
                      {pat.allergies && pat.allergies.length > 0 && (
                        <div className="flex items-center gap-2 text-xs text-rose-700 bg-rose-50/70 p-2.5 rounded-lg border border-rose-200">
                          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">Allergies: {pat.allergies.join(', ')}</span>
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      {isAuthorized ? (
                        <>
                          <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5" /> Full Record Access
                          </span>
                          <Button
                            variant="primary"
                            size="sm"
                            icon={ArrowRight}
                            onClick={() => navigate(`/doctor/patients/${pat.patientId}`)}
                          >
                            Open Medical Record
                          </Button>
                        </>
                      ) : isPending ? (
                        <>
                          <span className="text-[11px] text-amber-600 font-semibold">
                            Request Pending Approval
                          </span>
                          <Button variant="secondary" size="sm" disabled>
                            Waiting for Patient
                          </Button>
                        </>
                      ) : (
                        <>
                          <span className="text-[11px] text-slate-400 flex items-center gap-1">
                            <Lock className="w-3.5 h-3.5" /> Consent Required
                          </span>
                          <Button
                            variant="teal"
                            size="sm"
                            icon={KeyRound}
                            onClick={() => handleOpenAccessModal(pat)}
                          >
                            Request Record Access
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Access Request Modal */}
      {showAccessModal && targetPatient && (
        <RequestAccessModal
          isOpen={showAccessModal}
          onClose={() => {
            setShowAccessModal(false);
            setTargetPatient(null);
          }}
          patientId={targetPatient.patientId || targetPatient.id}
          patientName={targetPatient.name}
          onSuccess={() => {
            // refresh search
            setResults(results.map((r) => r.patientId === targetPatient.patientId ? { ...r, accessStatus: 'pending_request' } : r));
          }}
        />
      )}
    </div>
  );
};

export default PatientSearchPage;
