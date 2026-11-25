import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import confetti from 'canvas-confetti';
import {
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Bookmark,
  Sparkles,
  Award,
  RotateCcw,
  BarChart2,
  ChevronRight,
  Check
} from 'lucide-react';

export default function MockTestLivePage() {
  const { id } = useParams();

  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Exam Answers State: { [qId]: { selectedOption: 'A', isMarkedForReview: false } }
  const [userResponses, setUserResponses] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  useEffect(() => {
    const fetchTest = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/prep/mock-tests/${id}`);
        if (res.data.success) {
          const t = res.data.test;
          setTest(t);
          setTimeLeft(t.durationMinutes * 60);
        }
      } catch (err) {
        console.error('Error fetching mock test:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTest();
  }, [id]);

  // Live Timer Countdown
  useEffect(() => {
    if (isSubmitted || timeLeft <= 0 || loading || !test) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinalSubmit(); // Auto submit when timer reaches 0
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isSubmitted, loading, test]);

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const currentQ = test?.questions?.[currentIndex];
  const currentResp = currentQ ? userResponses[currentQ._id] || {} : {};

  const handleSelectOption = (optId) => {
    if (isSubmitted) return;
    setUserResponses((prev) => ({
      ...prev,
      [currentQ._id]: {
        ...prev[currentQ._id],
        selectedOption: optId,
      },
    }));
  };

  const handleToggleReview = () => {
    if (isSubmitted) return;
    setUserResponses((prev) => ({
      ...prev,
      [currentQ._id]: {
        ...prev[currentQ._id],
        isMarkedForReview: !prev[currentQ._id]?.isMarkedForReview,
      },
    }));
  };

  const handleClearResponse = () => {
    if (isSubmitted) return;
    setUserResponses((prev) => ({
      ...prev,
      [currentQ._id]: {
        ...prev[currentQ._id],
        selectedOption: '',
      },
    }));
  };

  const handleFinalSubmit = async () => {
    if (submitting || isSubmitted) return;
    setSubmitting(true);
    setShowSubmitModal(false);

    try {
      const formattedAnswers = Object.entries(userResponses).map(([qId, val]) => ({
        questionId: qId,
        selectedOption: val.selectedOption || '',
        isMarkedForReview: val.isMarkedForReview || false,
      }));

      const timeTakenSeconds = test.durationMinutes * 60 - timeLeft;

      const res = await api.post(`/prep/mock-tests/${test._id}/submit`, {
        answers: formattedAnswers,
        timeTakenSeconds,
      });

      if (res.data.success) {
        setTestResult(res.data.result);
        setIsSubmitted(true);

        // Confetti celebration if passed with > 60%
        if (res.data.result.score / res.data.result.totalMarks >= 0.6) {
          confetti({
            particleCount: 100,
            spread: 75,
            origin: { y: 0.6 },
          });
        }
      }
    } catch (err) {
      console.error('Error submitting test:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-sm text-slate-500 font-medium">Initializing secure test environment...</p>
      </div>
    );
  }

  if (!test) {
    return (
      <div className="py-20 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-slate-300 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900">Test Not Found</h2>
        <Link to="/mock-tests" className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs">
          Return to Mock Tests
        </Link>
      </div>
    );
  }

  // Answered count
  const answeredCount = Object.values(userResponses).filter((r) => r.selectedOption).length;
  const reviewCount = Object.values(userResponses).filter((r) => r.isMarkedForReview).length;

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Top Header Bar */}
        <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest block">
              {test.companyTag || 'Live Assessment'}
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              {test.title}
            </h1>
          </div>

          {!isSubmitted ? (
            <div className="flex items-center gap-4">
              {/* Countdown Timer */}
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-2xl border font-mono text-base font-extrabold ${
                  timeLeft < 300
                    ? 'bg-rose-50 border-rose-200 text-rose-600 animate-pulse'
                    : 'bg-indigo-50 border-indigo-100 text-indigo-700'
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>{formatTimer(timeLeft)}</span>
              </div>

              <button
                onClick={() => setShowSubmitModal(true)}
                className="px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/25 transition-all"
              >
                Submit Test
              </button>
            </div>
          ) : (
            <Link
              to="/mock-tests"
              className="px-6 py-2.5 rounded-2xl bg-indigo-600 text-white font-bold text-xs"
            >
              Take Another Test
            </Link>
          )}
        </div>

        {/* IF SUBMITTED: Display Comprehensive Result Scorecard & Review */}
        {isSubmitted && testResult ? (
          <div className="space-y-8 animate-fade-in">
            {/* Scorecard Hero */}
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-3">
                    <Award className="w-4 h-4" />
                    <span>Assessment Completed</span>
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-extrabold">
                    Score: {testResult.score} / {testResult.totalMarks}
                  </h2>
                  <p className="text-slate-300 text-xs sm:text-sm mt-1">
                    Accuracy: <strong>{testResult.accuracy}%</strong> • Time Taken:{' '}
                    <strong>{Math.round(testResult.timeTakenSeconds / 60)} minutes</strong>
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
                    <span className="text-[10px] uppercase font-bold text-emerald-400">Correct</span>
                    <p className="text-xl font-black text-white">{testResult.correctCount}</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
                    <span className="text-[10px] uppercase font-bold text-rose-400">Wrong</span>
                    <p className="text-xl font-black text-white">{testResult.wrongCount}</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Skipped</span>
                    <p className="text-xl font-black text-white">{testResult.unansweredCount}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Question Review List */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-6">
              <h3 className="text-xl font-extrabold text-slate-900">
                Detailed Solutions & Question Review
              </h3>

              <div className="space-y-6 divide-y divide-slate-100">
                {testResult.questionsReview?.map((qReview, idx) => (
                  <div key={idx} className="pt-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Question #{idx + 1}
                      </span>
                      {qReview.isCorrect ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Correct
                        </span>
                      ) : qReview.selectedOption ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 bg-rose-50 px-3 py-0.5 rounded-full">
                          <XCircle className="w-3.5 h-3.5" /> Incorrect
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 bg-slate-100 px-3 py-0.5 rounded-full">
                          Unanswered
                        </span>
                      )}
                    </div>

                    <p className="text-sm sm:text-base font-bold text-slate-900">
                      {qReview.question}
                    </p>

                    {/* Options list */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {qReview.options.map((opt) => {
                        const isChosen = qReview.selectedOption === opt.id;
                        const isCorrectAnswer = qReview.correctOption === opt.id;

                        let style = 'bg-slate-50 border-slate-200 text-slate-700';
                        if (isCorrectAnswer) style = 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold';
                        else if (isChosen && !qReview.isCorrect) style = 'bg-rose-50 border-rose-300 text-rose-900 font-bold';

                        return (
                          <div key={opt.id} className={`p-3 rounded-xl border flex items-center justify-between ${style}`}>
                            <span>{opt.id}. {opt.text}</span>
                            {isCorrectAnswer && <Check className="w-4 h-4 text-emerald-600" />}
                          </div>
                        );
                      })}
                    </div>

                    {/* Explanation */}
                    {qReview.explanation && (
                      <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 text-xs text-indigo-950 space-y-1">
                        <strong className="block text-indigo-900">Explanation:</strong>
                        <p>{qReview.explanation}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* LIVE EXAM INTERACTION: Question Box + Palette */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Main Question Panel (Col 8) */}
            <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Question {currentIndex + 1} of {test.questions.length}
                </span>

                <button
                  onClick={handleToggleReview}
                  className={`text-xs font-bold flex items-center gap-1.5 px-3 py-1 rounded-xl transition-colors ${
                    currentResp.isMarkedForReview
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <Bookmark className={`w-3.5 h-3.5 ${currentResp.isMarkedForReview ? 'fill-purple-800' : ''}`} />
                  <span>{currentResp.isMarkedForReview ? 'Marked for Review' : 'Mark for Review'}</span>
                </button>
              </div>

              {/* Question Statement */}
              <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
                {currentQ?.question}
              </h2>

              {/* Options */}
              <div className="space-y-3 pt-2">
                {currentQ?.options?.map((opt) => {
                  const isSelected = currentResp.selectedOption === opt.id;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => handleSelectOption(opt.id)}
                      className={`p-4 rounded-2xl border-2 flex items-center gap-3.5 cursor-pointer transition-all ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/60 text-indigo-950 font-bold'
                          : 'border-slate-200 hover:border-slate-300 text-slate-800'
                      }`}
                    >
                      <span
                        className={`w-8 h-8 rounded-xl text-xs font-bold flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {opt.id}
                      </span>
                      <span className="text-xs sm:text-sm">{opt.text}</span>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Navigation Buttons */}
              <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    disabled={currentIndex === 0}
                    onClick={() => setCurrentIndex((c) => Math.max(0, c - 1))}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={handleClearResponse}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800"
                  >
                    Clear Response
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {currentIndex < test.questions.length - 1 ? (
                    <button
                      onClick={() => setCurrentIndex((c) => c + 1)}
                      className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/20"
                    >
                      Save & Next
                    </button>
                  ) : (
                    <button
                      onClick={() => setShowSubmitModal(true)}
                      className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-500/20"
                    >
                      Finish & Submit Test
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Right Question Palette (Col 4) */}
            <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-5">
              <h3 className="font-bold text-slate-900 text-base">Question Palette</h3>

              {/* Palette Legend */}
              <div className="grid grid-cols-2 gap-2 text-[11px] font-semibold text-slate-600">
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded-md bg-emerald-500"></span>
                  <span>Answered ({answeredCount})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded-md bg-purple-500"></span>
                  <span>Review ({reviewCount})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded-md bg-slate-200"></span>
                  <span>Not Answered ({test.questions.length - answeredCount})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded-md border-2 border-indigo-600 bg-white"></span>
                  <span>Current</span>
                </div>
              </div>

              {/* Number Buttons Grid */}
              <div className="grid grid-cols-5 gap-2 pt-2">
                {test.questions.map((q, idx) => {
                  const resp = userResponses[q._id];
                  const hasAnswer = Boolean(resp?.selectedOption);
                  const isReview = Boolean(resp?.isMarkedForReview);
                  const isCurrent = currentIndex === idx;

                  let style = 'bg-slate-100 text-slate-700 hover:bg-slate-200';
                  if (hasAnswer) style = 'bg-emerald-500 text-white font-bold';
                  else if (isReview) style = 'bg-purple-500 text-white font-bold';

                  if (isCurrent) {
                    style += ' ring-2 ring-indigo-600 ring-offset-2';
                  }

                  return (
                    <button
                      key={q._id}
                      onClick={() => setCurrentIndex(idx)}
                      className={`h-10 rounded-xl text-xs font-bold transition-all ${style}`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-slate-100">
                <button
                  onClick={() => setShowSubmitModal(true)}
                  className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/20"
                >
                  Submit Assessment
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Confirmation Modal */}
        {showSubmitModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4 animate-slide-up">
              <h3 className="font-extrabold text-slate-900 text-lg">Submit Assessment?</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                You have answered <strong>{answeredCount} of {test.questions.length}</strong> questions.
                {reviewCount > 0 && ` (${reviewCount} marked for review).`}
                Are you sure you want to finalize your submission?
              </p>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  onClick={() => setShowSubmitModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600"
                >
                  Continue Test
                </button>
                <button
                  onClick={handleFinalSubmit}
                  disabled={submitting}
                  className="px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/20"
                >
                  {submitting ? 'Submitting...' : 'Confirm Submission'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
