import React, { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { Pill, Plus, Trash2 } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export const NewPrescriptionModal = ({ isOpen, onClose, patientId, patientName, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [diagnosisName, setDiagnosisName] = useState('');
  const [generalInstructions, setGeneralInstructions] = useState('');
  const [medicines, setMedicines] = useState([
    {
      name: '',
      brandName: '',
      dosage: '',
      dosageForm: 'Tablet',
      frequency: 'Once daily',
      route: 'Oral',
      duration: '14 days',
      timing: 'After meals',
      instructions: '',
      refills: 0,
    },
  ]);

  const handleAddMed = () => {
    setMedicines([
      ...medicines,
      {
        name: '',
        brandName: '',
        dosage: '',
        dosageForm: 'Tablet',
        frequency: 'Once daily',
        route: 'Oral',
        duration: '14 days',
        timing: 'After meals',
        instructions: '',
        refills: 0,
      },
    ]);
  };

  const handleRemoveMed = (i) => {
    setMedicines(medicines.filter((_, idx) => idx !== i));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!diagnosisName) {
      toast.error('Diagnosis / clinical reason is required.');
      return;
    }

    const validMeds = medicines.filter((m) => m.name.trim() !== '');
    if (validMeds.length === 0) {
      toast.error('Please specify at least one medication.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/prescriptions', {
        patientId,
        diagnosisName,
        medicines: validMeds,
        generalInstructions,
      });

      if (res.data.success) {
        toast.success(res.data.message || 'Prescription created successfully!');
        if (onSuccess) onSuccess(res.data.data);
        onClose();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create prescription.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Issue Prescription: ${patientName || patientId}`}
      subtitle="Electronic Prescription Builder"
      maxWidth="max-w-3xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5 text-xs">
        <div>
          <label className="block font-semibold text-slate-700 mb-1">Clinical Diagnosis / Indication *</label>
          <input
            type="text"
            required
            placeholder="e.g. Essential Hypertension, Bronchial Asthma"
            value={diagnosisName}
            onChange={(e) => setDiagnosisName(e.target.value)}
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-slate-800 text-sm">Medications List</span>
            <button
              type="button"
              onClick={handleAddMed}
              className="text-xs text-medivault-700 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Add Medication
            </button>
          </div>

          <div className="space-y-3">
            {medicines.map((m, idx) => (
              <div key={idx} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] text-slate-500 mb-0.5">Medicine Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Lisinopril, Metformin"
                      value={m.name}
                      onChange={(e) => {
                        const copy = [...medicines];
                        copy[idx].name = e.target.value;
                        setMedicines(copy);
                      }}
                      className="w-full p-2 bg-white border border-slate-200 rounded-md font-medium text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-0.5">Brand / Trade Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Prinivil"
                      value={m.brandName}
                      onChange={(e) => {
                        const copy = [...medicines];
                        copy[idx].brandName = e.target.value;
                        setMedicines(copy);
                      }}
                      className="w-full p-2 bg-white border border-slate-200 rounded-md"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-0.5">Dosage</label>
                    <input
                      type="text"
                      placeholder="e.g. 10 mg"
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
                    <label className="block text-[11px] text-slate-500 mb-0.5">Dosage Form</label>
                    <select
                      value={m.dosageForm}
                      onChange={(e) => {
                        const copy = [...medicines];
                        copy[idx].dosageForm = e.target.value;
                        setMedicines(copy);
                      }}
                      className="w-full p-2 bg-white border border-slate-200 rounded-md"
                    >
                      <option value="Tablet">Tablet</option>
                      <option value="Capsule">Capsule</option>
                      <option value="Syrup">Syrup</option>
                      <option value="Injection">Injection</option>
                      <option value="Inhaler">Inhaler</option>
                      <option value="Drops">Drops</option>
                      <option value="Ointment">Ointment</option>
                    </select>
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
                      <option value="Four times daily">Four times daily</option>
                      <option value="As needed">As needed</option>
                      <option value="Every 8 hours">Every 8 hours</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-0.5">Duration</label>
                    <input
                      type="text"
                      placeholder="e.g. 30 days"
                      value={m.duration}
                      onChange={(e) => {
                        const copy = [...medicines];
                        copy[idx].duration = e.target.value;
                        setMedicines(copy);
                      }}
                      className="w-full p-2 bg-white border border-slate-200 rounded-md"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <label className="block text-[11px] text-slate-500 mb-0.5">Timing & Food Instructions</label>
                    <input
                      type="text"
                      placeholder="e.g. After breakfast with glass of water"
                      value={m.instructions}
                      onChange={(e) => {
                        const copy = [...medicines];
                        copy[idx].instructions = e.target.value;
                        setMedicines(copy);
                      }}
                      className="w-full p-2 bg-white border border-slate-200 rounded-md"
                    />
                  </div>
                  {medicines.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveMed(idx)}
                      className="p-2 text-rose-500 hover:bg-rose-50 rounded-md mt-4 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">General Pharmacist & Patient Notes</label>
          <textarea
            rows={2}
            placeholder="Special instructions or precautions for patient and pharmacy"
            value={generalInstructions}
            onChange={(e) => setGeneralInstructions(e.target.value)}
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
          />
        </div>

        <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" loading={loading} icon={Pill}>
            Issue Prescription
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default NewPrescriptionModal;
