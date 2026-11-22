import React, { useState, useEffect } from 'react';
import StatCard from '../../components/common/StatCard';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import api from '../../services/api';
import { Link, useNavigate } from 'react-router-dom';
import {
  Users,
  Stethoscope,
  CheckCircle2,
  AlertCircle,
  FileText,
  Activity,
  Calendar,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const res = await api.get('/admin/dashboard');
        if (res.data.success) {
          setStats(res.data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminStats();
  }, []);

  if (loading) return <LoadingSkeleton count={6} />;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-medivault-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-wrap items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider font-semibold text-cyan-400">
              Platform Administration & Governance
            </span>
            <span className="text-xs bg-purple-900/60 text-purple-300 font-mono px-2 py-0.5 rounded border border-purple-800">
              SECURE AUDITED OVERSIGHT
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            MediVault System Operations Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Monitor healthcare provider verifications, account statuses, and system audit logs. Sensitive clinical patient data remains strictly protected by role-based consent.
          </p>
        </div>

        {stats?.pendingDoctors > 0 && (
          <div className="bg-amber-500/20 border border-amber-400/40 p-4 rounded-2xl text-xs space-y-2 text-right">
            <span className="text-amber-300 font-bold block">
              {stats.pendingDoctors} Doctor Verification{stats.pendingDoctors > 1 ? 's' : ''} Pending
            </span>
            <Link to="/admin/verifications">
              <Button variant="primary" size="sm" icon={CheckCircle2}>
                Review Credentials
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Registered Patients"
          value={stats?.totalPatients || 0}
          subtitle="Patient health identities"
          icon={Users}
          iconBg="bg-blue-50 text-blue-600"
          onClick={() => navigate('/admin/users?role=patient')}
        />
        <StatCard
          title="Verified Doctors"
          value={stats?.verifiedDoctors || 0}
          subtitle={`${stats?.pendingDoctors || 0} pending review`}
          icon={Stethoscope}
          iconBg="bg-teal-50 text-teal-600"
          onClick={() => navigate('/admin/verifications')}
        />
        <StatCard
          title="Clinical Consultations"
          value={stats?.totalConsultations || 0}
          subtitle="Permanent documented encounters"
          icon={Activity}
          iconBg="bg-purple-50 text-purple-600"
        />
        <StatCard
          title="Platform Appointments"
          value={stats?.totalAppointments || 0}
          subtitle="Scheduled clinical visits"
          icon={Calendar}
          iconBg="bg-amber-50 text-amber-600"
        />
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/admin/users"
          className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-card hover:shadow-hover transition duration-200 flex flex-col justify-between space-y-4"
        >
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-slate-900">User Account Management</h4>
            <p className="text-xs text-slate-500">
              Manage patient and doctor user accounts, review account statuses, and activate or suspend accounts.
            </p>
          </div>
          <span className="text-xs font-bold text-medivault-700 flex items-center gap-1">
            Manage Users <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </Link>

        <Link
          to="/admin/verifications"
          className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-card hover:shadow-hover transition duration-200 flex flex-col justify-between space-y-4"
        >
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-slate-900">Doctor Credential Verification</h4>
            <p className="text-xs text-slate-500">
              Authenticate physician medical registration numbers, specialization credentials, and activate verified badges.
            </p>
          </div>
          <span className="text-xs font-bold text-medivault-700 flex items-center gap-1">
            Review Verifications <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </Link>

        <Link
          to="/admin/audit-logs"
          className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-card hover:shadow-hover transition duration-200 flex flex-col justify-between space-y-4"
        >
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-slate-900">System Audit Trail</h4>
            <p className="text-xs text-slate-500">
              Inspect immutable security event records, consent authorizations, clinical exports, and login sessions.
            </p>
          </div>
          <span className="text-xs font-bold text-medivault-700 flex items-center gap-1">
            View Audit Logs <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </Link>
      </div>

      {/* Recent Audit Events Stream */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Recent Platform Security Audit Events</h3>
            <p className="text-xs text-slate-500">Immutable chronological log of platform operations</p>
          </div>
          <Link to="/admin/audit-logs" className="text-xs font-semibold text-medivault-700 hover:underline">
            All audit logs →
          </Link>
        </div>

        {stats?.recentAuditLogs?.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center">No audit events recorded yet.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {stats.recentAuditLogs.map((log) => (
              <div key={log._id} className="py-3 flex items-center justify-between gap-4 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                      {log.action}
                    </span>
                    <Badge variant={log.actorRole} size="sm">{log.actorRole}</Badge>
                    <span className="text-slate-600 font-semibold">{log.actorName}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">{log.purpose}</p>
                </div>

                <div className="text-right text-[11px] text-slate-400 whitespace-nowrap">
                  <span>{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  <span className="block text-[10px]">{new Date(log.timestamp).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
