import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import JobCard from '../components/JobCard';
import ApplyModal from '../components/ApplyModal';
import {
  Building2,
  MapPin,
  Globe,
  Users,
  Calendar,
  CheckCircle2,
  Briefcase,
  ExternalLink,
  ChevronRight,
  ArrowLeft
} from 'lucide-react';

export default function CompanyDetailPage() {
  const { idOrSlug } = useParams();
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedJobForApply, setSelectedJobForApply] = useState(null);

  useEffect(() => {
    const fetchCompany = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/companies/${idOrSlug}`);
        if (res.data.success) {
          setCompany(res.data.company);
          setJobs(res.data.jobs || []);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Company not found');
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
    window.scrollTo(0, 0);
  }, [idOrSlug]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-sm text-slate-500 font-medium">Loading company profile...</p>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="min-h-[70vh] max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <Building2 className="w-12 h-12 text-slate-300 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900">{error || 'Company Not Found'}</h2>
        <Link
          to="/companies"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Companies</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-6">
          <Link to="/" className="hover:text-indigo-600">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link to="/companies" className="hover:text-indigo-600">Companies</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-800">{company.name}</span>
        </nav>

        {/* Company Header Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/90 mb-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-5">
              {company.logo ? (
                <img
                  src={company.logo}
                  alt={company.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-contain p-2 border border-slate-100 bg-slate-50 shrink-0"
                />
              ) : (
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center font-bold text-indigo-600 text-2xl shrink-0">
                  <Building2 className="w-8 h-8" />
                </div>
              )}
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-2">
                  <span>{company.name}</span>
                  {company.verified && (
                    <CheckCircle2 className="w-5 h-5 text-indigo-600 fill-indigo-100" />
                  )}
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 flex flex-wrap items-center gap-2">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> {company.location}
                  </span>
                  <span>•</span>
                  <span>{company.industry}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" /> {company.companySize || '500+'} employees
                  </span>
                </p>
              </div>
            </div>

            {company.website && (
              <a
                href={company.website}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl border border-slate-200 text-slate-700 font-semibold text-xs hover:border-indigo-400 hover:text-indigo-600 transition-colors shadow-2xs"
              >
                <span>Visit Company Website</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>

          <div className="mt-6 pt-6 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">About Us</h3>
            <p className="text-sm text-slate-600 leading-relaxed max-w-4xl whitespace-pre-line">
              {company.about || company.description || 'Pioneering technology and customer solutions.'}
            </p>
          </div>
        </div>

        {/* Open Positions List */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
              <Briefcase className="w-6 h-6 text-indigo-600" />
              <span>Open Vacancies at {company.name}</span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700">
                {jobs.length}
              </span>
            </h2>
          </div>

          {jobs.length === 0 ? (
            <div className="bg-white p-10 rounded-3xl border border-slate-200/90 text-center space-y-3">
              <Briefcase className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">No active vacancies currently</h3>
              <p className="text-xs text-slate-500">Check back soon or explore other companies on CareerX.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job) => (
                <JobCard
                  key={job._id}
                  job={{ ...job, company }}
                  onQuickApply={(j) => setSelectedJobForApply(j)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Apply Modal */}
      <ApplyModal
        job={selectedJobForApply}
        isOpen={Boolean(selectedJobForApply)}
        onClose={() => setSelectedJobForApply(null)}
        onSuccess={() => {
          alert('Application successfully submitted!');
        }}
      />
    </div>
  );
}
