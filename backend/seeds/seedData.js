const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: __dirname + '/../.env' });

const User = require('../models/User');
const Company = require('../models/Company');
const Job = require('../models/Job');
const Application = require('../models/Application');
const SavedJob = require('../models/SavedJob');
const Notification = require('../models/Notification');

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/careerx_db';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing collections
    await Promise.all([
      User.deleteMany({}),
      Company.deleteMany({}),
      Job.deleteMany({}),
      Application.deleteMany({}),
      SavedJob.deleteMany({}),
      Notification.deleteMany({}),
    ]);

    console.log('Cleared existing collections.');

    // 1. Create Users
    // Admin
    const adminUser = await User.create({
      name: 'Eleanor Vance',
      email: 'admin@careerx.com',
      password: 'admin123',
      role: 'admin',
      headline: 'Platform Administrator & Trust Lead',
      location: 'San Francisco, CA',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    });

    // Recruiters
    const recruiterGoogle = await User.create({
      name: 'Sarah Jenkins',
      email: 'recruiter@google.com',
      password: 'password123',
      role: 'recruiter',
      headline: 'Senior Tech Talent Partner at Google',
      location: 'Mountain View, CA',
      phone: '+1 (555) 234-5678',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    });

    const recruiterStripe = await User.create({
      name: 'Marcus Chen',
      email: 'recruiter@stripe.com',
      password: 'password123',
      role: 'recruiter',
      headline: 'Head of Engineering Talent at Stripe',
      location: 'San Francisco, CA',
      phone: '+1 (555) 345-6789',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    });

    const recruiterAirbnb = await User.create({
      name: 'Jessica Reynolds',
      email: 'recruiter@airbnb.com',
      password: 'password123',
      role: 'recruiter',
      headline: 'Principal Recruiter at Airbnb',
      location: 'San Francisco, CA',
      phone: '+1 (555) 456-7890',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
    });

    // Job Seeker
    const jobSeeker = await User.create({
      name: 'Alex Rivera',
      email: 'seeker@careerx.com',
      password: 'password123',
      role: 'jobseeker',
      headline: 'Senior Full Stack & Cloud Engineer',
      bio: 'Passionate software craftsman with 6+ years designing, building and scaling modern cloud and web applications with React, Node.js, TypeScript and distributed systems.',
      location: 'Austin, TX (Open to Remote)',
      phone: '+1 (555) 987-6543',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
      skills: ['React', 'Node.js', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Docker', 'AWS', 'MongoDB', 'GraphQL', 'PostgreSQL'],
      resume: {
        url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        filename: 'Alex_Rivera_Senior_FullStack_Resume.pdf',
        originalName: 'Alex_Rivera_Resume_2026.pdf',
        updatedAt: new Date(),
      },
      portfolioLinks: {
        github: 'https://github.com/alexrivera-dev',
        linkedin: 'https://linkedin.com/in/alexrivera-tech',
        portfolio: 'https://alexrivera.dev',
        twitter: 'https://twitter.com/alexrivera_codes',
      },
      education: [
        {
          degree: 'B.S. in Computer Science',
          institution: 'University of Texas at Austin',
          startYear: '2016',
          endYear: '2020',
          description: 'Graduated Magna Cum Laude. President of Computer Science Society.',
        },
      ],
      experience: [
        {
          title: 'Senior Software Engineer',
          company: 'Nexus Cloud Technologies',
          location: 'Austin, TX',
          startDate: '2022',
          endDate: 'Present',
          current: true,
          description: 'Architected high-throughput microservices using Node.js and React. Reduced server latency by 42% through optimized caching strategies.',
        },
        {
          title: 'Software Developer',
          company: 'Hyperion Labs',
          location: 'Remote',
          startDate: '2020',
          endDate: '2022',
          current: false,
          description: 'Developed responsive user-facing features for a flagship SaaS platform serving over 500,000 active monthly users.',
        },
      ],
    });

    // 2. Create Companies
    const googleCompany = await Company.create({
      name: 'Google',
      slug: 'google',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg',
      website: 'https://careers.google.com',
      industry: 'Technology & Cloud',
      companySize: '1000+',
      location: 'Mountain View, CA',
      description: 'Our mission is to organize the world’s information and make it universally accessible and useful.',
      about: 'Google is a global technology leader focused on improving the ways people connect with information. Our innovations in web search and advertising have made our products a top web property and our brand one of the most recognized in the world.',
      foundedYear: 1998,
      verified: true,
      recruiter: recruiterGoogle._id,
      socialLinks: {
        linkedin: 'https://linkedin.com/company/google',
        twitter: 'https://twitter.com/google',
      },
    });

    const stripeCompany = await Company.create({
      name: 'Stripe',
      slug: 'stripe',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg',
      website: 'https://stripe.com/jobs',
      industry: 'Fintech & Payments',
      companySize: '1000+',
      location: 'San Francisco, CA',
      description: 'Financial infrastructure for the internet. Millions of companies use Stripe to accept payments and grow.',
      about: 'Stripe powers online commerce for businesses worldwide. From ambitious startups to Fortune 500 companies, organizations choose Stripe to accept payments, send payouts, and manage their businesses online.',
      foundedYear: 2010,
      verified: true,
      recruiter: recruiterStripe._id,
      socialLinks: {
        linkedin: 'https://linkedin.com/company/stripe',
        twitter: 'https://twitter.com/stripe',
      },
    });

    const airbnbCompany = await Company.create({
      name: 'Airbnb',
      slug: 'airbnb',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_B%C3%A9lo.svg',
      website: 'https://careers.airbnb.com',
      industry: 'Travel & Hospitality',
      companySize: '1000+',
      location: 'San Francisco, CA',
      description: 'Belong anywhere. Airbnb was born in 2007 when two hosts welcomed three guests to their San Francisco home.',
      about: 'Airbnb exists to create a world where anyone can belong anywhere, providing healthy travel that is local, authentic, diverse, inclusive and sustainable.',
      foundedYear: 2008,
      verified: true,
      recruiter: recruiterAirbnb._id,
      socialLinks: {
        linkedin: 'https://linkedin.com/company/airbnb',
        twitter: 'https://twitter.com/airbnb',
      },
    });

    const spotifyCompany = await Company.create({
      name: 'Spotify',
      slug: 'spotify',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg',
      website: 'https://www.lifeatspotify.com',
      industry: 'Music & Audio Streaming',
      companySize: '1000+',
      location: 'Stockholm & New York',
      description: 'Our mission is to unlock the potential of human creativity by giving millions of artists the opportunity to live off their art.',
      about: 'Spotify transformed music listening forever when it launched in 2008. Discover, manage and share over 100 million tracks and 5 million podcast titles.',
      foundedYear: 2006,
      verified: true,
      recruiter: recruiterStripe._id,
    });

    const openAICompany = await Company.create({
      name: 'OpenAI',
      slug: 'openai',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/4/4d/OpenAI_Logo.svg',
      website: 'https://openai.com/careers',
      industry: 'Artificial Intelligence',
      companySize: '501-1000',
      location: 'San Francisco, CA',
      description: 'Creating safe and beneficial artificial general intelligence that elevates humanity.',
      about: 'OpenAI is an AI research and deployment company. Our mission is to ensure that artificial general intelligence benefits all of humanity.',
      foundedYear: 2015,
      verified: true,
      recruiter: recruiterGoogle._id,
    });

    // Link companies back to recruiters
    await User.findByIdAndUpdate(recruiterGoogle._id, { company: googleCompany._id });
    await User.findByIdAndUpdate(recruiterStripe._id, { company: stripeCompany._id });
    await User.findByIdAndUpdate(recruiterAirbnb._id, { company: airbnbCompany._id });

    // 3. Create Jobs
    const jobsData = [
      {
        title: 'Senior Full Stack Engineer (React & Node.js)',
        company: stripeCompany._id,
        recruiter: recruiterStripe._id,
        category: 'Software Engineering',
        location: 'San Francisco, CA',
        workMode: 'Remote',
        jobType: 'Full-time',
        experienceLevel: 'Senior Level',
        salary: { min: 145000, max: 195000, currency: 'USD', period: 'year', isNegotiable: true },
        description: 'Stripe is looking for a Senior Full Stack Engineer to lead the architecture and expansion of our next-generation merchant checkout experience. You will collaborate with design, product, and infrastructure teams to build resilient interfaces visited hundreds of millions of times each day.',
        responsibilities: [
          'Design and maintain critical web infrastructure serving global merchant checkouts.',
          'Lead architectural reviews, refactoring, and performance optimizations for frontend and API services.',
          'Mentor junior and mid-level engineers through code reviews and technical deep dives.',
          'Collaborate across cross-functional teams to define quarterly engineering roadmaps.',
        ],
        qualifications: [
          '5+ years of production experience with TypeScript, React, and Node.js.',
          'Proven track record scaling web applications to millions of monthly active users.',
          'Deep understanding of RESTful APIs, distributed systems, and relational databases.',
          'Strong empathy for developer experience and user-centric design.',
        ],
        skills: ['React', 'Node.js', 'TypeScript', 'GraphQL', 'PostgreSQL', 'Tailwind CSS'],
        benefits: [
          'Competitive equity and annual bonus package',
          'Comprehensive health, dental, and vision coverage',
          'Remote-first flexible work setup with $1,500 home office stipend',
          'Unlimited paid time off with mandatory 2-week minimums',
          'Annual learning and development budget of $3,000',
        ],
        featured: true,
        applicantCount: 14,
        viewsCount: 312,
      },
      {
        title: 'Lead Product Designer (UI/UX & Design Systems)',
        company: airbnbCompany._id,
        recruiter: recruiterAirbnb._id,
        category: 'UI/UX Design',
        location: 'San Francisco, CA',
        workMode: 'Hybrid',
        jobType: 'Full-time',
        experienceLevel: 'Lead / Director',
        salary: { min: 160000, max: 210000, currency: 'USD', period: 'year', isNegotiable: true },
        description: 'Airbnb is seeking a Lead Product Designer to champion our design system and shape world-class discovery experiences for millions of guests and hosts worldwide.',
        responsibilities: [
          'Own the end-to-end user experience for guest trip planning and host onboarding.',
          'Expand and evolve our cross-platform design token system in close tandem with engineering.',
          'Conduct extensive user research, usability studies, and data-informed rapid prototyping.',
          'Present design vision and strategies directly to executive product leadership.',
        ],
        qualifications: [
          '6+ years of UX/UI product design experience for leading consumer applications.',
          'Exceptional portfolio displaying systems thinking, micro-interactions, and visual polish.',
          'Proficiency with Figma, Protopie, and modern token workflows.',
          'Strong communication skills and passion for storytelling through interfaces.',
        ],
        skills: ['Figma', 'UI/UX Design', 'Design Systems', 'User Research', 'Prototyping', 'Interaction Design'],
        benefits: [
          '$2,000 annual travel credit for stays across Airbnb worldwide',
          'Top-tier medical, dental, and vision insurance',
          '401(k) matching up to 5%',
          'Generous parental leave policies',
        ],
        featured: true,
        applicantCount: 9,
        viewsCount: 245,
      },
      {
        title: 'Staff AI Infrastructure & Distributed Systems Engineer',
        company: openAICompany._id,
        recruiter: recruiterGoogle._id,
        category: 'Data & AI',
        location: 'San Francisco, CA',
        workMode: 'Remote',
        jobType: 'Full-time',
        experienceLevel: 'Lead / Director',
        salary: { min: 210000, max: 320000, currency: 'USD', period: 'year', isNegotiable: true },
        description: 'Join OpenAI to scale our GPU compute clusters and low-latency inference pipelines powering next-generation frontier intelligence models.',
        responsibilities: [
          'Architect and optimize distributed model training and inference pipelines across thousands of GPUs.',
          'Build automated observability, telemetry, and fault-tolerant scheduling engines.',
          'Collaborate with AI research scientists to eliminate compute bottlenecks.',
        ],
        qualifications: [
          '7+ years experience with high-performance distributed systems, C++, Python, or Rust.',
          'Hands-on expertise with CUDA, PyTorch, Kubernetes, and InfiniBand networking.',
          'Solid background in hardware orchestration and memory-bound compute optimization.',
        ],
        skills: ['Python', 'Kubernetes', 'PyTorch', 'Distributed Systems', 'C++', 'Docker', 'AWS'],
        benefits: [
          'Exceptional equity compensation in a frontier AI pioneer',
          'Full executive healthcare coverage for employee and dependents',
          'Relocation assistance or fully remote equipment package',
          'Daily catered meals and premier wellness stipend',
        ],
        featured: true,
        applicantCount: 22,
        viewsCount: 560,
      },
      {
        title: 'Cloud DevOps & Platform Architect',
        company: googleCompany._id,
        recruiter: recruiterGoogle._id,
        category: 'DevOps & Cloud',
        location: 'Mountain View, CA',
        workMode: 'Hybrid',
        jobType: 'Full-time',
        experienceLevel: 'Senior Level',
        salary: { min: 155000, max: 205000, currency: 'USD', period: 'year', isNegotiable: false },
        description: 'Google Cloud is looking for an experienced Platform Architect to drive Kubernetes cluster reliability, CI/CD automated gates, and zero-trust security infrastructure.',
        responsibilities: [
          'Build and enforce multi-region Infrastructure as Code using Terraform and Helm.',
          'Elevate developer deployment speed while maintaining 99.99% system availability.',
          'Implement automated compliance, secrets rotation, and security perimeter scanning.',
        ],
        qualifications: [
          '4+ years architecting cloud-native solutions on GCP or AWS.',
          'Deep mastery of Kubernetes, Docker, Terraform, and GitOps workflows (ArgoCD).',
          'Strong scripting proficiency in Go, Python, or Bash.',
        ],
        skills: ['Kubernetes', 'Docker', 'Terraform', 'GCP', 'AWS', 'CI/CD', 'Go'],
        benefits: [
          'Google 401(k) matching with immediate vesting',
          'Free gourmet breakfast, lunch, and dinner on campus',
          'Comprehensive mental health and wellness subsidies',
          'Tuition reimbursement programs',
        ],
        featured: true,
        applicantCount: 18,
        viewsCount: 410,
      },
      {
        title: 'Principal Product Manager - Consumer Growth',
        company: spotifyCompany._id,
        recruiter: recruiterStripe._id,
        category: 'Product Management',
        location: 'New York, NY',
        workMode: 'Hybrid',
        jobType: 'Full-time',
        experienceLevel: 'Senior Level',
        salary: { min: 150000, max: 190000, currency: 'USD', period: 'year', isNegotiable: true },
        description: 'Lead the cross-functional team responsible for Spotify subscriber activation, personalized onboarding loops, and international marketplace growth.',
        responsibilities: [
          'Define multi-quarter product vision and measurable OKRs for consumer engagement.',
          'Partner with data science and engineering to execute continuous multivariate experiments.',
          'Synthesize customer feedback and competitive analysis into decisive product specs.',
        ],
        qualifications: [
          '5+ years leading high-growth consumer SaaS or mobile product initiatives.',
          'Strong analytical foundation in A/B testing, cohort analysis, and retention metrics.',
          'Demonstrated track record of scaling features from 0 to 10M+ users.',
        ],
        skills: ['Product Management', 'A/B Testing', 'Data Analytics', 'Agile', 'Growth Strategy'],
        benefits: [
          'Global flexible public holiday model',
          'Generous parental leave with 6 months fully paid',
          'Spotify Premium for life and concert ticket discounts',
        ],
        featured: false,
        applicantCount: 11,
        viewsCount: 198,
      },
      {
        title: 'Frontend React Engineer (Design Systems & Web)',
        company: airbnbCompany._id,
        recruiter: recruiterAirbnb._id,
        category: 'Software Engineering',
        location: 'San Francisco, CA',
        workMode: 'Remote',
        jobType: 'Full-time',
        experienceLevel: 'Mid Level',
        salary: { min: 115000, max: 150000, currency: 'USD', period: 'year', isNegotiable: true },
        description: 'Join our Frontend Core team to build ultra-responsive, accessible, and delightful interactive components used by travelers in over 220 countries.',
        responsibilities: [
          'Develop reusable, WCAG 2.1 AA accessible React components with Tailwind and Framer Motion.',
          'Optimize core web vitals, bundle size, and server-side rendering performance.',
          'Write rock-solid unit and integration tests with Vitest and Playwright.',
        ],
        qualifications: [
          '3+ years of professional React and modern JavaScript/TypeScript experience.',
          'Deep understanding of CSS architecture, animation performance, and semantic HTML.',
          'Experience building or maintaining reusable component libraries.',
        ],
        skills: ['React', 'TypeScript', 'Tailwind CSS', 'Next.js', 'Jest', 'Framer Motion'],
        benefits: [
          'Flexible remote work environment anywhere in North America',
          'Comprehensive health and retirement plans',
          'Quarterly wellness reimbursements',
        ],
        featured: false,
        applicantCount: 31,
        viewsCount: 480,
      },
      {
        title: 'Senior Data Scientist - Generative NLP & Analytics',
        company: googleCompany._id,
        recruiter: recruiterGoogle._id,
        category: 'Data & AI',
        location: 'Mountain View, CA',
        workMode: 'Remote',
        jobType: 'Full-time',
        experienceLevel: 'Senior Level',
        salary: { min: 165000, max: 215000, currency: 'USD', period: 'year', isNegotiable: true },
        description: 'Leverage large-scale language models and statistical modeling to generate actionable insights and intelligent recommendations across enterprise workspace tools.',
        responsibilities: [
          'Fine-tune and evaluate LLM pipelines for high-accuracy domain-specific tasks.',
          'Design causal inference frameworks to measure user engagement impact.',
          'Publish reproducible findings and collaborate with product engineering on model deployment.',
        ],
        qualifications: [
          'M.S. or Ph.D. in Computer Science, Statistics, or related quantitative field.',
          '4+ years applied experience with PyTorch, HuggingFace transformers, and SQL.',
          'Strong communication skills for conveying statistical nuances to leadership.',
        ],
        skills: ['Python', 'PyTorch', 'NLP', 'Machine Learning', 'SQL', 'HuggingFace'],
        benefits: [
          'Top-of-market compensation with stock grants',
          'Generous health, 401(k), and parental leaves',
          'Sabbatical opportunities after tenure',
        ],
        featured: false,
        applicantCount: 16,
        viewsCount: 290,
      },
      {
        title: 'Cybersecurity Threat & Incident Response Analyst',
        company: stripeCompany._id,
        recruiter: recruiterStripe._id,
        category: 'DevOps & Cloud',
        location: 'San Francisco, CA',
        workMode: 'Hybrid',
        jobType: 'Full-time',
        experienceLevel: 'Mid Level',
        salary: { min: 125000, max: 165000, currency: 'USD', period: 'year', isNegotiable: true },
        description: 'Safeguard global financial transactions against sophisticated cyber threats. Monitor, investigate, and proactively neutralize attack vectors across our platform.',
        responsibilities: [
          'Monitor SIEM alerts and respond rapidly to potential security incidents.',
          'Conduct vulnerability assessments, threat modeling, and red team exercises.',
          'Develop automated detection rules and security runbooks.',
        ],
        qualifications: [
          '3+ years in security operations, threat intelligence, or incident response.',
          'Certifications like CISSP, CEH, or OSCP are a strong plus.',
          'Familiarity with cloud security controls on AWS/GCP.',
        ],
        skills: ['Cybersecurity', 'AWS', 'SIEM', 'Python', 'Incident Response', 'Network Security'],
        benefits: [
          'Competitive salary and equity grant',
          'Comprehensive health insurance',
          'Remote work flexibility',
        ],
        featured: false,
        applicantCount: 8,
        viewsCount: 160,
      },
      {
        title: 'Mobile App Engineer (React Native & iOS)',
        company: spotifyCompany._id,
        recruiter: recruiterStripe._id,
        category: 'Software Engineering',
        location: 'New York, NY',
        workMode: 'Remote',
        jobType: 'Full-time',
        experienceLevel: 'Mid Level',
        salary: { min: 120000, max: 160000, currency: 'USD', period: 'year', isNegotiable: true },
        description: 'Build offline-first, high-fidelity audio playback and recommendation features for our cross-platform mobile apps.',
        responsibilities: [
          'Deliver smooth 60fps animations and seamless background audio buffering.',
          'Integrate native Swift/Kotlin modules into our React Native codebase.',
          'Participate in regular release trains and beta flight testing.',
        ],
        qualifications: [
          '3+ years building and shipping production React Native or native mobile apps.',
          'Solid understanding of state management (Redux/Zustand) and offline persistence.',
          'Keen eye for micro-interactions and mobile accessibility.',
        ],
        skills: ['React Native', 'TypeScript', 'iOS', 'Android', 'Mobile Development'],
        benefits: [
          'Flexible working hours and remote stipend',
          'Wellness subsidy and ergonomic setup allowances',
        ],
        featured: false,
        applicantCount: 19,
        viewsCount: 275,
      },
      {
        title: 'Technical Writer & Developer Relations Advocate',
        company: stripeCompany._id,
        recruiter: recruiterStripe._id,
        category: 'Marketing',
        location: 'San Francisco, CA',
        workMode: 'Remote',
        jobType: 'Full-time',
        experienceLevel: 'Mid Level',
        salary: { min: 95000, max: 135000, currency: 'USD', period: 'year', isNegotiable: true },
        description: 'Craft industry-acclaimed documentation, SDK sample apps, and interactive quickstarts for developers integrating payments around the world.',
        responsibilities: [
          'Author crystal-clear API references, architecture guides, and migration manuals.',
          'Build open-source starter repos demonstrating best practices.',
          'Engage with developer communities on Discord, GitHub, and Twitter.',
        ],
        qualifications: [
          'Strong technical writing portfolio explaining complex technical subjects clearly.',
          'Hands-on coding ability in JavaScript, Python, or Ruby.',
          'Passion for developer empathy and documentation design.',
        ],
        skills: ['Technical Writing', 'Developer Relations', 'JavaScript', 'APIs', 'Git'],
        benefits: [
          'Generous home office allowance',
          'Global health insurance',
          'Book and conference attendance budgets',
        ],
        featured: false,
        applicantCount: 14,
        viewsCount: 210,
      },
      {
        title: 'QA Automation Engineer (Playwright & CI/CD)',
        company: airbnbCompany._id,
        recruiter: recruiterAirbnb._id,
        category: 'Software Engineering',
        location: 'San Francisco, CA',
        workMode: 'Remote',
        jobType: 'Contract',
        experienceLevel: 'Mid Level',
        salary: { min: 90000, max: 125000, currency: 'USD', period: 'year', isNegotiable: true },
        description: 'Design end-to-end automated testing frameworks ensuring zero regressions across all booking and payment funnels.',
        responsibilities: [
          'Build scalable E2E test suites with Playwright and TypeScript in GitHub Actions.',
          'Identify edge cases in checkout, localization, and currency conversions.',
          'Coach developers on authoring robust integration tests.',
        ],
        qualifications: [
          '3+ years in automated software quality engineering.',
          'Proficiency with Playwright, Cypress, or Selenium.',
          'Experience testing multi-tier cloud applications.',
        ],
        skills: ['Playwright', 'TypeScript', 'QA Automation', 'CI/CD', 'Jest'],
        benefits: [
          'Flexible schedule and hourly or salaried options',
          'Contract with direct conversion potential to full-time',
        ],
        featured: false,
        applicantCount: 12,
        viewsCount: 180,
      },
      {
        title: 'Growth Marketing & Lifecycle Campaign Manager',
        company: spotifyCompany._id,
        recruiter: recruiterStripe._id,
        category: 'Marketing',
        location: 'New York, NY',
        workMode: 'On-site',
        jobType: 'Full-time',
        experienceLevel: 'Senior Level',
        salary: { min: 120000, max: 155000, currency: 'USD', period: 'year', isNegotiable: true },
        description: 'Drive retention, reactivation, and premium tier conversions across email, in-app messaging, and push notifications.',
        responsibilities: [
          'Develop personalized lifecycle marketing journeys based on streaming behavior.',
          'Run continuous multivariate copy and creative experiments.',
          'Work with product and brand teams on flagship seasonal campaigns (Wrapped).',
        ],
        qualifications: [
          '4+ years in digital marketing, retention, or growth in a B2C subscription business.',
          'Deep expertise in lifecycle platforms (Braze, Iterable) and analytics.',
        ],
        skills: ['Marketing', 'Email Marketing', 'Growth Strategy', 'Analytics', 'Copywriting'],
        benefits: [
          'Comprehensive health, dental, and vision insurance',
          'Generous 401(k) matching program',
          'Free Spotify Premium and VIP access',
        ],
        featured: false,
        applicantCount: 15,
        viewsCount: 220,
      },
    ];

    const createdJobs = await Job.insertMany(jobsData);
    console.log(`Created ${createdJobs.length} jobs.`);

    // 4. Create Sample Applications for Alex Rivera (jobSeeker)
    const sampleApps = [
      {
        job: createdJobs[0]._id, // Stripe Senior Full Stack
        applicant: jobSeeker._id,
        company: stripeCompany._id,
        resume: jobSeeker.resume,
        coverLetter: 'I have followed Stripe’s developer tooling and payment architecture with great admiration for years. With my deep background scaling React and Node.js microservices at high throughput, I am thrilled to apply for the Senior Full Stack Engineer position and help build the future of internet commerce.',
        status: 'Interview Scheduled',
        interviewDetails: {
          scheduledAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          meetingLink: 'https://meet.google.com/xyz-careerx-demo',
          round: 'Round 2: System Architecture & Coding',
          notes: 'Prepare to discuss distributed event queues and frontend rendering optimizations.',
        },
        recruiterNotes: 'Candidate has stellar GitHub portfolio and robust Node/React experience. Advanced to round 2 architecture review.',
      },
      {
        job: createdJobs[1]._id, // Airbnb Lead Product Designer
        applicant: jobSeeker._id,
        company: airbnbCompany._id,
        resume: jobSeeker.resume,
        coverLetter: 'Excited about the human-centered design principles that make Airbnb a world-class travel platform. Looking forward to discussing how design systems can empower faster, more accessible development.',
        status: 'Shortlisted',
        recruiterNotes: 'Impressive design-engineering hybrid background. High potential for design systems team.',
      },
      {
        job: createdJobs[3]._id, // Google Cloud DevOps
        applicant: jobSeeker._id,
        company: googleCompany._id,
        resume: jobSeeker.resume,
        coverLetter: 'Having managed multi-cloud Kubernetes clusters and CI/CD pipelines at scale, I am confident I can contribute meaningfully to Google Cloud infrastructure resilience.',
        status: 'Under Review',
        recruiterNotes: 'Resume matches 8 out of 9 core requirements.',
      },
      {
        job: createdJobs[5]._id, // Airbnb Frontend React Engineer
        applicant: jobSeeker._id,
        company: airbnbCompany._id,
        resume: jobSeeker.resume,
        coverLetter: 'Deep experience with modern React 19, TypeScript, and micro-animations. Would love to bring this energy to Airbnb guest experiences!',
        status: 'Applied',
      },
    ];

    await Application.insertMany(sampleApps);
    console.log(`Created ${sampleApps.length} sample applications.`);

    // 5. Create Saved Jobs for Alex Rivera
    await SavedJob.create([
      { user: jobSeeker._id, job: createdJobs[2]._id }, // OpenAI Staff AI Engineer
      { user: jobSeeker._id, job: createdJobs[4]._id }, // Spotify PM
    ]);
    console.log('Created saved jobs for candidate.');

    // 6. Create Notifications
    await Notification.create([
      {
        recipient: jobSeeker._id,
        sender: recruiterStripe._id,
        title: 'Interview Scheduled! 🎉',
        message: 'Stripe has scheduled your Technical Architecture Interview for "Senior Full Stack Engineer (React & Node.js)".',
        type: 'interview',
        link: '/seeker/applications',
        read: false,
      },
      {
        recipient: jobSeeker._id,
        sender: recruiterAirbnb._id,
        title: 'Application Shortlisted 🌟',
        message: 'Congratulations! Your application for "Lead Product Designer" has been shortlisted by the recruiting team at Airbnb.',
        type: 'application_status',
        link: '/seeker/applications',
        read: false,
      },
      {
        recipient: recruiterStripe._id,
        sender: jobSeeker._id,
        title: 'New Applicant for Senior Full Stack',
        message: 'Alex Rivera submitted an application for "Senior Full Stack Engineer (React & Node.js)".',
        type: 'job_alert',
        link: `/recruiter/applicants?jobId=${createdJobs[0]._id}`,
        read: false,
      },
      {
        recipient: adminUser._id,
        title: 'Platform Activity Alert',
        message: '12 new jobs successfully posted and verified across premier SaaS partners today.',
        type: 'system',
        link: '/admin',
        read: false,
      },
    ]);
    console.log('Created sample notifications.');

    console.log('============================================');
    console.log('✅ CareerX Database successfully seeded!');
    console.log('============================================');
    console.log('Demo Credentials for Instant Testing:');
    console.log('1. Job Seeker:  seeker@careerx.com     | password: password123');
    console.log('2. Recruiter:   recruiter@stripe.com   | password: password123');
    console.log('3. Recruiter:   recruiter@google.com   | password: password123');
    console.log('4. Admin:       admin@careerx.com      | password: admin123');
    console.log('============================================');

    process.exit(0);
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
};

seedDatabase();
