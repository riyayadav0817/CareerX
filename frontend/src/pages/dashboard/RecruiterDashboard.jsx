import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import {
  Briefcase,
  Users,
  PlusCircle,
  Building2,
  Calendar,
  Video,
  CheckCircle2,
  Clock,
  Trash2,
  Edit,
  ExternalLink,
  Upload,
  Search,
  Filter,
  Eye,
  FileText,
  Mail,
  MapPin,
  Sparkles,
  X
} from 'lucide-react';

export default function RecruiterDashboard() {
  const { user, updateUser } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'jobs';

  const [jobs, setJobs] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter Applicants State
  const [selectedJobFilter, setSelectedJobFilter] = useState(searchParams.get('jobId') || '');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('All');
  const [applicantSearch, setApplicantSearch] = useState('');

  // Post / Edit Job State
  const [isEditingJob, setIsEditingJob] = useState(null);
  const [jobFormData, setJobFormData] = useState({
    title: '',
    category: 'Software Engineering',
    location: '',
    workMode: 'Remote',
    jobType: 'Full-time',
    experienceLevel: 'Mid Level',
    minSalary: 120000,
    maxSalary: 160000,
    description: '',
    responsibilities: '',
    qualifications: '',
    skills: '',
    benefits: '',
    featured: false,
  });
  const [jobFormLoading, setJobFormLoading] = useState(false);
  const [jobFormMsg, setJobFormMsg] = useState('');

  // Schedule Interview Modal State
  const [interviewModalApp, setInterviewModalApp] = useState(null);
  const [interviewData, setInterviewData] = useState({
    scheduledAt: '',
    meetingLink: '',
    round: 'Round 1: Technical Screen',
    notes: '',
  });

  // Company Profile Form
  const [companyData, setCompanyData] = useState({
    name: user?.company?.name || '',
    website: user?.company?.website || '',
    industry: user?.company?.industry || 'Technology',
    companySize: user?.company?.companySize || '51-200',
    location: user?.company?.location || '',
    description: user?.company?.description || '',
    about: user?.company?.about || '',
    logo: user?.company?.logo || '',
  });
  const [logoFile, setLogoFile] = useState(null);
  const [savingCompany, setSavingCompany] = useState(false);
  const [companyMsg, setCompanyMsg] = useState('');

  // Fetch recruiter data
  const fetchData = async () => {
    setLoading(true);
    try {
      const [jobsRes, appsRes] = await Promise.all([
        api.get('/jobs/recruiter/my-jobs'),
        api.get(`/applications/recruiter/applicants?jobId=${selectedJobFilter}`),
      ]);
      if (jobsRes.data.success) setJobs(jobsRes.data.jobs);
      if (appsRes.data.success) setApplicants(appsRes.data.applications);
    } catch (err) {
      console.error('Error fetching recruiter dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedJobFilter]);

  const setTab = (tabName) => {
    setSearchParams({ tab: tabName });
  };

  // Job deletion
  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job posting? This will remove all associated applications.')) return;
    try {
      const res = await api.delete(`/jobs/${jobId}`);
      if (res.data.success) {
        setJobs((prev) => prev.filter((j) => j._id !== jobId));
        alert('Job posting deleted successfully.');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Could not delete job.');
    }
  };

  // Post / Update Job Submit
  const handleJobFormSubmit = async (e) => {
    e.preventDefault();
    setJobFormLoading(true);
    setJobFormMsg('');

    try {
      const payload = {
        title: jobFormData.title,
        category: jobFormData.category,
        location: jobFormData.location,
        workMode: jobFormData.workMode,
        jobType: jobFormData.jobType,
        experienceLevel: jobFormData.experienceLevel,
        salary: {
          min: Number(jobFormData.minSalary),
          max: Number(jobFormData.maxSalary),
          currency: 'USD',
          period: 'year',
        },
        description: jobFormData.description,
        responsibilities: jobFormData.responsibilities,
        qualifications: jobFormData.qualifications,
        skills: jobFormData.skills,
        benefits: jobFormData.benefits,
        featured: jobFormData.featured,
      };

      if (isEditingJob) {
        const res = await api.put(`/jobs/${isEditingJob}`, payload);
        if (res.data.success) {
          setJobFormMsg('Job vacancy updated successfully!');
          setIsEditingJob(null);
          fetchData();
          setTab('jobs');
        }
      } else {
        const res = await api.post('/jobs', payload);
        if (res.data.success) {
          setJobFormMsg('New job vacancy posted successfully!');
          resetJobForm();
          fetchData();
          setTab('jobs');
        }
      }
    } catch (err) {
      setJobFormMsg(err.response?.data?.message || 'Failed to save job posting.');
    } finally {
      setJobFormLoading(false);
    }
  };

  const startEditJob = (job) => {
    setIsEditingJob(job._id);
    setJobFormData({
      title: job.title,
      category: job.category,
      location: job.location,
      workMode: job.workMode,
      jobType: job.jobType,
      experienceLevel: job.experienceLevel,
      minSalary: job.salary?.min || 100000,
      maxSalary: job.salary?.max || 150000,
      description: job.description,
      responsibilities: Array.isArray(job.responsibilities) ? job.responsibilities.join('\n') : '',
      qualifications: Array.isArray(job.qualifications) ? job.qualifications.join('\n') : '',
      skills: Array.isArray(job.skills) ? job.skills.join(', ') : '',
      benefits: Array.isArray(job.benefits) ? job.benefits.join('\n') : '',
      featured: job.featured || false,
    });
    setTab('post');
  };

  const resetJobForm = () => {
    setIsEditingJob(null);
    setJobFormData({
      title: '',
      category: 'Software Engineering',
      location: '',
      workMode: 'Remote',
      jobType: 'Full-time',
      experienceLevel: 'Mid Level',
      minSalary: 120000,
      maxSalary: 160000,
      description: '',
      responsibilities: '',
      qualifications: '',
      skills: '',
      benefits: '',
      featured: false,
    });
  };

  // Update applicant status
  const handleUpdateStatus = async (appId, newStatus) => {
    try {
      const res = await api.put(`/applications/${appId}/status`, { status: newStatus });
      if (res.data.success) {
        setApplicants((prev) =>
          prev.map((a) => (a._id === appId ? { ...a, status: newStatus } : a))
        );
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Could not update status');
    }
  };

  // Submit interview schedule
  const handleScheduleInterviewSubmit = async (e) => {
    e.preventDefault();
    if (!interviewModalApp) return;

    try {
      const res = await api.put(`/applications/${interviewModalApp._id}/status`, {
        status: 'Interview Scheduled',
        interviewDetails: interviewData,
      });

      if (res.data.success) {
        setApplicants((prev) =>
          prev.map((a) => (a._id === interviewModalApp._id ? res.data.application : a))
        );
        alert('Interview scheduled and invitation delivered to candidate!');
        setInterviewModalApp(null);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Could not schedule interview.');
    }
  };

  // Save company profile
  const handleSaveCompany = async (e) => {
    e.preventDefault();
    setSavingCompany(true);
    setCompanyMsg('');

    try {
      // First upload logo if selected
      let uploadedLogoUrl = companyData.logo;
      if (logoFile) {
        const logoFormData = new FormData();
        logoFormData.append('logo', logoFile);
        const logoRes = await api.post('/companies/upload-logo', logoFormData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        if (logoRes.data.success) {
          uploadedLogoUrl = logoRes.data.logo;
        }
      }

      const res = await api.put('/companies/my-company', {
        ...companyData,
        logo: uploadedLogoUrl,
      });

      if (res.data.success) {
        setCompanyMsg('Company profile updated successfully!');
        setCompanyData(res.data.company);
        updateUser({ ...user, company: res.data.company });
      }
    } catch (err) {
      setCompanyMsg(err.response?.data?.message || 'Failed to update company.');
    } finally {
      setSavingCompany(false);
    }
  };

  // Filter applicants locally
  const filteredApplicants = applicants.filter((app) => {
    if (selectedStatusFilter !== 'All' && app.status !== selectedStatusFilter) return false;
    if (applicantSearch.trim()) {
      const q = applicantSearch.toLowerCase();
      const cand = app.applicant;
      const matchName = cand?.name?.toLowerCase().includes(q);
      const matchHead = cand?.headline?.toLowerCase().includes(q);
      const matchSkills = cand?.skills?.some((s) => s.toLowerCase().includes(q));
      if (!matchName && !matchHead && !matchSkills) return false;
    }
    return true;
  });

  const totalInterviews = applicants.filter((a) => a.status === 'Interview Scheduled').length;
  const totalShortlisted = applicants.filter((a) => a.status === 'Shortlisted').length;

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/90 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            {user?.company?.logo ? (
              <img
                src={user.company.logo}
                alt={user.company.name}
                className="w-16 h-16 rounded-2xl object-contain p-2 border border-slate-100 bg-slate-50"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-2xl">
                <Building2 className="w-8 h-8" />
              </div>
            )}
            <div>
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest block">
                Recruiter Talent Suite
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                {user?.company?.name || 'Recruiter Workspace'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Logged in as {user?.name} • {user?.headline || 'Talent Partner'}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              resetJobForm();
              setTab('post');
            }}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-500/20 flex items-center gap-2 transition-all shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post a New Job</span>
          </button>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
            <span className="text-xs font-semibold text-slate-500">Active Job Posts</span>
            <p className="text-2xl font-black text-slate-900 mt-1">{jobs.length}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
            <span className="text-xs font-semibold text-slate-500">Total Applicants</span>
            <p className="text-2xl font-black text-indigo-600 mt-1">{applicants.length}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
            <span className="text-xs font-semibold text-slate-500">Shortlisted Talent</span>
            <p className="text-2xl font-black text-blue-600 mt-1">{totalShortlisted}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
            <span className="text-xs font-semibold text-slate-500">Interviews Scheduled</span>
            <p className="text-2xl font-black text-purple-600 mt-1">{totalInterviews}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1">
          {[
            { id: 'jobs', label: 'Manage Jobs', count: jobs.length, icon: <Briefcase className="w-4 h-4" /> },
            { id: 'post', label: isEditingJob ? 'Edit Job' : 'Post New Job', icon: <PlusCircle className="w-4 h-4" /> },
            { id: 'applicants', label: 'Candidates & Applicants', count: applicants.length, icon: <Users className="w-4 h-4" /> },
            { id: 'company', label: 'Company Profile', icon: <Building2 className="w-4 h-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-white text-indigo-600 shadow-sm border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.count !== undefined && tab.count > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab 1: MANAGE JOBS */}
        {activeTab === 'jobs' && (
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Your Active Job Vacancies</h3>
                <p className="text-xs text-slate-500">Monitor views, applicant volume, and edit listings</p>
              </div>
            </div>

            {jobs.length === 0 ? (
              <div className="p-12 text-center space-y-3">
                <Briefcase className="w-10 h-10 text-slate-300 mx-auto" />
                <h4 className="font-bold text-slate-800 text-sm">No jobs posted yet</h4>
                <p className="text-xs text-slate-500">Post your first tech vacancy to begin receiving applications.</p>
                <button
                  onClick={() => setTab('post')}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-xs"
                >
                  Post a Job Now
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 border-b border-slate-100 uppercase tracking-wider text-[11px] font-bold text-slate-500">
                    <tr>
                      <th className="px-6 py-3.5">Job Title</th>
                      <th className="px-6 py-3.5">Category & Mode</th>
                      <th className="px-6 py-3.5">Applicants</th>
                      <th className="px-6 py-3.5">Views</th>
                      <th className="px-6 py-3.5">Posted Date</th>
                      <th className="px-6 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {jobs.map((job) => (
                      <tr key={job._id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-6 py-4 font-bold text-slate-900">
                          <Link to={`/jobs/${job._id}`} className="hover:text-indigo-600 transition-colors">
                            {job.title}
                          </Link>
                          {job.featured && (
                            <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700">
                              Featured
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className="block font-medium text-slate-700">{job.category}</span>
                          <span className="text-[11px] text-slate-400">{job.workMode} • {job.jobType}</span>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => {
                              setSelectedJobFilter(job._id);
                              setTab('applicants');
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors"
                          >
                            <Users className="w-3.5 h-3.5" />
                            <span>{job.applicantCount || 0} candidates</span>
                          </button>
                        </td>
                        <td className="px-6 py-4 text-slate-500 font-medium">
                          {job.viewsCount || 0}
                        </td>
                        <td className="px-6 py-4 text-slate-500">
                          {new Date(job.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <button
                            onClick={() => startEditJob(job)}
                            className="p-2 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-slate-100"
                            title="Edit job"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteJob(job._id)}
                            className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50"
                            title="Delete job"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: POST / EDIT JOB */}
        {activeTab === 'post' && (
          <form
            onSubmit={handleJobFormSubmit}
            className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-6 max-w-4xl"
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">
                  {isEditingJob ? 'Edit Job Posting' : 'Post a New Tech Vacancy'}
                </h3>
                <p className="text-xs text-slate-500">Provide rich details to attract top-tier candidates</p>
              </div>
              {jobFormMsg && <span className="text-xs font-bold text-indigo-600">{jobFormMsg}</span>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Job Title *
                </label>
                <input
                  type="text"
                  value={jobFormData.title}
                  onChange={(e) => setJobFormData({ ...jobFormData, title: e.target.value })}
                  placeholder="e.g. Senior Full Stack Engineer (React & Node.js)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 outline-none focus:border-indigo-600"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Job Category *
                </label>
                <select
                  value={jobFormData.category}
                  onChange={(e) => setJobFormData({ ...jobFormData, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 outline-none focus:border-indigo-600"
                >
                  <option value="Software Engineering">Software Engineering</option>
                  <option value="UI/UX Design">UI/UX Design</option>
                  <option value="Data & AI">Data & AI</option>
                  <option value="DevOps & Cloud">DevOps & Cloud</option>
                  <option value="Product Management">Product Management</option>
                  <option value="Marketing">Marketing</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Location *
                </label>
                <input
                  type="text"
                  value={jobFormData.location}
                  onChange={(e) => setJobFormData({ ...jobFormData, location: e.target.value })}
                  placeholder="e.g. San Francisco, CA or Remote"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 outline-none focus:border-indigo-600"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Work Mode
                </label>
                <select
                  value={jobFormData.workMode}
                  onChange={(e) => setJobFormData({ ...jobFormData, workMode: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 outline-none focus:border-indigo-600"
                >
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="On-site">On-site</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Employment Type
                </label>
                <select
                  value={jobFormData.jobType}
                  onChange={(e) => setJobFormData({ ...jobFormData, jobType: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 outline-none focus:border-indigo-600"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Internship">Internship</option>
                  <option value="Contract">Contract</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Min Salary ($ / year)
                </label>
                <input
                  type="number"
                  value={jobFormData.minSalary}
                  onChange={(e) => setJobFormData({ ...jobFormData, minSalary: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Max Salary ($ / year)
                </label>
                <input
                  type="number"
                  value={jobFormData.maxSalary}
                  onChange={(e) => setJobFormData({ ...jobFormData, maxSalary: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 outline-none focus:border-indigo-600"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Required Skills (Comma separated)
                </label>
                <input
                  type="text"
                  value={jobFormData.skills}
                  onChange={(e) => setJobFormData({ ...jobFormData, skills: e.target.value })}
                  placeholder="e.g. React, Node.js, TypeScript, Docker, AWS"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 outline-none focus:border-indigo-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Job Description *
              </label>
              <textarea
                rows={4}
                value={jobFormData.description}
                onChange={(e) => setJobFormData({ ...jobFormData, description: e.target.value })}
                placeholder="Give a thorough overview of the team, product mission, and technological stack..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 outline-none focus:border-indigo-600 resize-none"
                required
              ></textarea>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Responsibilities (One per line)
              </label>
              <textarea
                rows={3}
                value={jobFormData.responsibilities}
                onChange={(e) => setJobFormData({ ...jobFormData, responsibilities: e.target.value })}
                placeholder="Design distributed backend microservices in Node.js&#10;Lead sprint planning and technical architecture reviews"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 outline-none focus:border-indigo-600 resize-none"
              ></textarea>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Qualifications & Requirements (One per line)
              </label>
              <textarea
                rows={3}
                value={jobFormData.qualifications}
                onChange={(e) => setJobFormData({ ...jobFormData, qualifications: e.target.value })}
                placeholder="4+ years of professional React experience&#10;Deep understanding of PostgreSQL and Redis"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 outline-none focus:border-indigo-600 resize-none"
              ></textarea>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Perks & Benefits (One per line)
              </label>
              <textarea
                rows={3}
                value={jobFormData.benefits}
                onChange={(e) => setJobFormData({ ...jobFormData, benefits: e.target.value })}
                placeholder="Comprehensive medical, dental, and vision insurance&#10;$2,000 annual learning stipend&#10;Unlimited PTO"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 outline-none focus:border-indigo-600 resize-none"
              ></textarea>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="featured"
                checked={jobFormData.featured}
                onChange={(e) => setJobFormData({ ...jobFormData, featured: e.target.checked })}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="featured" className="text-xs font-bold text-slate-700 cursor-pointer">
                Promote as Featured Job (Boosted on Homepage & Search results)
              </label>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              {isEditingJob && (
                <button
                  type="button"
                  onClick={resetJobForm}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs"
                >
                  Cancel Edit
                </button>
              )}
              <button
                type="submit"
                disabled={jobFormLoading}
                className="px-8 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-500/25 transition-all"
              >
                {jobFormLoading
                  ? 'Saving...'
                  : isEditingJob
                  ? 'Update Job Post'
                  : 'Publish Job Posting'}
              </button>
            </div>
          </form>
        )}

        {/* Tab 3: CANDIDATES & APPLICANTS */}
        {activeTab === 'applicants' && (
          <div className="space-y-6">
            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row items-center gap-3">
              <div className="w-full md:w-1/3 flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={applicantSearch}
                  onChange={(e) => setApplicantSearch(e.target.value)}
                  placeholder="Search candidate name, headline or skills..."
                  className="w-full bg-transparent text-xs text-slate-800 placeholder:text-slate-400 outline-none"
                />
              </div>

              <div className="w-full md:w-1/3">
                <select
                  value={selectedJobFilter}
                  onChange={(e) => setSelectedJobFilter(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 text-xs font-semibold text-slate-700 outline-none"
                >
                  <option value="">All Job Positions</option>
                  {jobs.map((j) => (
                    <option key={j._id} value={j._id}>
                      {j.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="w-full md:w-1/3">
                <select
                  value={selectedStatusFilter}
                  onChange={(e) => setSelectedStatusFilter(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 text-xs font-semibold text-slate-700 outline-none"
                >
                  <option value="All">All Application Statuses</option>
                  <option value="Applied">Applied</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Shortlisted">Shortlisted</option>
                  <option value="Interview Scheduled">Interview Scheduled</option>
                  <option value="Hired">Hired</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>

            {/* Candidate Cards */}
            {filteredApplicants.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl border border-slate-200/90 text-center space-y-3">
                <Users className="w-10 h-10 text-slate-300 mx-auto" />
                <h4 className="font-bold text-slate-800 text-base">No applicants found</h4>
                <p className="text-xs text-slate-500">
                  {applicantSearch || selectedJobFilter || selectedStatusFilter !== 'All'
                    ? 'Try clearing your filter criteria.'
                    : 'Candidates who apply to your posted jobs will appear here.'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredApplicants.map((app) => (
                  <div
                    key={app._id}
                    className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs space-y-4"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      {/* Left: Candidate profile info */}
                      <div className="flex items-start gap-4">
                        {app.applicant?.avatar ? (
                          <img
                            src={app.applicant.avatar}
                            alt={app.applicant.name}
                            className="w-14 h-14 rounded-2xl object-cover border border-slate-100 shrink-0"
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-lg shrink-0">
                            {app.applicant?.name?.slice(0, 2) || 'CA'}
                          </div>
                        )}

                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-slate-900 text-base">{app.applicant?.name}</h4>
                            <span className="text-xs font-medium text-slate-400">
                              Applied for <strong>{app.job?.title}</strong>
                            </span>
                          </div>

                          <p className="text-xs text-slate-600 mt-0.5">
                            {app.applicant?.headline || 'Tech Professional'}
                          </p>

                          <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-500">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5" />
                              {app.applicant?.location || 'Remote'}
                            </span>
                            <span className="flex items-center gap-1">
                              <Mail className="w-3.5 h-3.5" />
                              {app.applicant?.email}
                            </span>
                            {app.applicant?.phone && (
                              <span className="flex items-center gap-1">
                                <Phone className="w-3.5 h-3.5" />
                                {app.applicant?.phone}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right: Status dropdown & Interview button */}
                      <div className="flex flex-wrap items-center gap-2.5">
                        <select
                          value={app.status}
                          onChange={(e) => handleUpdateStatus(app._id, e.target.value)}
                          className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 outline-none focus:border-indigo-600"
                        >
                          <option value="Applied">Applied</option>
                          <option value="Under Review">Under Review</option>
                          <option value="Shortlisted">Shortlisted</option>
                          <option value="Interview Scheduled">Interview Scheduled</option>
                          <option value="Hired">Hired</option>
                          <option value="Rejected">Rejected</option>
                        </select>

                        <button
                          onClick={() => {
                            setInterviewModalApp(app);
                            setInterviewData({
                              scheduledAt: '',
                              meetingLink: 'https://meet.google.com/xyz-interview-demo',
                              round: 'Round 1: Technical & Systems Architecture',
                              notes: 'Candidate review on distributed systems experience.',
                            });
                          }}
                          className="px-4 py-2 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 font-bold text-xs flex items-center gap-1.5 transition-colors"
                        >
                          <Calendar className="w-3.5 h-3.5" />
                          <span>Schedule Interview</span>
                        </button>
                      </div>
                    </div>

                    {/* Candidate Skills */}
                    {app.applicant?.skills && app.applicant.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {app.applicant.skills.map((skill, sIdx) => (
                          <span
                            key={sIdx}
                            className="px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Cover Note if provided */}
                    {app.coverLetter && (
                      <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
                        <span className="font-bold text-slate-900 block mb-0.5">Candidate Pitch / Cover Letter:</span>
                        {app.coverLetter}
                      </div>
                    )}

                    {/* Actions: Download Resume & Portfolio links */}
                    <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-3">
                        {app.resume?.url && (
                          <a
                            href={app.resume.url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 font-bold text-indigo-600 hover:text-indigo-800"
                          >
                            <FileText className="w-4 h-4" />
                            <span>Download Resume ({app.resume.originalName || 'PDF'})</span>
                          </a>
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-slate-500">
                        {app.applicant?.portfolioLinks?.github && (
                          <a
                            href={app.applicant.portfolioLinks.github}
                            target="_blank"
                            rel="noreferrer"
                            className="hover:text-slate-900"
                          >
                            GitHub
                          </a>
                        )}
                        {app.applicant?.portfolioLinks?.linkedin && (
                          <a
                            href={app.applicant.portfolioLinks.linkedin}
                            target="_blank"
                            rel="noreferrer"
                            className="hover:text-slate-900"
                          >
                            LinkedIn
                          </a>
                        )}
                        {app.applicant?.portfolioLinks?.portfolio && (
                          <a
                            href={app.applicant.portfolioLinks.portfolio}
                            target="_blank"
                            rel="noreferrer"
                            className="hover:text-slate-900"
                          >
                            Portfolio
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: COMPANY PROFILE */}
        {activeTab === 'company' && (
          <form
            onSubmit={handleSaveCompany}
            className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-6 max-w-3xl"
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Company Brand & Organization</h3>
                <p className="text-xs text-slate-500">Showcase your culture and mission to attracting candidates</p>
              </div>
              {companyMsg && <span className="text-xs font-bold text-indigo-600">{companyMsg}</span>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Company Name *
                </label>
                <input
                  type="text"
                  value={companyData.name}
                  onChange={(e) => setCompanyData({ ...companyData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 outline-none focus:border-indigo-600"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Website URL
                </label>
                <input
                  type="url"
                  value={companyData.website}
                  onChange={(e) => setCompanyData({ ...companyData, website: e.target.value })}
                  placeholder="https://company.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Industry
                </label>
                <input
                  type="text"
                  value={companyData.industry}
                  onChange={(e) => setCompanyData({ ...companyData, industry: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Company Size
                </label>
                <select
                  value={companyData.companySize}
                  onChange={(e) => setCompanyData({ ...companyData, companySize: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 outline-none focus:border-indigo-600"
                >
                  <option value="1-10">1-10 employees</option>
                  <option value="11-50">11-50 employees</option>
                  <option value="51-200">51-200 employees</option>
                  <option value="201-500">201-500 employees</option>
                  <option value="501-1000">501-1000 employees</option>
                  <option value="1000+">1000+ employees</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Headquarters Location
                </label>
                <input
                  type="text"
                  value={companyData.location}
                  onChange={(e) => setCompanyData({ ...companyData, location: e.target.value })}
                  placeholder="e.g. San Francisco, CA"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 outline-none focus:border-indigo-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Upload Company Logo
              </label>
              <div className="flex items-center gap-4">
                {companyData.logo && (
                  <img
                    src={companyData.logo}
                    alt="Current logo"
                    className="w-14 h-14 rounded-2xl object-contain p-2 border border-slate-200 bg-slate-50"
                  />
                )}
                <label className="flex-1 flex items-center justify-center border-2 border-dashed border-slate-200 hover:border-indigo-500 rounded-2xl p-4 cursor-pointer bg-slate-50/50 transition-all">
                  <Upload className="w-5 h-5 text-indigo-500 mr-2" />
                  <span className="text-xs text-slate-700 font-medium truncate max-w-[200px]">
                    {logoFile ? logoFile.name : 'Select PNG, JPG, or SVG logo'}
                  </span>
                  <input
                    type="file"
                    accept=".png,.jpg,.jpeg,.webp,.svg"
                    className="hidden"
                    onChange={(e) => setLogoFile(e.target.files[0])}
                  />
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Short Tagline / Mission
              </label>
              <input
                type="text"
                value={companyData.description}
                onChange={(e) => setCompanyData({ ...companyData, description: e.target.value })}
                placeholder="e.g. Financial infrastructure for the internet."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 outline-none focus:border-indigo-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Full About Us Description
              </label>
              <textarea
                rows={4}
                value={companyData.about}
                onChange={(e) => setCompanyData({ ...companyData, about: e.target.value })}
                placeholder="Describe your engineering culture, products, and vision..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 outline-none focus:border-indigo-600 resize-none"
              ></textarea>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                disabled={savingCompany}
                className="px-7 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-500/25 transition-all"
              >
                {savingCompany ? 'Saving Profile...' : 'Save Company Changes'}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Schedule Interview Modal */}
      {interviewModalApp && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-slide-up">
            <div className="px-6 py-5 bg-purple-50 border-b border-purple-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Calendar className="w-5 h-5 text-purple-700" />
                <h3 className="font-bold text-purple-950 text-base">
                  Schedule Interview for {interviewModalApp.applicant?.name}
                </h3>
              </div>
              <button
                onClick={() => setInterviewModalApp(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleScheduleInterviewSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Interview Round *
                </label>
                <input
                  type="text"
                  value={interviewData.round}
                  onChange={(e) => setInterviewData({ ...interviewData, round: e.target.value })}
                  placeholder="e.g. Technical Coding & Architecture"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm outline-none focus:border-purple-600"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Date and Time *
                </label>
                <input
                  type="datetime-local"
                  value={interviewData.scheduledAt}
                  onChange={(e) => setInterviewData({ ...interviewData, scheduledAt: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm outline-none focus:border-purple-600"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Video Meeting URL (Google Meet / Zoom) *
                </label>
                <input
                  type="url"
                  value={interviewData.meetingLink}
                  onChange={(e) => setInterviewData({ ...interviewData, meetingLink: e.target.value })}
                  placeholder="https://meet.google.com/xxx-xxxx-xxx"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm outline-none focus:border-purple-600"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Preparation Notes for Candidate (Optional)
                </label>
                <textarea
                  rows={3}
                  value={interviewData.notes}
                  onChange={(e) => setInterviewData({ ...interviewData, notes: e.target.value })}
                  placeholder="Please be in a quiet room with a working webcam and modern browser..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm outline-none focus:border-purple-600 resize-none"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setInterviewModalApp(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-500/20"
                >
                  Confirm & Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
