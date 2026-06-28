-- ============================================================
-- RAD Vision Academy — Seed Data
-- Run AFTER schema.sql. Migrates all existing hardcoded content.
-- ============================================================

-- ---- Navigation (header) ----
insert into navigation_items (location, label, href, sort_order) values
  ('header', 'Home', '/', 0),
  ('header', 'About', '/about', 1),
  ('header', 'Courses', '/courses', 2),
  ('header', 'Mentorship', '/mentorship', 3),
  ('header', 'Resources', '/resources', 4),
  ('header', 'Blog', '/blog', 5),
  ('header', 'Store', '/store', 6),
  ('header', 'Contact', '/contact', 7);

-- ---- Navigation (footer) ----
insert into navigation_items (location, label, href, sort_order) values
  ('footer', 'About Us', '/about', 0),
  ('footer', 'Courses', '/courses', 1),
  ('footer', 'Mentorship', '/mentorship', 2),
  ('footer', 'Resources', '/resources', 3),
  ('footer', 'Blog', '/blog', 4),
  ('footer', 'Store', '/store', 5),
  ('footer', 'Contact', '/contact', 6),
  ('footer', 'Privacy Policy', '/privacy-policy', 7),
  ('footer', 'Terms of Service', '/terms', 8);

-- ---- Homepage settings ----
insert into homepage_settings (id, hero_heading, hero_subheading, hero_cta_primary_label, hero_cta_primary_href, hero_cta_secondary_label, hero_cta_secondary_href, stats, featured_course_slugs) values
  (1,
   'World-Class Radiology Education',
   'Empowering Future Radiologists Through Expert Education, Mentorship, Digital Learning, and AI-Powered Learning Resources.',
   'Explore Courses', '/courses',
   'Book Consultation', '/contact',
   '[{"value":12000,"suffix":"+","label":"Learners worldwide"},{"value":75,"suffix":"+","label":"Countries reached"},{"value":40,"suffix":"+","label":"Expert courses & resources"},{"value":98,"suffix":"%","label":"Would recommend"}]'::jsonb,
   ARRAY['foundations-of-radiology','frcr-rapid-reporting','ct-abdomen-pelvis-mastery']
  );

-- ---- Social links ----
insert into social_links (id, twitter, linkedin, instagram, youtube, email) values
  (1,
   'https://twitter.com/radvisionacademy',
   'https://www.linkedin.com/company/rad-vision-academy',
   'https://www.instagram.com/radvisionacademy',
   'https://www.youtube.com/@radvisionacademy',
   'hello@radvisionacademy.com'
  );

-- ---- Site settings ----
insert into site_settings (id, brand_name, tagline, email, phone, footer_copyright, newsletter_text) values
  (1,
   'RAD Vision Academy',
   'International Medical Education',
   'hello@radvisionacademy.com',
   '+1 (000) 000-0000',
   '',
   'Weekly high-yield radiology pearls, case studies, and career guidance.'
  );

-- ---- SEO settings ----
insert into seo_settings (id, global_description, twitter_card, canonical_base) values
  (1,
   'World-class radiology education. Empowering future radiologists through expert mentorship, digital learning, and AI-powered resources for medical students, residents, and clinicians worldwide.',
   'summary_large_image',
   'https://radvisionacademy.com'
  );

