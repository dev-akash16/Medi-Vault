import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import StatCard from '../../components/common/StatCard';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import NewConsultationModal from '../../components/forms/NewConsultationModal';
import NewPrescriptionModal from '../../components/forms/NewPrescriptionModal';
import UploadReportModal from '../../components/forms/UploadReportModal';
import api from '../../services/api';
import { Link, useNavigate } from 'react-router-dom';
import {
  Users,
  Calendar,
  Stethoscope,
  Pill,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  Plus,
  Activity,
  FileCheck,
} from 'lucide-react';

export const DoctorDashboard = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modals
  const [showConsultationModal, setShowConsultationModal] = useState(false);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const fetchDoctorDashboard = async () => {
    try {
      const res = await api.get('/doctors/dashboard-stats');
      if (res.data.success) {
        setStats(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctorDashboard();
  }, []);

  if (loading) return <LoadingSkeleton count={6} />;

  const counts = stats?.counts || {};
  const todayAppointments = stats?.todayAppointments || [];
  const recentConsultations = stats?.recentConsultations || [];
  const recentPatients = stats?.recentPatients || [];

  const isVerified = profile?.verificationStatus === 'verified';

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-medivault-900 via-medivault-800 to-medivault-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-wrap items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/40">
              {profile?.doctorId}
            </span>
            <Badge variant={profile?.verificationStatus}>
              {isVerified ? 'Verified Physician' : 'Pending Verification'}
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome, Dr. {user?.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            {profile?.specialization} • {profile?.clinicName || 'MediVault Health Practice'}
          </p>
        </div>

        {/* Status Callout */}
        <div className="relative z-10 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 text-xs text-right space-y-1">
          <span className="text-slate-300 block">Registration License:</span>
          <span className="font-mono font-bold text-white block">{profile?.registrationNumber}</span>
          <span className="text-[10px] text-cyan-300 block">{profile?.experience} Years Clinical Practice</span>
        </div>
      </div>

      {/* Unverified Warning if pending */}
      {!isVerified && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between text-xs text-amber-900 gap-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <strong className="font-bold block">Medical Credentials Under Administrative Review:</strong>
              <span>
                Your profile is submitted for license verification. Patients can view your specialization, but full verification badge will activate once verified by platform administrators.
              </span>
            </div>
          </div>
          <Link to="/doctor/profile" className="font-bold underline shrink-0">
            View Credentials
          </Link>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Authorized Patients"
          value={counts.totalPatients || 0}
          subtitle="Active patient consents"
          icon={Users}
          iconBg="bg-blue-50 text-blue-600"
          onClick={() => navigate('/doctor/patients')}
        />
        <StatCard
          title="Today's Appointments"
          value={counts.todayAppointments || 0}
          subtitle="Scheduled consultations"
          icon={Calendar}
          iconBg="bg-cyan-50 text-cyan-600"
          onClick={() => navigate('/doctor/appointments')}
        />
        <StatCard
          title="Upcoming Schedule"
          value={counts.upcomingAppointments || 0}
          subtitle="Visits this month"
          icon={Clock}
          iconBg="bg-emerald-50 text-emerald-600"
          onClick={() => navigate('/doctor/appointments')}
        />
        <StatCard
          title="Consultations Logged"
          value={counts.consultationsCompleted || 0}
          subtitle="Permanent encounters"
          icon={Stethoscope}
          iconBg="bg-purple-50 text-purple-600"
          onClick={() => navigate('/doctor/consultations')}
        />
      </div>

      {/* Quick Actions Toolbar */}
      <div className="flex flex-wrap items-center gap-3 bg-white p-4 rounded-2xl border border-slate-100 shadow-xs">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-2">Clinical Tools:</span>
        <Link to="/doctor/search">
          <Button variant="primary" size="sm" icon={Search}>
            Search Patient by ID
          </Button>
        </Link>
        <Link to="/doctor/patients">
          <Button variant="secondary" size="sm" icon={Users}>
            My Authorized Patients
          </Button>
        </Link>
        <Link to="/doctor/appointments">
          <Button variant="secondary" size="sm" icon={Calendar}>
            Manage Appointments
          </Button>
        </Link>
      </div>

      {/* Main Grid: Today's Appointments & Recent Consultations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Today's Appointments */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Today's Patient Consultations</h3>
                <p className="text-xs text-slate-500">Scheduled visits for today</p>
              </div>
              <Link to="/doctor/appointments" className="text-xs font-semibold text-medivault-700 hover:underline">
                View all schedule →
              </Link>
            </div>

            {todayAppointments.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No scheduled visits for today.</p>
            ) : (
              <div className="divide-y divide-slate-100">
                {todayAppointments.map((apt) => (
                  <div key={apt._id} className="py-3.5 flex items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="text-sm font-bold text-slate-900">
                          {apt.patient?.user?.name || 'Patient'}
                        </strong>
                        <Badge variant={apt.status} size="sm">{apt.status}</Badge>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{apt.reason}</p>
                      <span className="text-[11px] font-mono text-cyan-600 block mt-1">
                        Time: {apt.timeSlot} • Mode: {apt.appointmentType}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => {
                          setSelectedPatient(apt.patient);
                          setShowConsultationModal(true);
                        }}
                      >
                        Start Visit
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Authorized Patients */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Authorized Patients</h3>
                <p className="text-xs text-slate-500">Patients who have granted you medical record access</p>
              </div>
              <Link to="/doctor/patients" className="text-xs font-semibold text-medivault-700 hover:underline">
                View all ({counts.totalPatients || 0}) →
              </Link>
            </div>

            {recentPatients.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No authorized patients yet.</p>
            ) : (
              <div className="space-y-3">
                {recentPatients.slice(0, 4).map((pat) => (
                  <div
                    key={pat._id}
                    className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{pat.user?.name}</h4>
                      <span className="text-[11px] font-mono text-slate-500 block">{pat.patientId}</span>
                    </div>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => navigate(`/doctor/patients/${pat.patientId}`)}
                    >
                      Open Records
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Consultations Completed */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Recent Completed Visits</h3>
                <p className="text-xs text-slate-500">Clinical encounter logs and assessments</p>
              </div>
              <Link to="/doctor/consultations" className="text-xs font-semibold text-medivault-700 hover:underline">
                All consultations →
              </Link>
            </div>

            {recentConsultations.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No completed consultations on record.</p>
            ) : (
              <div className="divide-y divide-slate-100">
                {recentConsultations.map((c) => (
                  <div key={c._id} className="py-4 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <strong className="text-xs font-bold text-slate-900">
                          {c.patient?.user?.name || 'Patient'}
                        </strong>
                        <span className="text-[11px] font-mono text-slate-400">({c.consultationId})</span>
                      </div>
                      <span className="text-[11px] font-mono text-slate-500">
                        {new Date(c.date).toLocaleDateString()}
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 font-medium">Chief Complaint: "{c.chiefComplaint}"</p>
                    {c.notes?.assessment && (
                      <p className="text-xs text-slate-500 line-clamp-1 italic">
                        Assessment: {c.notes.assessment}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showConsultationModal && selectedPatient && (
        <NewConsultationModal
          isOpen={showConsultationModal}
          onClose={() => {
            setShowConsultationModal(false);
            setSelectedPatient(null);
          }}
          patientId={selectedPatient.patientId || selectedPatient._id}
          patientName={selectedPatient.user?.name || selectedPatient.name}
          onSuccess={fetchDoctorDashboard}
        />
      )}
    </div>
  );
};

export default DoctorDashboard;
