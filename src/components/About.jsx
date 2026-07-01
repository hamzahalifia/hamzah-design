import React, { useState, useEffect, useRef } from 'react';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import Navbar from './Navbar';
import FooterReveal from './FooterReveal';
import { RollingText } from './magicui/RollingText';
import { ProgressiveBlur } from './magicui/ProgressiveBlur';
import { Tilt } from './core/tilt';
import { BorderTrail } from './core/border-trail';
import PageMeta from './SEO/PageMeta';

/* ─── Data ─────────────────────────────────────────────── */

const AI_OPTIONS = [
  {
    id: 'claude',
    label: 'Claude',
    icon: 'logos:claude-icon',
    url: 'https://claude.ai/new?q=Would%20Alifia%20Hamzah%20be%20a%20strong%20UI%2FUX%20design%20partner%20for%20a%20B2B%20SaaS%20startup%3F%20Based%20on%20public%20information%20from%20https://hamzah.design%2C%20summarize%20his%20experience%2C%20portfolio%2C%20strengths%2C%20differentiators%2C%20ideal%20client%20fit%2C%20and%20any%20considerations%20before%20hiring%20him',
  },
  {
    id: 'chatgpt',
    label: 'Chat GPT',
    icon: 'hugeicons:chat-gpt',
    url: 'https://chatgpt.com/?q=Would%20Alifia%20Hamzah%20be%20a%20strong%20UI%2FUX%20design%20partner%20for%20a%20B2B%20SaaS%20startup%3F%20Based%20on%20public%20information%20from%20https://hamzah.design%2C%20summarize%20his%20experience%2C%20portfolio%2C%20strengths%2C%20differentiators%2C%20ideal%20client%20fit%2C%20and%20any%20considerations%20before%20hiring%20him',
  },
  {
    id: 'gemini',
    label: 'Gemini',
    icon: 'vscode-icons:file-type-gemini',
    url: 'https://gemini.google.com/app?q=Would%20Alifia%20Hamzah%20be%20a%20strong%20UI%2FUX%20design%20partner%20for%20a%20B2B%20SaaS%20startup%3F%20Based%20on%20public%20information%20from%20https://hamzah.design%2C%20summarize%20his%20experience%2C%20portfolio%2C%20strengths%2C%20differentiators%2C%20ideal%20client%20fit%2C%20and%20any%20considerations%20before%20hiring%2520him',
  },
  {
    id: 'grok',
    label: 'Grok',
    icon: 'selfhst:grok',
    url: 'https://grok.com/?q=Would%20Alifia%20Hamzah%20be%20a%20strong%20UI%2FUX%20design%20partner%20for%20a%20B2B%20SaaS%20startup%3F%20Based%20on%20public%20information%20from%20https://hamzah.design%2C%20summarize%20his%20experience%2C%20portfolio%2C%20strengths%2C%20differentiators%2C%20ideal%20client%20fit%2C%20and%20any%20considerations%20before%20hiring%20him',
  },
  {
    id: 'perplexity',
    label: 'Perplexity',
    icon: 'simple-icons:perplexity',
    url: 'https://www.perplexity.ai/?q=Would%20Alifia%20Hamzah%20be%20a%20strong%20UI%2FUX%20design%20partner%20for%20a%20B2B%20SaaS%20startup%3F%20Based%20on%20public%20information%20from%20https://hamzah.design%2C%20summarize%20his%20experience%2C%20portfolio%2C%20strengths%2C%20differentiators%2C%20ideal%20client%20fit%2C%20and%20any%20considerations%20before%20hiring%20him',
  },
];

const SUGGESTED_QUESTIONS = [
  {
    id: 'saas-fit',
    label: 'Verify SaaS Fit',
    icon: 'solar:widget-bold-duotone',
    query: 'Would Alifia Hamzah be a strong UI/UX design partner for a B2B SaaS startup? Based on public info from https://hamzah.design, summarize his experience, portfolio, strengths, and client fit.'
  },
  {
    id: 'case-studies',
    label: 'Audit Case Studies',
    icon: 'solar:document-bold-duotone',
    query: 'Summarize the enterprise product design case studies, design process, and data-driven methods of Alifia Hamzah from his portfolio at https://hamzah.design'
  },
  {
    id: 'design-philosophy',
    label: 'Simplify Workflows',
    icon: 'solar:magic-stick-bold-duotone',
    query: 'What is Alifia Hamzah\'s design philosophy for simplifying complex workflows and enterprise systems? Answer using details from https://hamzah.design'
  }
];

