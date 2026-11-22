import React from 'react';
import { Pill, Printer, Calendar, Stethoscope, AlertCircle } from 'lucide-react';
import Badge from '../common/Badge';
import Button from '../common/Button';

export const PrescriptionCard = ({ prescription, onStatusChange, isDoctor = false }) => {
  const handlePrint = () => {
    window.print();
  };

  const doctorName = prescription.doctor?.user?.name || prescription.doctor?.name || 'Physician';
  const doctorSpecialization = prescription.doctor?.specialization || 'General Medicine';
  const clinic = prescription.doctor?.clinicName || 'MediVault Partner Clinic';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-card hover:shadow-hover transition duration-200 overflow-hidden">
      {/* Header with Rx Emblem */}
      <div className="bg-gradient-to-r from-medivault-900 via-medivault-800 to-medivault-900 text-white p-5 flex items-start justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-300 font-serif font-bold text-2xl shrink-0">
            ℞
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-semibold text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                {prescription.prescriptionId}
              </span>
              <Badge variant={prescription.status}>{prescription.status}</Badge>
            </div>
            <h3 className="text-base font-bold text-white mt-1">
              Diagnosis: {prescription.diagnosisName || 'Clinical Prescription'}
            </h3>
          </div>
        </div>

        <div className="text-right flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePrint}
            icon={Printer}
            className="text-slate-300 hover:text-white hover:bg-slate-800"
          >
            Print
          </Button>
        </div>
      </div>

      {/* Doctor & Date Row */}
      <div className="px-6 py-3.5 bg-slate-50 border-b border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-2">
        <div className="flex items-center gap-2">
          <Stethoscope className="w-4 h-4 text-medivault-700" />
          <span>
            Prescribed by <strong className="text-slate-900">Dr. {doctorName}</strong> ({doctorSpecialization}) • {clinic}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-500">
          <Calendar className="w-3.5 h-3.5" />
          <span>
            {new Date(prescription.prescriptionDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
        </div>
      </div>

      {/* Medicines Table */}
      <div className="p-6 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50/50">
              <th className="py-2.5 px-3">Medication</th>
              <th className="py-2.5 px-3">Dosage / Form</th>
              <th className="py-2.5 px-3">Frequency</th>
              <th className="py-2.5 px-3">Duration</th>
              <th className="py-2.5 px-3">Instructions & Timing</th>
              <th className="py-2.5 px-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {prescription.medicines?.map((med, index) => (
              <tr key={index} className="hover:bg-slate-50/60 transition">
                <td className="py-3 px-3 font-semibold text-slate-900">
                  <div className="flex items-center gap-2">
                    <Pill className="w-3.5 h-3.5 text-medivault-600 shrink-0" />
                    <div>
                      <span>{med.name}</span>
                      {med.brandName && (
                        <span className="text-[11px] text-slate-400 font-normal block">
                          Brand: {med.brandName}
                        </span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="py-3 px-3 text-slate-700 font-medium">
                  {med.dosage || med.strength || 'Standard dose'} • <span className="text-slate-500">{med.dosageForm}</span>
                </td>
                <td className="py-3 px-3 text-slate-700 font-medium">
                  {med.frequency} <span className="text-slate-400">({med.route})</span>
                </td>
                <td className="py-3 px-3 text-slate-700 font-medium">
                  {med.duration} <span className="text-slate-400">({med.quantity} units)</span>
                </td>
                <td className="py-3 px-3 text-slate-600">
                  <div>{med.timing}</div>
                  {med.instructions && (
                    <div className="text-[11px] text-slate-500 italic mt-0.5">{med.instructions}</div>
                  )}
                </td>
                <td className="py-3 px-3">
                  <Badge variant={med.status} size="sm">{med.status}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* General instructions */}
        {prescription.generalInstructions && (
          <div className="mt-4 p-3 bg-amber-50/60 border border-amber-200/60 rounded-xl text-xs text-amber-900 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-amber-950 font-semibold mb-0.5">Physician Instructions:</strong>
              <p className="leading-relaxed">{prescription.generalInstructions}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrescriptionCard;
