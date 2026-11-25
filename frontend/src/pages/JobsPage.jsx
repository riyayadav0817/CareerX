import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import JobCard from '../components/JobCard';
import ApplyModal from '../components/ApplyModal';
import { useAuth } from '../context/AuthContext';
import {
  Search,
  MapPin,
  Filter,
  X,
  ChevronDown,
  RotateCcw,
  SlidersHorizontal,
  Briefcase,
  Layers,
  DollarSign,
  Calendar,
  Check
} from 'lucide-react';

export default function JobsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Filters State
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [jobTypes, setJobTypes] = useState(searchParams.get('jobType') ? searchParams.get('jobType').split(',') : []);
  const [workModes, setWorkModes] = useState(searchParams.get('workMode') ? searchParams.get('workMode').split(',') : []);
  const [experienceLevels, setExperienceLevels] = useState(searchParams.get('experienceLevel') ? searchParams.get('experienceLevel').split(',') : []);
  const [minSalary, setMinSalary] = useState(searchParams.get('minSalary') || '');
  const [datePosted, setDatePosted] = useState(searchParams.get('datePosted') || 'All');
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');
  const [page, setPage] = useState(parseInt(searchParams.get('page'), 10) || 1);

  // Data State
  const [jobs, setJobs] = useState([]);
  const [pagination, setPagination] = useState({ totalJobs: 0, totalPages: 1, currentPage: 1 });
  const [loading, setLoading] = useState(true);
  const [savedJobIds, setSavedJobIds] = useState(new Set());
  const [selectedJobForApply, setSelectedJobForApply] = useState(null);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync state to URL and fetch jobs
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (search) queryParams.append('search', search);
        if (location) queryParams.append('location', location);
        if (category && category !== 'All') queryParams.append('category', category);
        if (jobTypes.length > 0) queryParams.append('jobType', jobTypes.join(','));
        if (workModes.length > 0) queryParams.append('workMode', workModes.join(','));
        if (experienceLevels.length > 0) queryParams.append('experienceLevel', experienceLevels.join(','));
        if (minSalary) queryParams.append('minSalary', minSalary);
        if (datePosted && datePosted !== 'All') queryParams.append('datePosted', datePosted);
        if (sort) queryParams.append('sort', sort);
        queryParams.append('page', page);
        queryParams.append('limit', 9);

        setSearchParams(queryParams, { replace: true });

        const res = await api.get(`/jobs?${queryParams.toString()}`);
        if (res.data.success) {
          setJobs(res.data.jobs);
          setPagination(res.data.pagination);
        }
      } catch (err) {
        console.error('Error fetching jobs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [search, location, category, jobTypes, workModes, experienceLevels, minSalary, datePosted, sort, page]);

  // Fetch saved jobs
  useEffect(() => {
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

  const handleCheckboxToggle = (list, setList, item) => {
    setPage(1);
    if (list.includes(item)) {
      setList(list.filter((x) => x !== item));
    } else {
      setList([...list, item]);
    }
  };

  const resetFilters = () => {
    setSearch('');
    setLocation('');
    setCategory('All');
    setJobTypes([]);
    setWorkModes([]);
    setExperienceLevels([]);
    setMinSalary('');
    setDatePosted('All');
    setSort('newest');
    setPage(1);
  };

  const categoriesList = [
    'All',
    'Software Engineering',
    'UI/UX Design',
    'Data & AI',
    'DevOps & Cloud',
    'Product Management',
    'Marketing',
  ];

  const availableJobTypes = ['Full-time', 'Part-time', 'Internship', 'Contract'];
  const availableWorkModes = ['Remote', 'Hybrid', 'On-site'];
  const availableLevels = ['Entry Level', 'Mid Level', 'Senior Level', 'Lead / Director'];

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Search Bar Banner */}
        <div className="bg-white p-4 sm:p-6 rounded-3xl shadow-sm border border-slate-200/90 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            <div className="md:col-span-5 flex items-center gap-3 px-3 py-2.5 rounded-2xl bg-slate-50 border border-slate-200/80">
              <Search className="w-5 h-5 text-indigo-600 shrink-0" />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Job title, keywords, or skills..."
                className="w-full bg-transparent text-sm text-slate-800 placeholder:text-slate-400 outline-none"
              />
              {search && (
                <button onClick={() => setSearch('')} className="text-slate-400 hover:text-slate-600">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="md:col-span-4 flex items-center gap-3 px-3 py-2.5 rounded-2xl bg-slate-50 border border-slate-200/80">
              <MapPin className="w-5 h-5 text-indigo-600 shrink-0" />
              <input
                type="text"
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value);
                  setPage(1);
                }}
                placeholder="City, State, or 'Remote'..."
                className="w-full bg-transparent text-sm text-slate-800 placeholder:text-slate-400 outline-none"
              />
              {location && (
                <button onClick={() => setLocation('')} className="text-slate-400 hover:text-slate-600">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="md:col-span-3 flex items-center gap-2">
              <button
                onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                className="md:hidden flex-1 py-3 px-4 rounded-2xl bg-indigo-50 text-indigo-700 font-semibold text-xs flex items-center justify-center gap-2"
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
              </button>
              <button
                onClick={resetFilters}
                className="w-full py-3 px-4 rounded-2xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset Filters</span>
              </button>
            </div>
          </div>
        </div>

        {/* Layout: Sidebar Filter + Results */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <aside
            className={`${
              mobileFilterOpen ? 'block' : 'hidden'
            } lg:block lg:col-span-1 space-y-6 bg-white p-6 rounded-3xl shadow-sm border border-slate-200/90 h-fit`}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
                <span>Filter Jobs</span>
              </h3>
              <button
                onClick={resetFilters}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Clear all
              </button>
            </div>

            {/* Category Dropdown */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Job Category
              </label>
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 outline-none focus:border-indigo-600"
              >
                {categoriesList.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Work Mode */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
                Work Mode
              </label>
              <div className="space-y-2">
                {availableWorkModes.map((mode) => (
                  <label
                    key={mode}
                    className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer hover:text-indigo-600"
                  >
                    <input
                      type="checkbox"
                      checked={workModes.includes(mode)}
                      onChange={() => handleCheckboxToggle(workModes, setWorkModes, mode)}
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                    />
                    <span>{mode}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Job Type */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
                Employment Type
              </label>
              <div className="space-y-2">
                {availableJobTypes.map((type) => (
                  <label
                    key={type}
                    className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer hover:text-indigo-600"
                  >
                    <input
                      type="checkbox"
                      checked={jobTypes.includes(type)}
                      onChange={() => handleCheckboxToggle(jobTypes, setJobTypes, type)}
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                    />
                    <span>{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Experience Level */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
                Experience Level
              </label>
              <div className="space-y-2">
                {availableLevels.map((lvl) => (
                  <label
                    key={lvl}
                    className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer hover:text-indigo-600"
                  >
                    <input
                      type="checkbox"
                      checked={experienceLevels.includes(lvl)}
                      onChange={() => handleCheckboxToggle(experienceLevels, setExperienceLevels, lvl)}
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                    />
                    <span>{lvl}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Minimum Salary */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Minimum Annual Salary ($)
              </label>
              <select
                value={minSalary}
                onChange={(e) => {
                  setMinSalary(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 outline-none focus:border-indigo-600"
              >
                <option value="">Any Salary</option>
                <option value="60000">$60,000+ / year</option>
                <option value="90000">$90,000+ / year</option>
                <option value="120000">$120,000+ / year</option>
                <option value="150000">$150,000+ / year</option>
                <option value="180000">$180,000+ / year</option>
              </select>
            </div>

            {/* Date Posted */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Date Posted
              </label>
              <div className="space-y-1.5">
                {[
                  { label: 'Anytime', val: 'All' },
                  { label: 'Past 24 Hours', val: '24h' },
                  { label: 'Past 7 Days', val: '7d' },
                  { label: 'Past 14 Days', val: '14d' },
                  { label: 'Past Month', val: '30d' },
                ].map((dp) => (
                  <label
                    key={dp.val}
                    className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer hover:text-indigo-600"
                  >
                    <input
                      type="radio"
                      name="datePosted"
                      value={dp.val}
                      checked={datePosted === dp.val}
                      onChange={(e) => {
                        setDatePosted(e.target.value);
                        setPage(1);
                      }}
                      className="text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                    />
                    <span>{dp.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* Jobs Results Column */}
          <main className="lg:col-span-3 space-y-6">
            {/* Top Results Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/90">
              <div>
                <p className="text-sm font-bold text-slate-900">
                  Showing {jobs.length} of {pagination.totalJobs} vacancies
                </p>
                <p className="text-xs text-slate-500">
                  Updated in real-time with verified tech employers
                </p>
              </div>

              {/* Sort By Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-500">Sort by:</span>
                <select
                  value={sort}
                  onChange={(e) => {
                    setSort(e.target.value);
                    setPage(1);
                  }}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 outline-none focus:border-indigo-600 cursor-pointer"
                >
                  <option value="newest">Newest First</option>
                  <option value="salary_high">Salary: High to Low</option>
                  <option value="salary_low">Salary: Low to High</option>
                  <option value="views">Most Viewed</option>
                  <option value="most_applied">Most Applied</option>
                </select>
              </div>
            </div>

            {/* Jobs Grid or Loading / Empty state */}
            {loading ? (
              <div className="py-20 text-center">
                <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-3"></div>
                <p className="text-sm font-medium text-slate-500">Searching verified jobs...</p>
              </div>
            ) : jobs.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl border border-slate-200/90 text-center space-y-4">
                <Briefcase className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="text-lg font-bold text-slate-900">No jobs match your criteria</h3>
                <p className="text-sm text-slate-500 max-w-md mx-auto">
                  Try broadening your keyword search, clearing some filters, or checking back later as new positions are posted daily.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-5 py-2.5 rounded-xl bg-indigo-50 text-indigo-700 font-semibold text-xs hover:bg-indigo-100 transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {jobs.map((job) => (
                  <JobCard
                    key={job._id}
                    job={job}
                    isSaved={savedJobIds.has(job._id)}
                    onSaveToggle={handleSaveToggle}
                    onQuickApply={(j) => setSelectedJobForApply(j)}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-6">
                <button
                  disabled={!pagination.hasPrevPage}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
                >
                  Previous
                </button>

                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((num) => (
                  <button
                    key={num}
                    onClick={() => setPage(num)}
                    className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                      pagination.currentPage === num
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                        : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {num}
                  </button>
                ))}

                <button
                  disabled={!pagination.hasNextPage}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

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
