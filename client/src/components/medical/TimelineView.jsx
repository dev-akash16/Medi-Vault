import React, { useState } from 'react';
import {
  Stethoscope,
  Pill,
  FileCheck,
  Activity,
  AlertCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  Filter,
  Calendar,
} from 'lucide-react';
import Badge from '../common/Badge';

const eventTypeStyles = {
  Consultation: {
    icon: Stethoscope,
    bg: 'bg-blue-500',
    border: 'border-blue-200',
    light: 'bg-blue-50',
    text: 'text-blue-700',
  },
  Prescription: {
    icon: Pill,
    bg: 'bg-emerald-500',
    border: 'border-emerald-200',
    light: 'bg-emerald-50',
    text: 'text-emerald-700',
  },
  'Lab Report': {
    icon: FileCheck,
    bg: 'bg-purple-500',
    border: 'border-purple-200',
    light: 'bg-purple-50',
    text: 'text-purple-700',
  },
  Diagnosis: {
    icon: Activity,
    bg: 'bg-amber-500',
    border: 'border-amber-200',
    light: 'bg-amber-50',
    text: 'text-amber-700',
  },
  Surgery: {
    icon: AlertCircle,
    bg: 'bg-rose-500',
    border: 'border-rose-200',
    light: 'bg-rose-50',
    text: 'text-rose-700',
  },
  Allergy: {
    icon: AlertCircle,
    bg: 'bg-red-500',
    border: 'border-red-200',
    light: 'bg-red-50',
    text: 'text-red-700',
  },
  Vitals: {
    icon: Activity,
    bg: 'bg-teal-500',
    border: 'border-teal-200',
    light: 'bg-teal-50',
    text: 'text-teal-700',
  },
  Hospitalization: {
    icon: Clock,
    bg: 'bg-indigo-500',
    border: 'border-indigo-200',
    light: 'bg-indigo-50',
    text: 'text-indigo-700',
  },
  Vaccination: {
    icon: FileCheck,
    bg: 'bg-cyan-500',
    border: 'border-cyan-200',
    light: 'bg-cyan-50',
    text: 'text-cyan-700',
  },
};

export const TimelineView = ({ events = [], isLoading = false }) => {
  const [expandedEvents, setExpandedEvents] = useState({});
  const [selectedType, setSelectedType] = useState('All');
  const [sortOrder, setSortOrder] = useState('desc'); // 'desc' or 'asc'

  const toggleExpand = (id) => {
    setExpandedEvents((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const types = ['All', 'Consultation', 'Prescription', 'Lab Report', 'Diagnosis', 'Surgery', 'Allergy', 'Vaccination'];

  const filteredEvents = events.filter((e) => {
    if (selectedType === 'All') return true;
    return e.eventType?.toLowerCase() === selectedType.toLowerCase();
  });

  const sortedEvents = [...filteredEvents].sort((a, b) => {
    const timeA = new Date(a.date).getTime();
    const timeB = new Date(b.date).getTime();
    return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
  });

  return (
    <div className="space-y-6">
      {/* Filters & Sorting Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <Filter className="w-4 h-4 text-slate-400 mr-1 shrink-0" />
          {types.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                selectedType === type
                  ? 'bg-medivault-800 text-white font-semibold'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <button
          onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
          className="flex items-center gap-2 text-xs font-semibold text-medivault-700 bg-medivault-50 border border-medivault-200 px-3 py-1.5 rounded-lg hover:bg-medivault-100 transition cursor-pointer"
        >
          <Calendar className="w-3.5 h-3.5" />
          {sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}
        </button>
      </div>

      {/* Events Timeline */}
      <div className="relative pl-6 sm:pl-8 border-l-2 border-slate-200 space-y-6">
        {sortedEvents.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center text-slate-500 text-sm">
            No timeline events match the selected filter.
          </div>
        ) : (
          sortedEvents.map((event) => {
            const style = eventTypeStyles[event.eventType] || eventTypeStyles.Consultation;
            const Icon = style.icon;
            const isExpanded = !!expandedEvents[event.id];

            return (
              <div key={event.id} className="relative group">
                {/* Timeline Dot Indicator */}
                <div
                  className={`absolute -left-[35px] sm:-left-[43px] top-1.5 w-7 h-7 sm:w-8 sm:h-8 rounded-full ${style.bg} text-white flex items-center justify-center shadow-md ring-4 ring-white shrink-0`}
                >
                  <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                </div>

                {/* Event Card */}
                <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-card hover:shadow-hover transition duration-200">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span
                          className={`text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${style.light} ${style.text} ${style.border}`}
                        >
                          {event.eventType}
                        </span>
                        <span className="text-xs font-mono text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                          {event.recordId}
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-slate-900">{event.title}</h4>
                      {event.subtitle && <p className="text-xs text-slate-500 mt-0.5">{event.subtitle}</p>}
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-semibold text-slate-700 block">
                        {new Date(event.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                      {event.doctor && (
                        <span className="text-[11px] text-slate-500 mt-0.5 block">{event.doctor}</span>
                      )}
                    </div>
                  </div>

                  {/* Summary row */}
                  {event.clinic && (
                    <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                      <span>Facility: <strong className="text-slate-700">{event.clinic}</strong></span>
                      <button
                        onClick={() => toggleExpand(event.id)}
                        className="flex items-center gap-1 text-medivault-700 font-medium hover:underline cursor-pointer"
                      >
                        {isExpanded ? (
                          <>Less <ChevronUp className="w-3.5 h-3.5" /></>
                        ) : (
                          <>Details <ChevronDown className="w-3.5 h-3.5" /></>
                        )}
                      </button>
                    </div>
                  )}

                  {/* Expandable Clinical Details */}
                  {isExpanded && (
                    <div className="mt-4 pt-3 border-t border-slate-100 bg-slate-50/70 -mx-5 -mb-5 p-5 rounded-b-2xl space-y-2.5 text-xs text-slate-700">
                      {event.details && (
                        <div>
                          <strong className="text-slate-900 block mb-0.5">Clinical Notes / Summary:</strong>
                          <p className="leading-relaxed text-slate-600">{event.details}</p>
                        </div>
                      )}
                      {event.diagnoses && (
                        <div>
                          <strong className="text-slate-900">Diagnosis: </strong>
                          <span className="text-slate-600">{event.diagnoses}</span>
                        </div>
                      )}
                      {event.treatmentPlan && (
                        <div>
                          <strong className="text-slate-900">Treatment Plan: </strong>
                          <span className="text-slate-600">{event.treatmentPlan}</span>
                        </div>
                      )}
                      {event.medicines && (
                        <div>
                          <strong className="text-slate-900">Prescribed Medications: </strong>
                          <span className="text-slate-600 font-mono text-[11px]">{event.medicines}</span>
                        </div>
                      )}
                      {event.precautions && (
                        <div>
                          <strong className="text-slate-900">Precautions: </strong>
                          <span className="text-slate-600">{event.precautions}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default TimelineView;
