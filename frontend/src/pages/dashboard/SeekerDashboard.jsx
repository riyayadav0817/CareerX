import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import JobCard from '../../components/JobCard';
import ApplyModal from '../../components/ApplyModal';
import {
  FileText,
  Bookmark,
  Sparkles,
  User,
  Bell,
  Upload,
  Download,
  Trash2,
  Calendar,
  Video,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  ExternalLink,
  Plus,
  Briefcase,
  GraduationCap,
  Globe,
  Github,
  Linkedin,
  MapPin,
  Phone,
  Edit3,
  Target,
  Flame,
  Award,
  Code2,
  Zap,
  BookOpen,
  ArrowRight,
  BarChart3
} from 'lucide-react';

export default function SeekerDashboard() {
  const { user, updateUser } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const activeTab = searchParams.get('tab') || 'applications';

  const [applications, setApplications] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJobForApply, setSelectedJobForApply] = useState(null);
  const [prepData, setPrepData] = useState(null);

  // Resume Upload State
  const [resumeFile, setResumeFile] = useState(null);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');

  // Profile Form State
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    headline: user?.headline || '',
    bio: user?.bio || '',
    location: user?.location || '',
    phone: user?.phone || '',
    skills: user?.skills || [],
    portfolioLinks: user?.portfolioLinks || { github: '', linkedin: '', portfolio: '', twitter: '' },
    education: user?.education || [],
    experience: user?.experience || [],
  });
  const [newSkill, setNewSkill] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileStatusMsg, setProfileStatusMsg] = useState('');

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [appRes, savedRes, recRes, notifRes, prepRes] = await Promise.allSettled([
          api.get('/applications/my-applications'),
          api.get('/applications/saved-jobs'),
          api.get('/applications/recommended-jobs'),
          api.get('/notifications'),
          api.get('/prep/dashboard'),
        ]);

        if (appRes.status === 'fulfilled' && appRes.value.data.success) {
          setApplications(appRes.value.data.applications);
        }
        if (savedRes.status === 'fulfilled' && savedRes.value.data.success) {
          setSavedJobs(savedRes.value.data.jobs);
        }
        if (recRes.status === 'fulfilled' && recRes.value.data.success) {
          setRecommendedJobs(recRes.value.data.jobs);
        }
        if (notifRes.status === 'fulfilled' && notifRes.value.data.success) {
          setNotifications(notifRes.value.data.notifications);
        }
        if (prepRes.status === 'fulfilled' && prepRes.value.data.success) {
          setPrepData(prepRes.value.data.data || prepRes.value.data);
        }
      } catch (err) {
        console.error('Error fetching candidate data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Update tab
  const setTab = (tabName) => {
    setSearchParams({ tab: tabName });
  };

  // Withdraw Application
  const handleWithdrawApplication = async (appId) => {
    if (!window.confirm('Are you sure you want to withdraw this job application?')) return;
    try {
      const res = await api.delete(`/applications/${appId}/withdraw`);
      if (res.data.success) {
        setApplications((prev) => prev.filter((a) => a._id !== appId));
        alert('Application withdrawn successfully.');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Could not withdraw application.');
    }
  };

  // Remove saved job
  const handleRemoveSavedJob = async (jobId) => {
    try {
      await api.delete(`/applications/saved-jobs/${jobId}`);
      setSavedJobs((prev) => prev.filter((j) => j._id !== jobId));
    } catch (err) {
      console.error(err);
    }
  };

  // Resume Upload Handler
  const handleUploadResume = async (e) => {
    e.preventDefault();
    if (!resumeFile) return;

    const formData = new FormData();
    formData.append('resume', resumeFile);

    try {
      setUploadingResume(true);
      setUploadMessage('');
      const res = await api.post('/auth/upload-resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data.success) {
        setUploadMessage('Resume uploaded and updated successfully!');
        updateUser({ ...user, resume: res.data.resume });
        setResumeFile(null);
      }
    } catch (err) {
      setUploadMessage(err.response?.data?.message || 'Failed to upload resume.');
    } finally {
      setUploadingResume(false);
    }
  };

  // Save Profile Handler
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      setSavingProfile(true);
      setProfileStatusMsg('');
      const res = await api.put('/auth/profile', profileData);
      if (res.data.success) {
        setProfileStatusMsg('Profile changes saved successfully!');
        updateUser(res.data.user);
      }
    } catch (err) {
      setProfileStatusMsg(err.response?.data?.message || 'Failed to save profile.');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !profileData.skills.includes(newSkill.trim())) {
      setProfileData({ ...profileData, skills: [...profileData.skills, newSkill.trim()] });
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setProfileData({
      ...profileData,
      skills: profileData.skills.filter((s) => s !== skillToRemove),
    });
  };

  // Status Badge Colors & Helper
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Interview Scheduled':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Shortlisted':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'Under Review':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Hired':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Rejected':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  // Calculate overview counts
  const statusCounts = {
    total: applications.length,
    underReview: applications.filter((a) => a.status === 'Under Review').length,
    shortlisted: applications.filter((a) => a.status === 'Shortlisted').length,
    interviews: applications.filter((a) => a.status === 'Interview Scheduled').length,
    hired: applications.filter((a) => a.status === 'Hired').length,
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Welcome Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/90 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-100"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-2xl">
                {user?.name?.slice(0, 2)}
              </div>
            )}
            <div>
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest block">
                Job Seeker Portal
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Welcome, {user?.name}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                {user?.headline || 'Explore opportunities, track applications, and level up your career.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/jobs"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-md shadow-indigo-500/20 transition-all"
            >
              Search New Jobs
            </Link>
          </div>
        </div>

        {/* Overview Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
            <span className="text-xs font-semibold text-slate-500">Total Applied</span>
            <p className="text-2xl font-black text-slate-900 mt-1">{statusCounts.total}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
            <span className="text-xs font-semibold text-slate-500">Under Review</span>
            <p className="text-2xl font-black text-blue-600 mt-1">{statusCounts.underReview}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
            <span className="text-xs font-semibold text-slate-500">Shortlisted</span>
            <p className="text-2xl font-black text-indigo-600 mt-1">{statusCounts.shortlisted}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
            <span className="text-xs font-semibold text-slate-500">Interviews</span>
            <p className="text-2xl font-black text-purple-600 mt-1">{statusCounts.interviews}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs col-span-2 md:col-span-1">
            <span className="text-xs font-semibold text-slate-500">Offers / Hired</span>
            <p className="text-2xl font-black text-emerald-600 mt-1">{statusCounts.hired}</p>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex items-center gap-1.5 border-b border-slate-200 overflow-x-auto no-scrollbar pb-1.5">
          {[
            { id: 'applications', label: 'My Applications', count: applications.length, icon: <FileText className="w-4 h-4" /> },
            { id: 'placement-prep', label: 'Placement Prep', icon: <GraduationCap className="w-4 h-4" /> },
            { id: 'saved', label: 'Saved Jobs', count: savedJobs.length, icon: <Bookmark className="w-4 h-4" /> },
            { id: 'recommended', label: 'Recommended', count: recommendedJobs.length, icon: <Sparkles className="w-4 h-4" /> },
            { id: 'profile', label: 'Profile & Resume', icon: <User className="w-4 h-4" /> },
            { id: 'notifications', label: 'Notifications', count: notifications.filter(n => !n.read).length, icon: <Bell className="w-4 h-4" /> },
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

        {/* Tab 1: APPLICATIONS */}
        {activeTab === 'applications' && (
          <div className="space-y-4">
            {applications.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl border border-slate-200/90 text-center space-y-4">
                <FileText className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="text-lg font-bold text-slate-900">No applications submitted yet</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Start applying to high-growth tech positions. Your status updates and interview schedules will appear here.
                </p>
                <Link
                  to="/jobs"
                  className="inline-block px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-700"
                >
                  Explore Jobs
                </Link>
              </div>
            ) : (
              applications.map((app) => (
                <div
                  key={app._id}
                  className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      {app.company?.logo ? (
                        <img
                          src={app.company.logo}
                          alt={app.company.name}
                          className="w-12 h-12 rounded-xl object-contain p-1 border border-slate-100 bg-slate-50 shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center font-bold text-indigo-600 shrink-0">
                          <Briefcase className="w-6 h-6" />
                        </div>
                      )}
                      <div>
                        <Link
                          to={`/jobs/${app.job?._id || ''}`}
                          className="text-base font-bold text-slate-900 hover:text-indigo-600 transition-colors"
                        >
                          {app.job?.title || 'Job Position'}
                        </Link>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {app.company?.name} • {app.job?.location} • Applied on {new Date(app.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadge(
                          app.status
                        )}`}
                      >
                        {app.status}
                      </span>

                      {['Applied', 'Under Review'].includes(app.status) && (
                        <button
                          onClick={() => handleWithdrawApplication(app._id)}
                          className="px-3 py-1.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold transition-colors"
                        >
                          Withdraw
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Interview scheduled box */}
                  {app.status === 'Interview Scheduled' && app.interviewDetails && (
                    <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2.5 rounded-xl bg-purple-600 text-white shrink-0 mt-0.5">
                          <Video className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-purple-950">
                            Interview Round: {app.interviewDetails.round || 'Technical Video Call'}
                          </p>
                          <p className="text-xs text-purple-800 mt-0.5 flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            {app.interviewDetails.scheduledAt
                              ? new Date(app.interviewDetails.scheduledAt).toLocaleString()
                              : 'Date to be confirmed'}
                          </p>
                          {app.interviewDetails.notes && (
                            <p className="text-xs text-purple-700 mt-1 italic">
                              "{app.interviewDetails.notes}"
                            </p>
                          )}
                        </div>
                      </div>

                      {app.interviewDetails.meetingLink && (
                        <a
                          href={app.interviewDetails.meetingLink}
                          target="_blank"
                          rel="noreferrer"
                          className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shrink-0"
                        >
                          <span>Join Video Meeting</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  )}

                  {/* Recruiter feedback notes */}
                  {app.recruiterNotes && (
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
                      <span className="font-bold text-slate-800">Recruiter Notes: </span>
                      {app.recruiterNotes}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab: PLACEMENT PREPARATION */}
        {activeTab === 'placement-prep' && (
          <div className="space-y-8">
            {/* Prep Banner */}
            <div className="rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white p-6 sm:p-8 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white/5 pointer-events-none blur-2xl"></div>
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2 max-w-2xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-indigo-200 text-xs font-semibold backdrop-blur-md">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>Placement Preparation & Skill Readiness Hub</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                    Elevate Your Career Preparation
                  </h2>
                  <p className="text-xs sm:text-sm text-indigo-100/90 leading-relaxed">
                    Practice aptitude, logical reasoning, and DSA topics, solve daily challenges, and simulate real hiring assessments to maximize your offer conversion rate.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3 shrink-0">
                  <Link
                    to="/placement-prep"
                    className="px-5 py-2.5 rounded-xl bg-white text-indigo-900 font-bold text-xs sm:text-sm hover:bg-indigo-50 shadow-md transition-all flex items-center gap-1.5"
                  >
                    <span>Full Prep Portal</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    to="/mock-tests"
                    className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/20 backdrop-blur-sm transition-all flex items-center gap-1.5"
                  >
                    <span>Mock Tests</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Preparation Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                  <Flame className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-500">Learning Streak</span>
                  <p className="text-2xl font-black text-slate-900 mt-0.5">
                    {prepData?.streakDays ?? 0} <span className="text-xs font-semibold text-slate-400">days</span>
                  </p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-500">Questions Solved</span>
                  <p className="text-2xl font-black text-slate-900 mt-0.5">
                    {prepData?.completedQuestionsCount ?? 0}
                  </p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-500">Average Accuracy</span>
                  <p className="text-2xl font-black text-emerald-600 mt-0.5">
                    {prepData?.accuracyPercentage ?? 0}%
                  </p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-500">Mocks Taken</span>
                  <p className="text-2xl font-black text-purple-600 mt-0.5">
                    {prepData?.recentTests?.length ?? 0}
                  </p>
                </div>
              </div>
            </div>

            {/* Subject Readiness Scores */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-2xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                    <Target className="w-5 h-5 text-indigo-600" />
                    <span>Domain Readiness Scores</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Track your real-time proficiency across core campus placement rounds and assessment sections.
                  </p>
                </div>
                <Link
                  to="/placement-prep"
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                >
                  <span>View All Syllabus</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {[
                  {
                    key: 'aptitude',
                    code: 'QA',
                    title: 'Quantitative Aptitude',
                    link: '/placement-prep/aptitude',
                    actionLabel: 'Practice',
                    unitLabel: 'Attempted',
                    badgeClass: 'bg-indigo-100 text-indigo-700',
                    textClass: 'text-indigo-600',
                    barClass: 'bg-indigo-600',
                    borderHover: 'hover:border-indigo-200',
                  },
                  {
                    key: 'reasoning',
                    code: 'LR',
                    title: 'Logical Reasoning',
                    link: '/placement-prep/reasoning',
                    actionLabel: 'Practice',
                    unitLabel: 'Attempted',
                    badgeClass: 'bg-purple-100 text-purple-700',
                    textClass: 'text-purple-600',
                    barClass: 'bg-purple-600',
                    borderHover: 'hover:border-purple-200',
                  },
                  {
                    key: 'verbal',
                    code: 'VA',
                    title: 'Verbal Ability',
                    link: '/placement-prep/verbal',
                    actionLabel: 'Practice',
                    unitLabel: 'Attempted',
                    badgeClass: 'bg-blue-100 text-blue-700',
                    textClass: 'text-blue-600',
                    barClass: 'bg-blue-600',
                    borderHover: 'hover:border-blue-200',
                  },
                  {
                    key: 'coding',
                    code: 'DSA',
                    title: 'Coding & DSA',
                    link: '/placement-prep/coding',
                    actionLabel: 'Solve DSA',
                    unitLabel: 'Attempted',
                    badgeClass: 'bg-emerald-100 text-emerald-700',
                    textClass: 'text-emerald-600',
                    barClass: 'bg-emerald-600',
                    borderHover: 'hover:border-emerald-200',
                  },
                  {
                    key: 'coreCs',
                    code: 'CS',
                    title: 'Core Computer Science',
                    link: '/placement-prep/core-cs',
                    actionLabel: 'Study CS',
                    unitLabel: 'Attempted',
                    badgeClass: 'bg-cyan-100 text-cyan-700',
                    textClass: 'text-cyan-600',
                    barClass: 'bg-cyan-600',
                    borderHover: 'hover:border-cyan-200',
                  },
                ].map((domain) => {
                  const stat = prepData?.categoryStats?.[domain.key] || {};
                  const attempted = stat.attempted ?? 0;
                  const correct = domain.key === 'coding' ? (stat.solved ?? 0) : (stat.correct ?? 0);
                  const pct = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;

                  return (
                    <div
                      key={domain.key}
                      className={`p-5 rounded-2xl bg-slate-50/80 border border-slate-200 ${domain.borderHover} transition-all space-y-3`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className={`p-2 rounded-xl ${domain.badgeClass} font-bold text-xs`}>
                            {domain.key === 'coding' ? <Code2 className="w-4 h-4" /> : domain.code}
                          </div>
                          <span className="font-bold text-slate-900 text-sm">{domain.title}</span>
                        </div>
                        <span className={`text-xs font-extrabold ${domain.textClass}`}>{pct}%</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div
                          className={`${domain.barClass} h-2 rounded-full transition-all duration-500`}
                          style={{ width: `${pct}%` }}
                        ></div>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                        <span>
                          {correct} / {attempted} {domain.key === 'coding' ? 'Solved' : 'Correct'}
                        </span>
                        <Link
                          to={domain.link}
                          className={`font-bold ${domain.textClass} hover:underline flex items-center gap-0.5`}
                        >
                          <span>{domain.actionLabel}</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  );
                })}

                {/* Company Tracks Quick Card */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 block">
                      Target Companies
                    </span>
                    <h4 className="font-bold text-slate-900 text-sm mt-0.5">
                      TCS, Infosys, Amazon & more
                    </h4>
                    <p className="text-xs text-slate-600 mt-1">
                      Check round-by-round selection processes, syllabus, and practice interview questions.
                    </p>
                  </div>
                  <Link
                    to="/company-prep"
                    className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs text-center transition-colors"
                  >
                    Explore Company Tracks
                  </Link>
                </div>
              </div>
            </div>

            {/* Daily Challenge & Weak Topics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Daily Challenge */}
              <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-2xs space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                      <Zap className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-base">Today's Placement Challenge</h3>
                      <p className="text-xs text-slate-500">
                        {prepData?.dailyChallenge?.completedQuestions ?? 0} / {prepData?.dailyChallenge?.targetQuestions ?? 5} questions completed today
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">
                    {prepData?.dailyChallenge?.isCompleted ? 'Completed' : 'In Progress'}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-700 uppercase">
                      {prepData?.dailyQuestion?.category || 'aptitude'}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      Topic: {prepData?.dailyQuestion?.topic || 'Quantitative Practice'}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-slate-800 leading-relaxed line-clamp-3">
                    {prepData?.dailyQuestion?.question ||
                      'Complete your daily target of 5 practice questions across Aptitude, Reasoning, or Coding.'}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-slate-500 font-medium">
                    Difficulty: <span className="font-bold text-amber-600">{prepData?.dailyQuestion?.difficulty || 'Medium'}</span>
                  </span>
                  <Link
                    to="/placement-prep/aptitude"
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors flex items-center gap-1.5"
                  >
                    <span>Solve Challenge</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Weak Topics & Recommended Practice */}
              <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-2xs space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
                      <AlertCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-base">Recommended Focus Topics</h3>
                      <p className="text-xs text-slate-500">Topics flagged from your practice accuracy</p>
                    </div>
                  </div>
                </div>

                {prepData?.weakTopics && prepData.weakTopics.length > 0 ? (
                  <div className="space-y-3">
                    {prepData.weakTopics.map((topicName, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4"
                      >
                        <div>
                          <p className="text-xs font-bold text-slate-800">{topicName}</p>
                          <p className="text-[11px] text-rose-600 font-medium">
                            Needs additional practice (&lt; 75% accuracy)
                          </p>
                        </div>
                        <Link
                          to="/placement-prep/aptitude"
                          className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-indigo-600 hover:text-indigo-600 text-xs font-bold text-slate-700 transition-colors shrink-0"
                        >
                          Practice Now
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-center space-y-2">
                    <CheckCircle2 className="w-7 h-7 text-emerald-500 mx-auto" />
                    <p className="text-xs font-semibold text-slate-700">No weak topics flagged yet</p>
                    <p className="text-[11px] text-slate-500">
                      As you solve practice questions, topics needing review will automatically appear here.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Mock Test History */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-2xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                    <Clock className="w-5 h-5 text-indigo-600" />
                    <span>Mock Test History & Scorecards</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Review your completed examination attempts, accuracy rates, and answer analysis.
                  </p>
                </div>
                <Link
                  to="/mock-tests"
                  className="px-4 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs transition-colors flex items-center gap-1.5 self-start sm:self-auto"
                >
                  <span>Take Another Mock</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {prepData?.recentTests && prepData.recentTests.length > 0 ? (
                <div className="divide-y divide-slate-100">
                  {prepData.recentTests.map((attempt) => (
                    <div key={attempt._id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                          {attempt.mockTest?.title || 'Comprehensive Placement Mock Test'}
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Taken on {new Date(attempt.createdAt).toLocaleDateString()} • Time spent: {Math.round((attempt.timeTakenSeconds || 0) / 60)} mins
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm font-extrabold text-indigo-600">
                            {attempt.score} / {attempt.mockTest?.totalMarks || 100}
                          </p>
                          <p className="text-[11px] text-slate-400 font-medium">
                            {attempt.accuracy ?? 0}% Accuracy
                          </p>
                        </div>
                        <Link
                          to={`/mock-tests/${attempt.mockTest?._id || ''}`}
                          className="px-3.5 py-1.5 rounded-xl border border-indigo-200 text-indigo-600 hover:bg-indigo-50 text-xs font-semibold transition-colors"
                        >
                          Retake
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-slate-50/60 rounded-2xl border border-dashed border-slate-200 space-y-3">
                  <BarChart3 className="w-8 h-8 text-slate-300 mx-auto" />
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    You haven't attempted any mock tests yet. Take a simulated TCS, Infosys, or full placement assessment to benchmark your skills.
                  </p>
                  <Link
                    to="/mock-tests"
                    className="inline-block px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors"
                  >
                    Start First Mock Test
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: SAVED JOBS */}
        {activeTab === 'saved' && (
          <div>
            {savedJobs.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl border border-slate-200/90 text-center space-y-4">
                <Bookmark className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="text-lg font-bold text-slate-900">No saved jobs yet</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Click the bookmark icon on any job card to save it for quick review and applying later.
                </p>
                <Link
                  to="/jobs"
                  className="inline-block px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-700"
                >
                  Browse Jobs
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedJobs.map((job) => (
                  <JobCard
                    key={job._id}
                    job={job}
                    isSaved={true}
                    onSaveToggle={handleRemoveSavedJob}
                    onQuickApply={(j) => setSelectedJobForApply(j)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: RECOMMENDED JOBS */}
        {activeTab === 'recommended' && (
          <div className="space-y-6">
            <div className="bg-indigo-50/80 p-5 rounded-2xl border border-indigo-100 flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-indigo-600 shrink-0" />
              <p className="text-xs text-indigo-950 font-medium">
                These vacancies match your profile skills: <strong>{user?.skills?.join(', ') || 'General Engineering'}</strong>.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedJobs.map((job) => (
                <JobCard
                  key={job._id}
                  job={job}
                  onQuickApply={(j) => setSelectedJobForApply(j)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: PROFILE & RESUME */}
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Resume Box */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs space-y-4">
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-600" />
                  <span>Resume & CV</span>
                </h3>

                {user?.resume?.url ? (
                  <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-indigo-600 text-white">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate">
                          {user.resume.originalName || 'Candidate_Resume.pdf'}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          Updated {user.resume.updatedAt ? new Date(user.resume.updatedAt).toLocaleDateString() : 'Recently'}
                        </p>
                      </div>
                    </div>

                    <a
                      href={user.resume.url}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-2.5 rounded-xl bg-white border border-indigo-200 text-indigo-700 font-semibold text-xs flex items-center justify-center gap-2 hover:bg-indigo-50 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span>View / Download Resume</span>
                    </a>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500">
                    No resume uploaded yet.
                  </div>
                )}

                {/* Upload form */}
                <form onSubmit={handleUploadResume} className="space-y-3 pt-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Upload New Resume File
                  </label>
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 hover:border-indigo-500 rounded-2xl p-4 cursor-pointer bg-slate-50/50 transition-all">
                    <Upload className="w-5 h-5 text-indigo-500 mb-1" />
                    <span className="text-xs text-slate-700 font-medium truncate max-w-[200px]">
                      {resumeFile ? resumeFile.name : 'Select PDF / DOCX file'}
                    </span>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                      onChange={(e) => setResumeFile(e.target.files[0])}
                    />
                  </label>

                  {uploadMessage && (
                    <p className="text-xs text-indigo-600 font-medium">{uploadMessage}</p>
                  )}

                  <button
                    type="submit"
                    disabled={!resumeFile || uploadingResume}
                    className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs transition-colors"
                  >
                    {uploadingResume ? 'Uploading...' : 'Save & Replace Resume'}
                  </button>
                </form>
              </div>

              {/* Skills Tags Card */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs space-y-4">
                <h3 className="font-bold text-slate-900 text-base">Skills & Specialties</h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="e.g. Next.js, Docker"
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs outline-none focus:border-indigo-600"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSkill();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="px-3.5 py-2 rounded-xl bg-indigo-50 text-indigo-700 font-bold text-xs hover:bg-indigo-100"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-2">
                  {profileData.skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 text-slate-800 text-xs font-semibold"
                    >
                      <span>{skill}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="text-slate-400 hover:text-red-500"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right 2 cols: Profile Form */}
            <div className="lg:col-span-2">
              <form
                onSubmit={handleSaveProfile}
                className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-2xs space-y-6"
              >
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <h3 className="font-bold text-slate-900 text-lg">Candidate Profile Details</h3>
                  {profileStatusMsg && (
                    <span className="text-xs font-bold text-indigo-600">{profileStatusMsg}</span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 outline-none focus:border-indigo-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Professional Headline
                    </label>
                    <input
                      type="text"
                      value={profileData.headline}
                      onChange={(e) => setProfileData({ ...profileData, headline: e.target.value })}
                      placeholder="e.g. Senior Full Stack & Cloud Architect"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 outline-none focus:border-indigo-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Location
                    </label>
                    <input
                      type="text"
                      value={profileData.location}
                      onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                      placeholder="e.g. Austin, TX (Open to Remote)"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 outline-none focus:border-indigo-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 outline-none focus:border-indigo-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Bio & Career Objective
                  </label>
                  <textarea
                    rows={4}
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 outline-none focus:border-indigo-600 resize-none"
                    placeholder="Tell employers about your engineering focus, key achievements, and the problems you love solving..."
                  ></textarea>
                </div>

                {/* Portfolio Links */}
                <div>
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                    Portfolio & Social Links
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 bg-slate-50">
                      <Github className="w-4 h-4 text-slate-500" />
                      <input
                        type="url"
                        value={profileData.portfolioLinks?.github || ''}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            portfolioLinks: { ...profileData.portfolioLinks, github: e.target.value },
                          })
                        }
                        placeholder="https://github.com/username"
                        className="w-full bg-transparent text-xs text-slate-800 outline-none"
                      />
                    </div>

                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 bg-slate-50">
                      <Linkedin className="w-4 h-4 text-slate-500" />
                      <input
                        type="url"
                        value={profileData.portfolioLinks?.linkedin || ''}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            portfolioLinks: { ...profileData.portfolioLinks, linkedin: e.target.value },
                          })
                        }
                        placeholder="https://linkedin.com/in/username"
                        className="w-full bg-transparent text-xs text-slate-800 outline-none"
                      />
                    </div>

                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 bg-slate-50">
                      <Globe className="w-4 h-4 text-slate-500" />
                      <input
                        type="url"
                        value={profileData.portfolioLinks?.portfolio || ''}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            portfolioLinks: { ...profileData.portfolioLinks, portfolio: e.target.value },
                          })
                        }
                        placeholder="https://yourportfolio.dev"
                        className="w-full bg-transparent text-xs text-slate-800 outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <button
                    type="submit"
                    disabled={savingProfile}
                    className="px-7 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-500/25 transition-all"
                  >
                    {savingProfile ? 'Saving...' : 'Save Profile Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Tab 5: NOTIFICATIONS */}
        {activeTab === 'notifications' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-4 max-w-3xl mx-auto">
            <h3 className="font-bold text-slate-900 text-lg">Notification Center</h3>
            {notifications.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No notifications yet.</p>
            ) : (
              <div className="divide-y divide-slate-100">
                {notifications.map((notif) => (
                  <div key={notif._id} className="py-4 flex items-start gap-4">
                    <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 shrink-0">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-slate-900">{notif.title}</p>
                      <p className="text-xs text-slate-600 mt-0.5">{notif.message}</p>
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        {new Date(notif.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Quick Apply Modal */}
      <ApplyModal
        job={selectedJobForApply}
        isOpen={Boolean(selectedJobForApply)}
        onClose={() => setSelectedJobForApply(null)}
        onSuccess={() => {
          alert('Application submitted successfully!');
          api.get('/applications/my-applications').then((res) => {
            if (res.data.success) setApplications(res.data.applications);
          });
        }}
      />
    </div>
  );
}
