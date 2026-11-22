import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Tabs from '../../components/common/Tabs';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import ConsultationCard from '../../components/medical/ConsultationCard';
import PrescriptionCard from '../../components/medical/PrescriptionCard';
import LabReportCard from '../../components/medical/LabReportCard';
import AllergyCard from '../../components/medical/AllergyCard';
import VitalsChart from '../../components/medical/VitalsChart';
import TimelineView from '../../components/medical/TimelineView';
import DocumentCard from '../../components/medical/DocumentCard';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import NewConsultationModal from '../../components/forms/NewConsultationModal';
import NewPrescriptionModal from '../../components/forms/NewPrescriptionModal';
import UploadReportModal from '../../components/forms/UploadReportModal';
import api from '../../services/api';
import toast from 'react-hot-toast';
import {
  Stethoscope,
  Pill,
  FileCheck,
  Activity,
  AlertTriangle,
  FolderOpen,
  Clock,
  Plus,
  Calendar,
  Phone,
  Mail,
  User,
  Heart,
  Shield,
  FileText,
} from 'lucide-react';

export const PatientClinicalProfilePage = () => {
  const { patientId } = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  const [patientData, setPatientData] = useState(null);
  const [history, setHistory] = useState(null);
  const [conditions, setConditions] = useState([]);
  const [allergies, setAllergies] = useState([]);
  const [consultations, setConsultations] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [reports, setReports] = useState([]);
  const [vitals, setVitals] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [timeline, setTimeline] = useState([]);

  // Modals
  const [showConsultationModal, setShowConsultationModal] = useState(false);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  const fetchPatientProfile = async () => {
    try {
      const [overviewRes, histRes, condRes, allRes, conRes, rxRes, repRes, vitRes, docRes, timeRes] =
        await Promise.all([
          api.get(`/patients/${patientId}/overview`),
          api.get(`/patients/${patientId}/history`),
          api.get(`/patients/${patientId}/conditions`),
          api.get(`/patients/${patientId}/allergies`),
          api.get(`/patients/${patientId}/consultations`),
          api.get(`/patients/${patientId}/prescriptions`),
          api.get(`/patients/${patientId}/reports`),
          api.get(`/patients/${patientId}/vitals`),
          api.get(`/patients/${patientId}/documents`),
          api.get(`/patients/${patientId}/timeline`),
        ]);

      if (overviewRes.data.success) setPatientData(overviewRes.data.data);
      if (histRes.data.success) setHistory(histRes.data.data);
      if (condRes.data.success) setConditions(condRes.data.data);
      if (allRes.data.success) setAllergies(allRes.data.data);
      if (conRes.data.success) setConsultations(conRes.data.data);
      if (rxRes.data.success) setPrescriptions(rxRes.data.data);
      if (repRes.data.success) setReports(repRes.data.data);
      if (vitRes.data.success) setVitals(vitRes.data.data);
      if (docRes.data.success) setDocuments(docRes.data.data);
      if (timeRes.data.success) setTimeline(timeRes.data.data);
    } catch (err) {
      toast.error('Unable to access patient records. Ensure active consent is granted.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatientProfile();
  }, [patientId]);

  if (loading) return <LoadingSkeleton count={6} />;

  const pat = patientData?.patient;
  if (!pat) {
    return (
      <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center">
        <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
        <h3 className="text-base font-bold text-slate-900">Patient Record Unavailable</h3>
        <p className="text-xs text-slate-500 mt-1">
          You do not have active consent permission to view records for {patientId}.
        </p>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'history', label: 'Medical History', icon: FileText, badge: (history?.pastDiseases?.length || 0) + (history?.surgeries?.length || 0) },
    { id: 'conditions', label: 'Conditions', icon: Heart, badge: conditions.length },
    { id: 'consultations', label: 'Consultations', icon: Stethoscope, badge: consultations.length },
    { id: 'prescriptions', label: 'Prescriptions', icon: Pill, badge: prescriptions.length },
    { id: 'reports', label: 'Lab Reports', icon: FileCheck, badge: reports.length },
    { id: 'vitals', label: 'Vitals Analytics', icon: Activity },
    { id: 'documents', label: 'Documents', icon: FolderOpen, badge: documents.length },
    { id: 'timeline', label: 'Timeline', icon: Clock },
  ];

  return (
    <div className="space-y-6">
      {/* Patient Profile Header Card */}
      <div className="bg-gradient-to-r from-medivault-900 via-medivault-800 to-medivault-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-400 to-medivault-500 text-white font-black text-2xl flex items-center justify-center shadow-md shrink-0">
              {pat.user?.name?.charAt(0) || 'P'}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-black tracking-tight">{pat.user?.name}</h1>
                <span className="font-mono text-xs font-bold bg-cyan-950 text-cyan-300 px-2.5 py-0.5 rounded border border-cyan-800/60">
                  {pat.patientId}
                </span>
                <Badge variant="verified">Authorized Patient</Badge>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 mt-2">
                <span>Blood Group: <strong className="text-white">{pat.bloodGroup || 'A+'}</strong></span>
                <span>Gender: <strong className="text-white">{pat.gender || 'Female'}</strong></span>
                <span>
                  DOB: <strong className="text-white">{pat.dateOfBirth ? new Date(pat.dateOfBirth).toLocaleDateString() : 'N/A'}</strong>
                </span>
                {pat.user?.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="w-3 h-3 text-cyan-400" /> {pat.user.phone}
                  </span>
                )}
                {pat.user?.email && (
                  <span className="flex items-center gap-1">
                    <Mail className="w-3 h-3 text-cyan-400" /> {pat.user.email}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Clinical Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="teal"
              size="md"
              icon={Stethoscope}
              onClick={() => setShowConsultationModal(true)}
            >
              Start Consultation
            </Button>
            <Button
              variant="secondary"
              size="md"
              icon={Pill}
              className="text-slate-800 bg-white"
              onClick={() => setShowPrescriptionModal(true)}
            >
              New Prescription
            </Button>
            <Button
              variant="ghost"
              size="md"
              icon={FileCheck}
              className="text-white hover:bg-slate-800"
              onClick={() => setShowReportModal(true)}
            >
              Add Report
            </Button>
          </div>
        </div>

        {/* Prominent Allergy Banner */}
        {allergies.length > 0 && (
          <div className="p-3.5 bg-rose-950/80 border border-rose-500/60 rounded-2xl flex items-center gap-3 text-xs text-rose-200">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
            <div>
              <strong className="text-white block font-bold">ALLERGY WARNING:</strong>
              <span>
                {allergies.map((a) => `${a.allergyName} (Reaction: ${a.reaction}, Severity: ${a.severity})`).join(' • ')}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">
            {/* Active Conditions */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-card">
              <h3 className="text-base font-bold text-slate-900 mb-4">Active Conditions</h3>
              {conditions.length === 0 ? (
                <p className="text-xs text-slate-400">No active chronic conditions.</p>
              ) : (
                <div className="space-y-3">
                  {conditions.map((c) => (
                    <div key={c._id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <strong className="text-sm font-bold text-slate-900">{c.conditionName}</strong>
                          <Badge variant={c.status} size="sm">{c.status}</Badge>
                        </div>
                        <p className="text-xs text-slate-600 mt-1">{c.treatmentPlan || c.description}</p>
                      </div>
                      <Badge variant={c.severity} size="sm">{c.severity}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Vitals Trend Summary */}
            <VitalsChart measurements={vitals} />
          </div>

          <div className="lg:col-span-4 space-y-6">
            {/* Current Medicines */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-card">
              <h3 className="text-base font-bold text-slate-900 mb-4">Active Medications</h3>
              {patientData?.currentMedicines?.length === 0 ? (
                <p className="text-xs text-slate-400">No active medications.</p>
              ) : (
                <div className="space-y-3">
                  {patientData?.currentMedicines?.map((m, i) => (
                    <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                      <strong className="text-slate-900 block">{m.name}</strong>
                      <span className="text-slate-500">{m.dosage} • {m.frequency}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Emergency Contact */}
            {pat.emergencyContact?.name && (
              <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-card space-y-2 text-xs">
                <h4 className="font-bold text-slate-900 text-sm">Emergency Contact</h4>
                <p className="text-slate-700"><strong>Name: </strong>{pat.emergencyContact.name}</p>
                <p className="text-slate-700"><strong>Relationship: </strong>{pat.emergencyContact.relationship}</p>
                <p className="text-slate-700"><strong>Phone: </strong>{pat.emergencyContact.phone}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: MEDICAL HISTORY */}
      {activeTab === 'history' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-card space-y-4">
            <h3 className="text-base font-bold text-slate-900">Surgical Procedures</h3>
            {history?.surgeries?.length === 0 ? (
              <p className="text-xs text-slate-400">No past surgeries on file.</p>
            ) : (
              <div className="space-y-3">
                {history?.surgeries?.map((s, i) => (
                  <div key={i} className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <strong className="text-sm font-bold text-slate-900">{s.surgeryName}</strong>
                      <span className="text-slate-500">{new Date(s.date).toLocaleDateString()}</span>
                    </div>
                    <p className="text-slate-600">Hospital: {s.hospital} • Surgeon: {s.surgeon}</p>
                    <p className="text-slate-600">Reason: {s.reason} • Outcome: {s.outcome}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-card space-y-4">
            <h3 className="text-base font-bold text-slate-900">Past Resolved Diseases</h3>
            {history?.pastDiseases?.length === 0 ? (
              <p className="text-xs text-slate-400">No resolved past diseases recorded.</p>
            ) : (
              <div className="space-y-3">
                {history?.pastDiseases?.map((d, i) => (
                  <div key={i} className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1">
                    <strong className="text-sm font-bold text-slate-900">{d.diseaseName}</strong>
                    <p className="text-slate-600">Diagnosis: {d.diagnosis}</p>
                    <p className="text-slate-600">Treatment: {d.treatment} • Outcome: {d.outcome}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: CONDITIONS */}
      {activeTab === 'conditions' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {conditions.map((c) => (
            <div key={c._id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-card space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-base font-bold text-slate-900">{c.conditionName}</h4>
                  <Badge variant={c.status} size="sm">{c.status}</Badge>
                </div>
                <Badge variant={c.severity} size="sm">{c.severity}</Badge>
              </div>
              <p className="text-xs text-slate-600">{c.treatmentPlan || c.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: CONSULTATIONS */}
      {activeTab === 'consultations' && (
        <div className="space-y-6">
          {consultations.length === 0 ? (
            <EmptyState
              icon={Stethoscope}
              title="No prior consultations on record"
              actionText="Start Consultation"
              onAction={() => setShowConsultationModal(true)}
            />
          ) : (
            consultations.map((c) => (
              <ConsultationCard key={c._id} consultation={c} isDoctor={true} />
            ))
          )}
        </div>
      )}

      {/* TAB 5: PRESCRIPTIONS */}
      {activeTab === 'prescriptions' && (
        <div className="space-y-6">
          {prescriptions.length === 0 ? (
            <EmptyState
              icon={Pill}
              title="No prescriptions on record"
              actionText="Issue Prescription"
              onAction={() => setShowPrescriptionModal(true)}
            />
          ) : (
            prescriptions.map((p) => (
              <PrescriptionCard key={p._id} prescription={p} isDoctor={true} />
            ))
          )}
        </div>
      )}

      {/* TAB 6: LAB REPORTS */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          {reports.length === 0 ? (
            <EmptyState
              icon={FileCheck}
              title="No lab reports found"
              actionText="Upload Report"
              onAction={() => setShowReportModal(true)}
            />
          ) : (
            reports.map((r) => (
              <LabReportCard key={r._id} report={r} />
            ))
          )}
        </div>
      )}

      {/* TAB 7: VITALS */}
      {activeTab === 'vitals' && (
        <VitalsChart measurements={vitals} />
      )}

      {/* TAB 8: DOCUMENTS */}
      {activeTab === 'documents' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((d) => (
            <DocumentCard key={d._id} document={d} />
          ))}
        </div>
      )}

      {/* TAB 9: TIMELINE */}
      {activeTab === 'timeline' && (
        <TimelineView events={timeline} />
      )}

      {/* Modals */}
      {showConsultationModal && (
        <NewConsultationModal
          isOpen={showConsultationModal}
          onClose={() => setShowConsultationModal(false)}
          patientId={patientId}
          patientName={pat.user?.name}
          onSuccess={fetchPatientProfile}
        />
      )}

      {showPrescriptionModal && (
        <NewPrescriptionModal
          isOpen={showPrescriptionModal}
          onClose={() => setShowPrescriptionModal(false)}
          patientId={patientId}
          patientName={pat.user?.name}
          onSuccess={fetchPatientProfile}
        />
      )}

      {showReportModal && (
        <UploadReportModal
          isOpen={showReportModal}
          onClose={() => setShowReportModal(false)}
          patientId={patientId}
          onSuccess={fetchPatientProfile}
        />
      )}
    </div>
  );
};

export default PatientClinicalProfilePage;
