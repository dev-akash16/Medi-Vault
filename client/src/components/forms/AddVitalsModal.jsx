import React, { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { Activity } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export const AddVitalsModal = ({ isOpen, onClose, patientId, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [systolicBP, setSystolicBP] = useState('');
  const [diastolicBP, setDiastolicBP] = useState('');
  const [heartRate, setHeartRate] = useState('');
  const [temperature, setTemperature] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [oxygenSaturation, setOxygenSaturation] = useState('');
  const [bloodGlucose, setBloodGlucose] = useState('');
  const [source, setSource] = useState('Home Device');
  const [notes, setNotes] = useState('');

  const calculateBMI = () => {
    if (height && weight) {
      const hM = Number(height) / 100;
      if (hM > 0) return (Number(weight) / (hM * hM)).toFixed(1);
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!systolicBP && !heartRate && !weight && !bloodGlucose) {
      toast.error('Please input at least one measurement metric.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/vitals', {
        patientId,
        systolicBP,
        diastolicBP,
        heartRate,
        temperature,
        weight,
        height,
        oxygenSaturation,
        bloodGlucose,
        source,
        notes,
      });

      if (res.data.success) {
        toast.success('Health vitals recorded successfully!');
        if (onSuccess) onSuccess(res.data.data);
        onClose();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to record vitals.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Record Health Vitals"
      subtitle="Log physical measurements and health metrics"
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Systolic BP (mmHg)</label>
            <input
              type="number"
              placeholder="e.g. 120"
              value={systolicBP}
              onChange={(e) => setSystolicBP(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Diastolic BP (mmHg)</label>
            <input
              type="number"
              placeholder="e.g. 80"
              value={diastolicBP}
              onChange={(e) => setDiastolicBP(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Heart Rate (bpm)</label>
            <input
              type="number"
              placeholder="e.g. 72"
              value={heartRate}
              onChange={(e) => setHeartRate(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Temperature (°F)</label>
            <input
              type="number"
              step="0.1"
              placeholder="e.g. 98.6"
              value={temperature}
              onChange={(e) => setTemperature(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Weight (kg)</label>
            <input
              type="number"
              step="0.1"
              placeholder="e.g. 68"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Height (cm)</label>
            <input
              type="number"
              placeholder="e.g. 172"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Oxygen SpO2 (%)</label>
            <input
              type="number"
              placeholder="e.g. 99"
              value={oxygenSaturation}
              onChange={(e) => setOxygenSaturation(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Blood Glucose (mg/dL)</label>
            <input
              type="number"
              placeholder="e.g. 95"
              value={bloodGlucose}
              onChange={(e) => setBloodGlucose(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
            />
          </div>
        </div>

        {calculateBMI() && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
            <span className="font-semibold text-blue-900">Calculated Body Mass Index (BMI):</span>
            <span className="font-mono text-base font-bold text-blue-900">{calculateBMI()}</span>
          </div>
        )}

        <div>
          <label className="block font-semibold text-slate-700 mb-1">Measurement Source</label>
          <select
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
          >
            <option value="Home Device">Home Device (Digital BP Monitor / Smart Scale)</option>
            <option value="Wearable">Wearable Device (Apple Watch, Garmin, Whoop)</option>
            <option value="Clinical Exam">Clinical Exam / Healthcare Facility</option>
            <option value="Manual Entry">Manual Entry</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">Notes / Context</label>
          <input
            type="text"
            placeholder="e.g. Fasting morning measurement, after exercise"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
          />
        </div>

        <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" loading={loading} icon={Activity}>
            Save Measurement
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddVitalsModal;
