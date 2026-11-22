import React, { useState, useEffect } from 'react';
import {
  FileText,
  Search,
  Filter,
  Shield,
  Clock,
  User,
  ArrowRight,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Database,
  Lock,
} from 'lucide-react';
import api from '../../services/api';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import toast from 'react-hot-toast';

export const AuditLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [roleFilter, setRoleFilter] = useState('all');
  const [actionFilter, setActionFilter] = useState('all');

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 25,
      };
      if (roleFilter !== 'all') params.role = roleFilter;
      if (actionFilter !== 'all') params.action = actionFilter;

      const res = await api.get('/admin/audit-logs', { params });
      if (res.data.success) {
        setLogs(res.data.data);
        setTotal(res.data.total);
        setPages(res.data.pages || 1);
      }
    } catch (err) {
      toast.error('Failed to load system audit logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [page, roleFilter, actionFilter]);

  const getActionBadgeVariant = (action) => {
    if (action.includes('REVOKE') || action.includes('REJECT') || action.includes('SUSPEND')) return 'danger';
    if (action.includes('GRANT') || action.includes('VERIF') || action.includes('APPROV')) return 'success';
    if (action.includes('ACCESS') || action.includes('VIEW')) return 'info';
    if (action.includes('CONSULT') || action.includes('PRESCRIPT')) return 'primary';
    return 'default';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Lock className="w-6 h-6 text-medivault-700" />
            System Audit & Compliance Logs
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Immutable HIPAA-compliant access journal tracking patient record disclosures, authorizations, and administrative actions.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 self-start sm:self-auto"
          onClick={fetchLogs}
          disabled={loading}
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh Journal
        </Button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Role:</span>
            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setPage(1);
              }}
              className="text-xs rounded-xl border-slate-200 bg-slate-50 text-slate-700 font-medium py-1.5 focus:border-medivault-500 focus:ring-medivault-500"
            >
              <option value="all">All Roles</option>
              <option value="patient">Patients</option>
              <option value="doctor">Doctors</option>
              <option value="admin">Administrators</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Action:</span>
            <select
              value={actionFilter}
              onChange={(e) => {
                setActionFilter(e.target.value);
                setPage(1);
              }}
              className="text-xs rounded-xl border-slate-200 bg-slate-50 text-slate-700 font-medium py-1.5 focus:border-medivault-500 focus:ring-medivault-500"
            >
              <option value="all">All Audit Events</option>
              <option value="LOGIN">User Logins</option>
              <option value="ACCESS_REQUESTED">Access Requests</option>
              <option value="ACCESS_GRANTED">Access Approvals</option>
              <option value="ACCESS_REVOKED">Access Revocations</option>
              <option value="CLINICAL_RECORD_ACCESSED">Clinical Record Views</option>
              <option value="CONSULTATION_CREATED">Consultations Recorded</option>
              <option value="PRESCRIPTION_ISSUED">Prescriptions Issued</option>
              <option value="DOCTOR_VERIFIED">Doctor Approvals</option>
            </select>
          </div>
        </div>

        <div className="text-xs text-slate-500 w-full md:w-auto text-right font-medium">
          Showing <span className="font-bold text-slate-800">{logs.length}</span> of <span className="font-bold text-slate-800">{total}</span> recorded events
        </div>
      </div>

      {/* Audit Log Table */}
      {loading ? (
        <LoadingSkeleton type="table" count={10} />
      ) : logs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-8">
          <EmptyState
            icon={FileText}
            title="No Matching Audit Logs"
            description="No system audit entries match your selected criteria."
          />
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Actor</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Action Event</th>
                  <th className="py-3 px-4">Target / Purpose</th>
                  <th className="py-3 px-4">Origin IP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {logs.map((log) => (
                  <tr key={log._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-4 text-slate-500 whitespace-nowrap font-mono text-[11px]">
                      {new Date(log.timestamp || log.createdAt).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}
                    </td>
                    <td className="py-3 px-4 text-slate-800 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{log.actorName || log.actor?.name || 'System Service'}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          log.actorRole === 'admin'
                            ? 'bg-purple-100 text-purple-700'
                            : log.actorRole === 'doctor'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        {log.actorRole || 'System'}
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <Badge variant={getActionBadgeVariant(log.action)}>
                        {log.action}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-slate-600 max-w-xs truncate" title={log.purpose || log.targetType}>
                      {log.purpose ? (
                        <span>{log.purpose}</span>
                      ) : (
                        <span className="text-slate-400">Target: {log.targetType || 'N/A'}</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-400 font-mono text-[11px] whitespace-nowrap">
                      {log.ipAddress || '127.0.0.1'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {pages > 1 && (
            <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Page <span className="font-semibold text-slate-800">{page}</span> of{' '}
                <span className="font-semibold text-slate-800">{pages}</span>
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page <= 1}
                  className="p-1.5"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(p + 1, pages))}
                  disabled={page >= pages}
                  className="p-1.5"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AuditLogsPage;
