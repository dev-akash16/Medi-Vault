import React, { useState, useEffect } from 'react';
import Tabs from '../../components/common/Tabs';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import api from '../../services/api';
import toast from 'react-hot-toast';
import {
  FileText,
  Activity,
  AlertCircle,
  Building,
  Calendar,
  Plus,
  ShieldCheck,
  Stethoscope,
  Users,
} from 'lucide-react';

export const MedicalHistoryPage = () => {
  const [activeTab, setActiveTab] = useState('pastDiseases');
  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(true);

  // Add modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [entryData, setEntryData] = useState({});

  const fetchHistory = async () => {
    try {
      const res = await api.get('/patients/me/history');
      if (res.data.success) {
        setHistory(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const tabs = [
    { id: 'pastDiseases', label: 'Past Diseases', icon: Activity, badge: history?.pastDiseases?.length || 0 },
    { id: 'surgeries', label: 'Surgeries', icon: AlertCircle, badge: history?.surgeries?.length || 0 },
    { id: 'hospitalizations', label: 'Hospitalizations', icon: Building, badge: history?.hospitalizations?.length || 0 },
    { id: 'vaccinations', label: 'Vaccinations', icon: ShieldCheck, badge: history?.vaccinations?.length || 0 },
    { id: 'familyHistory', label: 'Family History', icon: Users, badge: history?.familyHistory?.length || 0 },
  ];

  const handleOpenAddModal = () => {
    setEntryData({});
    setShowAddModal(true);
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setModalLoading(true);
    try {
      const res = await api.post('/patients/me/history/entry', {
        category: activeTab,
        entry: entryData,
      });

      if (res.data.success) {
        toast.success('Medical history entry recorded.');
        fetchHistory();
        setShowAddModal(false);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add entry.');
    } finally {
      setModalLoading(false);
    }
  };

  if (loading) return <LoadingSkeleton count={4} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-card flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-medivault-700">Permanent Record</span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">Complete Medical History</h1>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            Centralized repository of past medical conditions, surgical procedures, prior hospital admissions, and immunizations.
          </p>
        </div>

        <Button variant="primary" size="md" icon={Plus} onClick={handleOpenAddModal}>
          Add History Entry
        </Button>
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* TAB 1: Past Diseases */}
      {activeTab === 'pastDiseases' && (
        <div className="space-y-4">
          {(!history?.pastDiseases || history.pastDiseases.length === 0) ? (
            <EmptyState
              title="No past diseases documented"
              description="Record resolved illnesses and prior diagnoses."
              actionText="Add Past Disease"
              onAction={handleOpenAddModal}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {history.pastDiseases.map((d, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-card space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-base font-bold text-slate-900">{d.diseaseName}</h4>
                      <p className="text-xs text-slate-500">{d.diagnosis}</p>
                    </div>
                    <Badge variant={d.outcome}>{d.outcome}</Badge>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                    <div><strong>Treatment: </strong>{d.treatment}</div>
                    {d.doctor && <div><strong>Treating Physician: </strong>{d.doctor} ({d.hospitalOrClinic})</div>}
                    {d.notes && <div className="italic text-slate-500">"{d.notes}"</div>}
                  </div>

                  <div className="pt-2 text-[11px] text-slate-400 flex items-center justify-between">
                    <span>Recovery: <strong>{d.recoveryStatus}</strong></span>
                    <span>
                      {d.startDate ? new Date(d.startDate).toLocaleDateString() : ''} - {d.endDate ? new Date(d.endDate).toLocaleDateString() : 'Resolved'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Surgeries */}
      {activeTab === 'surgeries' && (
        <div className="space-y-4">
          {(!history?.surgeries || history.surgeries.length === 0) ? (
            <EmptyState
              title="No surgical procedures documented"
              description="Record previous operations, surgical interventions, and outcomes."
              actionText="Add Surgery"
              onAction={handleOpenAddModal}
            />
          ) : (
            <div className="space-y-4">
              {history.surgeries.map((s, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-card flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-bold text-slate-900">{s.surgeryName}</h4>
                      <Badge variant="completed">{s.outcome}</Badge>
                    </div>
                    <p className="text-xs text-slate-600">
                      Hospital: <strong>{s.hospital}</strong> • Surgeon: <strong>{s.surgeon}</strong>
                    </p>
                    <p className="text-xs text-slate-500">Reason: {s.reason}</p>
                    {s.complications && (
                      <p className="text-xs text-slate-500">Complications: {s.complications}</p>
                    )}
                    {s.notes && <p className="text-xs text-slate-400 italic">"{s.notes}"</p>}
                  </div>

                  <div className="text-right">
                    <span className="font-mono text-xs font-semibold text-slate-700 bg-slate-50 px-2.5 py-1 rounded border border-slate-200">
                      {new Date(s.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Hospitalizations */}
      {activeTab === 'hospitalizations' && (
        <div className="space-y-4">
          {(!history?.hospitalizations || history.hospitalizations.length === 0) ? (
            <EmptyState
              title="No prior hospitalizations on file"
              description="Record past hospital admissions, treatments, and discharge notes."
              actionText="Add Hospital Admission"
              onAction={handleOpenAddModal}
            />
          ) : (
            <div className="space-y-4">
              {history.hospitalizations.map((h, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-card space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-base font-bold text-slate-900">{h.hospital}</h4>
                      <p className="text-xs text-slate-500">Diagnosis: {h.diagnosis} (Reason: {h.reason})</p>
                    </div>
                    <span className="text-xs font-mono text-slate-500">
                      Admitted: {new Date(h.admissionDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-700 space-y-1">
                    <div><strong>Treatment Administered: </strong>{h.treatment}</div>
                    {h.dischargeSummary && <div><strong>Discharge Summary: </strong>{h.dischargeSummary}</div>}
                    {h.attendingDoctor && <div><strong>Attending: </strong>{h.attendingDoctor}</div>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: Vaccinations */}
      {activeTab === 'vaccinations' && (
        <div className="space-y-4">
          {(!history?.vaccinations || history.vaccinations.length === 0) ? (
            <EmptyState
              title="No immunization records found"
              description="Keep track of vaccinations, booster doses, and provider certificates."
              actionText="Record Vaccination"
              onAction={handleOpenAddModal}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {history.vaccinations.map((v, i) => (
                <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-card space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{v.vaccineName}</h4>
                      <span className="text-xs text-slate-500 font-medium">{v.dose}</span>
                    </div>
                    <Badge variant="verified">Administered</Badge>
                  </div>
                  <div className="space-y-1 text-xs text-slate-600">
                    <div>Provider: <strong>{v.provider}</strong></div>
                    {v.batchNumber && <div>Batch: <code className="font-mono">{v.batchNumber}</code></div>}
                    {v.nextDueDate && (
                      <div className="text-cyan-700 font-semibold">
                        Next Due: {new Date(v.nextDueDate).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                  <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-400">
                    Date: {new Date(v.date).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 5: Family History */}
      {activeTab === 'familyHistory' && (
        <div className="space-y-4">
          {(!history?.familyHistory || history.familyHistory.length === 0) ? (
            <EmptyState
              title="No family medical history recorded"
              description="Document genetic, cardiovascular, and hereditary conditions in immediate family."
              actionText="Add Family Record"
              onAction={handleOpenAddModal}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {history.familyHistory.map((f, i) => (
                <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-card space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-medivault-700 bg-medivault-50 px-2 py-0.5 rounded">
                      {f.relationship}
                    </span>
                    {f.ageAtDiagnosis && (
                      <span className="text-xs text-slate-400">Age: {f.ageAtDiagnosis}</span>
                    )}
                  </div>
                  <h4 className="text-base font-bold text-slate-900">{f.disease}</h4>
                  {f.notes && <p className="text-xs text-slate-500">{f.notes}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title={`Add Entry to ${tabs.find((t) => t.id === activeTab)?.label}`}
          maxWidth="max-w-lg"
        >
          <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
            {activeTab === 'pastDiseases' && (
              <>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Disease / Condition Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Acute Bronchitis"
                    value={entryData.diseaseName || ''}
                    onChange={(e) => setEntryData({ ...entryData, diseaseName: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Diagnosis Details</label>
                  <input
                    type="text"
                    placeholder="Specific clinical diagnosis"
                    value={entryData.diagnosis || ''}
                    onChange={(e) => setEntryData({ ...entryData, diagnosis: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Start Date</label>
                    <input
                      type="date"
                      value={entryData.startDate || ''}
                      onChange={(e) => setEntryData({ ...entryData, startDate: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">End / Resolution Date</label>
                    <input
                      type="date"
                      value={entryData.endDate || ''}
                      onChange={(e) => setEntryData({ ...entryData, endDate: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Treatment Received</label>
                  <input
                    type="text"
                    placeholder="Medications, rest, therapies"
                    value={entryData.treatment || ''}
                    onChange={(e) => setEntryData({ ...entryData, treatment: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
              </>
            )}

            {activeTab === 'surgeries' && (
              <>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Surgical Procedure Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Laparoscopic Appendectomy"
                    value={entryData.surgeryName || ''}
                    onChange={(e) => setEntryData({ ...entryData, surgeryName: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Surgery Date *</label>
                  <input
                    type="date"
                    required
                    value={entryData.date || ''}
                    onChange={(e) => setEntryData({ ...entryData, date: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Hospital / Clinic</label>
                    <input
                      type="text"
                      placeholder="Hospital name"
                      value={entryData.hospital || ''}
                      onChange={(e) => setEntryData({ ...entryData, hospital: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Surgeon Name</label>
                    <input
                      type="text"
                      placeholder="Dr. Alan Vance"
                      value={entryData.surgeon || ''}
                      onChange={(e) => setEntryData({ ...entryData, surgeon: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Indication / Reason</label>
                  <input
                    type="text"
                    placeholder="Reason for surgery"
                    value={entryData.reason || ''}
                    onChange={(e) => setEntryData({ ...entryData, reason: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
              </>
            )}

            {activeTab === 'vaccinations' && (
              <>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Vaccine Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Influenza, COVID-19 Booster"
                    value={entryData.vaccineName || ''}
                    onChange={(e) => setEntryData({ ...entryData, vaccineName: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Dose / Series</label>
                    <input
                      type="text"
                      placeholder="e.g. Booster, 1st Dose"
                      value={entryData.dose || ''}
                      onChange={(e) => setEntryData({ ...entryData, dose: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Date Administered *</label>
                    <input
                      type="date"
                      required
                      value={entryData.date || ''}
                      onChange={(e) => setEntryData({ ...entryData, date: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Provider / Clinic</label>
                  <input
                    type="text"
                    placeholder="e.g. CVS Health, Springfield Practice"
                    value={entryData.provider || ''}
                    onChange={(e) => setEntryData({ ...entryData, provider: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
              </>
            )}

            {activeTab === 'familyHistory' && (
              <>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Family Relationship *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mother, Father, Maternal Grandfather"
                    value={entryData.relationship || ''}
                    onChange={(e) => setEntryData({ ...entryData, relationship: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Medical Condition *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Type 2 Diabetes, Hypertension"
                    value={entryData.disease || ''}
                    onChange={(e) => setEntryData({ ...entryData, disease: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Approx. Age at Diagnosis</label>
                  <input
                    type="number"
                    placeholder="e.g. 52"
                    value={entryData.ageAtDiagnosis || ''}
                    onChange={(e) => setEntryData({ ...entryData, ageAtDiagnosis: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
              </>
            )}

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
              <Button variant="secondary" size="sm" onClick={() => setShowAddModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" loading={modalLoading}>
                Save to Medical History
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default MedicalHistoryPage;
