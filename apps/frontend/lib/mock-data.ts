import { Keyword, Resume, Job, AnalyticsData, User } from './types';

export const MOCK_USER: User = {
  name: "Arjun Mehta",
  email: "arjun@email.com",
  plan: "Pro",
  targetRole: "Senior Product Manager",
  avatarInitial: "A"
};

export const MOCK_JD = `Stripe
Job Title: Senior Product Manager, Core Payments
Location: San Francisco / Remote
Salary: $160k – $190k

About the Team
Stripe's core payments team handles billions of dollars in volume, ensuring reliability, speed, and conversion.

What you'll do:
- Lead Product Strategy for the core processing engine.
- Partner with engineering to scale our infrastructure.
- Use SQL and Data Analysis to identify conversion drop-offs based on A/B Testing.
- Create clear Roadmapping for quarter execution.
- Excel in Stakeholder Management across multiple teams.
- Understanding of Machine Learning applications in fraud prevention.
- Drive Agile and Scrum processes to deliver features.
- Basic knowledge of System Design, Kubernetes, Docker, TensorFlow is a plus, though not required for day-to-day.`;

export const MOCK_KEYWORDS: Keyword[] = [
  {
    id: "kw1",
    name: "Machine Learning",
    status: "matched",
    placement: "SWE — Acme Corp",
    originalBullet: "Worked on fraud detection algorithms.",
    rewrittenBullet: "Developed Machine Learning models to optimize fraud detection algorithms."
  },
  {
    id: "kw2",
    name: "Product Management",
    status: "contextual",
    placement: "PM — Google",
    clarifyingQuestion: "Did you hold an official PM title or did you just function as one?"
  },
  {
    id: "kw3",
    name: "SQL",
    status: "modified",
    placement: "Data Analyst — Acme",
    originalBullet: "Pulled data from the database.",
    rewrittenBullet: "Created complex SQL queries to pull and analyze dataset."
  },
  {
    id: "kw4",
    name: "Python",
    status: "matched",
    placement: "SWE — Acme Corp",
    originalBullet: "Scripted various automation tools.",
    rewrittenBullet: "Scripted various automation tools using Python."
  },
  {
    id: "kw5",
    name: "Kubernetes",
    status: "not-applicable",
    placement: "N/A for this role",
    whyFlagged: "Your resume shows no exposure to container orchestration."
  },
  {
    id: "kw6",
    name: "Agile / Scrum",
    status: "pending",
    placement: "PM — Google",
    proposedAddition: "Managed teams using Agile / Scrum methodologies to streamline product delivery."
  },
  {
    id: "kw7",
    name: "Data Analysis",
    status: "pending",
    placement: "PM — Google",
    proposedAddition: "Performed comprehensive Data Analysis to guide strategic roadmap decisions."
  },
  {
    id: "kw8",
    name: "TensorFlow",
    status: "matched",
    placement: "SWE — Acme Corp",
    originalBullet: "Trained neural networks.",
    rewrittenBullet: "Trained neural networks leveraging TensorFlow."
  },
  {
    id: "kw9",
    name: "A/B Testing",
    status: "contextual",
    placement: "PM — Google",
    clarifyingQuestion: "What tools did you use for A/B testing? Optimizely, LaunchDarkly, or internal tools?"
  },
  {
    id: "kw10",
    name: "System Design",
    status: "pending",
    placement: "SWE — Acme Corp",
    proposedAddition: "Architected System Design for microservices scaling to millions of users."
  },
  {
    id: "kw11",
    name: "Stakeholder Mgmt",
    status: "matched",
    placement: "PM — Google",
    originalBullet: "Worked with various internal teams.",
    rewrittenBullet: "Demonstrated strong Stakeholder Mgmt skills working with various internal teams."
  },
  {
    id: "kw12",
    name: "Docker",
    status: "not-applicable",
    placement: "N/A for this role",
    whyFlagged: "No prior infrastructure or containerization experience detected."
  },
  {
    id: "kw13",
    name: "Roadmapping",
    status: "pending",
    placement: "PM — Google",
    proposedAddition: "Led quarterly Roadmapping to prioritize high-impact feature deployments."
  }
];

export const MOCK_RESUMES: Resume[] = [
  {
    id: "r1",
    title: "software_engineer_v2",
    jobTitle: "Senior Software Engineer",
    company: "Not specified",
    isBase: true,
    updatedAt: "3 days ago",
    size: "1.2 MB"
  },
  {
    id: "r2",
    title: "Tailored for Stripe PM",
    jobTitle: "Product Manager",
    company: "Stripe",
    isBase: false,
    baseResumeId: "r1",
    updatedAt: "2 days ago"
  },
  {
    id: "r3",
    title: "Tailored for Google SWE",
    jobTitle: "Software Engineer",
    company: "Google",
    isBase: false,
    baseResumeId: "r1",
    updatedAt: "5 days ago"
  }
];

