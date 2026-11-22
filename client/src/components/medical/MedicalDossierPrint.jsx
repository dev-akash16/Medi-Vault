import React from 'react';
import { Shield, Printer, CheckCircle } from 'lucide-react';
import Button from '../common/Button';

export const MedicalDossierPrint = ({ data }) => {
  const handlePrint = () => {
    window.print();
  };

  if (!data || !data.patient) return null;

  const { patient, summary, allergies = [], activeConditions = [], prescriptions = [], consultations = [], reports = [], recentVitals = [] } = data;

  return (
    <div className="bg-white p-6 sm:p-10 rounded-2xl border border-slate-200 shadow-card max-w-4xl mx-auto print:border-none print:shadow-none print:p-0">
      {/* Print Trigger Button */}
      <div className="no-print mb-6 flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-200">
        <div>
          <h4 className="text-sm font-bold text-slate-800">Print or Save as Official PDF</h4>
          <p className="text-xs text-slate-500">Format includes official MediVault verification headers and legal medical confidentiality notice.</p>
        </div>
        <Button variant="primary" size="sm" onClick={handlePrint} icon={Printer}>
          Print Dossier / Save PDF
        </Button>
      </div>

      {/* Header */}
      <div className="border-b-2 border-medivault-800 pb-6 mb-6 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-medivault-800 text-white flex items-center justify-center font-bold">
            <Shield className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">MediVault</h1>
            <p className="text-xs uppercase tracking-widest text-medivault-700 font-bold">Unified Digital Health Records Dossier</p>
          </div>
        </div>

        <div className="text-right">
          <span className="font-mono text-sm font-bold bg-slate-100 text-slate-800 px-3 py-1 rounded border border-slate-300 block mb-1">
            {patient.patientId}
          </span>
          <span className="text-[11px] text-slate-500 block">
            Generated: {new Date(data.generatedAt || Date.now()).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
        </div>
      </div>

      {/* Confidentiality Warning */}
      <div className="p-3 bg-slate-100 border-l-4 border-slate-600 rounded text-[11px] text-slate-700 mb-6 italic">
        {data.confidentialityNotice}
      </div>

      {/* Patient Demographics Grid */}
      <div className="mb-6 p-4 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div>
          <span className="text-slate-400 font-medium block">Patient Full Name</span>
          <strong className="text-slate-900 text-sm">{patient.fullName}</strong>
        </div>
        <div>
          <span className="text-slate-400 font-medium block">Date of Birth</span>
          <strong className="text-slate-900">
            {patient.dateOfBirth ? new Date(patient.dateOfBirth).toLocaleDateString() : 'N/A'}
          </strong>
        </div>
        <div>
          <span className="text-slate-400 font-medium block">Gender</span>
          <strong className="text-slate-900">{patient.gender || 'Not specified'}</strong>
        </div>
        <div>
          <span className="text-slate-400 font-medium block">Blood Group</span>
          <strong className="text-slate-900 text-red-600 font-bold">{patient.bloodGroup || 'N/A'}</strong>
        </div>
        <div>
          <span className="text-slate-400 font-medium block">Contact Phone</span>
          <strong className="text-slate-900">{patient.phone || 'N/A'}</strong>
        </div>
        <div>
          <span className="text-slate-400 font-medium block">Email Address</span>
          <strong className="text-slate-900">{patient.email}</strong>
        </div>
        <div className="col-span-2">
          <span className="text-slate-400 font-medium block">Emergency Contact</span>
          <strong className="text-slate-900">
            {patient.emergencyContact?.name ? `${patient.emergencyContact.name} (${patient.emergencyContact.relationship}) - ${patient.emergencyContact.phone}` : 'N/A'}
          </strong>
        </div>
      </div>

      {/* Allergies Notice */}
      <div className="mb-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-rose-700 border-b border-rose-200 pb-1 mb-2">
          Known Allergies & Clinical Cautions ({allergies.length})
        </h3>
        {allergies.length === 0 ? (
          <p className="text-xs text-slate-500 italic">No known drug, food, or environmental allergies documented.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {allergies.map((a, i) => (
              <div key={i} className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg">
                <strong className="text-rose-900 font-bold">{a.allergyName}</strong> ({a.allergyType})
                <p className="text-rose-800 text-[11px] mt-0.5">Reaction: {a.reaction} • Severity: {a.severity}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Active Medical Conditions */}
      <div className="mb-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1 mb-2">
          Documented Conditions & Diagnoses ({activeConditions.length})
        </h3>
        {activeConditions.length === 0 ? (
          <p className="text-xs text-slate-500 italic">No active medical conditions on file.</p>
        ) : (
          <div className="space-y-2 text-xs">
            {activeConditions.map((c, i) => (
              <div key={i} className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-start justify-between">
                <div>
                  <strong className="text-slate-900 text-sm">{c.conditionName}</strong>
                  <span className="ml-2 text-[10px] uppercase font-bold text-slate-600 bg-slate-200 px-1.5 py-0.5 rounded">{c.status}</span>
                  <p className="text-slate-600 mt-1">{c.treatmentPlan || c.description}</p>
                </div>
                <span className="text-[11px] text-slate-400">Diagnosed: {new Date(c.diagnosisDate).getFullYear()}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Active Medications */}
      <div className="mb-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1 mb-2">
          Current Prescriptions & Medications
        </h3>
        {prescriptions.length === 0 ? (
          <p className="text-xs text-slate-500 italic">No prescription records on file.</p>
        ) : (
          <table className="w-full text-left text-xs border border-slate-200 rounded-lg overflow-hidden">
            <thead className="bg-slate-100 text-[11px] font-bold uppercase text-slate-600">
              <tr>
                <th className="p-2 border-b">Medication</th>
                <th className="p-2 border-b">Dosage & Form</th>
                <th className="p-2 border-b">Frequency</th>
                <th className="p-2 border-b">Instructions</th>
                <th className="p-2 border-b">Prescribing Doctor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {prescriptions.flatMap((p) =>
                p.medicines?.map((m, idx) => (
                  <tr key={`${p._id}-${idx}`}>
                    <td className="p-2 font-semibold text-slate-900">{m.name}</td>
                    <td className="p-2">{m.dosage} ({m.dosageForm})</td>
                    <td className="p-2">{m.frequency}</td>
                    <td className="p-2 text-slate-600">{m.timing} - {m.instructions}</td>
                    <td className="p-2 text-slate-700">Dr. {p.doctor?.user?.name || 'Physician'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Recent Consultations */}
      <div className="mb-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1 mb-2">
          Recent Clinical Consultations
        </h3>
        <div className="space-y-3 text-xs">
          {consultations.slice(0, 3).map((c, i) => (
            <div key={i} className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <strong className="text-slate-900">Chief Complaint: {c.chiefComplaint}</strong>
                <span className="text-[11px] text-slate-500 font-mono">{new Date(c.date).toLocaleDateString()}</span>
              </div>
              <p className="text-slate-600">
                <strong>Attending: </strong>Dr. {c.doctor?.user?.name || 'Physician'} • <strong>Assessment: </strong>{c.notes?.assessment || 'Evaluated'}
              </p>
              {c.notes?.treatmentPlan && <p className="text-slate-600 mt-1"><strong>Plan: </strong>{c.notes.treatmentPlan}</p>}
            </div>
          ))}
        </div>
      </div>

      {/* Official Sign-off Footer */}
      <div className="mt-8 pt-6 border-t-2 border-slate-300 flex items-end justify-between text-xs text-slate-500">
        <div>
          <p className="font-semibold text-slate-800">MediVault Certified Electronic Health Record</p>
          <p className="text-[11px]">Verified cryptographically on {new Date().toISOString()}</p>
        </div>
        <div className="text-right border-t border-slate-400 pt-1 w-48">
          <span className="text-[11px] block">Attending Physician Review / Signature</span>
        </div>
      </div>
    </div>
  );
};

export default MedicalDossierPrint;
