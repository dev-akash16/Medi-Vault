import React, { useState, useEffect } from 'react';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import api from '../../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { Users, Search, AlertTriangle, HeartPulse, ArrowRight } from 'lucide-react';

export const MyPatientsPage = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await api.get('/doctors/patients');
        if (res.data.success) {
          setPatients(res.data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);

  const filtered = patients.filter((p) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      p.name?.toLowerCase().includes(term) ||
      p.patientId?.toLowerCase().includes(term) ||
      p.email?.toLowerCase().includes(term)
    );
  });

  if (loading) return <LoadingSkeleton count={4} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-card flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-medivault-700">Clinical Panel</span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">My Authorized Patients</h1>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            Patients who have granted active consent for you to access their medical history, diagnostic reports, and record consultations.
          </p>
        </div>

        <Link to="/doctor/search">
          <Button variant="primary" size="md" icon={Search}>
            Search / Request New Patient
          </Button>
        </Link>
      </div>

      {/* Search Filter */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Filter authorized patients by name, Patient ID, email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-transparent border-none text-xs text-slate-800 focus:outline-none placeholder-slate-400"
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No authorized patients found"
          description="Patients will appear here once they approve your record access request."
          actionText="Search Patients"
          onAction={() => navigate('/doctor/search')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((pat) => (
            <div
              key={pat.id || pat.patientId}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-card hover:shadow-hover transition duration-200 p-6 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{pat.name}</h3>
                    <span className="font-mono text-xs font-semibold text-cyan-600 block mt-0.5">
                      {pat.patientId}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded">
                    {pat.bloodGroup || 'Blood Group: A+'}
                  </span>
                </div>

                {/* Allergies tag */}
                {pat.allergies && pat.allergies.length > 0 && (
                  <div className="p-2.5 bg-rose-50/70 border border-rose-200 rounded-xl text-xs text-rose-900 flex items-center gap-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                    <span className="truncate">Allergies: <strong>{pat.allergies.join(', ')}</strong></span>
                  </div>
                )}

                {/* Conditions tag */}
                {pat.activeConditions && pat.activeConditions.length > 0 && (
                  <div className="p-2.5 bg-blue-50/70 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-center gap-2">
                    <HeartPulse className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span className="truncate">Active: <strong>{pat.activeConditions.join(', ')}</strong></span>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  Consent: {new Date(pat.grantedAt).toLocaleDateString()}
                </span>
                <Button
                  variant="primary"
                  size="sm"
                  icon={ArrowRight}
                  onClick={() => navigate(`/doctor/patients/${pat.patientId}`)}
                >
                  Clinical Profile
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyPatientsPage;
