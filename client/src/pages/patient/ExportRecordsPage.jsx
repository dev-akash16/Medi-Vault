import React, { useState, useEffect } from 'react';
import MedicalDossierPrint from '../../components/medical/MedicalDossierPrint';
import Button from '../../components/common/Button';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { Download, Sparkles, Printer, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

export const ExportRecordsPage = () => {
  const [data, setData] = useState(null);
  const [aiSummary, setAiSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generatingAi, setGeneratingAi] = useState(false);

  useEffect(() => {
    const fetchExport = async () => {
      try {
        const res = await api.get('/export/me');
        if (res.data.success) {
          setData(res.data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchExport();
  }, []);

  const handleGenerateAiSummary = async () => {
    setGeneratingAi(true);
    try {
      const res = await api.post('/ai/summarize-history/me');
      if (res.data.success) {
        setAiSummary(res.data.data);
        toast.success('AI clinical medical history summary generated.');
      }
    } catch (err) {
      toast.error('AI summarization service unavailable.');
    } finally {
      setGeneratingAi(false);
    }
  };

  if (loading) return <LoadingSkeleton count={4} />;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="no-print bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-card flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-medivault-700">Records Portability</span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">Export Unified Health Records</h1>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            Generate an official certified dossier containing your continuous medical record, previous diagnoses, prescriptions, and test results.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="teal"
            size="md"
            icon={Sparkles}
            loading={generatingAi}
            onClick={handleGenerateAiSummary}
          >
            {aiSummary ? 'Regenerate AI Summary' : 'Generate AI Clinical Summary'}
          </Button>
        </div>
      </div>

      {/* AI Summary Card if generated */}
      {aiSummary && (
        <div className="no-print bg-gradient-to-r from-cyan-900 via-medivault-900 to-medivault-950 text-white rounded-3xl p-6 sm:p-8 border border-cyan-800/40 shadow-xl space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-bold">AI Clinical Health Summary</h3>
          </div>

          <div className="p-3 bg-cyan-950/60 border border-cyan-800/60 rounded-xl text-xs text-cyan-300 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <p>{aiSummary.notice}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-1">
              <strong className="text-cyan-400 block font-semibold">Active Chronic Conditions:</strong>
              <ul className="list-disc pl-4 space-y-0.5 text-slate-200">
                {aiSummary.currentConditions?.map((c, i) => <li key={i}>{c}</li>)}
              </ul>
            </div>

            <div className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-1">
              <strong className="text-rose-400 block font-semibold">Documented Allergies:</strong>
              <ul className="list-disc pl-4 space-y-0.5 text-slate-200">
                {aiSummary.allergies?.map((a, i) => <li key={i}>{a}</li>)}
              </ul>
            </div>

            <div className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-1">
              <strong className="text-emerald-400 block font-semibold">Active Medications:</strong>
              <ul className="list-disc pl-4 space-y-0.5 text-slate-200">
                {aiSummary.currentMedications?.map((m, i) => <li key={i}>{m}</li>)}
              </ul>
            </div>

            <div className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-1">
              <strong className="text-amber-400 block font-semibold">Surgical & Past History:</strong>
              <ul className="list-disc pl-4 space-y-0.5 text-slate-200">
                {aiSummary.previousSurgeries?.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Printable Clinical Dossier */}
      <MedicalDossierPrint data={data} />
    </div>
  );
};

export default ExportRecordsPage;