-- ---- Courses ----
insert into courses (slug, title, instructor, duration, level, category, blurb, description, highlights, price, status, sort_order, published_at) values
  ('foundations-of-radiology', 'Foundations of Radiology', 'Dr. Ayesha Khan, FRCR', '12 weeks', 'Beginner', 'Core',
   'A structured first step into diagnostic imaging — from basic physics to systematic film reading.',
   'Begin your radiology journey with a rock-solid foundation. Master imaging modalities, radiation physics, anatomy on imaging, and a systematic approach to interpreting common studies.',
   '["X-ray, CT, MRI & Ultrasound fundamentals","Chest and abdominal film interpretation","Systematic reporting framework","200+ annotated teaching cases"]'::jsonb,
   '$149', 'published', 0, now()),

  ('frcr-rapid-reporting', 'FRCR 2B Rapid Reporting', 'Dr. Omar Siddiqui, FRCR', '8 weeks', 'Advanced', 'Exam Prep',
   'Beat the clock on the FRCR rapid-reporting viva with a battle-tested technique and curated vaults.',
   'A focused, high-yield course built around the FRCR 2B rapid reporting examination. Develop pattern recognition, time discipline, and the confidence to walk into the viva prepared.',
   '["Timed rapid-reporting drills","Annotated answer keys with pitfalls","Live mock vivas with feedback","Strategy for the 35-minute format"]'::jsonb,
   '$199', 'published', 1, now()),

  ('ct-abdomen-pelvis-mastery', 'CT Abdomen & Pelvis Mastery', 'Dr. Lena Müller, MD', '10 weeks', 'Intermediate', 'Subspecialty',
   'Read abdominal CTs with confidence — from acute appendicitis to complex oncology staging.',
   'Develop a robust, reproducible method for interpreting abdominal and pelvic CT. Cover emergencies, common pathologies, and oncological staging with structured reporting.',
   '["Acute abdomen decision pathways","Oncologic staging by organ system","Structured reporting templates","150+ high-resolution cases"]'::jsonb,
   '$179', 'published', 2, now()),

  ('neuroradiology-essentials', 'Neuroradiology Essentials', 'Prof. Daniel Reyes, MD', '14 weeks', 'Intermediate', 'Subspecialty',
   'Decode the brain and spine — strokes, tumours, trauma, and the MRI sequences that matter.',
   'A thorough walkthrough of neuroradiology for residents and general radiologists. Understand MRI sequences, anatomy, and a systematic method for head CT and brain MRI.',
   '["Stroke imaging: CT, CTA, MRI","MRI sequence selection guide","Spine trauma & degenerative disease","120+ curated neuroradiology cases"]'::jsonb,
   '$219', 'published', 3, now()),

  ('ai-in-radiology', 'AI in Radiology: A Clinician''s Guide', 'Dr. Sara Ahmed, PhD', '6 weeks', 'All Levels', 'Future',
   'Understand how AI is reshaping radiology — from algorithm fundamentals to clinical deployment.',
   'Cut through the hype. Learn what AI can and cannot do in radiology today, how algorithms are validated, and how to evaluate and deploy AI tools safely in clinical practice.',
   '["How medical AI models are trained","Validation, bias & regulation","Deployment & clinical workflow","Hands-on tool evaluation"]'::jsonb,
   '$129', 'published', 4, now()),

  ('musculoskeletal-mri', 'Musculoskeletal MRI', 'Dr. Karim Haddad, MD', '10 weeks', 'Intermediate', 'Subspecialty',
   'Knee, shoulder, hip and spine MSK MRI — anatomy, protocols, and a reporting approach that holds up.',
   'Build confidence in MSK MRI interpretation across major joints. Master protocols, normal variants, and the reporting language used in clinical practice.',
   '["Joint-by-joint reading method","Protocol optimisation","Common reporting pitfalls","140+ annotated cases"]'::jsonb,
   '$169', 'published', 5, now());

-- ---- Products ----
insert into products (slug, title, category, blurb, price, format, status, sort_order) values
  ('radiology-pocket-ebook', 'The Radiology Pocket eBook', 'eBook',
   '320 pages of high-yield radiology, formatted for rapid reference on any device.', '$29', 'PDF + EPUB', 'published', 0),

  ('frcr-question-bank', 'FRCR Question Bank — 1,500 Questions', 'Question Bank',
   'Examination-style questions with detailed annotated answers and references.', '$49', 'Digital Access', 'published', 1),

  ('structured-reporting-templates', 'Structured Reporting Templates', 'Reporting Template',
   '120 editable, evidence-based reporting templates for the most common studies.', '$39', 'DOCX + PDF', 'published', 2),

  ('anatomy-study-notes', 'Cross-Sectional Anatomy Notes', 'Study Notes',
   'Clean, illustrated notes covering CT and MRI anatomy across every body system.', '$24', 'PDF', 'published', 3),

  ('residency-survival-bundle', 'Residency Survival Bundle', 'Bundle',
   'eBook, notes, templates and the question bank together — save 35%.', '$89', 'All Formats', 'published', 4),

  ('oncall-radiology-notes', 'On-Call Radiology Notes', 'Study Notes',
   'The after-hours survival guide — acute findings, red flags, and what to say.', '$19', 'PDF', 'published', 5);

