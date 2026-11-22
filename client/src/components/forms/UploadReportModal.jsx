import React, { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { FileCheck, UploadCloud, Plus, Trash2 } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export const UploadReportModal = ({ isOpen, onClose, patientId, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [reportName, setReportName] = useState('');
  const [testType, setTestType] = useState('Blood test');
  const [laboratory, setLaboratory] = useState('');
  const [testDate, setTestDate] = useState(new Date().toISOString().split('T')[0]);
  const [resultSummary, setResultSummary] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [structuredResults, setStructuredResults] = useState([
    { testName: '', value: '', unit: '', referenceRange: '', flag: 'Normal' },
  ]);

  const handleAddMetric = () => {
    setStructuredResults([
      ...structuredResults,
      { testName: '', value: '', unit: '', referenceRange: '', flag: 'Normal' },
    ]);
  };

  const handleRemoveMetric = (idx) => {
    setStructuredResults(structuredResults.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reportName || !laboratory) {
      toast.error('Report name and laboratory name are required.');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      if (patientId) formData.append('patientId', patientId);
      formData.append('reportName', reportName);
      formData.append('testType', testType);
      formData.append('laboratory', laboratory);
      formData.append('testDate', testDate);
      formData.append('resultSummary', resultSummary);

      const validMetrics = structuredResults.filter((m) => m.testName.trim() !== '');
      if (validMetrics.length > 0) {
        formData.append('structuredResults', JSON.stringify(validMetrics));
      }

      if (selectedFile) {
        formData.append('file', selectedFile);
      }

      const res = await api.post('/reports', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.success) {
        toast.success(res.data.message || 'Diagnostic report saved successfully!');
        if (onSuccess) onSuccess(res.data.data);
        onClose();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to upload report.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Upload Diagnostic Lab Report"
      subtitle="Upload PDF or imaging file and add structured values"
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Report Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Comprehensive Metabolic Panel (CMP)"
              value={reportName}
              onChange={(e) => setReportName(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Test Category</label>
            <select
              value={testType}
              onChange={(e) => setTestType(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
            >
              <option value="Blood test">Blood test</option>
              <option value="CBC">Complete Blood Count (CBC)</option>
              <option value="Lipid profile">Lipid profile</option>
              <option value="Blood glucose">Blood glucose / HbA1c</option>
              <option value="Thyroid">Thyroid Function</option>
              <option value="Urine test">Urinalysis</option>
              <option value="X-ray">X-ray</option>
              <option value="MRI">MRI Scan</option>
              <option value="CT scan">CT Scan</option>
              <option value="Ultrasound">Ultrasound</option>
              <option value="ECG">Electrocardiogram (ECG)</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Laboratory / Imaging Center *</label>
            <input
              type="text"
              required
              placeholder="e.g. Quest Diagnostics, Labcorp, Hospital Pathology"
              value={laboratory}
              onChange={(e) => setLaboratory(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Test Date</label>
            <input
              type="date"
              value={testDate}
              onChange={(e) => setTestDate(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
            />
          </div>
        </div>

        {/* File Drag/Select */}
        <div>
          <label className="block font-semibold text-slate-700 mb-1">Attach PDF or Image</label>
          <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center hover:bg-slate-50 transition cursor-pointer">
            <input
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={(e) => setSelectedFile(e.target.files[0])}
              className="hidden"
              id="report-file-input"
            />
            <label htmlFor="report-file-input" className="cursor-pointer block">
              <UploadCloud className="w-8 h-8 text-medivault-700 mx-auto mb-1" />
              <span className="text-xs font-semibold text-slate-800 block">
                {selectedFile ? selectedFile.name : 'Click to select report file (PDF, PNG, JPG)'}
              </span>
              <span className="text-[11px] text-slate-400">Maximum file size 10MB</span>
            </label>
          </div>
        </div>

        {/* Structured Results Table */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-slate-800 text-sm">Key Structured Values (Optional)</span>
            <button
              type="button"
              onClick={handleAddMetric}
              className="text-xs text-medivault-700 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Add Metric
            </button>
          </div>

          <div className="space-y-2">
            {structuredResults.map((m, idx) => (
              <div key={idx} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-2 sm:grid-cols-5 gap-2">
                <input
                  type="text"
                  placeholder="Indicator (e.g. Glucose)"
                  value={m.testName}
                  onChange={(e) => {
                    const copy = [...structuredResults];
                    copy[idx].testName = e.target.value;
                    setStructuredResults(copy);
                  }}
                  className="p-1.5 bg-white border border-slate-200 rounded text-xs"
                />
                <input
                  type="text"
                  placeholder="Value (e.g. 95)"
                  value={m.value}
                  onChange={(e) => {
                    const copy = [...structuredResults];
                    copy[idx].value = e.target.value;
                    setStructuredResults(copy);
                  }}
                  className="p-1.5 bg-white border border-slate-200 rounded text-xs font-bold"
                />
                <input
                  type="text"
                  placeholder="Unit (e.g. mg/dL)"
                  value={m.unit}
                  onChange={(e) => {
                    const copy = [...structuredResults];
                    copy[idx].unit = e.target.value;
                    setStructuredResults(copy);
                  }}
                  className="p-1.5 bg-white border border-slate-200 rounded text-xs"
                />
                <input
                  type="text"
                  placeholder="Range (e.g. 70-99)"
                  value={m.referenceRange}
                  onChange={(e) => {
                    const copy = [...structuredResults];
                    copy[idx].referenceRange = e.target.value;
                    setStructuredResults(copy);
                  }}
                  className="p-1.5 bg-white border border-slate-200 rounded text-xs"
                />
                <div className="flex items-center gap-1">
                  <select
                    value={m.flag}
                    onChange={(e) => {
                      const copy = [...structuredResults];
                      copy[idx].flag = e.target.value;
                      setStructuredResults(copy);
                    }}
                    className="p-1.5 bg-white border border-slate-200 rounded text-xs flex-1"
                  >
                    <option value="Normal">Normal</option>
                    <option value="High">High</option>
                    <option value="Low">Low</option>
                    <option value="Critical">Critical</option>
                  </select>
                  {structuredResults.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveMetric(idx)}
                      className="p-1.5 text-rose-500 hover:bg-rose-50 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">Result Summary / Notes</label>
          <textarea
            rows={2}
            placeholder="Official conclusion from laboratory pathologist or notes"
            value={resultSummary}
            onChange={(e) => setResultSummary(e.target.value)}
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
          />
        </div>

        <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" loading={loading} icon={FileCheck}>
            Save Diagnostic Report
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default UploadReportModal;
