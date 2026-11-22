import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import PatientLayout from '../components/layout/PatientLayout';
import DoctorLayout from '../components/layout/DoctorLayout';
import AdminLayout from '../components/layout/AdminLayout';

// Public Pages
import LandingPage from '../pages/public/LandingPage';
import FeaturesPage from '../pages/public/FeaturesPage';
import HowItWorksPage from '../pages/public/HowItWorksPage';
import AboutPage from '../pages/public/AboutPage';
import ContactPage from '../pages/public/ContactPage';

// Auth Pages
import LoginPage from '../pages/auth/LoginPage';
import PatientRegisterPage from '../pages/auth/PatientRegisterPage';
import DoctorRegisterPage from '../pages/auth/DoctorRegisterPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';

// Patient Pages
import PatientDashboard from '../pages/patient/PatientDashboard';
import MedicalHistoryPage from '../pages/patient/MedicalHistoryPage';
import HealthTimelinePage from '../pages/patient/HealthTimelinePage';
import ConditionsPage from '../pages/patient/ConditionsPage';
import ConsultationsPage from '../pages/patient/ConsultationsPage';
import PrescriptionsPage from '../pages/patient/PrescriptionsPage';
import MedicationsPage from '../pages/patient/MedicationsPage';
import LabReportsPage from '../pages/patient/LabReportsPage';
import HealthVitalsPage from '../pages/patient/HealthVitalsPage';
import AllergiesPage from '../pages/patient/AllergiesPage';
import AppointmentsPage from '../pages/patient/AppointmentsPage';
import DocumentsPage from '../pages/patient/DocumentsPage';
import AccessPermissionsPage from '../pages/patient/AccessPermissionsPage';
import ExportRecordsPage from '../pages/patient/ExportRecordsPage';
import PatientProfilePage from '../pages/patient/PatientProfilePage';

// Doctor Pages
import DoctorDashboard from '../pages/doctor/DoctorDashboard';
import MyPatientsPage from '../pages/doctor/MyPatientsPage';
import PatientSearchPage from '../pages/doctor/PatientSearchPage';
import PatientClinicalProfilePage from '../pages/doctor/PatientClinicalProfilePage';
import DoctorConsultationsPage from '../pages/doctor/DoctorConsultationsPage';
import DoctorPrescriptionsPage from '../pages/doctor/DoctorPrescriptionsPage';
import DoctorAppointmentsPage from '../pages/doctor/DoctorAppointmentsPage';
import DoctorProfilePage from '../pages/doctor/DoctorProfilePage';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import UsersManagementPage from '../pages/admin/UsersManagementPage';
import DoctorVerificationPage from '../pages/admin/DoctorVerificationPage';
import AuditLogsPage from '../pages/admin/AuditLogsPage';

// Error Pages
import NotFoundPage from '../pages/error/NotFoundPage';
import UnauthorizedPage from '../pages/error/UnauthorizedPage';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/features" element={<FeaturesPage />} />
      <Route path="/how-it-works" element={<HowItWorksPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />

      {/* Auth Pages */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<Navigate to="/register/patient" replace />} />
      <Route path="/register/patient" element={<PatientRegisterPage />} />
      <Route path="/register/doctor" element={<DoctorRegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Patient Portal */}
      <Route path="/patient" element={<PatientLayout />}>
        <Route index element={<Navigate to="/patient/dashboard" replace />} />
        <Route path="dashboard" element={<PatientDashboard />} />
        <Route path="history" element={<MedicalHistoryPage />} />
        <Route path="timeline" element={<HealthTimelinePage />} />
        <Route path="conditions" element={<ConditionsPage />} />
        <Route path="consultations" element={<ConsultationsPage />} />
        <Route path="prescriptions" element={<PrescriptionsPage />} />
        <Route path="medications" element={<MedicationsPage />} />
        <Route path="lab-reports" element={<LabReportsPage />} />
        <Route path="vitals" element={<HealthVitalsPage />} />
        <Route path="allergies" element={<AllergiesPage />} />
        <Route path="appointments" element={<AppointmentsPage />} />
        <Route path="documents" element={<DocumentsPage />} />
        <Route path="access-permissions" element={<AccessPermissionsPage />} />
        <Route path="export" element={<ExportRecordsPage />} />
        <Route path="profile" element={<PatientProfilePage />} />
      </Route>

      {/* Doctor Portal */}
      <Route path="/doctor" element={<DoctorLayout />}>
        <Route index element={<Navigate to="/doctor/dashboard" replace />} />
        <Route path="dashboard" element={<DoctorDashboard />} />
        <Route path="patients" element={<MyPatientsPage />} />
        <Route path="patients/:patientId" element={<PatientClinicalProfilePage />} />
        <Route path="search" element={<PatientSearchPage />} />
        <Route path="consultations" element={<DoctorConsultationsPage />} />
        <Route path="prescriptions" element={<DoctorPrescriptionsPage />} />
        <Route path="appointments" element={<DoctorAppointmentsPage />} />
        <Route path="profile" element={<DoctorProfilePage />} />
      </Route>

      {/* Admin Portal */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<UsersManagementPage />} />
        <Route path="verifications" element={<DoctorVerificationPage />} />
        <Route path="audit-logs" element={<AuditLogsPage />} />
      </Route>

      {/* Error & Fallback */}
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
