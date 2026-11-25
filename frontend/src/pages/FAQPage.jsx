import React from 'react';
import { HelpCircle } from 'lucide-react';

export default function FAQPage() {
  const faqs = [
    {
      q: 'Is CareerX completely free for candidates and job seekers?',
      a: 'Yes, 100%! Job seekers can search vacancies, create rich profiles, upload resumes, save jobs, and apply to unlimited verified positions without any cost or subscription.'
    },
    {
      q: 'How does resume uploading and profile synchronization work?',
      a: 'You can upload your resume in PDF, DOC, or DOCX formats up to 10MB. When applying to any job, you can use your saved profile resume or attach a role-tailored resume on the fly.'
    },
    {
      q: 'How do employers verify candidates and schedule interviews?',
      a: 'Recruiters have a dedicated dashboard where they can review candidate applications, inspect resumes, change statuses (Shortlisted, Under Review), and schedule video interviews with Google Meet/Zoom links and calendar notes.'
    },
    {
      q: 'Can I withdraw an application if I accepted an offer elsewhere?',
      a: 'Yes. Candidates can withdraw pending applications directly from their Candidate Dashboard with a single click, which instantly frees up the recruiter queue.'
    },
    {
      q: 'How do recruiters get their company profiles verified?',
      a: 'Platform administrators review corporate domains and business credentials before awarding the verified badge, ensuring zero scam postings.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-xl mx-auto space-y-3">
          <HelpCircle className="w-10 h-10 text-indigo-600 mx-auto" />
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-slate-600 text-sm">
            Everything you need to know about the CareerX platform and hiring workflow.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs space-y-2"
            >
              <h3 className="font-bold text-slate-900 text-base">{faq.q}</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
