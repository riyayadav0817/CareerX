import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import confetti from 'canvas-confetti';
import {
  X,
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  Building2,
  Send,
  Loader2
} from 'lucide-react';

export default function ApplyModal({ job, isOpen, onClose, onSuccess }) {
  const { user, isAuthenticated } = useAuth();
  const [coverLetter, setCoverLetter] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [useProfileResume, setUseProfileResume] = useState(Boolean(user?.resume?.url));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !job) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!isAuthenticated) {
      setError('Please sign in as a job seeker to submit an application.');
      return;
    }

    if (user?.role !== 'jobseeker') {
      setError('Only job seekers can submit applications. Please sign in with a candidate account.');
      return;
    }

    if (!useProfileResume && !selectedFile) {
      setError('Please select or upload a resume file (PDF, DOC, DOCX).');
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('coverLetter', coverLetter);

      if (!useProfileResume && selectedFile) {
        formData.append('resume', selectedFile);
      }

      const res = await api.post(`/applications/${job._id}/apply`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.data.success) {
        // Trigger celebratory confetti
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });

        if (onSuccess) onSuccess(res.data.application);
        onClose();
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-indigo-50/80 via-white to-purple-50/80 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {job.company?.logo ? (
              <img
                src={job.company.logo}
                alt={job.company.name}
                className="w-10 h-10 rounded-xl object-contain bg-white border border-slate-200 p-1"
              />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                <Building2 className="w-5 h-5" />
              </div>
            )}
            <div>
              <h3 className="font-bold text-slate-900 text-base leading-tight">
                Apply for {job.title}
              </h3>
              <p className="text-xs text-slate-500 font-medium">{job.company?.name} • {job.location}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Resume Choice */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Attach Resume *
            </label>

            {user?.resume?.url ? (
              <div className="space-y-2">
                <div
                  onClick={() => setUseProfileResume(true)}
                  className={`p-3.5 rounded-2xl border-2 flex items-center justify-between cursor-pointer transition-all ${
                    useProfileResume
                      ? 'border-indigo-600 bg-indigo-50/40 text-indigo-900'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-white border border-indigo-100 text-indigo-600">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">
                        {user.resume.originalName || 'Default Profile Resume.pdf'}
                      </p>
                      <p className="text-[11px] text-slate-500">From your candidate profile</p>
                    </div>
                  </div>
                  {useProfileResume && <CheckCircle2 className="w-5 h-5 text-indigo-600" />}
                </div>

                <div
                  onClick={() => setUseProfileResume(false)}
                  className={`p-3.5 rounded-2xl border-2 flex items-center justify-between cursor-pointer transition-all ${
                    !useProfileResume
                      ? 'border-indigo-600 bg-indigo-50/40 text-indigo-900'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-white border border-slate-200 text-slate-500">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">Upload a different resume</p>
                      <p className="text-[11px] text-slate-500">Customized specifically for this application</p>
                    </div>
                  </div>
                  {!useProfileResume && <CheckCircle2 className="w-5 h-5 text-indigo-600" />}
                </div>
              </div>
            ) : null}

            {(!useProfileResume || !user?.resume?.url) && (
              <div className="mt-3">
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 hover:border-indigo-500 rounded-2xl p-5 cursor-pointer bg-slate-50/50 hover:bg-indigo-50/20 transition-all">
                  <Upload className="w-7 h-7 text-indigo-500 mb-2" />
                  <span className="text-xs font-semibold text-slate-700">
                    {selectedFile ? selectedFile.name : 'Click to select resume file'}
                  </span>
                  <span className="text-[11px] text-slate-400 mt-1">PDF, DOC, DOCX up to 10MB</span>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                  />
                </label>
              </div>
            )}
          </div>

          {/* Cover Letter */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Cover Note / Pitch (Optional)
              </label>
              <span className="text-[11px] text-slate-400">Highlight your best achievements</span>
            </div>
            <textarea
              rows={4}
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Why are you a fantastic fit for this role? Share relevant achievements, projects, or questions for the hiring team..."
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 outline-none text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 transition-all resize-none"
            ></textarea>
          </div>

          {/* Notice */}
          <p className="text-[11px] text-slate-400 leading-relaxed">
            By submitting, your profile details, skills, and resume will be transmitted directly to the recruiting team at {job.company?.name}.
          </p>

          {/* Footer buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs sm:text-sm font-semibold hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-xs sm:text-sm font-semibold shadow-md shadow-indigo-500/25 hover:from-indigo-700 hover:to-violet-700 transition-all flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Application</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
