import React, { useState, useEffect } from 'react';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { KeyRound, ShieldAlert, Check, X, Stethoscope, Building, Lock, AlertTriangle } from 'lucide-react';

export const AccessPermissionsPage = () => {
  const [permissions, setPermissions] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [permRes, reqRes] = await Promise.all([
        api.get('/access/permissions'),
        api.get('/access/requests'),
      ]);

      if (permRes.data.success) {
        setPermissions(permRes.data.data);
      }
      if (reqRes.data.success) {
        setRequests(reqRes.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApprove = async (requestId) => {
    try {
      const res = await api.post(`/access/requests/${requestId}/approve`, {});
      if (res.data.success) {
        toast.success('Access permission granted to doctor.');
        fetchData();
      }
    } catch (err) {
      toast.error('Failed to approve request.');
    }
  };

  const handleReject = async (requestId) => {
    try {
      const res = await api.post(`/access/requests/${requestId}/reject`, {
        responseNotes: 'Declined by patient',
      });
      if (res.data.success) {
        toast.success('Access request declined.');
        fetchData();
      }
    } catch (err) {
      toast.error('Failed to reject request.');
    }
  };

  const handleRevoke = async (permissionId) => {
    if (!window.confirm('Are you sure you want to revoke this doctor\'s access to your medical records? They will be immediately blocked from viewing your clinical history.')) {
      return;
    }

    try {
      const res = await api.delete(`/access/permissions/${permissionId}`);
      if (res.data.success) {
        toast.success('Doctor authorization successfully revoked.');
        fetchData();
      }
    } catch (err) {
      toast.error('Failed to revoke access.');
    }
  };

  const pendingRequests = requests.filter((r) => r.status === 'pending');

  if (loading) return <LoadingSkeleton count={3} />;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-card">
        <span className="text-xs uppercase font-bold tracking-wider text-medivault-700">Consent & Privacy Control</span>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">Doctor Access Permissions</h1>
        <p className="text-xs text-slate-500 mt-1 max-w-2xl">
          MediVault enforces strict patient-consent-based access. Only physicians you explicitly approve can view your medical history, and you can revoke access at any time with immediate effect.
        </p>
      </div>

      {/* PENDING REQUESTS SECTION */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <KeyRound className="w-5 h-5 text-amber-600" />
          <h3 className="text-lg font-bold text-slate-900">
            Pending Doctor Access Requests ({pendingRequests.length})
          </h3>
        </div>

        {pendingRequests.length === 0 ? (
          <div className="p-6 bg-white rounded-2xl border border-slate-200/80 text-center text-xs text-slate-500">
            No incoming access requests pending your review.
          </div>
        ) : (
          <div className="space-y-4">
            {pendingRequests.map((req) => (
              <div
                key={req._id}
                className="bg-amber-50/50 rounded-2xl border border-amber-200 p-6 flex flex-wrap items-start justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider bg-amber-200 text-amber-900 px-2 py-0.5 rounded">
                      Action Required
                    </span>
                    <span className="text-xs text-slate-500 font-mono">
                      Requested {new Date(req.requestedAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-slate-900">
                    Dr. {req.doctor?.user?.name || 'Physician'}
                  </h4>

                  <p className="text-xs text-slate-600">
                    Specialization: <strong>{req.doctor?.specialization}</strong> • Clinic: <strong>{req.doctor?.clinicName || 'MediVault Clinic'}</strong>
                  </p>

                  <div className="p-3 bg-white rounded-xl border border-amber-200/60 text-xs text-slate-800">
                    <strong>Stated Clinical Reason: </strong>
                    <span className="italic text-slate-700">"{req.reason}"</span>
                  </div>

                  <div className="flex flex-wrap gap-1 pt-1">
                    <span className="text-[10px] text-slate-500 mr-1 self-center">Requested scopes:</span>
                    {req.requestedScopes?.map((scope, idx) => (
                      <span key={idx} className="text-[10px] bg-slate-200/80 text-slate-800 px-2 py-0.5 rounded-full font-mono">
                        {scope}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-center">
                  <Button
                    variant="primary"
                    size="sm"
                    icon={Check}
                    onClick={() => handleApprove(req._id)}
                  >
                    Grant Consent
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={X}
                    className="text-rose-600 hover:bg-rose-50"
                    onClick={() => handleReject(req._id)}
                  >
                    Decline
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ACTIVE AUTHORIZED DOCTORS SECTION */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Lock className="w-5 h-5 text-emerald-600" />
          <h3 className="text-lg font-bold text-slate-900">
            Currently Authorized Doctors ({permissions.length})
          </h3>
        </div>

        {permissions.length === 0 ? (
          <EmptyState
            icon={KeyRound}
            title="No authorized doctors"
            description="When you grant permission to a doctor, they will be listed here with options to manage or revoke access."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {permissions.map((perm) => (
              <div
                key={perm._id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-card p-6 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-bold text-slate-900">
                          Dr. {perm.doctor?.user?.name || 'Physician'}
                        </h4>
                        <Badge variant="verified">Authorized</Badge>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {perm.doctor?.specialization} • {perm.doctor?.clinicName || 'Clinic'}
                      </p>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600 space-y-1">
                    <div>
                      <strong>Granted on: </strong>
                      {new Date(perm.grantedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </div>
                    <div>
                      <strong>Permitted Scopes: </strong>
                      <span className="text-slate-500 font-mono text-[11px]">
                        {perm.scopes?.join(', ') || 'All clinical records'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">Doctor ID: {perm.doctor?.doctorId}</span>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleRevoke(perm._id)}
                  >
                    Revoke Access
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AccessPermissionsPage;
