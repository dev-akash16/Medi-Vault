import React, { useState, useEffect } from 'react';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { Calendar, Check, X, Clock, User, Phone, CheckCircle2 } from 'lucide-react';

export const DoctorAppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  const fetchAppointments = async () => {
    try {
      const res = await api.get('/appointments');
      if (res.data.success) {
        setAppointments(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      const res = await api.patch(`/appointments/${id}`, { status });
      if (res.data.success) {
        toast.success(`Appointment marked as ${status}.`);
        fetchAppointments();
      }
    } catch (err) {
      toast.error('Failed to update appointment status.');
    }
  };

  const statuses = ['All', 'Requested', 'Confirmed', 'Completed', 'Cancelled'];

  const filtered = appointments.filter((a) => {
    if (filter === 'All') return true;
    return a.status.toLowerCase() === filter.toLowerCase();
  });

  if (loading) return <LoadingSkeleton count={3} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-card">
        <span className="text-xs uppercase font-bold tracking-wider text-medivault-700">Practice Calendar</span>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">Doctor Appointments Schedule</h1>
        <p className="text-xs text-slate-500 mt-1 max-w-xl">
          Review incoming patient consultation requests, confirm upcoming visits, and update clinical statuses.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 bg-white p-3 rounded-2xl border border-slate-100">
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
              filter === s
                ? 'bg-medivault-800 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No appointments match filter"
          description="Appointments requested by patients will appear here for confirmation."
        />
      ) : (
        <div className="space-y-4">
          {filtered.map((apt) => (
            <div
              key={apt._id}
              className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-card flex flex-wrap items-center justify-between gap-4"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-cyan-700 bg-cyan-50 px-2.5 py-0.5 rounded border border-cyan-200">
                    {apt.appointmentId}
                  </span>
                  <Badge variant={apt.status}>{apt.status}</Badge>
                  <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                    {apt.appointmentType}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900">
                  {apt.patient?.user?.name || 'Patient'}{' '}
                  <span className="text-xs font-mono font-normal text-slate-400">({apt.patient?.patientId})</span>
                </h3>

                <p className="text-xs text-slate-600">
                  Reason: <strong>{apt.reason}</strong>
                </p>

                {apt.notes && (
                  <p className="text-xs text-slate-500 italic">Patient note: {apt.notes}</p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row items-end sm:items-center gap-4">
                <div className="text-right p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-xs font-bold text-slate-900 block">
                    {new Date(apt.date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                  <span className="text-xs font-semibold text-cyan-700 block">
                    {apt.timeSlot}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {apt.status === 'Requested' && (
                    <Button
                      variant="primary"
                      size="sm"
                      icon={Check}
                      onClick={() => handleUpdateStatus(apt._id, 'Confirmed')}
                    >
                      Confirm
                    </Button>
                  )}
                  {apt.status === 'Confirmed' && (
                    <Button
                      variant="teal"
                      size="sm"
                      icon={CheckCircle2}
                      onClick={() => handleUpdateStatus(apt._id, 'Completed')}
                    >
                      Mark Completed
                    </Button>
                  )}
                  {apt.status !== 'Cancelled' && apt.status !== 'Completed' && (
                    <Button
                      variant="secondary"
                      size="sm"
                      className="text-rose-600 hover:bg-rose-50"
                      icon={X}
                      onClick={() => handleUpdateStatus(apt._id, 'Cancelled')}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorAppointmentsPage;
