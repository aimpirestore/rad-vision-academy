/**
 * RAD Vision Academy — Central site configuration
 * Single source of truth for brand, navigation, products, SEO.
 */

export const GUMROAD_STORE_URL = "https://radvisionacademy.gumroad.com/";

export const site = {
  name: "RAD Vision Academy",
  tagline: "International Medical Education",
  description:
    "World-class radiology education. Empowering future radiologists through expert mentorship, digital learning, and AI-powered resources for medical students, residents, and clinicians worldwide.",
  url: "https://radvisionacademy.com",
  locale: "en_US",
  gumroad: GUMROAD_STORE_URL,
  email: "hello@radvisionacademy.com",
  phone: "+1 (000) 000-0000",
  foundedYear: 2019,
  social: {
    twitter: "https://twitter.com/radvisionacademy",
    linkedin: "https://www.linkedin.com/company/rad-vision-academy",
    instagram: "https://www.instagram.com/radvisionacademy",
    youtube: "https://www.youtube.com/@radvisionacademy",
  },
  countries: [
    "United States",
    "United Kingdom",
    "Europe",
    "United Arab Emirates",
    "Saudi Arabia",
    "Qatar",
    "Oman",
    "Bahrain",
    "Kuwait",
    "Pakistan",
    "Worldwide",
  ],
} as const;

export const mainNav = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Courses", href: "/courses" },
  { label: "Mentorship", href: "/mentorship" },
  { label: "Resources", href: "/resources" },
  { label: "Blog", href: "/blog" },
  { label: "Store", href: "/store" },
  { label: "Contact", href: "/contact" },
] as const;

