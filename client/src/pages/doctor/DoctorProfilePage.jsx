import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { Stethoscope, Award, Building, DollarSign, Save, AlertCircle, CheckCircle2 } from 'lucide-react';

export const DoctorProfilePage = () => {
  const { user, profile, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    specialization: profile?.specialization || 'Cardiology',
    qualifications: profile?.qualifications || '',
    registrationNumber: profile?.registrationNumber || '',
    experience: profile?.experience || 5,
    clinicName: profile?.clinicName || '',
    consultationAddress: profile?.consultationAddress || '',
    consultationFee: profile?.consultationFee || 150,
    bio: profile?.bio || '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.patch('/doctors/me', formData);
      if (res.data.success) {
        toast.success('Doctor profile details updated successfully!');
        await refreshProfile();
      }
    } catch (err) {
      toast.error('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const isVerified = profile?.verificationStatus === 'verified';

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-card flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-medivault-800 to-cyan-500 text-white flex items-center justify-center font-bold text-2xl shadow-md">
            {user?.name?.charAt(0) || 'D'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900">Dr. {user?.name}</h1>
              <Badge variant={profile?.verificationStatus}>
                {isVerified ? 'Verified Physician' : 'Pending Verification'}
              </Badge>
            </div>
            <p className="text-xs font-mono text-cyan-600 mt-0.5">{profile?.doctorId}</p>
            <p className="text-xs text-slate-500">{profile?.specialization}</p>
          </div>
        </div>

        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-right">
          <span className="text-slate-400 block">Registration License</span>
          <span className="font-mono font-bold text-slate-800">{profile?.registrationNumber}</span>
        </div>
      </div>

      {/* Verification Details Box */}
      <div
        className={`p-4 rounded-2xl border text-xs flex items-start gap-3 ${
          isVerified
            ? 'bg-teal-50/70 border-teal-200 text-teal-900'
            : 'bg-amber-50/70 border-amber-200 text-amber-900'
        }`}
      >
        {isVerified ? (
          <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
        ) : (
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        )}
        <div>
          <strong className="block font-bold mb-0.5">
            {isVerified ? 'Official State Medical License Verified' : 'Credential Verification in Progress'}
          </strong>
          <p className="leading-relaxed">
            {isVerified
              ? `Your medical credentials were confirmed and authenticated by the system administrator. Remarks: "${profile?.verificationRemarks || 'Verified against medical state directory.'}"`
              : 'Your medical credentials have been submitted and are undergoing review by administrative staff. During this time, patients are notified that verification is pending.'}
          </p>
        </div>
      </div>

      {/* Edit Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-card">
        <form onSubmit={handleSubmit} className="space-y-6 text-xs">
          <div>
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 mb-4">
              Professional Practice Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email (Account ID)</label>
                <input
                  type="email"
                  disabled
                  value={user?.email || ''}
                  className="w-full p-2.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Specialization</label>
                <input
                  type="text"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Qualifications & Degrees</label>
                <input
                  type="text"
                  name="qualifications"
                  value={formData.qualifications}
                  onChange={handleChange}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Medical Registration Number</label>
                <input
                  type="text"
                  name="registrationNumber"
                  value={formData.registrationNumber}
                  onChange={handleChange}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Years of Experience</label>
                <input
                  type="number"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                />
              </div>

              <div className="col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Clinic / Hospital Affiliation</label>
                <input
                  type="text"
                  name="clinicName"
                  value={formData.clinicName}
                  onChange={handleChange}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                />
              </div>

              <div className="col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Consultation Address</label>
                <input
                  type="text"
                  name="consultationAddress"
                  value={formData.consultationAddress}
                  onChange={handleChange}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Standard Consultation Fee ($ USD)</label>
                <input
                  type="number"
                  name="consultationFee"
                  value={formData.consultationFee}
                  onChange={handleChange}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Contact Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                />
              </div>

              <div className="col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Doctor Biography</label>
                <textarea
                  rows={3}
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <Button variant="primary" type="submit" loading={loading} icon={Save}>
              Save Profile Updates
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DoctorProfilePage;
