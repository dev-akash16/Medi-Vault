import React, { useState } from 'react';
import {
  FileCheck,
  Calendar,
  Building,
  Download,
  Sparkles,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import Badge from '../common/Badge';
import Button from '../common/Button';
import Modal from '../common/Modal';
import api from '../../services/api';
import toast from 'react-hot-toast';

export const LabReportCard = ({ report }) => {
  const [expanded, setExpanded] = useState(false);
  const [explaining, setExplaining] = useState(false);
  const [aiExplanation, setAiExplanation] = useState(null);
  const [showAiModal, setShowAiModal] = useState(false);

  const handleExplainWithAi = async () => {
    setExplaining(true);
    try {
      const res = await api.post(`/ai/explain-report/${report.reportId}`);
      if (res.data.success) {
        setAiExplanation(res.data.data);
        setShowAiModal(true);
      }
    } catch (err) {
      toast.error('AI explanation service unavailable. Please check configuration.');
    } finally {
      setExplaining(false);
    }
  };

  const hasStructured = report.structuredResults && report.structuredResults.length > 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-card hover:shadow-hover transition duration-200 overflow-hidden">
      {/* Header */}
      <div className="p-5 flex items-start justify-between flex-wrap gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 shrink-0">
            <FileCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="font-mono text-xs font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                {report.reportId}
              </span>
              <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full">
                {report.testType}
              </span>
            </div>
            <h4 className="text-base font-bold text-slate-900">{report.reportName}</h4>
            <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 flex-wrap">
              <span className="flex items-center gap-1">
                <Building className="w-3.5 h-3.5 text-slate-400" /> {report.laboratory}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />{' '}
                {new Date(report.testDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleExplainWithAi}
            loading={explaining}
            icon={Sparkles}
            className="text-purple-700 hover:bg-purple-50 border border-purple-200"
          >
            Explain with AI
          </Button>

          {report.reportFileUrl && (
            <a
              href={report.reportFileUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition"
            >
              <Download className="w-3.5 h-3.5" /> PDF
            </a>
          )}
        </div>
      </div>

      {/* Summary preview */}
      {report.resultSummary && (
        <div className="px-5 pb-4">
          <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-700 border border-slate-100">
            <strong className="text-slate-900 font-semibold block mb-0.5">Laboratory Summary:</strong>
            <p className="leading-relaxed">{report.resultSummary}</p>
          </div>
        </div>
      )}

      {/* Structured Results Table toggle */}
      {hasStructured && (
        <div className="border-t border-slate-100">
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full px-5 py-3 bg-slate-50/70 hover:bg-slate-100/70 text-xs font-semibold text-slate-700 flex items-center justify-between transition cursor-pointer"
          >
            <span>Laboratory Measured Values ({report.structuredResults.length} metrics)</span>
            <span className="flex items-center gap-1 text-medivault-700">
              {expanded ? 'Hide table' : 'View table'}
              {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </span>
          </button>

          {expanded && (
            <div className="p-5 overflow-x-auto bg-white">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50">
                    <th className="py-2 px-3">Test Indicator</th>
                    <th className="py-2 px-3">Measured Value</th>
                    <th className="py-2 px-3">Reference Range</th>
                    <th className="py-2 px-3">Result Flag</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {report.structuredResults.map((res, i) => (
                    <tr key={i} className="hover:bg-slate-50/60">
                      <td className="py-2.5 px-3 font-semibold text-slate-800">{res.testName}</td>
                      <td className="py-2.5 px-3 font-bold text-slate-900">
                        {res.value} <span className="font-normal text-slate-500">{res.unit}</span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 font-mono text-[11px]">
                        {res.referenceRange || 'Standard reference'}
                      </td>
                      <td className="py-2.5 px-3">
                        <Badge variant={res.flag}>{res.flag}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* AI Explanation Modal */}
      {showAiModal && aiExplanation && (
        <Modal
          isOpen={showAiModal}
          onClose={() => setShowAiModal(false)}
          title={`AI Educational Explanation — ${aiExplanation.reportName}`}
          subtitle={`${aiExplanation.testType} performed at ${aiExplanation.laboratory}`}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-4 text-xs">
            {/* Disclaimer Alert */}
            <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3 text-amber-900">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <p className="leading-relaxed">{aiExplanation.disclaimer}</p>
            </div>

            {/* Medical Terms Explained */}
            <div>
              <h5 className="font-bold text-sm text-slate-900 mb-2">Medical Terms in Plain Language:</h5>
              <div className="space-y-2">
                {aiExplanation.educationalTerms?.map((term, i) => (
                  <div key={i} className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <strong className="text-slate-800 block text-xs">{term.term}:</strong>
                    <p className="text-slate-600 mt-0.5 leading-relaxed">{term.explanation}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Breakdown of Values */}
            {aiExplanation.resultsBreakdown?.length > 0 && (
              <div>
                <h5 className="font-bold text-sm text-slate-900 mb-2">Detailed Results Breakdown:</h5>
                <div className="space-y-2">
                  {aiExplanation.resultsBreakdown.map((item, i) => (
                    <div key={i} className="p-3 bg-white rounded-lg border border-slate-200 shadow-xs">
                      <div className="flex items-center justify-between">
                        <strong className="text-slate-900">{item.testName}</strong>
                        <span className="font-mono font-bold text-slate-800">{item.value}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Lab Reference Range: {item.laboratoryRange}
                      </div>
                      <p className="text-slate-600 mt-1 italic">{item.simpleExplanation}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default LabReportCard;