-- ---- Blog posts ----
insert into posts (slug, title, excerpt, body, category, author, reading_time, featured, status, published_at) values
  ('how-to-read-a-chest-x-ray',
   'How to Read a Chest X-Ray: A Systematic Method That Always Works',
   'Stop guessing and start reading. A reproducible, anatomical approach to chest radiographs you can rely on under pressure.',
   '<h2>Why this matters</h2><p>Radiology rewards a systematic approach. When you read a study the same way every time, you stop relying on luck and start relying on method.</p><h2>The core principle</h2><p>The single most important habit is consistency: a reproducible search pattern.</p><h2>A practical framework</h2><ul><li><strong>Confirm:</strong> right patient, right study, right indication.</li><li><strong>Survey:</strong> a fixed anatomical sweep, every time.</li><li><strong>Compare:</strong> priors change everything.</li><li><strong>Conclude:</strong> a clear, actionable impression.</li></ul>',
   'Chest Imaging', 'Dr. Ayesha Khan', '8 min read', true, 'published', '2026-05-28'),

  ('frcr-2b-preparation-guide',
   'The Honest FRCR 2B Preparation Guide',
   'Everything I wish I had known before sitting the FRCR 2B — timelines, resources, and the technique that makes the difference.',
   '<h2>The reality of FRCR 2B</h2><p>The FRCR 2B is as much about technique as knowledge. Many well-read candidates fail because they lack a systematic approach.</p><h2>Timeline</h2><p>Start dedicated preparation at least 3 months before the exam. Earlier is better for rapid reporting drills.</p>',
   'Exam Prep', 'Dr. Omar Siddiqui', '12 min read', false, 'published', '2026-05-14'),

  ('ai-in-radiology-2026',
   'AI in Radiology: Where We Actually Are in 2026',
   'Beyond the headlines — a clinician''s view of what AI tools are delivering real value in radiology today.',
   '<h2>Beyond the hype</h2><p>AI in radiology is no longer theoretical. Multiple tools have demonstrated clinical value in triage, detection, and quantification.</p>',
   'Artificial Intelligence', 'Dr. Sara Ahmed', '10 min read', false, 'published', '2026-04-30'),

  ('ct-abdomen-checklist',
   'A Repeatable Checklist for Reading a CT Abdomen',
   'Build a reproducible system for abdominal CT. This checklist keeps you safe and keeps your reports consistent.',
   '<h2>The method</h2><p>Read every abdominal CT the same way. Start with the lungs, then the liver, spleen, pancreas, kidneys, bowel, vessels, and musculoskeletal structures.</p>',
   'Abdominal Imaging', 'Dr. Lena Müller', '7 min read', false, 'published', '2026-04-18'),

  ('stroke-imaging-essentials',
   'Acute Stroke Imaging: What Every Radiologist Must Know',
   'From ASPECTS to penumbra — the essentials of acute stroke imaging that you simply cannot afford to get wrong.',
   '<h2>The window matters</h2><p>Time is brain. The imaging protocol you choose directly affects treatment eligibility.</p>',
   'Neuroradiology', 'Prof. Daniel Reyes', '11 min read', false, 'published', '2026-04-02'),

  ('applying-to-radiology-residency',
   'Applying to Radiology Residency: A Global Perspective',
   'Pathways, timelines, and strategies for matching into radiology in the US, UK, and the Gulf region.',
   '<h2>Know your pathway</h2><p>Every region has its own system. Understanding the requirements early gives you a significant advantage.</p>',
   'Career', 'Dr. Ayesha Khan', '9 min read', false, 'published', '2026-03-20');

-- ---- Mentorship services ----
insert into mentorship_services (slug, title, description, benefits, icon, sort_order) values
  ('career-guidance', 'Career Guidance',
   'One-to-one mentorship to map your radiology career — from medical school to fellowship and consultant practice.',
   '["Personalised career roadmap","Specialty selection guidance","Long-term planning"]'::jsonb,
   'compass', 0),

  ('residency-guidance', 'Residency Guidance',
   'Strategic support for matching into radiology residency programmes in the US, UK, and the Gulf region.',
   '["Application strategy","Programme shortlisting","Interview preparation"]'::jsonb,
   'graduation', 1),

  ('frcr-guidance', 'FRCR Guidance',
   'Structured preparation for the Fellowship of the Royal College of Radiologists examinations.',
   '["Part 1 & 2 anatomy","Rapid reporting drills","Viva technique coaching"]'::jsonb,
   'target', 2),

  ('interview-preparation', 'Interview Preparation',
   'Mock interviews and structured coaching to help you present your best self under pressure.',
   '["Mock interview sessions","Question frameworks","Confidence under pressure"]'::jsonb,
   'message', 3),

  ('cv-review', 'CV Review',
   'Detailed, honest feedback on your medical CV and supporting documents from experienced reviewers.',
   '["Line-by-line CV review","Structure & impact","Cover letter editing"]'::jsonb,
   'file', 4),

  ('book-consultation', 'Book a Consultation',
   'A focused one-hour session to discuss your situation and agree concrete next steps with a senior mentor.',
   '["60-minute video call","Personalised action plan","Follow-up summary"]'::jsonb,
   'calendar', 5);

