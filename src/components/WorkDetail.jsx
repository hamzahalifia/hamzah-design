import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import Navbar from './Navbar';
import FooterReveal from './FooterReveal';
import { RollingText } from './magicui/RollingText';
import PageMeta from './SEO/PageMeta';

export const CASE_STUDIES = {};

const isVideo = (url) => url && (url.toLowerCase().endsWith('.mp4') || url.toLowerCase().includes('.mp4'));

const renderTechIcon = (tech) => {
  if (tech.icon === 'custom-pixi') {
    return (
      <svg viewBox="80 190 65 130" className="w-[18px] h-[18px] sm:w-5 sm:h-5 flex-shrink-0" fill="#EA1E63">
        <path d="M177.1,222.4c8.2,0,13.5-5.6,13.5-12.5c-0.2-7.3-5.3-12.7-13.4-12.7s-13.4,5.4-13.2,12.7 C163.9,216.8,169.2,222.4,177.1,222.4z"/>
        <path d="M276.7,197.2c-8.1,0-13.4,5.4-13.2,12.7c-0.2,6.9,5.1,12.5,13,12.5c8.3,0,13.5-5.6,13.5-12.5 C289.9,202.6,284.8,197.2,276.7,197.2z"/>
        <path d="M264.1,232.3h-22.6l-7.1,13c-2.1,4-4.1,8.1-6.3,12.4h-0.3c-2.1-3.8-4.3-7.9-6.6-12l-7.9-13.4h-45.8 c-0.7-8.8-4.9-16.9-11.7-22.4c-7.4-5.9-18.5-8.9-34-8.9c-15.3,0-26.2,1-34,2.3V313h24.9v-39.8c2.8,0.4,5.7,0.5,8.6,0.5 c14.9,0,27.6-3.6,36.1-11.7c3.2-3.1,5.7-6.8,7.3-10.9V313h47.4l7.6-14.5c2-4,4.1-7.9,6.1-12.2h0.5c2,4.1,4,8.2,6.3,12.2l8.1,14.5 h48.5v-80.7H264.1z M121.1,254.4c-2.8,0.1-5.6-0.1-8.4-0.7v-32.8c3.4-0.8,6.9-1.1,10.4-1c12.6,0,19.6,6.1,19.6,16.3 C142.7,247.7,134.4,254.4,121.1,254.4L121.1,254.4z M189.9,305.2v-66.1l22.2,32.8L189.9,305.2z M242.2,270.8l21.9-31.7v66.2 L242.2,270.8z"/>
        <path d="M395.4,247c-14.4-5.4-20.6-8.6-20.6-15.7c0-5.8,5.3-10.7,16.2-10.7c8.1,0,16,1.8,23.3,5.3l5.6-20.3 c-6.6-3-15.8-5.6-28.4-5.6c-23.1,0-38.1,11.2-41.4,26.9v-25.1h-25.1v70c0,17.3-6.6,22.1-17.2,22.1c-4.4,0-8.7-0.7-12.9-2l-2.8,20.3 c5.9,1.7,12.1,2.6,18.3,2.6c24.4,0,39.6-11.1,39.6-42.7v-32.3c2.8,12.6,13.9,21,29.9,26.5c13.4,4.8,18.6,8.7,18.6,15.7 c0,7.3-6.1,12-17.7,12c-9.7-0.2-19.2-2.5-27.9-6.9l-5.1,20.8c6.3,3.5,18.8,6.8,31.5,6.8c30.5,0,44.9-15.8,44.9-34.5 C424.2,264.5,415,254.3,395.4,247z"/>
      </svg>
    );
  }
  if (tech.icon === 'custom-motion') {
    return (
      <svg viewBox="0 0 25.364 9" className="w-[18px] h-[18px] sm:w-5 sm:h-5 flex-shrink-0 text-neutral-900 dark:text-neutral-100" fill="currentColor">
        <path d="M 9.587 0 L 4.57 9 L 0 9 L 3.917 1.972 C 4.524 0.883 6.039 0 7.301 0 Z M 20.794 2.25 C 20.794 1.007 21.817 0 23.079 0 C 24.341 0 25.364 1.007 25.364 2.25 C 25.364 3.493 24.341 4.5 23.079 4.5 C 21.817 4.5 20.794 3.493 20.794 2.25 Z M 10.443 0 L 15.013 0 L 9.997 9 L 5.427 9 Z M 15.841 0 L 20.411 0 L 16.494 7.028 C 15.887 8.117 14.372 9 13.11 9 L 10.825 9 Z" />
      </svg>
    );
  }
  return (
    <Icon 
      icon={tech.icon} 
      className={`w-[18px] h-[18px] sm:w-5 sm:h-5 flex-shrink-0 ${
        tech.color === 'currentColor' 
          ? 'text-neutral-950 dark:text-white' 
          : ''
      }`} 
      style={tech.color && tech.color !== 'currentColor' ? { color: tech.color } : undefined} 
    />
  );
};

