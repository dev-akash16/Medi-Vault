import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import StatCard from '../../components/common/StatCard';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import VitalsChart from '../../components/medical/VitalsChart';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import BookAppointmentModal from '../../components/forms/BookAppointmentModal';
import UploadReportModal from '../../components/forms/UploadReportModal';
import AddVitalsModal from '../../components/forms/AddVitalsModal';
import api from '../../services/api';
import { Link } from 'react-router-dom';
import {
  HeartPulse,
  Pill,
  Stethoscope,
  Calendar,
  Clock,
  FileCheck,
  KeyRound,
  Plus,
  ArrowRight,
  AlertTriangle,
  UploadCloud,
  Activity,
} from 'lucide-react';

export const PatientDashboard = () => {
  const { user, profile } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [vitalsData, setVitalsData] = useState([]);

  // Modals
  const [showBookModal, setShowBookModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showVitalsModal, setShowVitalsModal] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const [overviewRes, vitalsRes] = await Promise.all([
        api.get('/patients/me/overview'),
        api.get('/vitals?days=180'),
      ]);

      if (overviewRes.data.success) {
        setData(overviewRes.data.data);
      }
      if (vitalsRes.data.success) {
        setVitalsData(vitalsRes.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return <LoadingSkeleton count={6} />;
  }

  const counts = data?.counts || {};
  const activeConditions = data?.activeConditions || [];
  const currentMedicines = data?.currentMedicines || [];
  const recentConsultations = data?.recentConsultations || [];
  const upcomingAppointments = data?.upcomingAppointments || [];
  const allergies = data?.allergies || [];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-medivault-900 via-medivault-800 to-medivault-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-wrap items-center justify-between gap-6 relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider font-semibold text-cyan-400">
              Welcome back to your unified record
            </span>
            <span className="font-mono text-xs text-white bg-white/10 px-2 py-0.5 rounded border border-white/20">
              {profile?.patientId}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Hello, {user?.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Your continuous lifetime health profile is synchronized across all authorized clinical care providers.
          </p>
        </div>

        {/* Profile Completion Indicator */}
        <div className="relative z-10 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 text-xs space-y-2 shrink-0">
          <div className="flex justify-between items-center gap-4">
            <span className="font-semibold text-slate-200">Health Profile</span>
            <span className="font-mono font-bold text-cyan-400">{profile?.profileCompletion || 90}%</span>
          </div>
          <div className="w-40 h-2 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-full"
              style={{ width: `${profile?.profileCompletion || 90}%` }}
            ></div>
          </div>
          <span className="text-[10px] text-slate-300 block">Blood Group: <strong>{profile?.bloodGroup || 'A+'}</strong></span>
        </div>
      </div>

      {/* Allergies Critical Banner if any severe allergy exists */}
      {allergies.length > 0 && (
        <div className="p-4 bg-rose-50/80 border border-rose-200 rounded-2xl flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <strong className="text-rose-950 font-bold block">Documented Allergies On File:</strong>
              <span className="text-rose-900 font-medium">
                {allergies.map((a) => `${a.allergyName} (${a.reaction})`).join(' • ')}
              </span>
            </div>
          </div>
          <Link to="/patient/allergies" className="text-xs font-semibold text-rose-700 hover:underline shrink-0">
            View details →
          </Link>
        </div>
      )}

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Active Conditions"
          value={counts.activeConditions || 0}
          subtitle="Managed medical conditions"
          icon={HeartPulse}
          iconBg="bg-blue-50 text-blue-600"
          trend={{ label: 'Maintained', isPositive: true }}
          onClick={() => window.location.assign('/patient/conditions')}
        />
        <StatCard
          title="Current Medications"
          value={counts.currentMedicines || 0}
          subtitle="Active prescription courses"
          icon={Pill}
          iconBg="bg-emerald-50 text-emerald-600"
          onClick={() => window.location.assign('/patient/medications')}
        />
        <StatCard
          title="Consultations"
          value={counts.totalConsultations || 0}
          subtitle="Historical clinical visits"
          icon={Stethoscope}
          iconBg="bg-purple-50 text-purple-600"
          onClick={() => window.location.assign('/patient/consultations')}
        />
        <StatCard
          title="Upcoming Visits"
          value={counts.upcomingAppointments || 0}
          subtitle="Confirmed appointments"
          icon={Calendar}
          iconBg="bg-amber-50 text-amber-600"
          onClick={() => window.location.assign('/patient/appointments')}
        />
      </div>

      {/* Quick Action Buttons Bar */}
      <div className="flex flex-wrap items-center gap-3 bg-white p-4 rounded-2xl border border-slate-100 shadow-xs">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-2">Quick Actions:</span>
        <Button variant="primary" size="sm" icon={Calendar} onClick={() => setShowBookModal(true)}>
          Book Appointment
        </Button>
        <Button variant="secondary" size="sm" icon={UploadCloud} onClick={() => setShowUploadModal(true)}>
          Upload Lab Report
        </Button>
        <Button variant="secondary" size="sm" icon={Activity} onClick={() => setShowVitalsModal(true)}>
          Record Vitals
        </Button>
        <Link to="/patient/timeline">
          <Button variant="ghost" size="sm" icon={Clock}>
            View Health Timeline
          </Button>
        </Link>
        <Link to="/patient/access-permissions">
          <Button variant="ghost" size="sm" icon={KeyRound}>
            Manage Doctor Consent
          </Button>
        </Link>
      </div>

      {/* Main Content: Vitals Chart & Active Conditions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Vitals Chart */}
        <div className="lg:col-span-8 space-y-6">
          <VitalsChart measurements={vitalsData} />

          {/* Recent Consultations Feed */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Recent Doctor Encounters</h3>
                <p className="text-xs text-slate-500">Documented consultations and clinical evaluations</p>
              </div>
              <Link to="/patient/consultations" className="text-xs font-semibold text-medivault-700 hover:underline">
                View all consultations →
              </Link>
            </div>

            {recentConsultations.length === 0 ? (
              <EmptyState
                icon={Stethoscope}
                title="No prior consultations on file"
                description="When your authorized doctors complete a visit, clinical notes will appear here."
              />
            ) : (
              <div className="divide-y divide-slate-100">
                {recentConsultations.map((c) => (
                  <div key={c._id} className="py-4 flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-slate-900">
                          {c.chiefComplaint}
                        </span>
                        <Badge variant="completed" size="sm">{c.visitType}</Badge>
                      </div>
                      <p className="text-xs text-slate-500">
                        Attending: <strong>Dr. {c.doctor?.user?.name || 'Physician'}</strong> ({c.doctor?.specialization || 'Clinical'})
                      </p>
                      {c.notes?.assessment && (
                        <p className="text-xs text-slate-600 line-clamp-1 italic">
                          "{c.notes.assessment}"
                        </p>
                      )}
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-mono text-slate-500 block">
                        {new Date(c.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      <Link
                        to="/patient/consultations"
                        className="text-xs font-medium text-cyan-600 hover:underline mt-1 block"
                      >
                        Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Medications & Upcoming Appointments */}
        <div className="lg:col-span-4 space-y-6">
          {/* Active Medications List */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900">Current Medications</h3>
              <Link to="/patient/medications" className="text-xs font-semibold text-medivault-700 hover:underline">
                All ({currentMedicines.length})
              </Link>
            </div>

            {currentMedicines.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No active medications.</p>
            ) : (
              <div className="space-y-3">
                {currentMedicines.slice(0, 4).map((m, i) => (
                  <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                      <Pill className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="text-xs font-bold text-slate-900 truncate">{m.name}</h5>
                      <p className="text-[11px] text-slate-500">{m.dosage} • {m.frequency}</p>
                      {m.instructions && (
                        <p className="text-[10px] text-slate-400 italic truncate mt-0.5">{m.instructions}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upcoming Appointments */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900">Appointments</h3>
              <Button variant="ghost" size="sm" icon={Plus} onClick={() => setShowBookModal(true)}>
                Book
              </Button>
            </div>

            {upcomingAppointments.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No upcoming appointments.</p>
            ) : (
              <div className="space-y-3">
                {upcomingAppointments.map((apt) => (
                  <div key={apt._id} className="p-3.5 bg-cyan-50/40 rounded-xl border border-cyan-100 space-y-1">
                    <div className="flex items-center justify-between">
                      <strong className="text-xs text-cyan-950 font-bold">
                        Dr. {apt.doctor?.user?.name || 'Physician'}
                      </strong>
                      <Badge variant={apt.status} size="sm">{apt.status}</Badge>
                    </div>
                    <p className="text-xs text-slate-600 font-medium">{apt.reason}</p>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-1">
                      <Calendar className="w-3.5 h-3.5 text-cyan-600" />
                      <span>{new Date(apt.date).toLocaleDateString()} at {apt.timeSlot}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showBookModal && (
        <BookAppointmentModal
          isOpen={showBookModal}
          onClose={() => setShowBookModal(false)}
          onSuccess={fetchDashboardData}
        />
      )}

      {showUploadModal && (
        <UploadReportModal
          isOpen={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          onSuccess={fetchDashboardData}
        />
      )}

      {showVitalsModal && (
        <AddVitalsModal
          isOpen={showVitalsModal}
          onClose={() => setShowVitalsModal(false)}
          onSuccess={fetchDashboardData}
        />
      )}
    </div>
  );
};

export default PatientDashboard;