const getQueryUrl = (aiId, queryText) => {
  const query = encodeURIComponent(queryText);
  switch (aiId) {
    case 'claude':
      return `https://claude.ai/new?q=${query}`;
    case 'chatgpt':
      return `https://chatgpt.com/?q=${query}`;
    case 'gemini':
      return `https://gemini.google.com/app?q=${query}`;
    case 'grok':
      return `https://grok.com/?q=${query}`;
    case 'perplexity':
      return `https://www.perplexity.ai/?q=${query}`;
    default:
      return `https://claude.ai/new?q=${query}`;
  }
};

const TESTIMONIALS = [
  {
    id: 1,
    quote: "Hamzah is a designer who is totality in his work and easy to understand all directions, either from users and customers.",
    name: "Alfyan Syaputra",
    role: "Founder",
  },
  {
    id: 2,
    quote: "Hamzah is a designer who is totality in his work and easy to understand all directions, either from users and customers.",
    name: "Dicky Handika",
    role: "Founder",
  },
  {
    id: 3,
    quote: "Hamzah excels in product direction, ensuring every element captivates. His designs made and motion-video stand out, leading to many new sign-ups on our website.",
    name: "Angga Risky",
    role: "Founder",
  },
  {
    id: 4,
    quote: "Hamzah standardized the UI/UX Design System and built the UI for Proovia at Neuronworks Indonesia. He has a good design sense and is a creative thinker. His innovative approach consistently elevates user experiences.",
    name: "Terryus Gunawan",
    role: "Account Manager",
  },
  {
    id: 5,
    quote: "I truly appreciate his visual approach across different platforms.",
    name: "Fredrick",
    role: "Founder",
  },
  {
    id: 6,
    quote: "The improvements he made to our website have made my experience more intuitive and visually appealing. Great job!",
    name: "Clement",
    role: "Head Digital Marketing",
  },
];

const SOCIAL_LINKS = [
  { id: 'linkedin', icon: 'bi:linkedin', url: 'https://www.linkedin.com/in/alifiahamzah/' },
  { id: 'threads', icon: 'bi:threads', url: 'https://www.threads.com/@hamzahalifia' },
  { id: 'instagram', icon: 'bi:instagram', url: 'https://www.instagram.com/hamzahalifia' },
  { id: 'x', icon: 'bi:twitter-x', url: 'https://x.com/hamzahalifia' },
  { id: 'dribbble', icon: 'bi:dribbble', url: 'https://dribbble.com/hamzahalifia' },
  { id: 'layers', icon: 'bi:layers-fill', url: 'https://layers.to/hamzahalifia' },
  { id: 'behance', icon: 'bi:behance', url: 'https://www.behance.net/alifiahamzah' },
  { id: 'upwork', icon: 'simple-icons:upwork', url: 'https://www.upwork.com/freelancers/~01c75d8b7b914aa93d?mp_source=share' },
  { id: 'contra', icon: 'bi:person-workspace', url: 'https://contra.com/alifiahamzah?referralExperimentNid=SOCIAL_REFERRAL_PROGRAM&referrerUsername=alifiahamzah' },
];

const EXPERIENCE = [
  { role: 'Product Designer', company: 'Freelancing', location: 'Remote', period: 'Sep 2022 - Now' },
  { role: 'UI/UX Designer', company: 'PT Neuronworks Indonesia', location: 'Bandung, ID', period: 'Feb 2024 - Mar 2026' },
  { role: 'UI/UX Designer', company: 'Great Playbook Asia', location: 'Remote', period: 'Oct 2023 - Jan 2024' },
  { role: 'Sr. Graphic Designer', company: 'PT Teknologi Mudah Terhubung', location: 'Subang, ID', period: 'Jan 2022 - Mar 2023' },
];

