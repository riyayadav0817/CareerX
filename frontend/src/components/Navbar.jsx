import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  Briefcase,
  Search,
  Building2,
  Bell,
  User,
  LogOut,
  Menu,
  X,
  ChevronDown,
  LayoutDashboard,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  Bookmark,
  FileText,
  GraduationCap,
  Code2,
  BookOpen,
  Award,
  HelpCircle,
  FileQuestion,
  Layers
} from 'lucide-react';

export default function Navbar() {
  const { user, logout, isAuthenticated, isSeeker, isRecruiter, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [prepDropdownOpen, setPrepDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch notifications if logged in
  useEffect(() => {
    if (isAuthenticated) {
      const fetchNotifications = async () => {
        try {
          const res = await api.get('/notifications');
          if (res.data.success) {
            setNotifications(res.data.notifications || []);
            setUnreadCount(res.data.unreadCount || 0);
          }
        } catch (err) {
          // silent fail
        }
      };
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
    setNotifDropdownOpen(false);
    setPrepDropdownOpen(false);
  }, [location.pathname]);

  const handleMarkAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => (id === 'all' || n._id === id ? { ...n, read: true } : n)));
      if (id === 'all') setUnreadCount(0);
      else setUnreadCount(c => Math.max(0, c - 1));
    } catch (err) {
      console.error(err);
    }
  };

  const getDashboardLink = () => {
    if (isAdmin) return '/admin';
    if (isRecruiter) return '/recruiter/dashboard';
    return '/seeker/dashboard';
  };

  return (
    <header className="sticky top-0 z-50 glass border-b border-slate-200/80 transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm shadow-indigo-600/20 group-hover:bg-indigo-700 transition-colors duration-150">
              <Briefcase className="w-4.5 h-4.5" />
            </div>
            <div className="leading-none">
              <span className="text-lg font-bold tracking-tight text-slate-900">
                Career<span className="text-indigo-600 font-extrabold">X</span>
              </span>
              <span className="hidden sm:block text-[9px] uppercase tracking-widest text-slate-400 font-semibold mt-0.5">
                Jobs &amp; Prep
              </span>
            </div>
          </Link>

          {/* Desktop Navigation (1280px+ single-line) */}
          <nav className="hidden xl:flex items-center gap-0.5">
            <Link
              to="/"
              className={`whitespace-nowrap px-2.5 py-1.5 rounded-lg text-[13px] font-medium transition-colors ${
                location.pathname === '/'
                  ? 'text-indigo-600 bg-indigo-50/90 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              Home
            </Link>

            <Link
              to="/jobs"
              className={`whitespace-nowrap px-2.5 py-1.5 rounded-lg text-[13px] font-medium transition-colors ${
                location.pathname.startsWith('/jobs')
                  ? 'text-indigo-600 bg-indigo-50/90 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              Find Jobs
            </Link>

            <Link
              to="/placement-prep"
              className={`whitespace-nowrap px-2.5 py-1.5 rounded-lg text-[13px] font-medium transition-colors flex items-center gap-1.5 ${
                location.pathname === '/placement-prep'
                  ? 'text-indigo-600 bg-indigo-50/90 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
              <span>Placement Prep</span>
            </Link>

            {/* Practice Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setPrepDropdownOpen(!prepDropdownOpen);
                  setNotifDropdownOpen(false);
                  setProfileDropdownOpen(false);
                }}
                className={`whitespace-nowrap px-2.5 py-1.5 rounded-lg text-[13px] font-medium transition-colors flex items-center gap-1 ${
                  location.pathname.startsWith('/placement-prep/')
                    ? 'text-indigo-600 bg-indigo-50/90 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                <span>Practice</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {prepDropdownOpen && (
                <div className="absolute left-0 mt-2 w-56 rounded-xl bg-white shadow-soft-lg border border-slate-200/80 py-1.5 z-50 animate-slide-up">
                  <Link
                    to="/placement-prep/aptitude"
                    className="flex items-center gap-2.5 px-3.5 py-2 text-[13px] font-medium text-slate-700 hover:bg-indigo-50/70 hover:text-indigo-600"
                  >
                    <BookOpen className="w-4 h-4 text-indigo-500 shrink-0" />
                    <span>Quantitative Aptitude</span>
                  </Link>
                  <Link
                    to="/placement-prep/reasoning"
                    className="flex items-center gap-2.5 px-3.5 py-2 text-[13px] font-medium text-slate-700 hover:bg-indigo-50/70 hover:text-indigo-600"
                  >
                    <HelpCircle className="w-4 h-4 text-purple-500 shrink-0" />
                    <span>Logical Reasoning</span>
                  </Link>
                  <Link
                    to="/placement-prep/verbal"
                    className="flex items-center gap-2.5 px-3.5 py-2 text-[13px] font-medium text-slate-700 hover:bg-indigo-50/70 hover:text-indigo-600"
                  >
                    <FileText className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Verbal Ability</span>
                  </Link>
                  <Link
                    to="/placement-prep/coding"
                    className="flex items-center gap-2.5 px-3.5 py-2 text-[13px] font-medium text-slate-700 hover:bg-indigo-50/70 hover:text-indigo-600"
                  >
                    <Code2 className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Coding &amp; DSA</span>
                  </Link>
                  <Link
                    to="/placement-prep/core-cs"
                    className="flex items-center gap-2.5 px-3.5 py-2 text-[13px] font-medium text-slate-700 hover:bg-indigo-50/70 hover:text-indigo-600"
                  >
                    <Layers className="w-4 h-4 text-blue-500 shrink-0" />
                    <span>Core CS &amp; SQL</span>
                  </Link>
                </div>
              )}
            </div>

            <Link
              to="/mock-tests"
              className={`whitespace-nowrap px-2.5 py-1.5 rounded-lg text-[13px] font-medium transition-colors ${
                location.pathname.startsWith('/mock-tests')
                  ? 'text-indigo-600 bg-indigo-50/90 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              Mock Tests
            </Link>

            <Link
              to="/company-prep"
              className={`whitespace-nowrap px-2.5 py-1.5 rounded-lg text-[13px] font-medium transition-colors ${
                location.pathname.startsWith('/company-prep')
                  ? 'text-indigo-600 bg-indigo-50/90 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              Company Prep
            </Link>

            <Link
              to="/interview-prep"
              className={`whitespace-nowrap px-2.5 py-1.5 rounded-lg text-[13px] font-medium transition-colors ${
                location.pathname === '/interview-prep'
                  ? 'text-indigo-600 bg-indigo-50/90 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              Interview Prep
            </Link>

            <Link
              to="/companies"
              className={`whitespace-nowrap px-2.5 py-1.5 rounded-lg text-[13px] font-medium transition-colors ${
                location.pathname === '/companies'
                  ? 'text-indigo-600 bg-indigo-50/90 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              Companies
            </Link>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden xl:flex items-center gap-2 shrink-0">
            {isAuthenticated ? (
              <>
                {/* Notifications Bell */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setNotifDropdownOpen(!notifDropdownOpen);
                      setProfileDropdownOpen(false);
                      setPrepDropdownOpen(false);
                    }}
                    className="relative p-2.5 rounded-xl text-slate-600 hover:text-indigo-600 hover:bg-slate-100 transition-colors"
                    title="Notifications"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notification Dropdown */}
                  {notifDropdownOpen && (
                    <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl bg-white shadow-2xl border border-slate-100 py-3 z-50 animate-slide-up">
                      <div className="px-4 py-2 flex items-center justify-between border-b border-slate-100">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-slate-800 text-sm">Notifications</h4>
                          {unreadCount > 0 && (
                            <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-semibold">
                              {unreadCount} new
                            </span>
                          )}
                        </div>
                        {unreadCount > 0 && (
                          <button
                            onClick={() => handleMarkAsRead('all')}
                            className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                          >
                            Mark all read
                          </button>
                        )}
                      </div>

                      <div className="max-h-80 overflow-y-auto divide-y divide-slate-50">
                        {notifications.length === 0 ? (
                          <div className="px-4 py-8 text-center text-slate-400 text-sm">
                            <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                            No notifications yet
                          </div>
                        ) : (
                          notifications.slice(0, 6).map((notif) => (
                            <div
                              key={notif._id}
                              onClick={() => {
                                handleMarkAsRead(notif._id);
                                if (notif.link) navigate(notif.link);
                                setNotifDropdownOpen(false);
                              }}
                              className={`px-4 py-3 cursor-pointer hover:bg-slate-50 transition-colors ${
                                !notif.read ? 'bg-indigo-50/40' : ''
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                <div className="p-2 rounded-xl bg-indigo-100 text-indigo-600 shrink-0 mt-0.5">
                                  <Sparkles className="w-4 h-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-semibold text-slate-900 truncate">{notif.title}</p>
                                  <p className="text-xs text-slate-600 line-clamp-2 mt-0.5">{notif.message}</p>
                                  <span className="text-[10px] text-slate-400 mt-1 block">
                                    {new Date(notif.createdAt).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Dashboard Button */}
                <Link
                  to={getDashboardLink()}
                  className="whitespace-nowrap flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Dashboard</span>
                </Link>

                {/* User Profile Menu */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(!profileDropdownOpen);
                      setNotifDropdownOpen(false);
                      setPrepDropdownOpen(false);
                    }}
                    className="whitespace-nowrap flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-full border border-slate-200 hover:border-indigo-300 transition-all bg-white"
                  >
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-7 h-7 rounded-full object-cover border border-slate-200 shrink-0"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-[11px] uppercase shrink-0">
                        {user?.name?.slice(0, 2) || 'CX'}
                      </div>
                    )}
                    <span className="text-[13px] font-semibold text-slate-700 whitespace-nowrap">
                      {user?.name}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  </button>

                  {/* Profile Dropdown */}
                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-3 w-64 rounded-2xl bg-white shadow-2xl border border-slate-100 py-2 z-50 animate-slide-up">
                      <div className="px-4 py-3 border-b border-slate-100">
                        <p className="text-sm font-bold text-slate-900 truncate">{user?.name}</p>
                        <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                        <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-indigo-50 text-indigo-700">
                          {user?.role === 'jobseeker' ? 'Candidate' : user?.role}
                        </div>
                      </div>

                      <div className="py-1">
                        <Link
                          to={getDashboardLink()}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs sm:text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600"
                        >
                          <LayoutDashboard className="w-4 h-4 text-slate-400" />
                          <span>Dashboard</span>
                        </Link>

                        {isSeeker && (
                          <>
                            <Link
                              to="/seeker/dashboard?tab=placement-prep"
                              className="flex items-center gap-2.5 px-4 py-2 text-xs sm:text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600"
                            >
                              <GraduationCap className="w-4 h-4 text-indigo-500" />
                              <span>Placement Progress</span>
                            </Link>
                            <Link
                              to="/seeker/dashboard?tab=applications"
                              className="flex items-center gap-2.5 px-4 py-2 text-xs sm:text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600"
                            >
                              <FileText className="w-4 h-4 text-slate-400" />
                              <span>My Applications</span>
                            </Link>
                            <Link
                              to="/seeker/dashboard?tab=saved"
                              className="flex items-center gap-2.5 px-4 py-2 text-xs sm:text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600"
                            >
                              <Bookmark className="w-4 h-4 text-slate-400" />
                              <span>Saved Jobs</span>
                            </Link>
                          </>
                        )}

                        {isRecruiter && (
                          <>
                            <Link
                              to="/recruiter/post-job"
                              className="flex items-center gap-2.5 px-4 py-2 text-xs sm:text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600"
                            >
                              <Briefcase className="w-4 h-4 text-slate-400" />
                              <span>Post a Job</span>
                            </Link>
                            <Link
                              to="/recruiter/applicants"
                              className="flex items-center gap-2.5 px-4 py-2 text-xs sm:text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600"
                            >
                              <User className="w-4 h-4 text-slate-400" />
                              <span>Candidate Applicants</span>
                            </Link>
                          </>
                        )}

                        {isAdmin && (
                          <Link
                            to="/admin"
                            className="flex items-center gap-2.5 px-4 py-2 text-xs sm:text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600"
                          >
                            <ShieldCheck className="w-4 h-4 text-slate-400" />
                            <span>Admin Center</span>
                          </Link>
                        )}
                      </div>

                      <div className="border-t border-slate-100 pt-1 mt-1">
                        <button
                          onClick={logout}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-xs sm:text-sm text-red-600 hover:bg-red-50 transition-colors font-medium text-left"
                        >
                          <LogOut className="w-4 h-4 text-red-500" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="whitespace-nowrap px-3 py-1.5 rounded-lg text-[13px] font-semibold text-slate-700 hover:text-indigo-600 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="whitespace-nowrap px-3.5 py-1.5 rounded-lg text-[13px] font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm shadow-indigo-600/20 transition-all"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile & Tablet Menu Button (<1280px) */}
          <div className="flex xl:hidden items-center gap-2 shrink-0">
            {isAuthenticated && (
              <Link
                to={getDashboardLink()}
                className="p-2 rounded-lg text-indigo-600 bg-indigo-50"
                title="Dashboard"
              >
                <LayoutDashboard className="w-5 h-5" />
              </Link>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile & Tablet Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 animate-fade-in shadow-xl max-h-[85vh] overflow-y-auto">
          <div className="space-y-1">
            <Link
              to="/"
              className="block px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Home
            </Link>
            <Link
              to="/jobs"
              className="block px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Find Jobs
            </Link>
            <Link
              to="/placement-prep"
              className="block px-3 py-2 rounded-xl text-sm font-semibold text-indigo-600 bg-indigo-50"
            >
              Placement Prep Dashboard
            </Link>

            <div className="pl-3 py-1 space-y-1 border-l-2 border-indigo-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block px-2">
                Practice Sections
              </span>
              <Link to="/placement-prep/aptitude" className="block px-2 py-1.5 text-xs font-medium text-slate-600">
                • Quantitative Aptitude
              </Link>
              <Link to="/placement-prep/reasoning" className="block px-2 py-1.5 text-xs font-medium text-slate-600">
                • Logical Reasoning
              </Link>
              <Link to="/placement-prep/verbal" className="block px-2 py-1.5 text-xs font-medium text-slate-600">
                • Verbal Ability
              </Link>
              <Link to="/placement-prep/coding" className="block px-2 py-1.5 text-xs font-medium text-slate-600">
                • Coding & DSA Practice
              </Link>
              <Link to="/placement-prep/core-cs" className="block px-2 py-1.5 text-xs font-medium text-slate-600">
                • Core Computer Science
              </Link>
            </div>

            <Link
              to="/mock-tests"
              className="block px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Mock Tests
            </Link>
            <Link
              to="/company-prep"
              className="block px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Company Preparation
            </Link>
            <Link
              to="/interview-prep"
              className="block px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Interview Guides
            </Link>
            <Link
              to="/companies"
              className="block px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Hiring Companies
            </Link>
          </div>

          <div className="pt-3 border-t border-slate-100 space-y-2">
            {isAuthenticated ? (
              <>
                <Link
                  to={getDashboardLink()}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-indigo-50 text-indigo-700 text-sm font-bold"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Go to Dashboard</span>
                </Link>
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-red-600 hover:bg-red-50 text-sm font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  to="/login"
                  className="w-full text-center py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-50"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="w-full text-center py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 shadow-md shadow-indigo-500/20"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