export default function WorkDetail() {
  const { workId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    async function fetchDetail() {
      setLoading(true);
      try {
        const response = await fetch('/api/works');
        if (response.ok) {
          const list = await response.json();
          // Find by slug
          const match = list.find((w) => w.slug === workId) || list[0];
          setData(match);
        }
      } catch (err) {
        console.error("Gagal mengambil detail case study:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchDetail();
  }, [workId]);

  useEffect(() => {
    if (!data) return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;

      let currentSection = '';
      for (const section of data.sections || []) {
        const el = document.getElementById(section.id);
        if (el) {
          const top = el.offsetTop;
          if (scrollPosition >= top) {
            currentSection = section.id;
          }
        }
      }
      setActiveSection(currentSection || (data.sections?.[0]?.id || ''));
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [data]);

  const scrollToSection = (e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      const offset = 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      window.history.pushState(null, '', `#${id}`);
    }
  };

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0A0A0B] text-attio-text-primary-light dark:text-attio-text-primary-dark flex flex-col justify-between">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-3">
          <Icon icon="svg-spinners:180-ring" className="w-8 h-8 text-neutral-500" />
          <span className="text-sm font-medium">Memuat case study...</span>
        </div>
        <FooterReveal />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0A0B] text-attio-text-primary-light dark:text-attio-text-primary-dark flex flex-col justify-between">
      {data && (
        <PageMeta
          title={`${data.title} — Alifia Hamzah`}
          description={data.desc || `Case study: ${data.title} by Alifia Hamzah, Product Designer.`}
          keywords={`${data.category || 'case study'}, product design, UI/UX, ${data.company || ''}, Alifia Hamzah`}
          ogImage={data.heroImage || '/images/general/profilephoto.webp'}
          canonical={`https://hamzah.design/work/${data.slug}`}
          schema={data ? {
            "@context": "https://schema.org",
            "@type": "TechArticle",
            "headline": data.title,
            "description": data.desc,
            "image": data.heroImage ? (data.heroImage.startsWith('http') ? data.heroImage : `https://hamzah.design${data.heroImage.startsWith('/') ? '' : '/'}${data.heroImage}`) : undefined,
            "datePublished": data.year ? `${data.year}-01-01` : undefined,
            "author": {
              "@type": "Person",
              "name": "Alifia Hamzah",
              "url": "https://hamzah.design"
            },
            "publisher": {
              "@type": "Person",
              "name": "Alifia Hamzah",
              "url": "https://hamzah.design"
            },
            "mainEntityOfPage": `https://hamzah.design/work/${data.slug}`
          } : undefined}
        />
      )}
      <Navbar />

      <main className="relative z-10 bg-white dark:bg-[#0A0A0B] flex-1 border-b border-attio-border-light dark:border-attio-border-dark transition-colors duration-300">
        <div className="max-w-[1440px] mx-auto px-0 lg:px-6">
          <div className="border-l-0 border-r-0 lg:border-l lg:border-r border-attio-border-light dark:border-attio-border-dark min-h-full bg-white dark:bg-[#0A0A0B]">
            
            {/* Center Bounded content layout matching Attio Blog Detail page styling */}
            <div className="w-full py-12 md:py-16">

              {/* Topmost Header Meta Row */}
              <div className="px-8 sm:px-12 lg:px-16 xl:px-20 pb-4 border-b border-dashed border-neutral-200 dark:border-neutral-800 text-[11px] font-bold tracking-widest text-neutral-400 dark:text-neutral-500 uppercase select-none">
                <div className="flex justify-between items-center">
                  <span>WORK / {data.category}</span>
                  <span>{data.readingTime}</span>
                </div>
              </div>

              {/* Back Button & Logo Row */}
              <div className="px-8 sm:px-12 lg:px-16 xl:px-20 pt-8 flex items-center gap-4 pb-2">
                <Link
                  to="/work"
                  className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-all border border-attio-border-light dark:border-attio-border-dark cursor-pointer shadow-attio-sm"
                  aria-label="Back to Work"
                >
                  <Icon icon="solar:alt-arrow-left-linear" className="w-4.5 h-4.5" />
                </Link>
                {data.logo && (
                  <div className="h-10 sm:h-12 w-auto flex items-center justify-center">
                    <img
                      src={data.logo}
                      alt={`${data.company || 'Company'} logo`}
                      className="h-7 sm:h-8 w-auto object-contain dark:grayscale dark:invert"
                    />
                  </div>
                )}
              </div>

              {/* Title & Author Block */}
              <div className="px-8 sm:px-12 lg:px-16 xl:px-20 pt-4 pb-8 space-y-6 border-b border-neutral-100 dark:border-neutral-800/60">
                <div className="relative pl-0">
                  <h1 className="font-serif-attio text-3xl sm:text-4xl lg:text-[46px] font-semibold leading-tight tracking-tight text-[#111827] dark:text-white">
                    {data.title}
                  </h1>
                </div>
                <div className="flex items-center gap-3">
                  <img
                    src="/images/general/profilephoto.webp"
                    alt="Alifia Hamzah"
                    className="w-8 h-8 rounded-full object-cover border border-neutral-200 dark:border-neutral-800/60"
                  />
                  <div className="text-sm font-normal text-neutral-700 dark:text-neutral-300">
                    <span className="font-semibold text-neutral-900 dark:text-white">Alifia Hamzah</span>
                    <span className="text-neutral-400 dark:text-neutral-500 mx-2">•</span>
                    <span className="text-neutral-500 dark:text-neutral-400 font-light">Product Designer</span>
                  </div>
                </div>
              </div>

              {/* 2-Column Responsive Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] w-full">
                
                {/* Column 2: Table of Contents (Swaps to top position under lg size) */}
                <div className="pl-8 pr-8 sm:pl-12 sm:pr-12 lg:pl-12 lg:pr-16 xl:pr-20 py-8 border-b lg:border-b-0 lg:border-l border-neutral-100 dark:border-neutral-900 pb-6 lg:pb-8 mb-6 lg:mb-0 lg:order-2">
                  <div className="sticky top-24 space-y-4">
                    <h4 className="text-[11px] font-bold text-neutral-400 dark:text-neutral-500 tracking-widest uppercase">
                      Table of Contents
                    </h4>
                    <ul className="space-y-3 pl-0">
                      {data.sections?.map((section) => {
                        const isActive = activeSection === section.id;
                        return (
                          <li key={section.id}>
                            <a
                              href={`#${section.id}`}
                              onClick={(e) => scrollToSection(e, section.id)}
                              className={`block text-[13px] transition-colors leading-relaxed ${
                                isActive
                                  ? 'font-semibold text-neutral-900 dark:text-white'
                                  : 'text-neutral-400 dark:text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 font-normal'
                              }`}
                            >
                              {section.title}
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>

                {/* Column 1: Main Case Study Content Area */}
                <div className="pl-8 pr-8 sm:pl-12 sm:pr-12 lg:pl-16 lg:pr-16 xl:pl-20 xl:pr-16 py-8 space-y-10 lg:order-1">
                  
                  {/* 1. Description */}
                  <div className="space-y-6">
                    <p className="text-lg text-neutral-600 dark:text-neutral-300 leading-relaxed font-normal">
                      {data.desc}
                    </p>
                    {data.liveUrl && (
                      <div className="pt-2">
                        <a
                          href={data.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold bg-[#545454] dark:bg-neutral-800 text-white hover:bg-neutral-800 dark:hover:bg-neutral-700 transition-all cursor-pointer shadow-lg shadow-black/10 dark:shadow-none"
                        >
                          <RollingText>View live site</RollingText>
                          <Icon icon="solar:arrow-right-up-linear" className="w-4 h-4" />
                        </a>
                      </div>
                    )}
                  </div>

                  {/* 2. Main Thumbnail (Image or Loop Video without controls) */}
                  <div className="rounded-xl overflow-hidden border border-attio-border-light dark:border-attio-border-dark bg-neutral-100 dark:bg-neutral-900">
                    {isVideo(data.heroImage) ? (
                      <video
                        src={data.heroImage}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-auto object-cover max-h-[520px]"
                      />
                    ) : (
                      <img
                        src={data.heroImage}
                        alt={data.title}
                        className="w-full h-auto object-cover max-h-[520px]"
                      />
                    )}
                  </div>

                  {/* 3. Borderless Details Grid (Company, Design Stack, Industry, Year) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-8 py-6 border-b border-neutral-100 dark:border-neutral-800/60 text-sm sm:text-base">
                    {/* Row 1, Col 1: Company */}
                    <div>
                      <h4 className="text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-2.5">Company</h4>
                      <div className="text-neutral-800 dark:text-neutral-200 font-normal leading-normal">
                        {data.company}
                      </div>
                    </div>

                    {/* Row 1, Col 2: Design Stack */}
                    <div>
                      <h4 className="text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-2.5">Design Stack</h4>
                      <ul className="space-y-2.5 text-neutral-800 dark:text-neutral-200">
                        {data.designStack?.map((tech, idx) => (
                          <li key={idx} className="flex items-center gap-2.5 leading-normal">
                            {renderTechIcon(tech)}
                            <span className="font-normal">{tech.name}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Row 2, Col 1: Industry */}
                    <div>
                      <h4 className="text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-2.5">Industry</h4>
                      <ul className="space-y-2.5 text-neutral-800 dark:text-neutral-200">
                        {data.industry?.map((item, idx) => (
                          <li key={idx} className="font-normal leading-normal">{item}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Row 2, Col 2: Year */}
                    <div>
                      <h4 className="text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-2.5">Year</h4>
                      <div className="text-neutral-800 dark:text-neutral-200 font-normal leading-normal">
                        {data.year}
                      </div>
                    </div>
                  </div>

                  {/* 4. Detailed Case Study Content Sections */}
                  {data.content ? (
                    <div 
                      className="case-study-content text-neutral-700 dark:text-neutral-300 text-[15px] sm:text-base"
                      dangerouslySetInnerHTML={{ __html: data.content }}
                    />
                  ) : (
                    /* Fallback layout for other work cards */
                    <div className="space-y-8 text-neutral-700 dark:text-neutral-300 leading-relaxed text-base pt-4">
                      <div className="space-y-3">
                        <h2 id="overview" className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white pt-6">
                          Overview & Objective
                        </h2>
                        <p>
                          Detailed documentation for this case study is currently being compiled. It explores enterprise user experience optimizations, story-data approaches, and system design token synchronization.
                        </p>
                      </div>
                    </div>
                  )}

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
