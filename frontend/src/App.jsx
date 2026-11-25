import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import JobsPage from './pages/JobsPage';
import JobDetailPage from './pages/JobDetailPage';
import CompaniesPage from './pages/CompaniesPage';
import CompanyDetailPage from './pages/CompanyDetailPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import SeekerDashboard from './pages/dashboard/SeekerDashboard';
import RecruiterDashboard from './pages/dashboard/RecruiterDashboard';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import FAQPage from './pages/FAQPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';

// Placement Prep Pages
import PlacementPrepDashboard from './pages/prep/PlacementPrepDashboard';
import PracticeTopicPage from './pages/prep/PracticeTopicPage';
import CodingDsaPage from './pages/prep/CodingDsaPage';
import MockTestsPage from './pages/prep/MockTestsPage';
import MockTestLivePage from './pages/prep/MockTestLivePage';
import CompanyPrepPage from './pages/prep/CompanyPrepPage';
import CompanyPrepDetailPage from './pages/prep/CompanyPrepDetailPage';
import InterviewPrepPage from './pages/prep/InterviewPrepPage';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800">
          <Navbar />
          <div className="flex-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/jobs" element={<JobsPage />} />
              <Route path="/jobs/:id" element={<JobDetailPage />} />
              <Route path="/companies" element={<CompaniesPage />} />
              <Route path="/companies/:idOrSlug" element={<CompanyDetailPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />

              {/* Placement Preparation Ecosystem Routes */}
              <Route path="/placement-prep" element={<PlacementPrepDashboard />} />
              <Route path="/placement-prep/aptitude" element={<PracticeTopicPage category="aptitude" />} />
              <Route path="/placement-prep/reasoning" element={<PracticeTopicPage category="reasoning" />} />
              <Route path="/placement-prep/verbal" element={<PracticeTopicPage category="verbal" />} />
              <Route path="/placement-prep/core-cs" element={<PracticeTopicPage category="core-cs" />} />
              <Route path="/placement-prep/coding" element={<CodingDsaPage />} />
              <Route path="/placement-prep/coding/:id" element={<CodingDsaPage />} />
              <Route path="/mock-tests" element={<MockTestsPage />} />
              <Route path="/mock-tests/:id" element={<MockTestLivePage />} />
              <Route path="/company-prep" element={<CompanyPrepPage />} />
              <Route path="/company-prep/:slug" element={<CompanyPrepDetailPage />} />
              <Route path="/interview-prep" element={<InterviewPrepPage />} />

              {/* Authentication Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />

              {/* Job Seeker Protected Routes */}
              <Route
                path="/seeker/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['jobseeker']}>
                    <SeekerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/seeker/applications"
                element={
                  <ProtectedRoute allowedRoles={['jobseeker']}>
                    <SeekerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/seeker/saved"
                element={
                  <ProtectedRoute allowedRoles={['jobseeker']}>
                    <SeekerDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Recruiter Protected Routes */}
              <Route
                path="/recruiter/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['recruiter', 'admin']}>
                    <RecruiterDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/recruiter/post-job"
                element={
                  <ProtectedRoute allowedRoles={['recruiter', 'admin']}>
                    <RecruiterDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/recruiter/applicants"
                element={
                  <ProtectedRoute allowedRoles={['recruiter', 'admin']}>
                    <RecruiterDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Admin Protected Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}
