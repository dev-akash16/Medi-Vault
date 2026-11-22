import React, { useState } from 'react';
import { FolderOpen, Download, Trash2, Calendar, FileText, ExternalLink } from 'lucide-react';
import Badge from '../common/Badge';

export const DocumentCard = ({ document, onDelete }) => {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const formatFileSize = (bytes) => {
    if (!bytes) return '150 KB';
    const kb = bytes / 1024;
    if (kb < 1024) return `${Math.round(kb)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-card hover:shadow-hover transition duration-200 flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
            <FolderOpen className="w-5 h-5" />
          </div>
          <Badge variant="default" size="sm">{document.category}</Badge>
        </div>

        <h4 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2">
          {document.title}
        </h4>

        {document.notes && (
          <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
            {document.notes}
          </p>
        )}
      </div>

      <div className="mt-5 pt-3.5 border-t border-slate-100">
        <div className="flex items-center justify-between text-[11px] text-slate-400 mb-3">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {new Date(document.date).toLocaleDateString()}
          </span>
          <span>{formatFileSize(document.fileSize)}</span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <a
            href={document.fileUrl}
            target="_blank"
            rel="noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold text-medivault-800 bg-medivault-50 hover:bg-medivault-100 transition"
          >
            <Download className="w-3.5 h-3.5" /> Download
          </a>

          {onDelete && (
            confirmDelete ? (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onDelete(document._id)}
                  className="px-2 py-1 text-[11px] font-bold text-white bg-rose-600 hover:bg-rose-700 rounded transition cursor-pointer"
                >
                  Yes
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="px-2 py-1 text-[11px] text-slate-600 hover:bg-slate-100 rounded transition cursor-pointer"
                >
                  No
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmDelete(true)}
                title="Delete document"
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentCard;