export const MOCK_JOBS: Job[] = [
  {
    id: "j1",
    companyName: "Stripe",
    title: "Sr. Product Manager",
    location: "San Francisco",
    remote: true,
    fullTime: true,
    salary: "$ 160k – 190k / yr",
    matchPercentage: 94,
    skills: ["SQL", "Agile", "Roadmapping", "A/B Testing"],
    avatarInitial: "S",
    avatarColorClass: "bg-brand-purple",
    postedAt: "2 days ago"
  },
  {
    id: "j2",
    companyName: "Google",
    title: "Staff PM, ML Platform",
    location: "NYC",
    remote: true,
    fullTime: true,
    salary: "$ 180k – 220k / yr",
    matchPercentage: 88,
    skills: ["Machine Learning", "Python", "Stakeholder Mgmt"],
    avatarInitial: "G",
    avatarColorClass: "bg-brand-red",
    postedAt: "3 days ago"
  },
  {
    id: "j3",
    companyName: "Notion",
    title: "Product Lead",
    location: "Remote",
    remote: true,
    fullTime: true,
    salary: "$ 150k – 180k / yr",
    matchPercentage: 85,
    skills: ["Product Strategy", "SQL", "Agile"],
    avatarInitial: "N",
    avatarColorClass: "bg-ink",
    postedAt: "5 days ago"
  },
  {
    id: "j4",
    companyName: "Figma",
    title: "Senior PM, Editor",
    location: "San Francisco",
    remote: false,
    fullTime: true,
    salary: "$ 155k – 185k / yr",
    matchPercentage: 81,
    skills: ["A/B Testing", "User Research", "Roadmapping"],
    avatarInitial: "F",
    avatarColorClass: "bg-brand-orange",
    postedAt: "1 week ago"
  },
  {
    id: "j5",
    companyName: "Anthropic",
    title: "PM, API Products",
    location: "San Francisco",
    remote: false,
    fullTime: true,
    salary: "$ 175k – 210k / yr",
    matchPercentage: 77,
    skills: ["Python", "Data Analysis", "System Design"],
    avatarInitial: "A",
    avatarColorClass: "bg-brand-blue",
    postedAt: "1 week ago"
  },
  {
    id: "j6",
    companyName: "Linear",
    title: "Product Manager",
    location: "Remote",
    remote: true,
    fullTime: true,
    salary: "$ 140k – 160k / yr",
    matchPercentage: 74,
    skills: ["Agile", "Stakeholder Mgmt", "Roadmapping"],
    avatarInitial: "L",
    avatarColorClass: "bg-brand-purple",
    postedAt: "2 weeks ago"
  }
];

export const MOCK_ANALYTICS: AnalyticsData = {
  atsScore: 87,
  history: [
    { day: "Day 1", score: 61 },
    { day: "Day 2", score: 68 },
    { day: "Day 3", score: 72 },
    { day: "Day 4", score: 79 },
    { day: "Day 5", score: 83 },
    { day: "Day 6", score: 87 }
  ],
  targetRole: "Senior Product Manager",
  targetIndustry: "B2B SaaS",
  experienceLevel: "Mid-Senior (4-6 years)",
  topSkills: [
    "Python", "SQL", "Machine Learning", "Product Strategy", 
    "Agile", "Data Analysis", "Stakeholder Mgmt"
  ],
  jobsFit: [
    { category: "Product Roles", count: 48, colorClass: "bg-brand-blue" },
    { category: "Engineering", count: 39, colorClass: "bg-brand-purple" },
    { category: "Data Science", count: 28, colorClass: "bg-brand-orange" },
    { category: "Other", count: 12, colorClass: "bg-ink/30" }
  ],
  tailoringSessions: [
    { company: "Stripe PM", date: "2 days ago", score: 94, colorClass: "bg-brand-green" },
    { company: "Google SWE", date: "5 days ago", score: 88, colorClass: "bg-brand-green" },
    { company: "Notion PM", date: "1 week ago", score: 79, colorClass: "bg-brand-orange" }
  ],
  missingSkills: [
    { skill: "Kubernetes", importance: "High", score: 80 },
    { skill: "Docker", importance: "High", score: 70 },
    { skill: "GraphQL", importance: "Medium", score: 40 },
    { skill: "Go / Golang", importance: "Medium", score: 30 },
    { skill: "Terraform", importance: "Low", score: 20 }
  ]
};
