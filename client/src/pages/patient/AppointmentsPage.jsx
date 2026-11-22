import React, { useState, useEffect } from 'react';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import BookAppointmentModal from '../../components/forms/BookAppointmentModal';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { Calendar, Clock, Stethoscope, Building, Plus, X } from 'lucide-react';

export const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [showModal, setShowModal] = useState(false);

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

  const handleCancelAppointment = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this scheduled appointment?')) return;
    try {
      const res = await api.patch(`/appointments/${id}`, {
        status: 'Cancelled',
        cancellationReason: 'Cancelled by patient',
      });
      if (res.data.success) {
        toast.success('Appointment cancelled.');
        fetchAppointments();
      }
    } catch (err) {
      toast.error('Failed to cancel appointment.');
    }
  };

  const now = new Date();
  const upcoming = appointments.filter((a) => new Date(a.date) >= new Date(now.setHours(0, 0, 0, 0)));
  const past = appointments.filter((a) => new Date(a.date) < new Date(now.setHours(0, 0, 0, 0)));

  const displayList = activeTab === 'upcoming' ? upcoming : past;

  if (loading) return <LoadingSkeleton count={3} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-card flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-medivault-700">Scheduling Hub</span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">Appointments & Follow-ups</h1>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            Book consultations with verified medical doctors, manage follow-up sessions, and track scheduled visits.
          </p>
        </div>

        <Button variant="primary" size="md" icon={Plus} onClick={() => setShowModal(true)}>
          Book Doctor Appointment
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 bg-white p-3 rounded-2xl border border-slate-100">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === 'upcoming'
              ? 'bg-medivault-800 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Upcoming Appointments ({upcoming.length})
        </button>
        <button
          onClick={() => setActiveTab('past')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === 'past'
              ? 'bg-medivault-800 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Past / Completed ({past.length})
        </button>
      </div>

      {displayList.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title={`No ${activeTab} appointments`}
          description={activeTab === 'upcoming' ? 'You have no pending consultations scheduled.' : 'No past visits recorded.'}
          actionText={activeTab === 'upcoming' ? 'Book Appointment' : undefined}
          onAction={() => setShowModal(true)}
        />
      ) : (
        <div className="space-y-4">
          {displayList.map((apt) => (
            <div
              key={apt._id}
              className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-card flex flex-wrap items-start justify-between gap-4"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs font-semibold text-cyan-700 bg-cyan-50 px-2.5 py-0.5 rounded border border-cyan-200">
                    {apt.appointmentId}
                  </span>
                  <Badge variant={apt.status}>{apt.status}</Badge>
                  <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                    {apt.appointmentType}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900">{apt.reason}</h3>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
                  <span className="flex items-center gap-1 font-semibold text-slate-800">
                    <Stethoscope className="w-3.5 h-3.5 text-medivault-700" />
                    Dr. {apt.doctor?.user?.name || 'Physician'} ({apt.doctor?.specialization || 'Medicine'})
                  </span>
                  <span className="flex items-center gap-1 text-slate-500">
                    <Building className="w-3.5 h-3.5" />
                    {apt.clinic}
                  </span>
                </div>

                {apt.notes && (
                  <p className="text-xs text-slate-500 italic mt-1">Notes: {apt.notes}</p>
                )}
              </div>

              <div className="text-right space-y-2">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                  <span className="text-xs font-bold text-slate-900 block">
                    {new Date(apt.date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                  <span className="text-xs font-semibold text-cyan-700 block mt-0.5">
                    {apt.timeSlot}
                  </span>
                </div>

                {apt.status === 'Requested' || apt.status === 'Confirmed' ? (
                  <button
                    onClick={() => handleCancelAppointment(apt._id)}
                    className="text-xs text-rose-600 hover:text-rose-800 hover:underline flex items-center gap-1 ml-auto cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" /> Cancel Visit
                  </button>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <BookAppointmentModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSuccess={fetchAppointments}
        />
      )}
    </div>
  );
};

export default AppointmentsPage;