-- ---- Resources ----
insert into resources (slug, title, type, description, free, sort_order) values
  ('chest-xray-systematic-approach', 'Chest X-Ray Systematic Approach', 'PDF', 'A one-page ABCS approach you can use on every chest film.', true, 0),
  ('ct-head-baseline-checklist', 'CT Head — Baseline Checklist', 'Notes', 'A structured checklist for non-contrast head CT in the acute setting.', true, 1),
  ('frcr-exam-roadmap', 'FRCR Exam Roadmap', 'Guide', 'Everything you need to plan your Fellowship of the Royal College of Radiologists journey.', true, 2),
  ('radiology-cv-template', 'Radiology CV Template', 'Template', 'A clean, ATS-friendly CV template designed for medical professionals.', true, 3),
  ('abdominal-pain-decision-aid', 'Abdominal Pain Decision Aid', 'Toolkit', 'A decision aid for imaging selection in non-traumatic abdominal pain.', true, 4),
  ('stroke-imaging-protocol-card', 'Stroke Imaging Protocol Card', 'Notes', 'The imaging sequences and thresholds that matter in acute stroke.', true, 5),
  ('career-guide-becoming-radiologist', 'Career Guide: Becoming a Radiologist', 'Guide', 'A global perspective on pathways into radiology across countries.', true, 6),
  ('common-reporting-pitfalls', 'Common Reporting Pitfalls', 'PDF', 'Fifty frequent reporting mistakes — and how to avoid them.', true, 7);

-- ---- Testimonials ----
insert into testimonials (quote, name, role, sort_order) values
  ('RAD Vision Academy completely changed how I read films. The systematic method finally clicked — I went from anxious to confident on call.',
   'Dr. Priya Nair', 'Radiology Resident, London', 0),

  ('I cleared FRCR 2B on my first attempt. The rapid reporting drills were exactly what I needed to build pattern recognition.',
   'Dr. Hassan Al-Rashid', 'Specialist Radiologist, Dubai', 1),

  ('As an IMG applying to the US, the mentorship was invaluable. Honest, structured, and genuinely invested in my success.',
   'Dr. Maria Santos', 'PGY-2 Diagnostic Radiology, USA', 2),

  ('The AI in Radiology course is the clearest explanation I have seen. It removed the fear and gave me a real framework.',
   'Dr. Yusuf Ibrahim', 'Consultant Radiologist, Qatar', 3);

-- ---- Founders ----
insert into founders (name, role, bio, initials, sort_order) values
  ('Dr. Ayesha Khan, FRCR', 'Founder & Lead Educator',
   'Consultant radiologist with 15+ years across teaching hospitals in the UK and UAE. Passionate about structured reporting and mentorship.',
   'AK', 0),
  ('Dr. Omar Siddiqui, FRCR', 'Co-Founder & Exam Lead',
   'FRCR examiner-grade educator specialising in examination preparation and rapid reporting technique. Trained hundreds of successful candidates.',
   'OS', 1);

-- ---- Values ----
insert into brand_values (title, text, icon, sort_order) values
  ('Clinical rigour', 'Everything we publish is grounded in evidence and reviewed by practising radiologists. We never trade accuracy for appeal.', 'shield', 0),
  ('Learner-first', 'From medical students to consultants, our content meets you where you are and takes you where you want to go.', 'heart', 1),
  ('Global perspective', 'We serve learners across the US, UK, Europe, the Gulf, and beyond — with pathways that respect local systems.', 'globe', 2),
  ('Innovation', 'We embrace AI, simulation, and modern pedagogy to make radiology education faster, deeper, and more accessible.', 'sparkles', 3);

-- ---- Timeline ----
insert into timeline (year, title, text, sort_order) values
  ('2019', 'The idea', 'RAD Vision Academy begins as a mentorship practice helping IMGs into radiology.', 0),
  ('2021', 'Going digital', 'First flagship course and digital study notes launched, reaching learners across four continents.', 1),
  ('2023', 'Global reach', 'Catalogue expands to 40+ courses, question banks and templates serving 70+ countries.', 2),
  ('2026', 'AI-native learning', 'A new generation of AI-powered learning resources and the relaunched premium platform.', 3);

-- ---- FAQ ----
insert into faqs (question, answer, sort_order) values
  ('Are the courses suitable for absolute beginners?',
   'Yes. Our Foundations of Radiology course is designed for medical students and junior doctors with no prior radiology experience.', 0),
  ('How do I access a course or product after purchase?',
   'All products are sold through our official Gumroad store. Immediately after purchase, Gumroad sends you an email with secure access.', 1),
  ('Do you offer mentorship for international medical graduates (IMGs)?',
   'Absolutely. A large share of our mentees are IMGs. We provide tailored guidance for residency matching, FRCR preparation, and building a competitive application.', 2),
  ('Can hospitals and institutions book bulk training or consulting?',
   'Yes. We work with hospitals, universities, and healthcare institutions on custom curricula, reporting standardisation, and teleradiology consulting.', 3),
  ('Do I get a certificate after completing a course?',
   'Gumroad-hosted courses issue a completion confirmation from RAD Vision Academy, which can be used for your portfolio and CPD record.', 4),
  ('What is your refund policy?',
   'Digital products follow Gumroad''s refund policy. If a product does not meet your expectations, contact us and we will help resolve it directly.', 5);