export const footerNav = {
  Academy: [
    { label: "About Us", href: "/about" },
    { label: "Courses", href: "/courses" },
    { label: "Mentorship", href: "/mentorship" },
    { label: "Resources", href: "/resources" },
  ],
  Content: [
    { label: "Blog", href: "/blog" },
    { label: "Store", href: "/store" },
    { label: "Contact", href: "/contact" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms of Service", href: "/terms" },
  ],
} as const;

export type Course = {
  slug: string;
  title: string;
  instructor: string;
  duration: string;
  level: "Beginner" | "Intermediate" | "Advanced" | "All Levels";
  category: string;
  blurb: string;
  description: string;
  highlights: string[];
  price: string;
  gumroadId?: string;
  gumroadUrl?: string;
};

export const courses: Course[] = [
  {
    slug: "foundations-of-radiology",
    title: "Foundations of Radiology",
    instructor: "Dr. Ayesha Khan, FRCR",
    duration: "12 weeks",
    level: "Beginner",
    category: "Core",
    blurb:
      "A structured first step into diagnostic imaging — from basic physics to systematic film reading.",
    description:
      "Begin your radiology journey with a rock-solid foundation. Master imaging modalities, radiation physics, anatomy on imaging, and a systematic approach to interpreting common studies.",
    highlights: [
      "X-ray, CT, MRI & Ultrasound fundamentals",
      "Chest and abdominal film interpretation",
      "Systematic reporting framework",
      "200+ annotated teaching cases",
    ],
    price: "$149",
  },
  {
    slug: "frcr-rapid-reporting",
    title: "FRCR 2B Rapid Reporting",
    instructor: "Dr. Omar Siddiqui, FRCR",
    duration: "8 weeks",
    level: "Advanced",
    category: "Exam Prep",
    blurb:
      "Beat the clock on the FRCR rapid-reporting viva with a battle-tested technique and curated vaults.",
    description:
      "A focused, high-yield course built around the FRCR 2B rapid reporting examination. Develop pattern recognition, time discipline, and the confidence to walk into the viva prepared.",
    highlights: [
      "Timed rapid-reporting drills",
      "Annotated answer keys with pitfalls",
      "Live mock vivas with feedback",
      "Strategy for the 35-minute format",
    ],
    price: "$199",
  },
  {
    slug: "ct-abdomen-pelvis-mastery",
    title: "CT Abdomen & Pelvis Mastery",
    instructor: "Dr. Lena Müller, MD",
    duration: "10 weeks",
    level: "Intermediate",
    category: "Subspecialty",
    blurb:
      "Read abdominal CTs with confidence — from acute appendicitis to complex oncology staging.",
    description:
      "Develop a robust, reproducible method for interpreting abdominal and pelvic CT. Cover emergencies, common pathologies, and oncological staging with structured reporting.",
    highlights: [
      "Acute abdomen decision pathways",
      "Oncologic staging by organ system",
      "Structured reporting templates",
      "150+ high-resolution cases",
    ],
    price: "$179",
  },
  {
    slug: "neuroradiology-essentials",
    title: "Neuroradiology Essentials",
    instructor: "Prof. Daniel Reyes, MD",
    duration: "14 weeks",
    level: "Intermediate",
    category: "Subspecialty",
    blurb:
      "Decode the brain and spine — strokes, tumours, trauma, and the MRI sequences that matter.",
    description:
      "A thorough walkthrough of neuroradiology for residents and general radiologists. Understand MRI sequences, anatomy, and a systematic method for head CT and brain MRI.",
    highlights: [
      "Stroke imaging: CT, CTA, MRI",
      "MRI sequence selection guide",
      "Spine trauma & degenerative disease",
      "120+ curated neuroradiology cases",
    ],
    price: "$219",
  },
  {
    slug: "ai-in-radiology",
    title: "AI in Radiology: A Clinician's Guide",
    instructor: "Dr. Sara Ahmed, PhD",
    duration: "6 weeks",
    level: "All Levels",
    category: "Future",
    blurb:
      "Understand how AI is reshaping radiology — from algorithm fundamentals to clinical deployment.",
    description:
      "Cut through the hype. Learn what AI can and cannot do in radiology today, how algorithms are validated, and how to evaluate and deploy AI tools safely in clinical practice.",
    highlights: [
      "How medical AI models are trained",
      "Validation, bias & regulation",
      "Deployment & clinical workflow",
      "Hands-on tool evaluation",
    ],
    price: "$129",
  },
  {
    slug: "musculoskeletal-mri",
    title: "Musculoskeletal MRI",
    instructor: "Dr. Karim Haddad, MD",
    duration: "10 weeks",
    level: "Intermediate",
    category: "Subspecialty",
    blurb:
      "Knee, shoulder, hip and spine MSK MRI — anatomy, protocols, and a reporting approach that holds up.",
    description:
      "Build confidence in MSK MRI interpretation across major joints. Master protocols, normal variants, and the reporting language used in clinical practice.",
    highlights: [
      "Joint-by-joint reading method",
      "Protocol optimisation",
      "Common reporting pitfalls",
      "140+ annotated cases",
    ],
    price: "$169",
  },
];

export type Product = {
  slug: string;
  title: string;
  category: "eBook" | "Question Bank" | "Reporting Template" | "Study Notes" | "Course" | "Bundle";
  blurb: string;
  price: string;
  format: string;
  gumroadUrl?: string;
};

export const products: Product[] = [
  {
    slug: "radiology-pocket-ebook",
    title: "The Radiology Pocket eBook",
    category: "eBook",
    blurb: "320 pages of high-yield radiology, formatted for rapid reference on any device.",
    price: "$29",
    format: "PDF + EPUB",
  },
  {
    slug: "frcr-question-bank",
    title: "FRCR Question Bank — 1,500 Questions",
    category: "Question Bank",
    blurb: "Examination-style questions with detailed annotated answers and references.",
    price: "$49",
    format: "Digital Access",
  },
  {
    slug: "structured-reporting-templates",
    title: "Structured Reporting Templates",
    category: "Reporting Template",
    blurb: "120 editable, evidence-based reporting templates for the most common studies.",
    price: "$39",
    format: "DOCX + PDF",
  },
  {
    slug: "anatomy-study-notes",
    title: "Cross-Sectional Anatomy Notes",
    category: "Study Notes",
    blurb: "Clean, illustrated notes covering CT and MRI anatomy across every body system.",
    price: "$24",
    format: "PDF",
  },
  {
    slug: "residency-survival-bundle",
    title: "Residency Survival Bundle",
    category: "Bundle",
    blurb: "eBook, notes, templates and the question bank together — save 35%.",
    price: "$89",
    format: "All Formats",
  },
  {
    slug: "oncall-radiology-notes",
    title: "On-Call Radiology Notes",
    category: "Study Notes",
    blurb: "The after-hours survival guide — acute findings, red flags, and what to say.",
    price: "$19",
    format: "PDF",
  },
];

export type Service = {
  title: string;
  description: string;
  outcomes: string[];
  icon: "compass" | "graduation" | "target" | "message" | "file" | "calendar";
  gumroadUrl?: string;
};

export const mentorshipServices: Service[] = [
  {
    title: "Career Guidance",
    description:
      "One-to-one mentorship to map your radiology career — from medical school to fellowship and consultant practice.",
    outcomes: ["Personalised career roadmap", "Specialty selection guidance", "Long-term planning"],
    icon: "compass",
  },
  {
    title: "Residency Guidance",
    description:
      "Strategic support for matching into radiology residency programmes in the US, UK, and the Gulf region.",
    outcomes: ["Application strategy", "Programme shortlisting", "Interview preparation"],
    icon: "graduation",
  },
  {
    title: "FRCR Guidance",
    description:
      "Structured preparation for the Fellowship of the Royal College of Radiologists examinations.",
    outcomes: ["Part 1 & 2 anatomy", "Rapid reporting drills", "Viva technique coaching"],
    icon: "target",
  },
  {
    title: "Interview Preparation",
    description:
      "Mock interviews and structured coaching to help you present your best self under pressure.",
    outcomes: ["Mock interview sessions", "Question frameworks", "Confidence under pressure"],
    icon: "message",
  },
  {
    title: "CV Review",
    description:
      "Detailed, honest feedback on your medical CV and supporting documents from experienced reviewers.",
    outcomes: ["Line-by-line CV review", "Structure & impact", "Cover letter editing"],
    icon: "file",
  },
  {
    title: "Book a Consultation",
    description:
      "A focused one-hour session to discuss your situation and agree concrete next steps with a senior mentor.",
    outcomes: ["60-minute video call", "Personalised action plan", "Follow-up summary"],
    icon: "calendar",
  },
];

export type Resource = {
  title: string;
  type: "PDF" | "Notes" | "Template" | "Guide" | "Toolkit";
  description: string;
  free: boolean;
};

export const resources: Resource[] = [
  { title: "Chest X-Ray Systematic Approach", type: "PDF", description: "A one-page ABCS approach you can use on every chest film.", free: true },
  { title: "CT Head — Baseline Checklist", type: "Notes", description: "A structured checklist for non-contrast head CT in the acute setting.", free: true },
  { title: "FRCR Exam Roadmap", type: "Guide", description: "Everything you need to plan your Fellowship of the Royal College of Radiologists journey.", free: true },
  { title: "Radiology CV Template", type: "Template", description: "A clean, ATS-friendly CV template designed for medical professionals.", free: true },
  { title: "Abdominal Pain Decision Aid", type: "Toolkit", description: "A decision aid for imaging selection in non-traumatic abdominal pain.", free: true },
  { title: "Stroke Imaging Protocol Card", type: "Notes", description: "The imaging sequences and thresholds that matter in acute stroke.", free: true },
  { title: "Career Guide: Becoming a Radiologist", type: "Guide", description: "A global perspective on pathways into radiology across countries.", free: true },
  { title: "Common Reporting Pitfalls", type: "PDF", description: "Fifty frequent reporting mistakes — and how to avoid them.", free: true },
];

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  readingTime: string;
  featured?: boolean;
};

