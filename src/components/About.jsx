import React, { useState, useEffect, useRef } from "react";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import Navbar from "./Navbar";
import FooterReveal from "./FooterReveal";
import { RollingText } from "./magicui/RollingText";
import { ProgressiveBlur } from "./magicui/ProgressiveBlur";
import { Tilt } from "./core/tilt";
import { BorderTrail } from "./core/border-trail";
import { Button } from "@/components/ui/button";
import PageMeta from "./SEO/PageMeta";

/* ─── Data ─────────────────────────────────────────────── */

const AI_OPTIONS = [
  {
    id: "chatgpt",
    label: "Chat GPT",
    icon: "simple-icons:openai",
    url: "https://chatgpt.com/?q=Would%20Alifia%20Hamzah%20be%20a%20strong%20UI%2FUX%20design%20partner%20for%20a%20B2B%20SaaS%20startup%3F%20Based%20on%20public%20information%20from%20https://hamzah.design%2C%20summarize%20his%20experience%2C%20portfolio%2C%20strengths%2C%20differentiators%2C%20ideal%20client%20fit%2C%20and%20any%20considerations%20before%20hiring%20him",
  },
  {
    id: "perplexity",
    label: "Perplexity",
    icon: "simple-icons:perplexity",
    url: "https://www.perplexity.ai/?q=Would%20Alifia%20Hamzah%20be%20a%20strong%20UI%2FUX%20design%20partner%20for%20a%20B2B%20SaaS%20startup%3F%20Based%20on%20public%20information%20from%20https://hamzah.design%2C%20summarize%20his%20experience%2C%20portfolio%2C%20strengths%2C%20differentiators%2C%20ideal%20client%20fit%2C%20and%20any%20considerations%20before%20hiring%20him",
  },
  {
    id: "claude",
    label: "Claude",
    icon: "logos:claude-icon",
    url: "https://claude.ai/new?q=Would%20Alifia%20Hamzah%20be%20a%20strong%20UI%2FUX%20design%20partner%20for%20a%20B2B%20SaaS%20startup%3F%20Based%20on%20public%20information%20from%20https://hamzah.design%2C%20summarize%20his%20experience%2C%20portfolio%2C%20strengths%2C%20differentiators%2C%20ideal%20client%20fit%2C%20and%20any%20considerations%20before%20hiring%20him",
  },
  {
    id: "grok",
    label: "Grok",
    icon: "selfhst:grok",
    url: "https://grok.com/?q=Would%20Alifia%20Hamzah%20be%20a%20strong%20UI%2FUX%20design%20partner%20for%20a%20B2B%20SaaS%20startup%3F%20Based%20on%20public%20information%20from%20https://hamzah.design%2C%20summarize%20his%20experience%2C%20portfolio%2C%20strengths%2C%20differentiators%2C%20ideal%20client%20fit%2C%20and%20any%20considerations%20before%20hiring%20him",
  },
  {
    id: "gemini",
    label: "Gemini",
    icon: "vscode-icons:file-type-gemini",
    url: "https://gemini.google.com/app?q=Would%20Alifia%20Hamzah%20be%20a%20strong%20UI%2FUX%20design%20partner%20for%20a%20B2B%20SaaS%20startup%3F%20Based%20on%20public%20information%20from%20https://hamzah.design%2C%20summarize%20his%20experience%2C%20portfolio%2C%20strengths%2C%20differentiators%2C%20ideal%20client%20fit%2C%20and%20any%20considerations%20before%20hiring%2520him",
  },
];

const TESTIMONIALS = [
  {
    id: 1,
    quote:
      "Hamzah is a designer who is totality in his work and easy to understand all directions, either from users and customers.",
    name: "Alfyan Syaputra",
    role: "Founder",
    image: "/images/client_feedback/client_feedback_alfyan.webp",
  },
  {
    id: 2,
    quote:
      "Hamzah is a designer who is totality in his work and easy to understand all directions, either from users and customers.",
    name: "Dicky Handika",
    role: "Founder",
    image: "/images/client_feedback/client_feedback_dicky.webp",
  },
  {
    id: 3,
    quote:
      "Hamzah excels in product direction, ensuring every element captivates. His designs made and motion-video stand out, leading to many new sign-ups on our website.",
    name: "Angga Risky",
    role: "Founder",
    image: "/images/client_feedback/client_feedback_angga.webp",
  },
  {
    id: 4,
    quote:
      "Hamzah standardized the UI/UX Design System and built the UI for Proovia at Neuronworks Indonesia. He has a good design sense and is a creative thinker. His innovative approach consistently elevates user experiences.",
    name: "Terryus Gunawan",
    role: "Account Manager",
    image: "/images/client_feedback/client_feedback_terryus.webp",
  },
  {
    id: 5,
    quote: "I truly appreciate his visual approach across different platforms.",
    name: "Fredrick",
    role: "Founder",
    image: "/images/client_feedback/client_feedback_fredrick.webp",
  },
  {
    id: 6,
    quote:
      "The improvements he made to our website have made my experience more intuitive and visually appealing. Great job!",
    name: "Clement",
    role: "Head Digital Marketing",
    image: "/images/client_feedback/client_feedback_clement.webp",
  },
];