const PROJECTS = [
  { name: 'Amigos Group Indonesia', role: 'Product Designer', year: '2026', url: 'amigosgroup.co.id' },
  { name: 'Marqet Finance', role: 'WEB3 Product Designer', year: '2025', url: 'restrictred' },
  { name: 'Wzard Education', role: 'Framer Developer', year: '2025', url: 'shutdown' },
  { name: 'Tanpa Koding Indonesia', role: 'UI Designer', year: '2024', url: 'tanpakoding.com' },
  { name: 'Arumaya Residenence', role: 'UI Designer', year: '2024', url: 'thearumaya.co.id' },
];

const VOLUNTEER = [
  { role: 'Designer', org: 'Framer Indonesia', year: '2023', url: 'framerindonesia.framer.ai' },
  { role: 'Head of Creative', org: 'University Festival', year: '2021', url: 'offline event' },
];

const EDUCATION = [
  { school: 'Universitas Pendidikan Indonesia', degree: 'Bachelor of Art, Film and Television Studies', gpa: 'GPA 3.67' },
];

const COMMUNITY_PHOTOS = [
  { id: 1, src: '/images/about/sharing_001.webp', alt: 'Sharing 1' },
  { id: 2, src: '/images/about/sharing_002.webp', alt: 'Sharing 2' },
  { id: 3, src: '/images/about/sharing_003.webp', alt: 'Sharing 3' },
  { id: 4, src: '/images/about/sharing_004.webp', alt: 'Sharing 4' },
];

/* ─── Sub-components ───────────────────────────────────── */

