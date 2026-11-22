import React, { useState, useEffect } from 'react';
import TimelineView from '../../components/medical/TimelineView';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import api from '../../services/api';

export const HealthTimelinePage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTimeline = async () => {
      try {
        const res = await api.get('/patients/me/timeline?sort=desc');
        if (res.data.success) {
          setEvents(res.data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTimeline();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-card">
        <span className="text-xs uppercase font-bold tracking-wider text-medivault-700">Chronological Record</span>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">Unified Health Timeline</h1>
        <p className="text-xs text-slate-500 mt-1 max-w-2xl">
          Complete chronological synthesis combining all consultations, prescriptions, diagnostic reports, surgeries, and vitals across your lifetime.
        </p>
      </div>

      {/* Interactive Timeline Component */}
      {loading ? <LoadingSkeleton count={4} /> : <TimelineView events={events} />}
    </div>
  );
};

export default HealthTimelinePage;