const SOCIAL_LINKS = [
  {
    id: "linkedin",
    icon: "bi:linkedin",
    url: "https://www.linkedin.com/in/alifiahamzah/",
  },
  {
    id: "threads",
    icon: "bi:threads",
    url: "https://www.threads.net/@hamzahalifia",
  },
  {
    id: "instagram",
    icon: "bi:instagram",
    url: "https://www.instagram.com/hamzahalifia",
  },
  { id: "x", icon: "bi:twitter-x", url: "https://x.com/hamzahalifia" },
  {
    id: "dribbble",
    icon: "bi:dribbble",
    url: "https://dribbble.com/hamzahalifia",
  },
  {
    id: "layers",
    icon: "bi:layers-fill",
    url: "https://layers.to/hamzahalifia",
  },
  {
    id: "behance",
    icon: "bi:behance",
    url: "https://www.behance.net/alifiahamzah",
  },
  {
    id: "upwork",
    icon: "simple-icons:upwork",
    url: "https://www.upwork.com/freelancers/~01c75d8b7b914aa93d?mp_source=share",
  },
  {
    id: "contra",
    icon: "bi:person-workspace",
    url: "https://contra.com/alifiahamzah?referralExperimentNid=SOCIAL_REFERRAL_PROGRAM&referrerUsername=alifiahamzah",
  },
];

const EXPERIENCE = [
  {
    role: "UI/UX Designer",
    company: "PT Neuronworks Indonesia",
    location: "Bandung, ID",
    period: "Feb 2024 - Mar 2026",
    year: "2024",
    logo: "/images/experience/nws.svg",
    link: "https://neuronworks.co.id",
    dotColor: "bg-blue-500",
  },
  {
    role: "UI/UX Designer",
    company: "Great Playbook Asia",
    location: "Remote",
    period: "Oct 2023 - Jan 2024",
    year: "2023",
    logo: "/images/experience/gpa.webp",
    link: "https://greatplaybookasia.framer.website/",
    dotColor: "bg-purple-500",
  },
  {
    role: "Product Designer",
    company: "Freelancing",
    location: "Remote",
    period: "Sep 2022 - Now",
    year: "2022",
    logo: "/images/experience/freelance.svg",
    link: "",
    dotColor: "bg-emerald-500",
  },
  {
    role: "Sr. Graphic Designer",
    company: "PT Teknologi Mudah Terhubung",
    location: "Subang, ID",
    period: "Jan 2022 - Mar 2023",
    year: "2022",
    logo: "/images/experience/tappp.svg",
    link: "",
    dotColor: "bg-orange-500",
  },
];

const PROJECTS = [
  {
    name: "Amigos Group Indonesia",
    role: "Product Designer",
    year: "2026",
    url: "amigosgroup.co.id",
    logo: "/images/projects/amigos.svg",
    link: "https://amigosgroup.co.id",
    dotColor: "bg-green-500",
  },
  {
    name: "Marqet Finance",
    role: "WEB3 Product Designer",
    year: "2025",
    url: "restricted",
    logo: "/images/projects/marqetfi.svg",
    link: "",
    dotColor: "bg-yellow-500",
  },
  {
    name: "Wzard Education",
    role: "Framer Developer",
    year: "2025",
    url: "shutdown",
    logo: "/images/projects/wzard.svg",
    link: "",
    dotColor: "bg-red-500",
  },
  {
    name: "Tanpa Koding Indonesia",
    role: "UI Designer",
    year: "2024",
    url: "tanpakoding.com",
    logo: "/images/projects/tanpakoding.svg",
    link: "https://tanpakoding.com",
    dotColor: "bg-green-500",
  },
  {
    name: "Arumaya Residence",
    role: "UI Designer",
    year: "2024",
    url: "thearumaya.co.id",
    logo: "/images/projects/arumaya.svg",
    link: "https://thearumaya.co.id",
    dotColor: "bg-green-500",
  },
];

