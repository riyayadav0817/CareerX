import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import JobCard from '../components/JobCard';
import ApplyModal from '../components/ApplyModal';
import { useAuth } from '../context/AuthContext';
import {
  Building2,
  MapPin,
  Briefcase,
  DollarSign,
  Clock,
  CheckCircle2,
  Bookmark,
  Share2,
  Calendar,
  Globe,
  Users,
  Award,
  Sparkles,
  ArrowLeft,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

export default function JobDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [job, setJob] = useState(null);
  const [similarJobs, setSimilarJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.get(`/jobs/${id}`);
        if (res.data.success) {
          setJob(res.data.job);
          setSimilarJobs(res.data.similarJobs || []);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Job posting not found');
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
    window.scrollTo(0, 0);
  }, [id]);

  // Check saved state if candidate
  useEffect(() => {
    if (user && user.role === 'jobseeker' && job) {
      api.get('/applications/saved-jobs')
        .then((res) => {
          if (res.data.success) {
            const hasIt = res.data.jobs.some((j) => j._id === job._id);
            setIsSaved(hasIt);
          }
        })
        .catch(() => {});
    }
  }, [user, job]);

  const handleSaveToggle = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      if (isSaved) {
        await api.delete(`/applications/saved-jobs/${job._id}`);
        setIsSaved(false);
      } else {
        await api.post(`/applications/saved-jobs/${job._id}`);
        setIsSaved(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const formatSalary = (salary) => {
    if (!salary || (!salary.min && !salary.max)) return 'Competitive';
    const minK = salary.min ? `$${Math.round(salary.min / 1000)}k` : '';
    const maxK = salary.max ? `$${Math.round(salary.max / 1000)}k` : '';
    if (minK && maxK) return `${minK} - ${maxK} / year`;
    if (minK) return `From ${minK} / year`;
    return `Up to ${maxK} / year`;
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-sm text-slate-500 font-medium">Loading position details...</p>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-[70vh] max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <Briefcase className="w-12 h-12 text-slate-300 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900">{error || 'Job Not Found'}</h2>
        <p className="text-sm text-slate-500">
          This position may have been closed, fulfilled, or is temporarily unlisted.
        </p>
        <Link
          to="/jobs"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Browse Active Jobs</span>
        </Link>
      </div>
    );
  }

  const { company } = job;

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-6">
          <Link to="/" className="hover:text-indigo-600">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link to="/jobs" className="hover:text-indigo-600">Jobs</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-800 truncate max-w-xs">{job.title}</span>
        </nav>

        {/* Hero Card with Job Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/90 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            {/* Left: Company Logo + Title + Badges */}
            <div className="flex items-start gap-5">
              {company?.logo ? (
                <img
                  src={company.logo}
                  alt={company.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-contain p-2 border border-slate-100 bg-slate-50 shrink-0"
                />
              ) : (
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-2xl shrink-0">
                  <Building2 className="w-8 h-8" />
                </div>
              )}

              <div>
                <div className="flex items-center gap-2">
                  <Link
                    to={`/companies/${company?._id || ''}`}
                    className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors flex items-center gap-1.5"
                  >
                    <span>{company?.name}</span>
                    {company?.verified && (
                      <CheckCircle2 className="w-4 h-4 text-indigo-600 fill-indigo-100" />
                    )}
                  </Link>
                  <span className="text-slate-300">•</span>
                  <span className="text-xs text-slate-500">{job.category}</span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                  {job.title}
                </h1>

                {/* Key badges */}
                <div className="flex flex-wrap items-center gap-2.5 mt-3 text-xs font-medium text-slate-600">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-slate-100 text-slate-700">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    {job.location}
                  </span>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-indigo-50 text-indigo-700 font-semibold">
                    {job.workMode}
                  </span>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-slate-100 text-slate-700">
                    <Briefcase className="w-3.5 h-3.5 text-slate-500" />
                    {job.jobType}
                  </span>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-slate-100 text-slate-700">
                    <Award className="w-3.5 h-3.5 text-slate-500" />
                    {job.experienceLevel}
                  </span>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-emerald-50 text-emerald-700 font-bold">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                    {formatSalary(job.salary)}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex flex-wrap items-center gap-3 shrink-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100">
              <button
                onClick={handleShare}
                className="p-3 rounded-2xl border border-slate-200 text-slate-600 hover:text-indigo-600 hover:bg-slate-50 transition-colors relative"
                title="Share link"
              >
                <Share2 className="w-5 h-5" />
                {copiedLink && (
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded-md bg-slate-900 text-white text-[10px] font-semibold">
                    Copied!
                  </span>
                )}
              </button>

              <button
                onClick={handleSaveToggle}
                className={`p-3 rounded-2xl border transition-colors ${
                  isSaved
                    ? 'border-indigo-200 bg-indigo-50 text-indigo-600'
                    : 'border-slate-200 text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
                }`}
                title={isSaved ? 'Remove from saved' : 'Save job'}
              >
                <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-indigo-600' : ''}`} />
              </button>

              <button
                onClick={() => setApplyModalOpen(true)}
                className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold text-sm shadow-md shadow-indigo-500/25 transition-all transform hover:-translate-y-0.5"
              >
                Apply Now
              </button>
            </div>
          </div>
        </div>

        {/* Content Columns: Left Main Info, Right Company Widget */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Job Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Required Skills */}
            {job.skills && job.skills.length > 0 && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200/90">
                <h3 className="font-bold text-slate-900 text-lg mb-4">Required Skills & Technologies</h3>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3.5 py-1.5 rounded-xl bg-indigo-50/80 border border-indigo-100 text-xs font-semibold text-indigo-700"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200/90 space-y-4">
              <h3 className="font-bold text-slate-900 text-lg">Role Overview</h3>
              <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                {job.description}
              </p>
            </div>

            {/* Responsibilities */}
            {job.responsibilities && job.responsibilities.length > 0 && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200/90">
                <h3 className="font-bold text-slate-900 text-lg mb-4">Key Responsibilities</h3>
                <ul className="space-y-3">
                  {job.responsibilities.map((resp, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-slate-600">
                      <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                      <span>{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Qualifications */}
            {job.qualifications && job.qualifications.length > 0 && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200/90">
                <h3 className="font-bold text-slate-900 text-lg mb-4">Candidate Qualifications</h3>
                <ul className="space-y-3">
                  {job.qualifications.map((qual, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-slate-600">
                      <div className="w-2 h-2 rounded-full bg-indigo-600 shrink-0 mt-2"></div>
                      <span>{qual}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Benefits & Perks */}
            {job.benefits && job.benefits.length > 0 && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200/90">
                <h3 className="font-bold text-slate-900 text-lg mb-4">Perks & Benefits</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {job.benefits.map((benefit, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 text-xs font-medium text-slate-700 flex items-center gap-2.5"
                    >
                      <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar: Company Card & Quick Overview */}
          <div className="space-y-6">
            {/* About Company Card */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200/90 space-y-5">
              <h3 className="font-bold text-slate-900 text-base">About the Employer</h3>

              <div className="flex items-center gap-4">
                {company?.logo ? (
                  <img
                    src={company.logo}
                    alt={company.name}
                    className="w-14 h-14 rounded-2xl object-contain p-1 border border-slate-100 bg-slate-50"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center font-bold text-indigo-600 text-xl">
                    <Building2 className="w-7 h-7" />
                  </div>
                )}
                <div>
                  <h4 className="font-bold text-slate-900 text-base">{company?.name}</h4>
                  <p className="text-xs text-slate-500">{company?.industry || 'Technology'}</p>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {company?.about || company?.description || 'A world-class SaaS enterprise building cutting-edge digital experiences.'}
              </p>

              <div className="space-y-2.5 pt-3 border-t border-slate-100 text-xs text-slate-600">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Headquarters:</span>
                  <span className="font-semibold text-slate-800">{company?.location || 'San Francisco, CA'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Company Size:</span>
                  <span className="font-semibold text-slate-800">{company?.companySize || '500+'} employees</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Founded:</span>
                  <span className="font-semibold text-slate-800">{company?.foundedYear || 2015}</span>
                </div>
                {company?.website && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Website:</span>
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-indigo-600 hover:underline flex items-center gap-1"
                    >
                      Visit site <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>

              <Link
                to={`/companies/${company?._id || ''}`}
                className="w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors mt-2"
              >
                <span>View Company Profile & Open Jobs</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Quick Summary Info */}
            <div className="bg-indigo-50/60 p-6 rounded-3xl border border-indigo-100 space-y-4">
              <h3 className="font-bold text-indigo-950 text-sm">Position Highlights</h3>
              <div className="space-y-3 text-xs text-slate-600">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Applications:</span>
                  <span className="font-bold text-slate-800">{job.applicantCount || 0} candidates</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Views:</span>
                  <span className="font-bold text-slate-800">{job.viewsCount || 1} views</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Date Posted:</span>
                  <span className="font-bold text-slate-800">
                    {new Date(job.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setApplyModalOpen(true)}
                className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/20 transition-all text-center block"
              >
                Apply for this Role
              </button>
            </div>
          </div>
        </div>

        {/* Similar Jobs Section */}
        {similarJobs.length > 0 && (
          <div className="mt-16 pt-12 border-t border-slate-200/80">
            <h2 className="text-2xl font-extrabold text-slate-900 mb-8">
              Similar Opportunities You Might Like
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarJobs.map((simJob) => (
                <JobCard key={simJob._id} job={simJob} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Apply Modal */}
      <ApplyModal
        job={job}
        isOpen={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
        onSuccess={() => {
          alert('Congratulations! Your application has been submitted to the recruiting team.');
        }}
      />
    </div>
  );
}