export const posts: Post[] = [
  {
    slug: "how-to-read-a-chest-x-ray",
    title: "How to Read a Chest X-Ray: A Systematic Method That Always Works",
    excerpt:
      "Stop guessing and start reading. A reproducible, anatomical approach to chest radiographs you can rely on under pressure.",
    category: "Chest Imaging",
    author: "Dr. Ayesha Khan",
    date: "2026-05-28",
    readingTime: "8 min read",
    featured: true,
  },
  {
    slug: "frcr-2b-preparation-guide",
    title: "The Honest FRCR 2B Preparation Guide",
    excerpt:
      "Everything I wish I had known before sitting the FRCR 2B — timelines, resources, and the technique that makes the difference.",
    category: "Exam Prep",
    author: "Dr. Omar Siddiqui",
    date: "2026-05-14",
    readingTime: "12 min read",
  },
  {
    slug: "ai-in-radiology-2026",
    title: "AI in Radiology: Where We Actually Are in 2026",
    excerpt:
      "Beyond the headlines — a clinician's view of what AI tools are delivering real value in radiology today.",
    category: "Artificial Intelligence",
    author: "Dr. Sara Ahmed",
    date: "2026-04-30",
    readingTime: "10 min read",
  },
  {
    slug: "ct-abdomen-checklist",
    title: "A Repeatable Checklist for Reading a CT Abdomen",
    excerpt:
      "Build a reproducible system for abdominal CT. This checklist keeps you safe and keeps your reports consistent.",
    category: "Abdominal Imaging",
    author: "Dr. Lena Müller",
    date: "2026-04-18",
    readingTime: "7 min read",
  },
  {
    slug: "stroke-imaging-essentials",
    title: "Acute Stroke Imaging: What Every Radiologist Must Know",
    excerpt:
      "From ASPECTS to penumbra — the essentials of acute stroke imaging that you simply cannot afford to get wrong.",
    category: "Neuroradiology",
    author: "Prof. Daniel Reyes",
    date: "2026-04-02",
    readingTime: "11 min read",
  },
  {
    slug: "applying-to-radiology-residency",
    title: "Applying to Radiology Residency: A Global Perspective",
    excerpt:
      "Pathways, timelines, and strategies for matching into radiology in the US, UK, and the Gulf region.",
    category: "Career",
    author: "Dr. Ayesha Khan",
    date: "2026-03-20",
    readingTime: "9 min read",
  },
];