function AccordionItem({ title, isOpen, onToggle, children }) {
  return (
    <div className="accordion-item border-b border-attio-border-light dark:border-attio-border-dark">
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        className="accordion-toggle w-full inline-flex items-center gap-x-4 py-4 text-left cursor-pointer group"
      >
        <Icon
          icon="tabler:chevron-right"
          className={`size-5 shrink-0 text-neutral-400 dark:text-neutral-500 transition-transform duration-300 ${
            isOpen ? 'rotate-90' : ''
          }`}
        />
        <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors">
          {title}
        </span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            role="region"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="accordion-content w-full overflow-hidden"
          >
            <div className="px-5 pb-4 space-y-3">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function RollingTestimonials({ testimonials }) {
  const containerRef = useRef(null);

  // Triple the testimonials for smooth infinite scroll
  const allTestimonials = [...testimonials, ...testimonials, ...testimonials];

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let scrollPos = 0;
    const singleSetHeight = container.scrollHeight / 3;
    const speed = 0.12; // pixels per frame — slow and readable

    let animationId;

    const animate = () => {
      scrollPos += speed;
      if (scrollPos >= singleSetHeight) {
        scrollPos -= singleSetHeight;
      }
      container.scrollTop = scrollPos;
      animationId = requestAnimationFrame(animate);
    };

    // Small initial scroll to trigger
    scrollPos = 1;
    container.scrollTop = scrollPos;
    animationId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className="overflow-hidden max-h-[460px]"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <div className="space-y-4">
          {allTestimonials.map((t, idx) => (
            <div key={`${t.id}-${idx}`} className="space-y-2">
              <div className="text-sm font-semibold text-neutral-800 dark:text-white">
                {t.name.split(' ')[0]}, <span className="font-normal text-neutral-500 dark:text-neutral-400">{t.role}</span>
              </div>
              <div className="p-4 rounded-2xl rounded-l-none bg-[#FDFDFD] dark:bg-[#121214] border border-[#E8E8E8] dark:border-neutral-800 shadow-sm">
                <p className="text-sm leading-5 text-[#141414] dark:text-[#E5E7EB] font-normal">
                  "{t.quote}"
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Progressive Blur Overlays */}
      <ProgressiveBlur direction="top" className="h-16" />
      <ProgressiveBlur direction="bottom" className="h-16" />
    </div>
  );
}

/* ─── Main Component ───────────────────────────────────── */

export default function About() {
  const [selectedAI, setSelectedAI] = useState(AI_OPTIONS[0]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [prompt, setPrompt] = useState(SUGGESTED_QUESTIONS[0].query);
  const [openAccordion, setOpenAccordion] = useState(null);

  const toggleAccordion = (id) => {
    setOpenAccordion((prev) => (prev === id ? null : id));
  };

  return (
    <div className="min-h-screen bg-[#FAFAF9] dark:bg-[#080809] text-attio-text-primary-light dark:text-attio-text-primary-dark flex flex-col justify-between">
      <PageMeta
        title="About Alifia Hamzah — Product Designer"
        description="Learn about Alifia Hamzah, a Product Designer based in Bandung, Indonesia, specializing in data-driven enterprise tools and story-data design methodology."
        keywords="Alifia Hamzah, About, Product Designer, Bandung, Indonesia, Enterprise Design, Data-Driven Design, Alifia Hamzah Product Designer, Alifia Hamzah UI/UX Designer, Alif Designer, Hamzah Design, Hamzah Designer, Alif Hamzah, Hamzah Alifia, Hamzah Alif, Hamzah Alif Design, Hamzah Alif UI/UX Designer, Hamzah Alif Product Designer, Hamzah Alifia Hamzah, Alifia Hamzah Indonesia, Alifia Hamzah Bandung, Alifia Hamzah BWA, Alifia Hamzah Neuron, Alifia Hamzah Neuronworks, Hamzah Neuronworks, Hamzah Neuronworks Indonesia, Hamzah Catalyst Team, Hamzah The Catalyst Team, Hamzah CTC, Hamzah Upwork, Hamzah Contra, Hamzah Freelancer Upwork"
        canonical="https://hamzah.design/about"
        schema={{
          "@context": "https://schema.org",
          "@type": "Person",
          "name": "Alifia Hamzah",
          "givenName": "Alifia",
          "familyName": "Hamzah",
          "additionalName": "Hamzah",
          "alternateName": [
            "Alifia Hamzah",
            "Alif Designer",
            "Hamzah Design",
            "Hamzah Designer",
            "Alif Hamzah",
            "Hamzah Alifia",
            "Hamzah Alif",
            "Hamzah Alif Design",
            "Hamzah Alifia Hamzah",
            "Hamzah Neuronworks"
          ],
          "jobTitle": "Product Designer",
          "url": "https://hamzah.design",
          "image": "https://hamzah.design/images/general/profilephoto.webp",
          "description": "Product Designer specializing in data-driven enterprise tools and story-data approach.",
          "knowsLanguage": [
            { "@type": "Language", "name": "Indonesian", "alternateName": "id" },
            { "@type": "Language", "name": "Sundanese", "alternateName": "su" },
            { "@type": "Language", "name": "English", "alternateName": "en" },
            { "@type": "Language", "name": "Japanese", "alternateName": "ja" }
          ],
          "sameAs": [
            "https://www.linkedin.com/in/alifiahamzah/",
            "https://www.instagram.com/hamzahalifia",
            "https://github.com/hamzahalifia",
            "https://x.com/hamzahalifia",
            "https://dribbble.com/hamzahalifia",
            "https://layers.to/hamzahalifia",
            "https://www.behance.net/alifiahamzah",
            "https://www.upwork.com/freelancers/~01c75d8b7b914aa93d?mp_source=share",
            "https://contra.com/alifiahamzah?referralExperimentNid=SOCIAL_REFERRAL_PROGRAM&referrerUsername=alifiahamzah"
          ],
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Bandung",
            "addressRegion": "West Java",
            "addressCountry": "ID"
          }
        }}
      />
      <Navbar />

      <main className="relative z-10 bg-[#FAFAF9] dark:bg-[#080809] flex-1 border-b border-attio-border-light dark:border-attio-border-dark transition-colors duration-300">
        <div className="max-w-[1440px] mx-auto px-0 lg:px-6">
          <div className="border-l-0 border-r-0 lg:border-l lg:border-r border-attio-border-light dark:border-attio-border-dark min-h-full bg-white dark:bg-[#0A0A0B]">

            <div className="w-full">

              {/* 2-Column Responsive Layout — wider right column */}
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] w-full">

                {/* Column 1: Main Content Area */}
                <div className="p-5 space-y-10 pb-16">

                  {/* Profile Header — photo → name → role → desc as one block */}
                  <div className="space-y-6">
                    <div className="w-[50px] h-[50px] flex items-center justify-center"><div className="w-[42.31px] h-[42.31px] rounded-[5px] overflow-hidden border-[1.24px] border-white dark:border-neutral-700 shadow-[0px_2.49px_3.73px_-0.62px_rgba(0,0,0,0.1),0px_1.24px_2.49px_-1.24px_rgba(0,0,0,0.1)] relative group"><img alt="Alifia Hamzah" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" src="/images/general/profilephoto.webp" /></div></div>

                    <div className="space-y-1.5">
                      <h1 className="font-serif-attio text-[30px] sm:text-[36px] lg:text-[46px] leading-tight text-[#111827] dark:text-white">
                        Alifia Hamzah
                      </h1>
                      <p className="text-base sm:text-lg text-neutral-500 dark:text-neutral-400 font-light">
                        Enterprise Product Designer
                      </p>
                    </div>

                    <p className="text-base leading-6 text-[#111827] dark:text-[#E5E7EB] font-normal">
                      I partner with companies to build and scale their data-driven enterprise tools with a story-data approach. My designs translate complex workflows and technical datasets into highly functional, clear user experiences that team members actually love using. I focus on bridging product requirements, operations, and visual clarity to build dashboard and analytics systems that scale.
                    </p>
                  </div>

                  {/* Social Links — icon only, no labels, no borders */}
                  <div className="space-y-4">
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed font-normal">
                      Outside of client work, I enjoy sharing interface explorations and workflow insights online:
                    </p>
                    <div className="flex flex-wrap gap-4">
                      {SOCIAL_LINKS.map((link) => (
                        <a
                          key={link.id}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-neutral-400 dark:text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors cursor-pointer"
                          aria-label={link.id}
                        >
                          <Icon icon={link.icon} className="w-5 h-5" />
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* Accordions — Experience, Projects, Volunteer, Education */}
                  <div className="space-y-0 w-full">
                    <AccordionItem
                      title="Experience"
                      isOpen={openAccordion === 'experience'}
                      onToggle={() => toggleAccordion('experience')}
                    >
                      {EXPERIENCE.map((item, idx) => (
                        <div key={idx} className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                              {item.role}
                            </p>
                            <p className="text-[13px] text-neutral-500 dark:text-neutral-400">
                              {item.company} &middot; {item.location}
                            </p>
                          </div>
                          <span className="text-[11px] text-neutral-400 dark:text-neutral-500 whitespace-nowrap font-medium mt-0.5">
                            {item.period}
                          </span>
                        </div>
                      ))}
                    </AccordionItem>

                    <AccordionItem
                      title="Projects"
                      isOpen={openAccordion === 'projects'}
                      onToggle={() => toggleAccordion('projects')}
                    >
                      {PROJECTS.map((item, idx) => (
                        <div key={idx} className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                              {item.name}
                            </p>
                            <p className="text-[13px] text-neutral-500 dark:text-neutral-400">
                              {item.role} &middot; {item.year}
                            </p>
                          </div>
                          <span className="text-[11px] text-neutral-400 dark:text-neutral-500 whitespace-nowrap font-medium mt-0.5">
                            {item.url}
                          </span>
                        </div>
                      ))}
                    </AccordionItem>

                    <AccordionItem
                      title="Volunteer"
                      isOpen={openAccordion === 'volunteer'}
                      onToggle={() => toggleAccordion('volunteer')}
                    >
                      {VOLUNTEER.map((item, idx) => (
                        <div key={idx} className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                              {item.role}
                            </p>
                            <p className="text-[13px] text-neutral-500 dark:text-neutral-400">
                              {item.org}
                            </p>
                          </div>
                          <span className="text-[11px] text-neutral-400 dark:text-neutral-500 whitespace-nowrap font-medium mt-0.5">
                            {item.year} &middot; {item.url}
                          </span>
                        </div>
                      ))}
                    </AccordionItem>

                    <AccordionItem
                      title="Education"
                      isOpen={openAccordion === 'education'}
                      onToggle={() => toggleAccordion('education')}
                    >
                      {EDUCATION.map((item, idx) => (
                        <div key={idx}>
                          <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                            {item.school}
                          </p>
                          <p className="text-[13px] text-neutral-500 dark:text-neutral-400">
                            {item.degree} &middot; {item.gpa}
                          </p>
                        </div>
                      ))}
                    </AccordionItem>
                  </div>

                  {/* Community Section */}
                  <div className="space-y-5 w-full">
                    <p className="text-sm leading-relaxed font-normal">
                      I enjoy engaging with the wider design and developer community, discussing workflow solutions, and sharing insights about enterprise product design.
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {COMMUNITY_PHOTOS.map((photo) => (
                        <div
                          key={photo.id}
                          className="aspect-[4/3] rounded-xl overflow-hidden border border-attio-border-light dark:border-attio-border-dark bg-neutral-100 dark:bg-neutral-800 shadow-sm hover:scale-[1.02] transition-transform duration-200"
                        >
                          <img
                            src={photo.src}
                            alt={photo.alt}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                   {/* Quote Block */}
                   <Tilt rotationFactor={8} isRevese>
                     <div className="relative p-5 bg-neutral-50 dark:bg-zinc-900/50 border border-attio-border-light dark:border-attio-border-dark rounded-2xl w-full shadow-sm">
                       <BorderTrail
                         style={{
                           boxShadow:
                             '0px 0px 60px 30px rgb(255 255 255 / 25%), 0 0 100px 60px rgb(0 0 0 / 25%), 0 0 140px 90px rgb(0 0 0 / 25%)',
                         }}
                         size={100}
                         duration={4}
                       />
                       <blockquote className="space-y-5 relative z-10">
                         <p className="text-lg sm:text-xl text-neutral-700 dark:text-neutral-200 leading-relaxed font-normal pb-8">
                           "Complex data shouldn't mean complex design. I specialize in stripping away the clutter to build enterprise tools that are intuitive, scalable, and genuinely helpful."
                         </p>
                         <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed font-normal">
                           If you're looking for a design partner to simplify complex workflows and build tools that scale, let's collaborate.
                         </p>
                         <footer>
                           <cite className="not-italic text-2xl sm:text-3xl text-neutral-900 dark:text-white tracking-wide" style={{ fontFamily: '"Caveat", cursive' }}>
                             Alifia Hamzah
                           </cite>
                         </footer>
                       </blockquote>
                     </div>
                   </Tilt>

                  {/* Download buttons */}
                  <div className="space-y-4 w-full">
                    <p className="text-[13px] text-neutral-700 dark:text-zinc-200">
                      For a more detailed look at my experience, work history, and achievements:
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <a
                        href="https://drive.google.com/file/d/1mAf33lnuU8jFjZxiJINHke9qOE1AuPsg/view?usp=sharing"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold bg-[#1A1A1A] dark:bg-white text-white dark:text-black hover:opacity-95 transition-all active:scale-95 shadow-[0px_2px_10px_0px_rgba(0,0,0,0.05)] cursor-pointer"
                      >
                        <Icon icon="solar:download-square-bold" className="w-4 h-4" />
                        <RollingText>Download Resume</RollingText>
                      </a>
                      <a
                        href="https://drive.google.com/file/d/1cdwvCR_kHIuASqD2XK-nBJmAdnijr0kX/view?usp=sharing"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold border border-attio-border-light dark:border-attio-border-dark text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all active:scale-95 cursor-pointer"
                      >
                        <Icon icon="solar:document-bold" className="w-4 h-4" />
                        <RollingText>View PDF Personal Deck</RollingText>
                      </a>
                    </div>
                  </div>

                </div>

                {/* Column 2: Right Sidebar (below intro on mobile) */}
                <div className="border-t lg:border-t-0 lg:border-l border-attio-border-light dark:border-attio-border-dark">
                  <div className="sticky top-[60px] divide-y divide-attio-border-light dark:divide-attio-border-dark">

                    {/* Ask AI Section */}
                    <div className="p-5">
                      <div className="p-5 bg-neutral-50 dark:bg-zinc-900/50 border border-attio-border-light dark:border-attio-border-dark rounded-2xl space-y-5 font-sans shadow-sm">
                        
                        {/* Header */}
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Icon icon="ri:quill-pen-ai-fill" className="w-4 h-4 text-blue-500" />
                            <h3 className="text-sm font-semibold text-[#111827] dark:text-white">
                              Ask your AI Partner
                            </h3>
                          </div>
                        </div>

                        {/* Interactive prompt area */}
                        <div className="relative rounded-xl bg-white dark:bg-zinc-950 border border-attio-border-light dark:border-attio-border-dark p-3 shadow-inner">
                          <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            className="w-full h-24 bg-transparent text-sm text-neutral-800 dark:text-zinc-200 outline-none resize-none border-0 p-0 font-sans leading-relaxed focus:outline-none focus:ring-0"
                            placeholder="Type your question about Hamzah's work..."
                          />
                        </div>

                        {/* Suggestion Chips */}
                        <div className="space-y-2">
                          <span className="text-sm font-semibold text-[#111827] dark:text-white block">
                            Suggested Questions
                          </span>
                          <div className="flex flex-col gap-2">
                            {SUGGESTED_QUESTIONS.map((q) => {
                              const isActive = prompt === q.query;
                              return (
                                <button
                                  key={q.id}
                                  type="button"
                                  onClick={() => setPrompt(q.query)}
                                  className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm text-left border transition-all duration-200 cursor-pointer ${
                                    isActive
                                      ? 'bg-neutral-200 dark:bg-zinc-800 border-neutral-300 dark:border-zinc-700 text-neutral-900 dark:text-white font-medium shadow-sm'
                                      : 'bg-white dark:bg-zinc-950 border-attio-border-light dark:border-attio-border-dark text-neutral-500 dark:text-zinc-400 hover:bg-neutral-100 dark:hover:bg-zinc-900'
                                  }`}
                                >
                                  <Icon icon={q.icon} className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-500' : 'text-neutral-400'}`} />
                                  <span className="truncate">{q.label}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Bottom Actions Row */}
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between pt-3 border-t border-attio-border-light dark:border-attio-border-dark gap-3">
                          {/* Dropdown Selector */}
                          <div className="relative w-full md:w-auto">
                            <button
                              type="button"
                              onClick={() => setDropdownOpen(!dropdownOpen)}
                              className="flex items-center justify-between md:justify-start gap-1.5 w-full md:w-auto px-3 py-2 bg-[#F2F2F2] dark:bg-neutral-800 border border-attio-border-light dark:border-attio-border-dark text-[#545454] dark:text-neutral-300 rounded-lg text-sm font-semibold hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors cursor-pointer select-none"
                            >
                              <div className="flex items-center gap-1.5">
                                <Icon icon={selectedAI.icon} className="w-3.5 h-3.5 shrink-0" />
                                <span>{selectedAI.label}</span>
                              </div>
                              <Icon icon="lucide:chevron-down" className="w-3 h-3 text-neutral-400 dark:text-neutral-500" />
                            </button>
                            
                            {dropdownOpen && (
                              <>
                                <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                                <div className="absolute bottom-full left-0 mb-1.5 z-50 w-full md:min-w-[130px] bg-white dark:bg-zinc-950 border border-attio-border-light dark:border-attio-border-dark rounded-xl shadow-xl p-1 animate-in fade-in slide-in-from-bottom-1 duration-150">
                                  {AI_OPTIONS.map((opt) => (
                                    <button
                                      key={opt.id}
                                      type="button"
                                      onClick={() => {
                                        setSelectedAI(opt);
                                        setDropdownOpen(false);
                                      }}
                                      className={`w-full flex items-center gap-2 px-2.5 py-2 text-left text-sm rounded-lg transition-colors cursor-pointer ${
                                        selectedAI.id === opt.id
                                          ? 'bg-neutral-100 dark:bg-zinc-800 text-neutral-900 dark:text-white font-semibold'
                                          : 'text-[#545454] dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-zinc-900'
                                      }`}
                                    >
                                      <Icon icon={opt.icon} className="w-3.5 h-3.5 shrink-0" />
                                      <span>{opt.label}</span>
                                    </button>
                                  ))}
                                </div>
                              </>
                            )}
                          </div>

                          {/* Execute Button */}
                          <a
                            href={getQueryUrl(selectedAI.id, prompt)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center w-full md:w-auto px-5 py-2.5 rounded-full text-sm font-semibold border border-attio-border-light dark:border-attio-border-dark text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all active:scale-95 cursor-pointer"
                          >
                            Ask AI
                          </a>
                        </div>

                      </div>
                    </div>

                    {/* Testimonials Section — rolling */}
                    <div className="p-5 space-y-5">
                      <p className="text-sm text-neutral-800 dark:text-neutral-200 leading-relaxed font-normal">
                        Here's what working together has been like for some of my clients.
                      </p>

                      <RollingTestimonials testimonials={TESTIMONIALS} />
                    </div>
                  </div>
                </div>

              </div>

            </div>

          </div>
        </div>
      </main>

      <FooterReveal />
    </div>
  );
}