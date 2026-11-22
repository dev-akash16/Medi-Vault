import React, { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { Plus, Trash2, Activity, Stethoscope, Pill, AlertCircle } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export const NewConsultationModal = ({ isOpen, onClose, patientId, patientName, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(1);

  // Form state
  const [visitType, setVisitType] = useState('In-person');
  const [chiefComplaint, setChiefComplaint] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [symptomDuration, setSymptomDuration] = useState('');

  // Vitals
  const [vitals, setVitals] = useState({
    temperature: '',
    systolicBP: '',
    diastolicBP: '',
    heartRate: '',
    respiratoryRate: '',
    oxygenSaturation: '',
    height: '',
    weight: '',
  });

  // Diagnoses
  const [diagnoses, setDiagnoses] = useState([
    { name: '', code: '', description: '', severity: 'Moderate', type: 'Primary' },
  ]);

  // Notes
  const [notes, setNotes] = useState({
    clinicalNotes: '',
    assessment: '',
    treatmentPlan: '',
    precautions: '',
    lifestyleRecommendations: '',
    warningSigns: '',
    followUpInstructions: '',
  });

  // Prescriptions
  const [includePrescription, setIncludePrescription] = useState(false);
  const [medicines, setMedicines] = useState([
    {
      name: '',
      dosage: '',
      dosageForm: 'Tablet',
      frequency: 'Once daily',
      route: 'Oral',
      duration: '7 days',
      timing: 'After meals',
      instructions: '',
    },
  ]);

  const [followUpDate, setFollowUpDate] = useState('');
  const [updateCondition, setUpdateCondition] = useState(true);

  // BMI calculation
  const calculateBMI = () => {
    if (vitals.height && vitals.weight) {
      const hM = Number(vitals.height) / 100;
      if (hM > 0) return (Number(vitals.weight) / (hM * hM)).toFixed(1);
    }
    return null;
  };

  const handleAddDiagnosis = () => {
    setDiagnoses([
      ...diagnoses,
      { name: '', code: '', description: '', severity: 'Moderate', type: 'Secondary' },
    ]);
  };

  const handleRemoveDiagnosis = (index) => {
    setDiagnoses(diagnoses.filter((_, i) => i !== index));
  };

  const handleAddMedicine = () => {
    setMedicines([
      ...medicines,
      {
        name: '',
        dosage: '',
        dosageForm: 'Tablet',
        frequency: 'Once daily',
        route: 'Oral',
        duration: '7 days',
        timing: 'After meals',
        instructions: '',
      },
    ]);
  };

  const handleRemoveMedicine = (index) => {
    setMedicines(medicines.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!chiefComplaint.trim()) {
      toast.error('Chief complaint is required.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        patientId,
        visitType,
        chiefComplaint,
        symptoms,
        symptomDuration,
        observations: {
          vitals: {
            ...vitals,
            temperature: vitals.temperature ? Number(vitals.temperature) : null,
            systolicBP: vitals.systolicBP ? Number(vitals.systolicBP) : null,
            diastolicBP: vitals.diastolicBP ? Number(vitals.diastolicBP) : null,
            heartRate: vitals.heartRate ? Number(vitals.heartRate) : null,
            respiratoryRate: vitals.respiratoryRate ? Number(vitals.respiratoryRate) : null,
            oxygenSaturation: vitals.oxygenSaturation ? Number(vitals.oxygenSaturation) : null,
            height: vitals.height ? Number(vitals.height) : null,
            weight: vitals.weight ? Number(vitals.weight) : null,
            bmi: calculateBMI() ? Number(calculateBMI()) : null,
          },
        },
        diagnoses: diagnoses.filter((d) => d.name.trim() !== ''),
        notes,
        followUpDate: followUpDate || null,
        updateCondition,
      };

      if (includePrescription) {
        payload.prescriptions = {
          medicines: medicines.filter((m) => m.name.trim() !== ''),
          generalInstructions: notes.treatmentPlan,
        };
      }

      const res = await api.post('/consultations', payload);
      if (res.data.success) {
        toast.success(res.data.message || 'Consultation completed and permanently documented.');
        if (onSuccess) onSuccess(res.data.data);
        onClose();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to complete consultation.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Clinical Consultation: ${patientName || patientId}`}
      subtitle="Complete permanent clinical record creation"
      maxWidth="max-w-4xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step Tabs */}
        <div className="flex border-b border-slate-200 text-xs font-semibold gap-4 pb-2">
          <button
            type="button"
            onClick={() => setActiveStep(1)}
            className={`cursor-pointer ${
              activeStep === 1 ? 'text-medivault-800 border-b-2 border-medivault-800 pb-2 -mb-2.5 font-bold' : 'text-slate-400'
            }`}
          >
            1. Clinical Assessment & Vitals
          </button>
          <button
            type="button"
            onClick={() => setActiveStep(2)}
            className={`cursor-pointer ${
              activeStep === 2 ? 'text-medivault-800 border-b-2 border-medivault-800 pb-2 -mb-2.5 font-bold' : 'text-slate-400'
            }`}
          >
            2. Diagnoses & Treatment Plan
          </button>
          <button
            type="button"
            onClick={() => setActiveStep(3)}
            className={`cursor-pointer ${
              activeStep === 3 ? 'text-medivault-800 border-b-2 border-medivault-800 pb-2 -mb-2.5 font-bold' : 'text-slate-400'
            }`}
          >
            3. Prescription & Follow-up
          </button>
        </div>

        {/* STEP 1: Assessment & Vitals */}
        {activeStep === 1 && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Visit Type *</label>
                <select
                  value={visitType}
                  onChange={(e) => setVisitType(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white"
                >
                  <option value="In-person">In-person</option>
                  <option value="Follow-up">Follow-up</option>
                  <option value="Teleconsultation">Teleconsultation</option>
                  <option value="Emergency visit">Emergency visit</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Symptom Duration</label>
                <input
                  type="text"
                  placeholder="e.g. 3 days, 2 weeks"
                  value={symptomDuration}
                  onChange={(e) => setSymptomDuration(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Chief Complaint *</label>
              <input
                type="text"
                required
                placeholder="Primary medical reason for visit"
                value={chiefComplaint}
                onChange={(e) => setChiefComplaint(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Symptoms Description</label>
              <textarea
                rows={2}
                placeholder="Detailed presenting symptoms and patient statements"
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white"
              />
            </div>

            {/* Vitals Grid */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <h5 className="font-bold text-slate-800 text-xs mb-3 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-medivault-700" /> Objective Examination Vitals
              </h5>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-slate-500 text-[11px] mb-0.5">Systolic BP (mmHg)</label>
                  <input
                    type="number"
                    placeholder="120"
                    value={vitals.systolicBP}
                    onChange={(e) => setVitals({ ...vitals, systolicBP: e.target.value })}
                    className="w-full p-2 bg-white border border-slate-200 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 text-[11px] mb-0.5">Diastolic BP (mmHg)</label>
                  <input
                    type="number"
                    placeholder="80"
                    value={vitals.diastolicBP}
                    onChange={(e) => setVitals({ ...vitals, diastolicBP: e.target.value })}
                    className="w-full p-2 bg-white border border-slate-200 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 text-[11px] mb-0.5">Heart Rate (bpm)</label>
                  <input
                    type="number"
                    placeholder="72"
                    value={vitals.heartRate}
                    onChange={(e) => setVitals({ ...vitals, heartRate: e.target.value })}
                    className="w-full p-2 bg-white border border-slate-200 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 text-[11px] mb-0.5">Temperature (°F)</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="98.6"
                    value={vitals.temperature}
                    onChange={(e) => setVitals({ ...vitals, temperature: e.target.value })}
                    className="w-full p-2 bg-white border border-slate-200 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 text-[11px] mb-0.5">Oxygen SpO2 (%)</label>
                  <input
                    type="number"
                    placeholder="98"
                    value={vitals.oxygenSaturation}
                    onChange={(e) => setVitals({ ...vitals, oxygenSaturation: e.target.value })}
                    className="w-full p-2 bg-white border border-slate-200 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 text-[11px] mb-0.5">Height (cm)</label>
                  <input
                    type="number"
                    placeholder="170"
                    value={vitals.height}
                    onChange={(e) => setVitals({ ...vitals, height: e.target.value })}
                    className="w-full p-2 bg-white border border-slate-200 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 text-[11px] mb-0.5">Weight (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="70"
                    value={vitals.weight}
                    onChange={(e) => setVitals({ ...vitals, weight: e.target.value })}
                    className="w-full p-2 bg-white border border-slate-200 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 text-[11px] mb-0.5">Calculated BMI</label>
                  <div className="p-2 bg-slate-100 rounded-md font-mono font-bold text-slate-800">
                    {calculateBMI() || '—'}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button variant="primary" size="sm" onClick={() => setActiveStep(2)}>
                Next: Diagnoses & Notes →
              </Button>
            </div>
          </div>
        )}

        {/* STEP 2: Diagnoses & Notes */}
        {activeStep === 2 && (
          <div className="space-y-4 text-xs">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="font-semibold text-slate-800 text-sm">Clinical Diagnoses</label>
                <button
                  type="button"
                  onClick={handleAddDiagnosis}
                  className="text-xs text-medivault-700 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Another Diagnosis
                </button>
              </div>

              <div className="space-y-3">
                {diagnoses.map((d, index) => (
                  <div key={index} className="p-3 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-4 gap-2">
                    <div className="sm:col-span-2">
                      <label className="block text-slate-500 text-[11px] mb-0.5">Diagnosis Name *</label>
                      <input
                        type="text"
                        placeholder="e.g. Essential Hypertension"
                        value={d.name}
                        onChange={(e) => {
                          const copy = [...diagnoses];
                          copy[index].name = e.target.value;
                          setDiagnoses(copy);
                        }}
                        className="w-full p-2 bg-white border border-slate-200 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 text-[11px] mb-0.5">Severity</label>
                      <select
                        value={d.severity}
                        onChange={(e) => {
                          const copy = [...diagnoses];
                          copy[index].severity = e.target.value;
                          setDiagnoses(copy);
                        }}
                        className="w-full p-2 bg-white border border-slate-200 rounded-md"
                      >
                        <option value="Mild">Mild</option>
                        <option value="Moderate">Moderate</option>
                        <option value="Severe">Severe</option>
                        <option value="Critical">Critical</option>
                      </select>
                    </div>
                    <div className="flex items-end gap-1">
                      <div className="flex-1">
                        <label className="block text-slate-500 text-[11px] mb-0.5">Type</label>
                        <select
                          value={d.type}
                          onChange={(e) => {
                            const copy = [...diagnoses];
                            copy[index].type = e.target.value;
                            setDiagnoses(copy);
                          }}
                          className="w-full p-2 bg-white border border-slate-200 rounded-md"
                        >
                          <option value="Primary">Primary</option>
                          <option value="Secondary">Secondary</option>
                          <option value="Differential">Differential</option>
                        </select>
                      </div>
                      {diagnoses.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveDiagnosis(index)}
                          className="p-2 text-rose-500 hover:bg-rose-50 rounded-md cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Clinical Assessment / Notes</label>
                <textarea
                  rows={3}
                  placeholder="Doctor assessment of patient physical status"
                  value={notes.clinicalNotes}
                  onChange={(e) => setNotes({ ...notes, clinicalNotes: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Treatment Plan</label>
                <textarea
                  rows={3}
                  placeholder="Recommended treatment, therapeutic path, therapy"
                  value={notes.treatmentPlan}
                  onChange={(e) => setNotes({ ...notes, treatmentPlan: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Precautions & Advice</label>
                <textarea
                  rows={2}
                  placeholder="Precautions and activity warnings"
                  value={notes.precautions}
                  onChange={(e) => setNotes({ ...notes, precautions: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Warning Signs to Monitor</label>
                <textarea
                  rows={2}
                  placeholder="Red flags requiring emergency care"
                  value={notes.warningSigns}
                  onChange={(e) => setNotes({ ...notes, warningSigns: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                />
              </div>
            </div>

            <div className="flex justify-between pt-2">
              <Button variant="secondary" size="sm" onClick={() => setActiveStep(1)}>
                ← Back
              </Button>
              <Button variant="primary" size="sm" onClick={() => setActiveStep(3)}>
                Next: Prescribe & Finalize →
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3: Prescriptions & Finalize */}
        {activeStep === 3 && (
          <div className="space-y-4 text-xs">
            {/* Include Prescription Toggle */}
            <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl">
              <label className="flex items-center gap-2 cursor-pointer font-bold text-emerald-950 text-sm">
                <input
                  type="checkbox"
                  checked={includePrescription}
                  onChange={(e) => setIncludePrescription(e.target.checked)}
                  className="w-4 h-4 rounded text-medivault-800"
                />
                Issue New Electronic Prescription with Consultation
              </label>
              <p className="text-[11px] text-emerald-800 mt-1 ml-6">
                Directly registers an electronic prescription linked to this clinical encounter.
              </p>
            </div>

            {includePrescription && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-800">Prescribed Medications</span>
                  <button
                    type="button"
                    onClick={handleAddMedicine}
                    className="text-xs text-medivault-700 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Medication
                  </button>
                </div>

                {medicines.map((m, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div className="col-span-2">
                      <label className="block text-[11px] text-slate-500 mb-0.5">Medicine Name *</label>
                      <input
                        type="text"
                        placeholder="e.g. Amoxicillin, Lisinopril"
                        value={m.name}
                        onChange={(e) => {
                          const copy = [...medicines];
                          copy[idx].name = e.target.value;
                          setMedicines(copy);
                        }}
                        className="w-full p-2 bg-white border border-slate-200 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-500 mb-0.5">Dosage / Strength</label>
                      <input
                        type="text"
                        placeholder="e.g. 500 mg"
                        value={m.dosage}
                        onChange={(e) => {
                          const copy = [...medicines];
                          copy[idx].dosage = e.target.value;
                          setMedicines(copy);
                        }}
                        className="w-full p-2 bg-white border border-slate-200 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-500 mb-0.5">Frequency</label>
                      <select
                        value={m.frequency}
                        onChange={(e) => {
                          const copy = [...medicines];
                          copy[idx].frequency = e.target.value;
                          setMedicines(copy);
                        }}
                        className="w-full p-2 bg-white border border-slate-200 rounded-md"
                      >
                        <option value="Once daily">Once daily</option>
                        <option value="Twice daily">Twice daily</option>
                        <option value="Thrice daily">Thrice daily</option>
                        <option value="Every 8 hours">Every 8 hours</option>
                        <option value="As needed">As needed</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-500 mb-0.5">Duration</label>
                      <input
                        type="text"
                        placeholder="e.g. 10 days"
                        value={m.duration}
                        onChange={(e) => {
                          const copy = [...medicines];
                          copy[idx].duration = e.target.value;
                          setMedicines(copy);
                        }}
                        className="w-full p-2 bg-white border border-slate-200 rounded-md"
                      />
                    </div>
                    <div className="col-span-2 sm:col-span-3 flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Food instructions: e.g. After meals with plenty of water"
                        value={m.instructions}
                        onChange={(e) => {
                          const copy = [...medicines];
                          copy[idx].instructions = e.target.value;
                          setMedicines(copy);
                        }}
                        className="w-full p-2 bg-white border border-slate-200 rounded-md"
                      />
                      {medicines.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveMedicine(idx)}
                          className="p-2 text-rose-500 hover:bg-rose-50 rounded-md"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Follow-up & Condition Update */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Follow-up Schedule Date</label>
                <input
                  type="date"
                  value={followUpDate}
                  onChange={(e) => setFollowUpDate(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                />
              </div>

              <div className="flex items-center pt-6">
                <label className="flex items-center gap-2 text-slate-700 cursor-pointer font-medium">
                  <input
                    type="checkbox"
                    checked={updateCondition}
                    onChange={(e) => setUpdateCondition(e.target.checked)}
                    className="w-4 h-4 rounded text-medivault-800"
                  />
                  Automatically add primary diagnosis to active patient conditions
                </label>
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-slate-200">
              <Button variant="secondary" size="sm" onClick={() => setActiveStep(2)}>
                ← Back
              </Button>
              <Button variant="primary" type="submit" loading={loading} icon={Stethoscope}>
                Complete & Document Consultation
              </Button>
            </div>
          </div>
        )}
      </form>
    </Modal>
  );
};

export default NewConsultationModal;
