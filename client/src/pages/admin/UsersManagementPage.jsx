import React, { useState, useEffect } from 'react';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { Users, Search, ShieldCheck, ShieldAlert, Check, X, Filter } from 'lucide-react';

export const UsersManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchUsers = async () => {
    try {
      const res = await api.get(`/admin/users?role=${roleFilter}&status=${statusFilter}&search=${encodeURIComponent(search)}`);
      if (res.data.success) {
        setUsers(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter, statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  const handleToggleStatus = async (user) => {
    const nextStatus = user.accountStatus === 'active' ? 'suspended' : 'active';
    const actionLabel = nextStatus === 'suspended' ? 'suspend' : 'reactivate';

    if (!window.confirm(`Are you sure you want to ${actionLabel} the account for ${user.name}?`)) {
      return;
    }

    try {
      const res = await api.patch(`/admin/users/${user._id}/status`, { status: nextStatus });
      if (res.data.success) {
        toast.success(`User ${user.name} is now ${nextStatus}.`);
        fetchUsers();
      }
    } catch (err) {
      toast.error('Failed to update user status.');
    }
  };

  if (loading) return <LoadingSkeleton count={4} type="table" />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-card">
        <span className="text-xs uppercase font-bold tracking-wider text-medivault-700">Account Oversight</span>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">Platform User Management</h1>
        <p className="text-xs text-slate-500 mt-1 max-w-xl">
          Search, audit, and regulate patient, physician, and administrative accounts on MediVault.
        </p>

        {/* Filter bar */}
        <form onSubmit={handleSearchSubmit} className="mt-6 flex flex-wrap gap-3 text-xs">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search user name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
          >
            <option value="all">All Roles</option>
            <option value="patient">Patients</option>
            <option value="doctor">Doctors</option>
            <option value="admin">Administrators</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="suspended">Suspended Only</option>
          </select>

          <Button variant="primary" size="sm" type="submit">
            Apply Filters
          </Button>
        </form>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-card overflow-hidden">
        {users.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No matching users found"
            description="Adjust your search query or filter options."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50/70">
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Healthcare Identifier</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Joined Date</th>
                  <th className="py-3 px-4 text-right">Administrative Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{u.name}</div>
                      <div className="text-[11px] text-slate-400">{u.email}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-cyan-700">
                      {u.identifier || '—'}
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant={u.role}>{u.role}</Badge>
                      {u.specialization && (
                        <span className="block text-[10px] text-slate-500 mt-0.5">{u.specialization}</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant={u.accountStatus}>{u.accountStatus}</Badge>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {u.role !== 'admin' && (
                        <button
                          onClick={() => handleToggleStatus(u)}
                          className={`text-xs font-bold px-3 py-1 rounded-lg transition cursor-pointer ${
                            u.accountStatus === 'active'
                              ? 'text-rose-600 hover:bg-rose-50 border border-rose-200'
                              : 'text-emerald-700 hover:bg-emerald-50 border border-emerald-200'
                          }`}
                        >
                          {u.accountStatus === 'active' ? 'Suspend' : 'Reactivate'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersManagementPage;