export const faqs = [
  {
    q: "Are the courses suitable for absolute beginners?",
    a: "Yes. Our Foundations of Radiology course is designed for medical students and junior doctors with no prior radiology experience. Each course clearly states its level on its detail page.",
  },
  {
    q: "How do I access a course or product after purchase?",
    a: "All products are sold through our official Gumroad store. Immediately after purchase, Gumroad sends you an email with secure access to your content, downloadable files, and (where applicable) lifetime updates.",
  },
  {
    q: "Do you offer mentorship for international medical graduates (IMGs)?",
    a: "Absolutely. A large share of our mentees are IMGs. We provide tailored guidance for residency matching, FRCR preparation, and building a competitive application across the US, UK, Europe, and the Gulf region.",
  },
  {
    q: "Can hospitals and institutions book bulk training or consulting?",
    a: "Yes. We work with hospitals, universities, and healthcare institutions on custom curricula, reporting standardisation, and teleradiology consulting. Please contact us to discuss your needs.",
  },
  {
    q: "Do I get a certificate after completing a course?",
    a: "Gumroad-hosted courses issue a completion confirmation from RAD Vision Academy, which can be used for your portfolio and CPD record. Always check your local CPD body for credit recognition.",
  },
  {
    q: "What is your refund policy?",
    a: "Digital products follow Gumroad's refund policy. If a product does not meet your expectations, contact us and we will help resolve it directly.",
  },
];

export const testimonials = [
  {
    quote:
      "RAD Vision Academy completely changed how I read films. The systematic method finally clicked — I went from anxious to confident on call.",
    name: "Dr. Priya Nair",
    role: "Radiology Resident, London",
  },
  {
    quote:
      "I cleared FRCR 2B on my first attempt. The rapid reporting drills were exactly what I needed to build pattern recognition.",
    name: "Dr. Hassan Al-Rashid",
    role: "Specialist Radiologist, Dubai",
  },
  {
    quote:
      "As an IMG applying to the US, the mentorship was invaluable. Honest, structured, and genuinely invested in my success.",
    name: "Dr. Maria Santos",
    role: "PGY-2 Diagnostic Radiology, USA",
  },
  {
    quote:
      "The AI in Radiology course is the clearest explanation I have seen. It removed the fear and gave me a real framework.",
    name: "Dr. Yusuf Ibrahim",
    role: "Consultant Radiologist, Qatar",
  },
];

export const stats = [
  { value: 12000, suffix: "+", label: "Learners worldwide" },
  { value: 75, suffix: "+", label: "Countries reached" },
  { value: 40, suffix: "+", label: "Expert courses & resources" },
  { value: 98, suffix: "%", label: "Would recommend" },
];

export const timeline = [
  { year: "2019", title: "The idea", text: "RAD Vision Academy begins as a mentorship practice helping IMGs into radiology." },
  { year: "2021", title: "Going digital", text: "First flagship course and digital study notes launched, reaching learners across four continents." },
  { year: "2023", title: "Global reach", text: "Catalogue expands to 40+ courses, question banks and templates serving 70+ countries." },
  { year: "2026", title: "AI-native learning", text: "A new generation of AI-powered learning resources and the relaunched premium platform." },
];

export const values = [
  {
    title: "Clinical rigour",
    text: "Everything we publish is grounded in evidence and reviewed by practising radiologists. We never trade accuracy for appeal.",
    icon: "shield",
  },
  {
    title: "Learner-first",
    text: "From medical students to consultants, our content meets you where you are and takes you where you want to go.",
    icon: "heart",
  },
  {
    title: "Global perspective",
    text: "We serve learners across the US, UK, Europe, the Gulf, and beyond — with pathways that respect local systems.",
    icon: "globe",
  },
  {
    title: "Innovation",
    text: "We embrace AI, simulation, and modern pedagogy to make radiology education faster, deeper, and more accessible.",
    icon: "sparkles",
  },
];

export const founders = [
  {
    name: "Dr. Ayesha Khan, FRCR",
    role: "Founder & Lead Educator",
    bio: "Consultant radiologist with 15+ years across teaching hospitals in the UK and UAE. Passionate about structured reporting and mentorship.",
    initials: "AK",
  },
  {
    name: "Dr. Omar Siddiqui, FRCR",
    role: "Co-Founder & Exam Lead",
    bio: "FRCR examiner-grade educator specialising in examination preparation and rapid reporting technique. Trained hundreds of successful candidates.",
    initials: "OS",
  },
];
