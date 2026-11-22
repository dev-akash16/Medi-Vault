import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { Calendar, Clock, Stethoscope } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export const BookAppointmentModal = ({ isOpen, onClose, preselectedDoctorId = '', onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [doctorsList, setDoctorsList] = useState([]);
  const [doctorId, setDoctorId] = useState(preselectedDoctorId);
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('10:00 AM');
  const [appointmentType, setAppointmentType] = useState('In-person');
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    // Fetch available doctors
    const loadDoctors = async () => {
      try {
        const res = await api.get('/access/permissions');
        if (res.data.success && res.data.data.length > 0) {
          const docs = res.data.data.map((p) => p.doctor).filter(Boolean);
          setDoctorsList(docs);
          if (!doctorId && docs.length > 0) {
            setDoctorId(docs[0].doctorId || docs[0]._id);
          }
        }
      } catch (err) {
        // ignore
      }
    };
    if (isOpen) loadDoctors();
  }, [isOpen]);

  const timeSlots = [
    '09:00 AM',
    '09:30 AM',
    '10:00 AM',
    '10:30 AM',
    '11:00 AM',
    '11:30 AM',
    '02:00 PM',
    '02:30 PM',
    '03:00 PM',
    '03:30 PM',
    '04:00 PM',
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!doctorId || !date || !reason) {
      toast.error('Doctor, appointment date, and clinical reason are required.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/appointments', {
        doctorId,
        date,
        timeSlot,
        appointmentType,
        reason,
        notes,
      });

      if (res.data.success) {
        toast.success(res.data.message || 'Appointment requested successfully!');
        if (onSuccess) onSuccess(res.data.data);
        onClose();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to book appointment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Book Doctor Appointment"
      subtitle="Schedule in-person or teleconsultation with verified physician"
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <label className="block font-semibold text-slate-700 mb-1">Select Physician *</label>
          {doctorsList.length > 0 ? (
            <select
              value={doctorId}
              onChange={(e) => setDoctorId(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
            >
              {doctorsList.map((doc) => (
                <option key={doc._id} value={doc.doctorId || doc._id}>
                  Dr. {doc.user?.name || doc.name} — {doc.specialization} ({doc.clinicName})
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              placeholder="Doctor ID (e.g. MV-DOC-2026-0001)"
              value={doctorId}
              onChange={(e) => setDoctorId(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
            />
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Appointment Date *</label>
            <input
              type="date"
              required
              min={new Date().toISOString().split('T')[0]}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Time Slot *</label>
            <select
              value={timeSlot}
              onChange={(e) => setTimeSlot(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
            >
              {timeSlots.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">Consultation Mode</label>
          <div className="grid grid-cols-3 gap-2">
            {['In-person', 'Teleconsultation', 'Follow-up'].map((mode) => (
              <button
                type="button"
                key={mode}
                onClick={() => setAppointmentType(mode)}
                className={`py-2 px-3 text-center rounded-lg border font-medium transition cursor-pointer ${
                  appointmentType === mode
                    ? 'bg-medivault-800 text-white border-medivault-800'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">Reason for Visit *</label>
          <input
            type="text"
            required
            placeholder="e.g. Regular blood pressure review, persistent cough"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">Additional Notes for Doctor</label>
          <textarea
            rows={2}
            placeholder="Any recent symptoms, test results, or medications to discuss"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
          />
        </div>

        <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" loading={loading} icon={Calendar}>
            Confirm Appointment Request
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default BookAppointmentModal;
