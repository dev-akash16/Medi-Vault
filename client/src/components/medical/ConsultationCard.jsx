import React, { useState } from 'react';
import {
  Stethoscope,
  Calendar,
  Activity,
  FileText,
  AlertTriangle,
  Clock,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Edit3,
} from 'lucide-react';
import Badge from '../common/Badge';
import Button from '../common/Button';

export const ConsultationCard = ({ consultation, onAmend, isDoctor = false }) => {
  const [expanded, setExpanded] = useState(true);

  const doctorName = consultation.doctor?.user?.name || consultation.doctor?.name || 'Physician';
  const doctorSpecialization = consultation.doctor?.specialization || 'Clinical Medicine';
  const vitals = consultation.observations?.vitals || {};

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-card hover:shadow-hover transition duration-200 overflow-hidden">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white p-5 flex items-start justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="font-mono text-xs font-semibold text-cyan-300 bg-cyan-950/80 px-2.5 py-0.5 rounded border border-cyan-800/40">
              {consultation.consultationId}
            </span>
            <Badge variant="completed">{consultation.visitType}</Badge>
            {consultation.status === 'amended' && (
              <span className="text-[10px] font-semibold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full">
                Formally Amended
              </span>
            )}
          </div>
          <h3 className="text-base font-bold text-white mt-1.5">
            Chief Complaint: "{consultation.chiefComplaint}"
          </h3>
          {consultation.symptoms && (
            <p className="text-xs text-slate-300 mt-1">
              Symptoms: {consultation.symptoms} {consultation.symptomDuration ? `(${consultation.symptomDuration})` : ''}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="text-right">
            <span className="text-xs text-slate-400 block">
              {new Date(consultation.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </span>
            <span className="text-xs font-semibold text-white block mt-0.5">
              Dr. {doctorName}
            </span>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="p-6 space-y-6">
          {/* Clinical Vitals Strip */}
          {(vitals.systolicBP || vitals.heartRate || vitals.temperature || vitals.weight) && (
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
              <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-medivault-700" /> Clinical Vitals Recorded
              </h5>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 text-center">
                {vitals.systolicBP && (
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200/80 shadow-xs">
                    <span className="text-[10px] text-slate-400 block uppercase font-medium">Blood Pressure</span>
                    <strong className="text-sm font-bold text-slate-900">
                      {vitals.systolicBP}/{vitals.diastolicBP || 80}
                    </strong>
                    <span className="text-[10px] text-slate-400 ml-0.5">mmHg</span>
                  </div>
                )}
                {vitals.heartRate && (
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200/80 shadow-xs">
                    <span className="text-[10px] text-slate-400 block uppercase font-medium">Heart Rate</span>
                    <strong className="text-sm font-bold text-slate-900">{vitals.heartRate}</strong>
                    <span className="text-[10px] text-slate-400 ml-0.5">bpm</span>
                  </div>
                )}
                {vitals.temperature && (
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200/80 shadow-xs">
                    <span className="text-[10px] text-slate-400 block uppercase font-medium">Temperature</span>
                    <strong className="text-sm font-bold text-slate-900">{vitals.temperature}</strong>
                    <span className="text-[10px] text-slate-400 ml-0.5">°F</span>
                  </div>
                )}
                {vitals.oxygenSaturation && (
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200/80 shadow-xs">
                    <span className="text-[10px] text-slate-400 block uppercase font-medium">SpO2</span>
                    <strong className="text-sm font-bold text-slate-900">{vitals.oxygenSaturation}%</strong>
                  </div>
                )}
                {vitals.weight && (
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200/80 shadow-xs">
                    <span className="text-[10px] text-slate-400 block uppercase font-medium">Weight</span>
                    <strong className="text-sm font-bold text-slate-900">{vitals.weight}</strong>
                    <span className="text-[10px] text-slate-400 ml-0.5">kg</span>
                  </div>
                )}
                {vitals.bmi && (
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200/80 shadow-xs">
                    <span className="text-[10px] text-slate-400 block uppercase font-medium">BMI</span>
                    <strong className="text-sm font-bold text-slate-900">{vitals.bmi}</strong>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Diagnoses List */}
          {consultation.diagnoses && consultation.diagnoses.length > 0 && (
            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Clinical Diagnoses
              </h5>
              <div className="space-y-2">
                {consultation.diagnoses.map((diag, i) => (
                  <div
                    key={i}
                    className="p-3 bg-blue-50/50 border border-blue-100 rounded-xl flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="text-sm font-bold text-slate-900">{diag.name}</strong>
                        {diag.code && (
                          <span className="text-xs font-mono bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                            {diag.code}
                          </span>
                        )}
                        <Badge variant={diag.severity}>{diag.severity}</Badge>
                      </div>
                      {diag.description && (
                        <p className="text-xs text-slate-600 mt-1">{diag.description}</p>
                      )}
                    </div>
                    <span className="text-xs font-semibold text-blue-800 uppercase px-2 py-1 bg-white rounded-md border border-blue-200">
                      {diag.type || 'Primary'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes & Treatment Plan Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {consultation.notes?.clinicalNotes && (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <strong className="text-slate-900 block mb-1 font-semibold">Clinical Assessment:</strong>
                <p className="text-slate-600 leading-relaxed">{consultation.notes.clinicalNotes}</p>
              </div>
            )}
            {consultation.notes?.treatmentPlan && (
              <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100">
                <strong className="text-emerald-950 block mb-1 font-semibold">Treatment Plan:</strong>
                <p className="text-emerald-900 leading-relaxed">{consultation.notes.treatmentPlan}</p>
              </div>
            )}
            {consultation.notes?.precautions && (
              <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-100">
                <strong className="text-amber-950 block mb-1 font-semibold">Precautions:</strong>
                <p className="text-amber-900 leading-relaxed">{consultation.notes.precautions}</p>
              </div>
            )}
            {consultation.notes?.warningSigns && (
              <div className="p-4 bg-rose-50/50 rounded-xl border border-rose-100">
                <strong className="text-rose-950 block mb-1 font-semibold">Warning Signs to Monitor:</strong>
                <p className="text-rose-900 leading-relaxed">{consultation.notes.warningSigns}</p>
              </div>
            )}
          </div>

          {/* Follow-up banner */}
          {consultation.followUpDate && (
            <div className="p-3 bg-cyan-50/60 border border-cyan-100 rounded-xl text-xs text-cyan-900 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-700" />
                Scheduled Follow-up Date:{' '}
                <strong>
                  {new Date(consultation.followUpDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </strong>
              </span>
              {consultation.notes?.followUpInstructions && (
                <span className="text-slate-600">{consultation.notes.followUpInstructions}</span>
              )}
            </div>
          )}

          {/* Formal Amendment History */}
          {consultation.amendmentHistory && consultation.amendmentHistory.length > 0 && (
            <div className="border-t border-slate-100 pt-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 block mb-1.5">
                Audit Trail — Formal Amendments:
              </span>
              {consultation.amendmentHistory.map((amend, idx) => (
                <div key={idx} className="p-2.5 bg-amber-50/40 rounded-lg text-xs text-amber-900 mb-1">
                  <strong>{new Date(amend.amendedAt).toLocaleString()}: </strong>
                  Reason: "{amend.reason}". {amend.notes}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ConsultationCard;
