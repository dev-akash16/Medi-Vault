import React, { useState, useEffect } from 'react';
import DocumentCard from '../../components/medical/DocumentCard';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { FolderOpen, UploadCloud, Plus, Search } from 'lucide-react';

export const DocumentsPage = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');

  // Upload Modal
  const [showModal, setShowModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [docCategory, setDocCategory] = useState('Hospital discharge summaries');
  const [notes, setNotes] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  const fetchDocuments = async () => {
    try {
      const res = await api.get('/documents');
      if (res.data.success) {
        setDocuments(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/documents/${id}`);
      toast.success('Document removed from vault.');
      fetchDocuments();
    } catch (err) {
      toast.error('Failed to remove document.');
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!title || !selectedFile) {
      toast.error('Title and file are required.');
      return;
    }

    setModalLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('category', docCategory);
      formData.append('notes', notes);
      formData.append('file', selectedFile);

      const res = await api.post('/documents', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.success) {
        toast.success('Document uploaded to vault.');
        fetchDocuments();
        setShowModal(false);
        setTitle('');
        setNotes('');
        setSelectedFile(null);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to upload document.');
    } finally {
      setModalLoading(false);
    }
  };

  const categories = [
    'All',
    'Prescriptions',
    'Lab reports',
    'Hospital discharge summaries',
    'Insurance documents',
    'Medical certificates',
    'Imaging reports',
    'Surgery documents',
    'Vaccination certificates',
    'Other healthcare documents',
  ];

  const filtered = documents.filter((d) => {
    if (category !== 'All' && d.category !== category) return false;
    if (search && !d.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  if (loading) return <LoadingSkeleton count={3} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-card flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-medivault-700">Encrypted Repository</span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">Medical Document Vault</h1>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            Securely upload, preview, and archive discharge summaries, surgery records, insurance cards, and certificates.
          </p>
        </div>

        <Button variant="primary" size="md" icon={UploadCloud} onClick={() => setShowModal(true)}>
          Upload Medical Document
        </Button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-100">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 max-w-2xl">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                category === c
                  ? 'bg-medivault-800 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search documents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:bg-white"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={FolderOpen}
          title="No documents in this category"
          description="Upload medical certificates, discharge forms, and imaging PDFs."
          actionText="Upload Document"
          onAction={() => setShowModal(true)}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((doc) => (
            <DocumentCard key={doc._id} document={doc} onDelete={handleDelete} />
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {showModal && (
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title="Upload Medical Document"
          subtitle="Archive clinical records securely in your patient vault"
          maxWidth="max-w-md"
        >
          <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Document Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Discharge Summary Northwestern"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Category</label>
              <select
                value={docCategory}
                onChange={(e) => setDocCategory(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
              >
                {categories.filter((c) => c !== 'All').map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Attach File (PDF, PNG, JPG) *</label>
              <input
                type="file"
                required
                accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                onChange={(e) => setSelectedFile(e.target.files[0])}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Notes / Summary</label>
              <textarea
                rows={2}
                placeholder="Brief summary or details about this document"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
              <Button variant="secondary" size="sm" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" loading={modalLoading} icon={UploadCloud}>
                Upload Document
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default DocumentsPage;
