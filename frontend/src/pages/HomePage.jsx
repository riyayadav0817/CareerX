import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import JobCard from '../components/JobCard';
import ApplyModal from '../components/ApplyModal';
import { useAuth } from '../context/AuthContext';
import {
  Search,
  MapPin,
  Briefcase,
  Layers,
  Sparkles,
  TrendingUp,
  Building2,
  Users,
  Award,
  ArrowRight,
  CheckCircle2,
  FileCheck,
  Compass,
  Star,
  BookOpen,
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';

export default function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [searchCategory, setSearchCategory] = useState('');

  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [latestJobs, setLatestJobs] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [stats, setStats] = useState({
    totalJobs: 120,
    totalCompanies: 48,
    totalCandidates: 1540,
    totalPlacements: 320,
  });
  const [categories, setCategories] = useState([]);
  const [savedJobIds, setSavedJobIds] = useState(new Set());
  const [selectedJobForApply, setSelectedJobForApply] = useState(null);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featRes, latestRes, compRes, statsRes, catRes] = await Promise.all([
          api.get('/jobs/featured'),
          api.get('/jobs?limit=6&sort=newest'),
          api.get('/companies'),
          api.get('/jobs/meta/stats'),
          api.get('/jobs/meta/categories'),
        ]);

        if (featRes.data.success) setFeaturedJobs(featRes.data.jobs);
        if (latestRes.data.success) setLatestJobs(latestRes.data.jobs);
        if (compRes.data.success) setCompanies(compRes.data.companies.slice(0, 6));
        if (statsRes.data.success) setStats(statsRes.data.stats);
        if (catRes.data.success) setCategories(catRes.data.categories);
      } catch (err) {
        console.error('Error fetching homepage data:', err);
      }
    };
    fetchData();

    // Fetch user saved jobs if seeker
    if (user && user.role === 'jobseeker') {
      api.get('/applications/saved-jobs')
        .then((res) => {
          if (res.data.success) {
            setSavedJobIds(new Set(res.data.jobs.map((j) => j._id)));
          }
        })
        .catch(() => {});
    }
  }, [user]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchKeyword.trim()) params.append('search', searchKeyword.trim());
    if (searchLocation.trim()) params.append('location', searchLocation.trim());
    if (searchCategory && searchCategory !== 'All') params.append('category', searchCategory);
    navigate(`/jobs?${params.toString()}`);
  };

  const handleSaveToggle = async (jobId) => {
    if (!user) {
      navigate('/login');
      return;
    }
    const isCurrentlySaved = savedJobIds.has(jobId);
    try {
      if (isCurrentlySaved) {
        await api.delete(`/applications/saved-jobs/${jobId}`);
        setSavedJobIds((prev) => {
          const next = new Set(prev);
          next.delete(jobId);
          return next;
        });
      } else {
        await api.post(`/applications/saved-jobs/${jobId}`);
        setSavedJobIds((prev) => new Set(prev).add(jobId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const defaultCategoriesList = [
    { name: 'Software Engineering', count: 48, icon: '💻' },
    { name: 'UI/UX Design', count: 24, icon: '🎨' },
    { name: 'Data & AI', count: 35, icon: '🤖' },
    { name: 'DevOps & Cloud', count: 19, icon: '☁️' },
    { name: 'Product Management', count: 16, icon: '🚀' },
    { name: 'Marketing', count: 14, icon: '📈' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-14 pb-16 lg:pt-20 lg:pb-24 bg-white border-b border-slate-200/70">
        {/* Subtle Linear-style radial highlight */}
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[720px] h-[320px] bg-gradient-to-b from-indigo-100/60 via-purple-50/40 to-transparent blur-3xl rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            {/* Pill Announcement */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50/90 border border-indigo-200/70 text-indigo-700 text-xs font-semibold mb-6">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>All-in-One Hiring &amp; Placement Preparation Platform</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
              Find Your Dream Job.{' '}
              <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                Build Your Future.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mt-5 text-base sm:text-lg text-slate-600 leading-relaxed font-normal max-w-2xl mx-auto">
              Connect with premier tech companies, master aptitude and DSA coding rounds, and track every application from shortlist to offer.
            </p>

            {/* Search Bar Container */}
            <div className="mt-9 max-w-4xl mx-auto">
              <form
                onSubmit={handleSearchSubmit}
                className="p-2 rounded-2xl bg-white shadow-soft-lg border border-slate-200/90 focus-within:border-indigo-400 focus-within:ring-4 focus-within:ring-indigo-500/10 flex flex-col md:flex-row items-center gap-2 transition-all"
              >
                {/* Keyword input */}
                <div className="w-full flex-1 flex items-center gap-2.5 px-3.5 py-2.5 border-b md:border-b-0 md:border-r border-slate-100">
                  <Search className="w-4 h-4 text-indigo-600 shrink-0" />
                  <input
                    type="text"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    placeholder="Job title, keywords, or skills..."
                    className="w-full bg-transparent text-sm font-medium text-slate-800 placeholder:text-slate-400 outline-none"
                  />
                </div>

                {/* Location input */}
                <div className="w-full md:w-1/4 flex items-center gap-2.5 px-3.5 py-2.5 border-b md:border-b-0 md:border-r border-slate-100">
                  <MapPin className="w-4 h-4 text-indigo-600 shrink-0" />
                  <input
                    type="text"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    placeholder="Location or Remote"
                    className="w-full bg-transparent text-sm font-medium text-slate-800 placeholder:text-slate-400 outline-none"
                  />
                </div>

                {/* Category select */}
                <div className="w-full md:w-1/4 flex items-center gap-2.5 px-3.5 py-2.5">
                  <Layers className="w-4 h-4 text-indigo-600 shrink-0" />
                  <select
                    value={searchCategory}
                    onChange={(e) => setSearchCategory(e.target.value)}
                    className="w-full bg-transparent text-sm font-medium text-slate-700 outline-none cursor-pointer"
                  >
                    <option value="">All Categories</option>
                    <option value="Software Engineering">Software Engineering</option>
                    <option value="UI/UX Design">UI/UX Design</option>
                    <option value="Data & AI">Data &amp; AI</option>
                    <option value="DevOps & Cloud">DevOps &amp; Cloud</option>
                    <option value="Product Management">Product Management</option>
                    <option value="Marketing">Marketing</option>
                  </select>
                </div>

                {/* Search Button */}
                <button
                  type="submit"
                  className="w-full md:w-auto px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-sm shadow-indigo-600/20 flex items-center justify-center gap-2 transition-all shrink-0"
                >
                  <Search className="w-4 h-4" />
                  <span>Search Jobs</span>
                </button>
              </form>

              {/* Popular tags & Prep CTA below search */}
              <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500 font-medium">
                <span className="text-slate-400">Popular:</span>
                {['React', 'Remote', 'Full Stack', 'Product Designer', 'AI Engineer', 'DevOps'].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      setSearchKeyword(tag);
                      navigate(`/jobs?search=${encodeURIComponent(tag)}`);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200/80 text-slate-600 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50/50 transition-colors"
                  >
                    {tag}
                  </button>
                ))}
                <Link
                  to="/placement-prep"
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-indigo-50 border border-indigo-200/80 text-indigo-700 font-semibold hover:bg-indigo-100 transition-colors ml-1"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Start Placement Prep</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. STATS SECTION */}
      <section className="py-10 bg-slate-50/70 border-b border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <div className="surface-card p-5 text-center">
              <p className="text-2xl sm:text-3xl font-extrabold text-indigo-600 tracking-tight">
                {stats.totalJobs}+
              </p>
              <p className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">
                Live Job Vacancies
              </p>
            </div>
            <div className="surface-card p-5 text-center">
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {stats.totalCompanies}+
              </p>
              <p className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">
                Hiring Companies
              </p>
            </div>
            <div className="surface-card p-5 text-center">
              <p className="text-2xl sm:text-3xl font-extrabold text-indigo-600 tracking-tight">
                {stats.totalCandidates}+
              </p>
              <p className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">
                Vetted Candidates
              </p>
            </div>
            <div className="surface-card p-5 text-center">
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {stats.totalPlacements}+
              </p>
              <p className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">
                Successful Placements
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. POPULAR JOB CATEGORIES */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest block mb-2">
              Explore by Specialty
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Popular Job Categories
            </h2>
          </div>
          <Link
            to="/jobs"
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 group"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {defaultCategoriesList.map((cat, idx) => (
            <div
              key={idx}
              onClick={() => navigate(`/jobs?category=${encodeURIComponent(cat.name)}`)}
              className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-soft-sm hover:shadow-lg hover:border-indigo-300 transition-all cursor-pointer group flex items-start gap-4"
            >
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-2xl group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all shrink-0">
                <span>{cat.icon}</span>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base group-hover:text-indigo-600 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Active opportunities available
                </p>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 mt-3 group-hover:underline">
                  Browse {cat.count}+ jobs <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. FEATURED JOBS SECTION */}
      <section className="py-20 bg-slate-100/60 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest block mb-2">
              Curated Opportunities
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Featured High-Impact Jobs
            </h2>
            <p className="text-slate-600 text-sm mt-3">
              Hand-picked positions offering premium compensation, competitive benefits, and world-class engineering teams.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredJobs.map((job) => (
              <JobCard
                key={job._id}
                job={job}
                isSaved={savedJobIds.has(job._id)}
                onSaveToggle={handleSaveToggle}
                onQuickApply={(j) => setSelectedJobForApply(j)}
              />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/jobs"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl font-semibold text-sm bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-500/25 transition-all transform hover:-translate-y-0.5"
            >
              <span>Explore All {stats.totalJobs}+ Vacancies</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. TOP HIRING COMPANIES */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest block mb-2">
              Leading Employers
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Top Hiring Companies
            </h2>
          </div>
          <Link
            to="/companies"
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 group"
          >
            <span>Explore All Companies</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((comp) => (
            <Link
              key={comp._id}
              to={`/companies/${comp._id}`}
              className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-soft-sm hover:shadow-lg hover:border-indigo-300 transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  {comp.logo ? (
                    <img
                      src={comp.logo}
                      alt={comp.name}
                      className="w-14 h-14 rounded-2xl object-contain p-2 border border-slate-100 bg-slate-50"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center font-bold text-indigo-600 text-lg">
                      <Building2 className="w-7 h-7" />
                    </div>
                  )}
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700">
                    {comp.openJobsCount || 2} Open Jobs
                  </span>
                </div>

                <div className="mt-4">
                  <h3 className="font-bold text-slate-900 text-lg group-hover:text-indigo-600 transition-colors flex items-center gap-1.5">
                    <span>{comp.name}</span>
                    {comp.verified && (
                      <CheckCircle2 className="w-4 h-4 text-indigo-600 fill-indigo-100" />
                    )}
                  </h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {comp.location || 'Global Headquarters'} • {comp.industry || 'Technology'}
                  </p>
                  <p className="text-xs text-slate-600 line-clamp-2 mt-3 leading-relaxed">
                    {comp.description || 'Pioneering global SaaS and digital transformation solutions.'}
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-indigo-600">
                <span>View Open Positions</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 6. HOW IT WORKS */}
      <section className="py-20 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest block mb-2">
              Seamless Workflow
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              How CareerX Works
            </h2>
            <p className="text-slate-600 text-sm mt-3">
              We eliminated bureaucratic hiring barriers so you can find and land top roles in record time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {[
              {
                step: '01',
                title: 'Create Your Profile',
                desc: 'Sign up in seconds, configure your role preferences, and add your verified portfolio.',
                icon: <Users className="w-6 h-6 text-indigo-600" />,
              },
              {
                step: '02',
                title: 'Upload Your Resume',
                desc: 'Upload your PDF/DOC resume once. Our smart parser syncs your skills and experience.',
                icon: <FileCheck className="w-6 h-6 text-indigo-600" />,
              },
              {
                step: '03',
                title: 'Explore & 1-Click Apply',
                desc: 'Browse verified vacancies with transparent pay. Submit applications with a single tap.',
                icon: <Compass className="w-6 h-6 text-indigo-600" />,
              },
              {
                step: '04',
                title: 'Interview & Get Hired',
                desc: 'Track live status updates, accept calendar invitations, and receive job offers.',
                icon: <Award className="w-6 h-6 text-indigo-600" />,
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="relative p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:bg-white hover:shadow-lg hover:border-indigo-200 transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-indigo-100/70 flex items-center justify-center">
                    {item.icon}
                  </div>
                  <span className="text-2xl font-black text-slate-300">{item.step}</span>
                </div>
                <h3 className="font-bold text-slate-900 text-base">{item.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed mt-2">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. LATEST JOB LISTINGS FEED */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest block mb-2">
              Just Added
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Latest Job Listings
            </h2>
          </div>
          <Link
            to="/jobs"
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 group"
          >
            <span>View All Fresh Listings</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {latestJobs.map((job) => (
            <JobCard
              key={job._id}
              job={job}
              isSaved={savedJobIds.has(job._id)}
              onSaveToggle={handleSaveToggle}
              onQuickApply={(j) => setSelectedJobForApply(j)}
            />
          ))}
        </div>
      </section>

      {/* 8. CAREER TIPS & ARTICLES */}
      <section className="py-20 bg-slate-100/60 border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest block mb-2">
              Expert Guidance
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Career Insights & Advice
            </h2>
            <p className="text-slate-600 text-sm mt-3">
              Proven strategies from top hiring leaders on resume crafting, technical interviews, and salary negotiation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'How to Ace the Modern Full-Stack System Design Interview',
                category: 'Interview Prep',
                readTime: '6 min read',
                desc: 'A comprehensive playbook covering distributed caches, rate-limiting algorithms, and frontend micro-frontends.',
                img: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80',
              },
              {
                title: 'Structuring Your Software Engineering Resume for ATS Systems',
                category: 'Resume Tips',
                readTime: '4 min read',
                desc: 'Actionable techniques to quantify your architectural impact and bypass automated keyword filters easily.',
                img: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=600&q=80',
              },
              {
                title: 'Mastering Tech Salary Negotiations in a Shifting SaaS Market',
                category: 'Career Growth',
                readTime: '5 min read',
                desc: 'How to benchmark equity vs. cash base, navigate counteroffers, and advocate for meaningful remote perks.',
                img: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=600&q=80',
              },
            ].map((article, idx) => (
              <div
                key={idx}
                className="rounded-2xl bg-white border border-slate-200/90 overflow-hidden shadow-soft-sm hover:shadow-lg transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="h-48 overflow-hidden relative">
                    <img
                      src={article.img}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/90 backdrop-blur-sm text-indigo-700">
                      {article.category}
                    </span>
                  </div>
                  <div className="p-6">
                    <span className="text-[11px] font-semibold text-slate-400 block mb-1">
                      {article.readTime}
                    </span>
                    <h3 className="font-bold text-slate-900 text-base group-hover:text-indigo-600 transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      {article.desc}
                    </p>
                  </div>
                </div>
                <div className="px-6 pb-6">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 group-hover:underline">
                    Read Article <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. BOTTOM CTA BANNER */}
      <section className="py-20 bg-gradient-to-tr from-indigo-900 via-indigo-950 to-slate-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none"></div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Ready to Take the Next Leap in Your Tech Career?
          </h2>
          <p className="mt-4 text-indigo-200 text-base sm:text-lg max-w-2xl mx-auto">
            Join thousands of ambitious engineers, designers, and tech innovators who found their dream job through CareerX.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white text-indigo-900 font-bold text-sm shadow-xl hover:bg-slate-100 transition-all transform hover:-translate-y-0.5"
            >
              Sign Up as Candidate
            </Link>
            <Link
              to="/register?role=recruiter"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl border border-indigo-400/40 hover:bg-indigo-800/40 text-white font-bold text-sm transition-all"
            >
              Post Jobs as Recruiter
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Apply Modal */}
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