const VOLUNTEER = [
  {
    role: "Design Friend",
    org: "Framer Indonesia",
    year: "2023",
    location: "Bandung, ID",
    logo: "/images/volunteer/framerindo.svg",
    link: "https://framerindonesia.framer.ai",
    dotColor: "bg-sky-500",
  },
  {
    role: "Head of Creative",
    org: "University Festival",
    year: "2021",
    location: "Subang, ID",
    logo: "/images/volunteer/unifest.svg",
    link: "",
    dotColor: "bg-pink-500",
  },
];

const EDUCATION = [
  {
    school: "Universitas Pendidikan Indonesia",
    degree: "Bachelor of Art, Film and Television Studies",
    gpa: "GPA 3.67",
    year: "2021",
    logo: "/images/education/upi.svg",
    link: "https://upi.edu",
    dotColor: "bg-violet-500",
  },
];

const COMMUNITY_PHOTOS = [
  {
    id: 1,
    src: "/images/about/sharing_001.webp",
    alt: "Sharing 1",
    label: "design training",
    rotation: "-rotate-6 hover:-rotate-1",
  },
  {
    id: 2,
    src: "/images/about/sharing_002.webp",
    alt: "Sharing 2",
    label: "pitch the idea",
    rotation: "rotate-3 hover:rotate-0",
  },
  {
    id: 3,
    src: "/images/about/sharing_003.webp",
    alt: "Sharing 3",
    label: "mentoring session",
    rotation: "-rotate-2 hover:rotate-1",
  },
  {
    id: 4,
    src: "/images/about/sharing_004.webp",
    alt: "Sharing 4",
    label: "meetup & sharing",
    rotation: "rotate-6 hover:rotate-1",
  },
  {
    id: 5,
    src: "/images/about/sharing_005.webp",
    alt: "Sharing 5",
    label: "workspace",
    rotation: "-rotate-3 hover:rotate-1",
  },
  {
    id: 6,
    src: "/images/about/sharing_006.avif",
    alt: "Sharing 6",
    label: "coffee break",
    rotation: "rotate-4 hover:-rotate-1",
  },
];

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
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <div className="space-y-4">
          {allTestimonials.map((t, idx) => (
            <div key={`${t.id}-${idx}`} className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-[20px] h-[20px] rounded-full bg-white dark:bg-black border border-neutral-200 dark:border-neutral-700 overflow-hidden flex items-center justify-center">
                  <img
                    src={t.image}
                    alt={t.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-sm font-semibold text-neutral-800 dark:text-white">
                  {t.name.split(" ")[0]},{" "}
                  <span className="font-normal text-neutral-500 dark:text-neutral-400">
                    {t.role}
                  </span>
                </div>
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

// Function to calculate years since a specific date
const calculateYearsSince = (startDate) => {
  const now = new Date();
  let years = now.getFullYear() - startDate.getFullYear();
  const monthDifference = now.getMonth() - startDate.getMonth();

  // If current month is before start month, or if it's the same month but earlier day, subtract a year
  if (
    monthDifference < 0 ||
    (monthDifference === 0 && now.getDate() < startDate.getDate())
  ) {
    years--;
  }
  return years;
};

/* ─── Main Component ───────────────────────────────────── */

export default function About() {
  const [selectedAI, setSelectedAI] = useState(AI_OPTIONS[0]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Set the career start date to September 1st, 2021
  const careerStartDate = new Date("2021-09-01T00:00:00");
  const yearsOfExperience = calculateYearsSince(careerStartDate);

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
          name: "Alifia Hamzah",
          givenName: "Alifia",
          familyName: "Hamzah",
          additionalName: "Hamzah",
          alternateName: [
            "Alifia Hamzah",
            "Alif Designer",
            "Hamzah Design",
            "Hamzah Designer",
            "Alif Hamzah",
            "Hamzah Alifia",
            "Hamzah Alif",
            "Hamzah Alif Design",
            "Hamzah Alifia Hamzah",
            "Hamzah Neuronworks",
          ],
          jobTitle: "Product Designer",
          url: "https://hamzah.design",
          image: "https://hamzah.design/images/general/profilephoto.webp",
          description:
            "Product Designer specializing in data-driven enterprise tools and story-data approach.",
          knowsLanguage: [
            { "@type": "Language", name: "Indonesian", alternateName: "id" },
            { "@type": "Language", name: "Sundanese", alternateName: "su" },
            { "@type": "Language", name: "English", alternateName: "en" },
            { "@type": "Language", name: "Japanese", alternateName: "ja" },
          ],
          sameAs: [
            "https://www.linkedin.com/in/alifiahamzah/",
            "https://www.instagram.com/hamzahalifia",
            "https://github.com/hamzahalifia",
            "https://x.com/hamzahalifia",
            "https://dribbble.com/hamzahalifia",
            "https://layers.to/hamzahalifia",
            "https://www.behance.net/alifiahamzah",
            "https://www.upwork.com/freelancers/~01c75d8b7b914aa93d?mp_source=share",
            "https://contra.com/alifiahamzah?referralExperimentNid=SOCIAL_REFERRAL_PROGRAM&referrerUsername=alifiahamzah",
          ],
          address: {
            "@type": "PostalAddress",
            addressLocality: "Bandung",
            addressRegion: "West Java",
            addressCountry: "ID",
          },
        }}
      />
      {/* <Navbar /> */}

      <main
        aria-label="About page content"
        className="relative z-10 bg-[#FAFAF9] dark:bg-[#080809] flex-1 border-b border-attio-border-light dark:border-attio-border-dark transition-colors duration-300"
      >
        <div className="max-w-[1440px] mx-auto px-0 lg:px-6">
          <div className="border-l-0 border-r-0 lg:border-l lg:border-r border-attio-border-light dark:border-attio-border-dark min-h-full bg-white dark:bg-[#0A0A0B]">
            <div className="w-full">
              {/* 2-Column Responsive Layout — wider right column */}
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] xl:grid-cols-[1fr_420px] w-full">
                {/* Column 1: Main Content Area */}
                <div className="p-5 space-y-10 pb-16 min-w-0">
                  {/* Profile Header — photo → name → role → desc as one block */}
                  <div className="space-y-6">
                    <div className="w-[50px] h-[50px] flex items-center justify-center">
                      <div className="w-[42.31px] h-[42.31px] rounded-[5px] overflow-hidden border-[1.24px] border-white dark:border-neutral-700 shadow-[0px_2.49px_3.73px_-0.62px_rgba(0,0,0,0.1),0px_1.24px_2.49px_-1.24px_rgba(0,0,0,0.1)] relative group">
                        <img
                          alt="Alifia Hamzah"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          src="/images/general/profilephoto.webp"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <h1 className="font-serif-attio text-[30px] sm:text-[36px] lg:text-[46px] leading-tight text-black dark:text-white">
                        Alifia Hamzah
                      </h1>
                      <p className="text-base sm:text-lg text-neutral-500 dark:text-neutral-400 font-light">
                        Enterprise Product Designer
                      </p>
                    </div>

                    <p className="text-base leading-6 text-[#111827] dark:text-[#E5E7EB] font-normal">
                      Over the last {yearsOfExperience} years, I have partnered
                      with companies to build and scale their data-driven
                      enterprise tools using a story-data approach. My designs
                      translate complex workflows and technical datasets into
                      highly functional, clear user experiences that team
                      members actually love using. I focus on bridging product
                      requirements, operations, and visual clarity to build
                      dashboard and analytics systems that scale.
                    </p>
                  </div>

                  {/* Social Links — icon only, no labels, no borders */}
                  <div className="space-y-4">
                    <p className="text-sm text-[#111827] dark:text-[#E5E7EB] leading-relaxed font-normal">
                      Outside of client work, I enjoy sharing interface
                      explorations and workflow insights online:
                    </p>
                    <div className="flex flex-wrap gap-4">
                      {SOCIAL_LINKS.map((link) => (
                        <a
                          key={link.id}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-neutral-400 dark:text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors cursor-pointer"
                          aria-label={`Alifia Hamzah on ${link.id.charAt(0).toUpperCase() + link.id.slice(1)}`}
                        >
                          <Icon icon={link.icon} className="w-5 h-5" />
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* Experience, Projects, Volunteer, Education sections */}
                  <div className="space-y-10 w-full">
                    {/* EXPERIENCE */}
                    <div className="space-y-2">
                      <h2 className="text-xs font-semibold tracking-wider text-neutral-400 dark:text-neutral-500 uppercase border-b border-neutral-100 dark:border-neutral-900 pb-2">
                        Experience
                      </h2>
                      <div className="flex flex-col">
                        {EXPERIENCE.map((item, idx) => {
                          const showYear =
                            idx === 0 || EXPERIENCE[idx - 1].year !== item.year;
                          const isRemote =
                            item.location.toLowerCase() === "remote";
                          const iconName = isRemote
                            ? "proicons:computer"
                            : "twemoji:flag-indonesia";
                          const itemContent = (
                            <div className="group grid grid-cols-[60px_1fr] sm:grid-cols-[64px_2fr_1.2fr] lg:grid-cols-[80px_2.2fr_1.3fr] py-3 border-b border-neutral-100/50 dark:border-neutral-900/50 cursor-pointer gap-x-3 gap-y-1 sm:gap-4 items-start sm:items-center">
                              <span className="text-sm font-mono text-neutral-400 dark:text-neutral-600 col-start-1 col-span-1">
                                {showYear ? item.year : ""}
                              </span>
                              <div className="col-start-2 col-span-1 flex items-center gap-2.5 min-w-0 transition-all duration-300 group-hover:pl-4">
                                {item.logo && (
                                  <div className="w-5 h-5 rounded overflow-hidden shrink-0 flex items-center justify-center bg-neutral-100 dark:bg-neutral-800">
                                    <img
                                      src={item.logo}
                                      alt={item.company}
                                      className="w-full h-full object-contain"
                                    />
                                  </div>
                                )}
                                <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 transition-colors duration-200 group-hover:text-neutral-950 dark:group-hover:text-white">
                                  {item.role}
                                </span>
                              </div>
                              <div className="col-start-2 sm:col-start-3 col-span-1 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 sm:text-right flex items-center justify-start sm:justify-end gap-1.5">
                                <span>{item.company}</span>
                                <span className="text-neutral-300 dark:text-neutral-700 hidden sm:inline">
                                  ·
                                </span>
                                <div className="group/tooltip relative flex items-center justify-center w-[12px] h-[12px] shrink-0">
                                  <Icon
                                    icon={iconName}
                                    className="w-3.5 h-3.5"
                                  />
                                  <span className="pointer-events-none absolute -top-1.5 left-1/2 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-md bg-neutral-900 dark:bg-neutral-100 px-2 py-1 text-[10px] leading-tight text-white dark:text-neutral-900 opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-150 shadow-lg z-50">
                                    {item.location}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );

                          return item.link ? (
                            <a
                              href={item.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              key={idx}
                              className="block no-underline"
                            >
                              {itemContent}
                            </a>
                          ) : (
                            <div key={idx} className="block">
                              {itemContent}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* PROJECTS */}
                    <div className="space-y-2">
                      <h2 className="text-xs font-semibold tracking-wider text-neutral-400 dark:text-neutral-500 uppercase border-b border-neutral-100 dark:border-neutral-900 pb-2">
                        Projects
                      </h2>
                      <div className="flex flex-col">
                        {PROJECTS.map((item, idx) => {
                          const showYear =
                            idx === 0 || PROJECTS[idx - 1].year !== item.year;
                          const status =
                            item.url === "restricted"
                              ? "Restricted"
                              : item.url === "shutdown"
                                ? "Shutdown"
                                : item.url === "stealth"
                                  ? "Stealth"
                                  : "Live";

                          const itemContent = (
                            <div className="group grid grid-cols-[60px_1fr] sm:grid-cols-[64px_2fr_1.2fr] lg:grid-cols-[80px_2.2fr_1.3fr] py-3 border-b border-neutral-100/50 dark:border-neutral-900/50 cursor-pointer gap-x-3 gap-y-1 sm:gap-4 items-start sm:items-center">
                              <span className="text-sm font-mono text-neutral-400 dark:text-neutral-600 col-start-1 col-span-1">
                                {showYear ? item.year : ""}
                              </span>
                              <div className="col-start-2 col-span-1 flex items-center gap-2.5 min-w-0 transition-all duration-300 group-hover:pl-4">
                                {item.logo && (
                                  <div className="w-5 h-5 rounded overflow-hidden shrink-0 flex items-center justify-center bg-neutral-100 dark:bg-neutral-800">
                                    <img
                                      src={item.logo}
                                      alt={item.name}
                                      className="w-full h-full object-contain"
                                    />
                                  </div>
                                )}
                                <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 transition-colors duration-200 group-hover:text-neutral-950 dark:group-hover:text-white">
                                  {item.name}{" "}
                                  <span className="font-normal text-neutral-400 dark:text-neutral-500">
                                    / {item.role}
                                  </span>
                                </span>
                              </div>
                              <div className="col-start-2 sm:col-start-3 col-span-1 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 sm:text-right flex items-center justify-start sm:justify-end gap-1.5 shrink-0">
                                <span>{status}</span>
                                <span
                                  className={`w-1.5 h-1.5 rounded-full ${item.dotColor || "bg-neutral-400"}`}
                                />
                              </div>
                            </div>
                          );

                          return item.link ? (
                            <a
                              href={item.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              key={idx}
                              className="block no-underline"
                            >
                              {itemContent}
                            </a>
                          ) : (
                            <div key={idx} className="block">
                              {itemContent}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* VOLUNTEER */}
                    <div className="space-y-2">
                      <h2 className="text-xs font-semibold tracking-wider text-neutral-400 dark:text-neutral-500 uppercase border-b border-neutral-100 dark:border-neutral-900 pb-2">
                        Volunteer
                      </h2>
                      <div className="flex flex-col">
                        {VOLUNTEER.map((item, idx) => {
                          const showYear =
                            idx === 0 || VOLUNTEER[idx - 1].year !== item.year;
                          const volIsRemote = item.location
                            ? item.location.toLowerCase() === "remote"
                            : false;
                          const volIconName = volIsRemote
                            ? "proicons:computer"
                            : "twemoji:flag-indonesia";
                          const itemContent = (
                            <div className="group grid grid-cols-[60px_1fr] sm:grid-cols-[64px_2fr_1.2fr] lg:grid-cols-[80px_2.2fr_1.3fr] py-3 border-b border-neutral-100/50 dark:border-neutral-900/50 cursor-pointer gap-x-3 gap-y-1 sm:gap-4 items-start sm:items-center">
                              <span className="text-sm font-mono text-neutral-400 dark:text-neutral-600 col-start-1 col-span-1">
                                {showYear ? item.year : ""}
                              </span>
                              <div className="col-start-2 col-span-1 flex items-center gap-2.5 min-w-0 transition-all duration-300 group-hover:pl-4">
                                {item.logo && (
                                  <div className="w-5 h-5 rounded overflow-hidden shrink-0 flex items-center justify-center bg-neutral-100 dark:bg-neutral-800">
                                    <img
                                      src={item.logo}
                                      alt={item.org}
                                      className="w-full h-full object-contain"
                                    />
                                  </div>
                                )}
                                <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 transition-colors duration-200 group-hover:text-neutral-950 dark:group-hover:text-white">
                                  {item.role}
                                </span>
                              </div>
                              <div className="col-start-2 sm:col-start-3 col-span-1 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 sm:text-right flex items-center justify-start sm:justify-end gap-1.5">
                                <span>{item.org}</span>
                                {item.location && (
                                  <>
                                    <span className="text-neutral-300 dark:text-neutral-700 hidden sm:inline">
                                      ·
                                    </span>
                                    <div className="group/tooltip relative flex items-center justify-center w-[12px] h-[12px] shrink-0">
                                      <Icon
                                        icon={volIconName}
                                        className="w-3.5 h-3.5"
                                      />
                                      <span className="pointer-events-none absolute -top-1.5 left-1/2 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-md bg-neutral-900 dark:bg-neutral-100 px-2 py-1 text-[10px] leading-tight text-white dark:text-neutral-900 opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-150 shadow-lg z-50">
                                        {item.location}
                                      </span>
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                          );

                          return item.link ? (
                            <a
                              href={item.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              key={idx}
                              className="block no-underline"
                            >
                              {itemContent}
                            </a>
                          ) : (
                            <div key={idx} className="block">
                              {itemContent}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* EDUCATION */}
                    <div className="space-y-2">
                      <h2 className="text-xs font-semibold tracking-wider text-neutral-400 dark:text-neutral-500 uppercase border-b border-neutral-100 dark:border-neutral-900 pb-2">
                        Education
                      </h2>
                      <div className="flex flex-col">
                        {EDUCATION.map((item, idx) => {
                          const showYear =
                            idx === 0 || EDUCATION[idx - 1].year !== item.year;
                          const itemContent = (
                            <div className="group grid grid-cols-[60px_1fr] sm:grid-cols-[64px_2fr_1.2fr] lg:grid-cols-[80px_2.2fr_1.3fr] py-3 border-b border-neutral-100/50 dark:border-neutral-900/50 cursor-pointer gap-x-3 gap-y-1 sm:gap-4 items-start sm:items-center">
                              <span className="text-sm font-mono text-neutral-400 dark:text-neutral-600 col-start-1 col-span-1">
                                {showYear ? item.year : ""}
                              </span>
                              <div className="col-start-2 col-span-1 flex items-center gap-2.5 min-w-0 transition-all duration-300 group-hover:pl-4">
                                {item.logo && (
                                  <div className="w-5 h-5 rounded overflow-hidden shrink-0 flex items-center justify-center bg-neutral-100 dark:bg-neutral-800">
                                    <img
                                      src={item.logo}
                                      alt={item.school}
                                      className="w-full h-full object-contain"
                                    />
                                  </div>
                                )}
                                <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 transition-colors duration-200 group-hover:text-neutral-950 dark:group-hover:text-white">
                                  {item.degree}
                                </span>
                              </div>
                              <div className="col-start-2 sm:col-start-3 col-span-1 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 sm:text-right flex items-center justify-start sm:justify-end gap-1.5">
                                <span>{item.school}</span>
                                <span className="text-neutral-300 dark:text-neutral-700 hidden sm:inline">
                                  ·
                                </span>
                                <span>{item.gpa}</span>
                              </div>
                            </div>
                          );

                          return item.link ? (
                            <a
                              href={item.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              key={idx}
                              className="block no-underline"
                            >
                              {itemContent}
                            </a>
                          ) : (
                            <div key={idx} className="block">
                              {itemContent}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  {/* Community Section */}
                  <div className="space-y-5 w-full">
                    <p className="text-sm leading-relaxed font-normal">
                      I enjoy engaging with the wider design and developer
                      community, discussing workflow solutions, and sharing
                      insights about enterprise product design.
                    </p>
                    <div className="flex flex-row md:justify-center justify-start items-center -space-x-8 md:-space-x-12 pt-16 pb-12 w-full overflow-x-auto md:overflow-x-visible select-none scrollbar-none px-10 md:px-0">
                      {COMMUNITY_PHOTOS.map((photo) => (
                        <div
                          key={photo.id}
                          className={`group relative flex-shrink-0 w-[145px] sm:w-[155px] md:w-[165px] bg-white dark:bg-zinc-900 border border-neutral-200/80 dark:border-zinc-800 rounded-sm p-2 pb-8 sm:p-2.5 sm:pb-10 md:p-3 md:pb-12 shadow-md hover:shadow-xl dark:shadow-black/40 transition-all duration-300 ease-out cursor-pointer hover:scale-[1.05] hover:-translate-y-3 hover:z-30 ${photo.rotation}`}
                        >
                          {/* Bubble Chat Tooltip */}
                          <div className="absolute bottom-[104%] left-1/2 -translate-x-1/2 opacity-0 translate-y-1 pointer-events-none transition-all duration-250 group-hover:opacity-100 group-hover:translate-y-0 z-50 select-none">
                            <div className="relative bg-white dark:bg-zinc-800 text-neutral-800 dark:text-zinc-100 text-[10px] sm:text-xs font-semibold px-3 py-1.5 rounded-full border border-neutral-200 dark:border-zinc-700/80 shadow-md dark:shadow-black/50 whitespace-nowrap">
                              {photo.label}
                              {/* Triangle pointer */}
                              <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[5px] w-2.5 h-2.5 rotate-45 bg-white dark:bg-zinc-800 border-r border-b border-neutral-200 dark:border-zinc-700/80" />
                            </div>
                          </div>

                          {/* Polaroid Image Box */}
                          <div className="w-full aspect-square overflow-hidden bg-neutral-50 dark:bg-zinc-950 border border-neutral-100 dark:border-zinc-800/60 rounded-[1px]">
                            <img
                              src={photo.src}
                              alt={photo.alt}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          </div>
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
                            "0px 0px 60px 30px rgb(255 255 255 / 25%), 0 0 100px 60px rgb(0 0 0 / 25%), 0 0 140px 90px rgb(0 0 0 / 25%)",
                        }}
                        size={100}
                        duration={4}
                      />
                      <blockquote className="space-y-5 relative z-10">
                        <p className="text-lg sm:text-xl text-neutral-700 dark:text-neutral-200 leading-relaxed font-normal pb-8">
                          "Complex data shouldn't mean complex design. I
                          specialize in stripping away the clutter to build
                          enterprise tools that are intuitive, scalable, and
                          genuinely helpful."
                        </p>
                        <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed font-normal">
                          If you're looking for a design partner to simplify
                          complex workflows and build tools that scale, let's
                          collaborate.
                        </p>
                        <footer>
                          <cite
                            className="not-italic text-xl sm:text-xl text-neutral-900 dark:text-white tracking-wide"
                            style={{ fontFamily: '"Playwrite NZ", cursive' }}
                          >
                            Alifia Hamzah
                          </cite>
                        </footer>
                      </blockquote>
                    </div>
                  </Tilt>

                  {/* Download buttons */}
                  <div className="space-y-4 w-full">
                    <p className="text-[13px] text-neutral-700 dark:text-zinc-200">
                      For a more detailed look at my experience, work history,
                      and achievements:
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <a
                        href="https://drive.google.com/file/d/1Y18tRL9FbpHFL5zpf5dDPMmcg2WxcNoH/view?usp=sharing"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold bg-[#1A1A1A] dark:bg-white text-white dark:text-black hover:opacity-95 transition-all active:scale-95 shadow-[0px_2px_10px_0px_rgba(0,0,0,0.05)] cursor-pointer"
                      >
                        <Icon
                          icon="solar:download-square-bold"
                          className="w-4 h-4"
                        />
                        <RollingText>Read Resume</RollingText>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Column 2: Right Sidebar (below intro on mobile) */}
                <div className="border-t lg:border-t-0 lg:border-l border-attio-border-light dark:border-attio-border-dark pb-7">
                  <div className="sticky top-[60px] divide-y divide-attio-border-light dark:divide-attio-border-dark">
                    {/* Ask AI Section */}
                    <div className="p-5">
                      <div className="p-4 bg-neutral-50 dark:bg-zinc-900/40 border border-attio-border-light dark:border-attio-border-dark rounded-2xl font-sans shadow-sm w-full space-y-3">
                        {/* Dynamic Prompt Box */}
                        <a
                          href={selectedAI.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2.5 px-4 py-3 bg-white dark:bg-zinc-950 border border-neutral-200/80 dark:border-zinc-800/80 rounded-xl shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] w-full select-none cursor-pointer transition-all hover:border-neutral-300 dark:hover:border-zinc-700 active:scale-[0.98]"
                        >
                          <Icon
                            icon="lucide:sparkles"
                            className="w-4 h-4 text-blue-500 shrink-0"
                          />
                          <span className="text-sm font-medium text-neutral-800 dark:text-zinc-200 truncate">
                            Ask {selectedAI.label} if Hamzah is worth hiring
                          </span>
                        </a>

                        {/* Bottom Actions Row */}
                        <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row lg:items-stretch xl:items-center justify-between w-full gap-2.5 relative">
                          {/* Dropdown Selector */}
                          <div className="relative w-full sm:w-auto lg:w-full xl:w-auto">
                            <button
                              type="button"
                              onClick={() => setDropdownOpen(!dropdownOpen)}
                              className="flex items-center justify-between sm:justify-start gap-1.5 px-3 h-[46px] w-full sm:w-auto lg:w-full xl:w-auto rounded-xl bg-neutral-200/50 dark:bg-zinc-800 border border-neutral-300/30 dark:border-zinc-700/50 text-[#545454] dark:text-neutral-300 text-sm font-semibold hover:bg-neutral-200 dark:hover:bg-zinc-700 transition-all cursor-pointer select-none"
                            >
                              <div className="flex items-center gap-1.5">
                                <Icon
                                  icon={selectedAI.icon}
                                  className="w-3.5 h-3.5 shrink-0"
                                />
                                <span>{selectedAI.label}</span>
                              </div>
                              <Icon
                                icon="lucide:chevrons-up-down"
                                className="w-3 h-3 text-neutral-400 dark:text-neutral-500"
                              />
                            </button>

                            {dropdownOpen && (
                              <>
                                <div
                                  className="fixed inset-0 z-40"
                                  onClick={() => setDropdownOpen(false)}
                                />
                                <div className="absolute top-full left-0 mt-1.5 z-50 w-full md:min-w-[150px] bg-white dark:bg-zinc-950 border border-neutral-200 dark:border-zinc-800 rounded-xl shadow-xl p-1 animate-in fade-in slide-in-from-top-1 duration-150">
                                  {AI_OPTIONS.map((opt) => (
                                    <button
                                      key={opt.id}
                                      type="button"
                                      onClick={() => {
                                        setSelectedAI(opt);
                                        setDropdownOpen(false);
                                      }}
                                      className={`w-full flex items-center justify-between px-2.5 py-2 text-left text-xs rounded-lg transition-colors cursor-pointer ${
                                        selectedAI.id === opt.id
                                          ? "bg-neutral-100 dark:bg-zinc-800 text-neutral-900 dark:text-white font-semibold"
                                          : "text-[#545454] dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-zinc-900"
                                      }`}
                                    >
                                      <div className="flex items-center gap-2">
                                        <Icon
                                          icon={opt.icon}
                                          className="w-3.5 h-3.5 shrink-0"
                                        />
                                        <span>{opt.label}</span>
                                      </div>
                                      {selectedAI.id === opt.id && (
                                        <Icon
                                          icon="lucide:check"
                                          className="w-3.5 h-3.5 text-neutral-800 dark:text-neutral-200"
                                        />
                                      )}
                                    </button>
                                  ))}
                                </div>
                              </>
                            )}
                          </div>

                          {/* Execute Button */}
                          <div className="flex justify-end w-full sm:w-auto lg:w-full xl:w-auto">
                            <Button
                              asChild
                              className="btn-radius-lg h-[46px] w-full sm:w-auto lg:w-full xl:w-auto px-4 font-semibold text-white dark:text-[#111827]"
                              variant="primary"
                            >
                              <a
                                href={selectedAI.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full text-center"
                              >
                                <RollingText>Ask AI</RollingText>
                              </a>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Testimonials Section — rolling */}
                    <div className="p-5 space-y-5">
                      <p className="text-sm text-neutral-800 dark:text-neutral-200 leading-relaxed font-normal">
                        Here's what working together has been like for some of
                        my clients.
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
