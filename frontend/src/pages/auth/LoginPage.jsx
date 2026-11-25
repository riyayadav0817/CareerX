import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Briefcase,
  Mail,
  Lock,
  ArrowRight,
  AlertCircle,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Building2,
  UserCheck
} from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please provide your email address and password');
      return;
    }

    try {
      setLoading(true);
      const user = await login(email, password);
      // Redirect based on role
      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'recruiter') navigate('/recruiter/dashboard');
      else navigate(from === '/' ? '/seeker/dashboard' : from);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  // Quick Demo fill
  const handleQuickLogin = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50/70 via-white to-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
              <Briefcase className="w-6 h-6" />
            </div>
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Career<span className="text-indigo-600">X</span>
            </span>
          </Link>
        </div>
        <h2 className="mt-6 text-center text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Welcome back to CareerX
        </h2>
        <p className="mt-2 text-center text-xs sm:text-sm text-slate-600">
          Sign in to access your jobs, applications, and verified hiring pipeline.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200/80 space-y-6">
          {error && (
            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 transition-all"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Accounts Selection */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block text-center">
              Quick 1-Click Demo Accounts
            </span>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('seeker@careerx.com', 'password123')}
                className="p-2.5 rounded-xl border border-indigo-100 bg-indigo-50/50 hover:bg-indigo-100/60 text-left transition-colors"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-700">
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Job Seeker</span>
                </div>
                <span className="text-[10px] text-slate-500 block truncate">seeker@careerx.com</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('recruiter@stripe.com', 'password123')}
                className="p-2.5 rounded-xl border border-purple-100 bg-purple-50/50 hover:bg-purple-100/60 text-left transition-colors"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-purple-700">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Stripe Recruiter</span>
                </div>
                <span className="text-[10px] text-slate-500 block truncate">recruiter@stripe.com</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('recruiter@google.com', 'password123')}
                className="p-2.5 rounded-xl border border-blue-100 bg-blue-50/50 hover:bg-blue-100/60 text-left transition-colors"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-blue-700">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Google Recruiter</span>
                </div>
                <span className="text-[10px] text-slate-500 block truncate">recruiter@google.com</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('admin@careerx.com', 'admin123')}
                className="p-2.5 rounded-xl border border-slate-200 bg-slate-100/70 hover:bg-slate-200 text-left transition-colors"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Admin</span>
                </div>
                <span className="text-[10px] text-slate-500 block truncate">admin@careerx.com</span>
              </button>
            </div>
          </div>

          <div className="text-center pt-2">
            <p className="text-xs text-slate-600">
              Don't have an account yet?{' '}
              <Link to="/register" className="font-bold text-indigo-600 hover:text-indigo-800 underline">
                Sign up free
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
