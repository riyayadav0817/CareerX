import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../../services/api';
import {
  ShieldCheck,
  Users,
  Briefcase,
  Building2,
  FileText,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Search,
  Trash2,
  Lock,
  Unlock,
  Check,
  X,
  TrendingUp,
  Activity,
  Layers
} from 'lucide-react';

export default function AdminDashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'stats';

  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  // User filters
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('All');

  // Job filter
  const [jobModFilter, setJobModFilter] = useState('All');

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, jobsRes, compRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users?limit=50'),
        api.get('/admin/jobs'),
        api.get('/companies'),
      ]);

      if (statsRes.data.success) setStats(statsRes.data);
      if (usersRes.data.success) setUsers(usersRes.data.users);
      if (jobsRes.data.success) setJobs(jobsRes.data.jobs);
      if (compRes.data.success) setCompanies(compRes.data.companies);
    } catch (err) {
      console.error('Admin fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const setTab = (tabName) => {
    setSearchParams({ tab: tabName });
  };

  // Toggle user suspension
  const handleToggleUserStatus = async (userId, currentStatus) => {
    const nextStatus = currentStatus === 'active' ? 'suspended' : 'active';
    try {
      const res = await api.put(`/admin/users/${userId}`, { status: nextStatus });
      if (res.data.success) {
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, status: nextStatus } : u))
        );
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Could not update user');
    }
  };

  // Delete user
  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to permanently delete this user account?')) return;
    try {
      const res = await api.delete(`/admin/users/${userId}`);
      if (res.data.success) {
        setUsers((prev) => prev.filter((u) => u._id !== userId));
        alert('User deleted.');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Could not delete user');
    }
  };

  // Moderate job
  const handleModerateJob = async (jobId, newStatus) => {
    try {
      const res = await api.put(`/admin/jobs/${jobId}/moderate`, { moderationStatus: newStatus });
      if (res.data.success) {
        setJobs((prev) =>
          prev.map((j) => (j._id === jobId ? { ...j, moderationStatus: newStatus } : j))
        );
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Could not moderate job');
    }
  };

  // Delete job
  const handleDeleteJobAdmin = async (jobId) => {
    if (!window.confirm('Are you sure you want to remove this job posting?')) return;
    try {
      const res = await api.delete(`/admin/jobs/${jobId}`);
      if (res.data.success) {
        setJobs((prev) => prev.filter((j) => j._id !== jobId));
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Could not delete job');
    }
  };

  // Toggle company verification
  const handleToggleVerifyCompany = async (compId, currentVerified) => {
    try {
      const res = await api.put(`/admin/companies/${compId}/verify`, { verified: !currentVerified });
      if (res.data.success) {
        setCompanies((prev) =>
          prev.map((c) => (c._id === compId ? { ...c, verified: !currentVerified } : c))
        );
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Could not update company');
    }
  };

  const filteredUsers = users.filter((u) => {
    if (userRoleFilter !== 'All' && u.role !== userRoleFilter) return false;
    if (userSearch.trim()) {
      const q = userSearch.toLowerCase();
      return u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q);
    }
    return true;
  });

  const filteredJobs = jobs.filter((j) => {
    if (jobModFilter !== 'All' && j.moderationStatus !== jobModFilter) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest block">
                Platform Control Center
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                CareerX Admin Panel
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Monitor system metrics, moderate job postings, verify companies, and manage users.
              </p>
            </div>
          </div>
        </div>

        {/* High-level KPI Cards */}
        {stats?.stats && (
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
              <span className="text-xs font-semibold text-slate-500">Total Users</span>
              <p className="text-2xl font-black text-slate-900 mt-1">{stats.stats.totalUsers}</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
              <span className="text-xs font-semibold text-slate-500">Job Seekers</span>
              <p className="text-2xl font-black text-indigo-600 mt-1">{stats.stats.totalJobSeekers}</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
              <span className="text-xs font-semibold text-slate-500">Recruiters</span>
              <p className="text-2xl font-black text-purple-600 mt-1">{stats.stats.totalRecruiters}</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
              <span className="text-xs font-semibold text-slate-500">Active Jobs</span>
              <p className="text-2xl font-black text-emerald-600 mt-1">{stats.stats.activeJobs}</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
              <span className="text-xs font-semibold text-slate-500">Applications</span>
              <p className="text-2xl font-black text-blue-600 mt-1">{stats.stats.totalApplications}</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
              <span className="text-xs font-semibold text-slate-500">Hired Offers</span>
              <p className="text-2xl font-black text-amber-600 mt-1">{stats.stats.hiredCount}</p>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1">
          {[
            { id: 'stats', label: 'Platform Analytics', icon: <TrendingUp className="w-4 h-4" /> },
            { id: 'users', label: 'User Management', count: users.length, icon: <Users className="w-4 h-4" /> },
            { id: 'jobs', label: 'Job Moderation', count: jobs.length, icon: <Briefcase className="w-4 h-4" /> },
            { id: 'companies', label: 'Company Verification', count: companies.length, icon: <Building2 className="w-4 h-4" /> },
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

        {/* TAB 1: PLATFORM ANALYTICS */}
        {activeTab === 'stats' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Status Breakdown */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-2xs space-y-4">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Activity className="w-5 h-5 text-indigo-600" />
                <span>Application Funnel Breakdown</span>
              </h3>
              <div className="space-y-3">
                {stats?.statusBreakdown?.map((sb) => (
                  <div key={sb._id} className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">{sb._id}</span>
                    <span className="px-2.5 py-1 rounded-full font-bold bg-slate-100 text-slate-800">
                      {sb.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Jobs by Category */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-2xs space-y-4">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-600" />
                <span>Top Job Categories Distribution</span>
              </h3>
              <div className="space-y-3">
                {stats?.jobsByCategory?.map((cat) => (
                  <div key={cat._id} className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">{cat._id}</span>
                    <span className="px-2.5 py-1 rounded-full font-bold bg-indigo-50 text-indigo-700">
                      {cat.count} listings
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Registrations */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-2xs space-y-4 md:col-span-2">
              <h3 className="font-bold text-slate-900 text-base">Recent Platform Registrations</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <tr>
                      <th className="px-4 py-3">Name</th>
                      <th className="px-4 py-3">Email</th>
                      <th className="px-4 py-3">Role</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Joined</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {stats?.recentUsers?.map((u) => (
                      <tr key={u._id}>
                        <td className="px-4 py-3 font-bold text-slate-900">{u.name}</td>
                        <td className="px-4 py-3 text-slate-600">{u.email}</td>
                        <td className="px-4 py-3 capitalize font-semibold text-indigo-700">{u.role}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              u.status === 'active'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {u.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-400">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: USER MANAGEMENT */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden space-y-4 p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 w-full sm:w-64">
                  <Search className="w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    placeholder="Search name or email..."
                    className="w-full bg-transparent text-xs text-slate-800 outline-none"
                  />
                </div>

                <select
                  value={userRoleFilter}
                  onChange={(e) => setUserRoleFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 outline-none"
                >
                  <option value="All">All Roles</option>
                  <option value="jobseeker">Job Seeker</option>
                  <option value="recruiter">Recruiter</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <span className="text-xs text-slate-500 font-semibold">
                {filteredUsers.length} total registered users
              </span>
            </div>

            <div className="overflow-x-auto pt-2">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3">User</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Organization</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map((u) => (
                    <tr key={u._id} className="hover:bg-slate-50">
                      <td className="px-4 py-3.5">
                        <p className="font-bold text-slate-900">{u.name}</p>
                        <p className="text-[11px] text-slate-400">{u.email}</p>
                      </td>
                      <td className="px-4 py-3.5 capitalize font-semibold text-slate-700">
                        {u.role}
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            u.status === 'active'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {u.status}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-slate-600 font-medium">
                        {u.company?.name || '—'}
                      </td>
                      <td className="px-4 py-3.5 text-right space-x-2">
                        <button
                          onClick={() => handleToggleUserStatus(u._id, u.status)}
                          className={`p-1.5 rounded-lg border text-xs font-semibold ${
                            u.status === 'active'
                              ? 'border-amber-200 text-amber-700 hover:bg-amber-50'
                              : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                          }`}
                          title={u.status === 'active' ? 'Suspend account' : 'Reactivate account'}
                        >
                          {u.status === 'active' ? <Lock className="w-3.5 h-3.5 inline" /> : <Unlock className="w-3.5 h-3.5 inline" />}
                        </button>
                        <button
                          onClick={() => handleDeleteUser(u._id)}
                          className="p-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                          title="Delete user"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: JOB MODERATION */}
        {activeTab === 'jobs' && (
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Job Postings Moderation</h3>
                <p className="text-xs text-slate-500">Approve, flag, or remove inappropriate listings</p>
              </div>

              <select
                value={jobModFilter}
                onChange={(e) => setJobModFilter(e.target.value)}
                className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 outline-none"
              >
                <option value="All">All Statuses</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div className="overflow-x-auto pt-2">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3">Job Title & Company</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Moderation</th>
                    <th className="px-4 py-3">Posted By</th>
                    <th className="px-4 py-3 text-right">Moderation Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredJobs.map((j) => (
                    <tr key={j._id} className="hover:bg-slate-50">
                      <td className="px-4 py-3.5">
                        <p className="font-bold text-slate-900">{j.title}</p>
                        <p className="text-[11px] text-slate-500">{j.company?.name} • {j.location}</p>
                      </td>
                      <td className="px-4 py-3.5 font-medium text-slate-700">{j.category}</td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            j.moderationStatus === 'approved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : j.moderationStatus === 'rejected'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {j.moderationStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-slate-600">
                        {j.recruiter?.name || 'Recruiter'}
                      </td>
                      <td className="px-4 py-3.5 text-right space-x-2">
                        {j.moderationStatus !== 'approved' && (
                          <button
                            onClick={() => handleModerateJob(j._id, 'approved')}
                            className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-bold text-xs hover:bg-emerald-100"
                          >
                            Approve
                          </button>
                        )}
                        {j.moderationStatus !== 'rejected' && (
                          <button
                            onClick={() => handleModerateJob(j._id, 'rejected')}
                            className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 font-bold text-xs hover:bg-amber-100"
                          >
                            Reject
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteJobAdmin(j._id)}
                          className="p-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                          title="Delete Job"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: COMPANY VERIFICATION */}
        {activeTab === 'companies' && (
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden p-6 space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Hiring Organizations & Verification</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3">Company</th>
                    <th className="px-4 py-3">Headquarters</th>
                    <th className="px-4 py-3">Industry</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Verification Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {companies.map((comp) => (
                    <tr key={comp._id} className="hover:bg-slate-50">
                      <td className="px-4 py-3.5">
                        <p className="font-bold text-slate-900">{comp.name}</p>
                        <p className="text-[11px] text-slate-400">{comp.website}</p>
                      </td>
                      <td className="px-4 py-3.5 text-slate-600">{comp.location}</td>
                      <td className="px-4 py-3.5 text-slate-600">{comp.industry}</td>
                      <td className="px-4 py-3.5">
                        {comp.verified ? (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600">
                            <CheckCircle2 className="w-4 h-4 fill-emerald-100" />
                            <span>Verified</span>
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400">Unverified</span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <button
                          onClick={() => handleToggleVerifyCompany(comp._id, comp.verified)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                            comp.verified
                              ? 'border border-slate-200 text-slate-600 hover:bg-slate-100'
                              : 'bg-indigo-600 text-white hover:bg-indigo-700'
                          }`}
                        >
                          {comp.verified ? 'Revoke Badge' : 'Grant Verified Badge'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
