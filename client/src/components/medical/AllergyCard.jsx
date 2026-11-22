import React from 'react';
import { AlertCircle, AlertTriangle, ShieldAlert } from 'lucide-react';
import Badge from '../common/Badge';

export const AllergyCard = ({ allergy, onDelete, canDelete = false }) => {
  const isSevere = allergy.severity === 'Severe' || allergy.severity === 'Life-threatening';

  return (
    <div
      className={`rounded-2xl p-5 border transition duration-200 ${
        isSevere
          ? 'bg-rose-50/40 border-rose-200 shadow-sm'
          : 'bg-white border-slate-200/90 shadow-card'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              isSevere ? 'bg-rose-500 text-white animate-pulse' : 'bg-amber-100 text-amber-700'
            }`}
          >
            {isSevere ? <ShieldAlert className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-base font-bold text-slate-900">{allergy.allergyName}</h4>
              <Badge variant={allergy.severity}>{allergy.severity}</Badge>
            </div>
            <span className="text-xs font-medium text-slate-500 block mt-0.5">
              Category: {allergy.allergyType}
            </span>
          </div>
        </div>

        {canDelete && onDelete && (
          <button
            onClick={() => onDelete(allergy._id)}
            className="text-xs text-rose-500 hover:text-rose-700 hover:underline cursor-pointer"
          >
            Remove
          </button>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100/80 space-y-2 text-xs">
        <div>
          <strong className="text-slate-800">Allergic Reaction: </strong>
          <span className="text-slate-600 font-medium">{allergy.reaction}</span>
        </div>
        {allergy.notes && (
          <div>
            <strong className="text-slate-800">Clinical Precautions: </strong>
            <span className="text-slate-600">{allergy.notes}</span>
          </div>
        )}
        <div className="text-[11px] text-slate-400 pt-1 flex items-center justify-between">
          <span>Identified by: {allergy.identifiedBy}</span>
          <span>
            {new Date(allergy.dateIdentified).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AllergyCard;
