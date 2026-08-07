import React, { useState, useEffect, useRef } from "react";
import { useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { RollingText } from "./magicui/RollingText";
import { RainbowButton } from "./ui/rainbow-button";
import { SlidingNumber } from "./core/sliding-number";
import LetsTalkModal from "./LetsTalkModal";
import DynamicWeight from "./DynamicWeight";
import AsciiBackground from "./AsciiBackground";

export default function FooterReveal() {
  const { theme } = useTheme();
  const location = useLocation();
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const containerRef = useRef(null);

  const [isTallScreen, setIsTallScreen] = useState(true);

  useEffect(() => {
    const checkHeight = () => {
      setIsTallScreen(window.innerHeight >= 800);
    };
    checkHeight();
    window.addEventListener("resize", checkHeight);
    return () => window.removeEventListener("resize", checkHeight);
  }, []);

  const nonStickyPaths = ["/work", "/exploration"];
  const isStickyPage =
    !nonStickyPaths.some((p) => location.pathname.startsWith(p)) &&
    isTallScreen;

  // Realtime Bandung Clock
  const [clockHours, setClockHours] = useState(0);
  const [clockMinutes, setClockMinutes] = useState(0);
  const [clockSeconds, setClockSeconds] = useState(0);
  const [clockLabel, setClockLabel] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      const dayName = days[now.getDay()];

      const hour = now.getHours();
      let period = "evening";
      if (hour >= 5 && hour < 12) period = "morning";
      else if (hour >= 12 && hour < 18) period = "afternoon";

      setClockHours(now.getHours());
      setClockMinutes(now.getMinutes());
      setClockSeconds(now.getSeconds());
      setClockLabel(
        `${dayName} ${period.charAt(0).toUpperCase() + period.slice(1)}`,
      );
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <footer
        ref={containerRef}
        className={`relative z-10 w-full h-auto bg-[#FAFAFB] dark:bg-[#080809] text-attio-text-primary-light dark:text-attio-text-primary-dark flex flex-col justify-between border-t border-attio-border-light dark:border-attio-border-dark transition-colors duration-300 ${isStickyPage ? "lg:sticky bottom-0 lg:z-0 lg:h-screen lg:overflow-hidden" : ""}`}
      >
        {/* Part 1: Top Hero Sign Section — Attio Globe Reference Structure */}
        <div
          className={`max-w-[1440px] w-full mx-auto px-0 lg:px-6 flex-1 flex flex-col justify-between ${isStickyPage ? "lg:overflow-hidden" : ""}`}
        >
          {/* Container: centered text and ASCII portrait background */}
          <div className="relative flex-1 min-h-[550px] lg:min-h-[640px] flex flex-col items-center justify-start lg:justify-center overflow-hidden border-l-0 border-r-0 lg:border-l lg:border-r border-attio-border-light dark:border-attio-border-dark bg-[#FAFAFB] dark:bg-[#080809]">
            {/* ASCII Braille Background Filter */}
            <div className="absolute inset-0 z-0 pointer-events-auto opacity-75 dark:opacity-20">
              <AsciiBackground
                imageSrc="/images/general/footer_acsii.webp"
                className="invert grayscale dark:invert-0 dark:grayscale-0"
              />
            </div>

            {/* Title Section */}
            <div className="relative z-20 w-full flex flex-col items-center justify-start justify-center text-center p-0 pointer-events-none my-0 my-auto">
              <div className="space-y-[24px] pointer-events-auto flex flex-col items-center">
                <h2 className="text-[30px] sm:text-[36px] lg:text-[64px] leading-tight text-neutral-900 dark:text-white flex flex-col items-center">
                  <span className="block font-geist-regular">
                    Less distraction,
                  </span>
                  <DynamicWeight
                    label="More execution."
                    fromWeight={500}
                    toWeight={700}
                    strength={40}
                    transition={{
                      type: "tween",
                      duration: 0.3,
                      ease: "easeOut",
                    }}
                    className="block font-sans text-[30px] sm:text-[36px] lg:text-[64px] leading-tight tracking-tight text-neutral-900 dark:text-white"
                  />
                </h2>
                <RainbowButton
                  onClick={() => setIsContactModalOpen(true)}
                  className="px-6 text-base font-semibold btn-radius-lg"
                  style={{ height: "46px" }}
                >
                  <RollingText>Let's Talk</RollingText>
                </RainbowButton>
              </div>
            </div>
          </div>
        </div>

        {/* Part 2: Separate Full-Width Section for Sitemap Cards Grid & Bottom Metadata Bar */}
        <div className="w-full border-t border-attio-border-light dark:border-attio-border-dark bg-[#FAFAFB] dark:bg-[#080809] transition-colors duration-300 relative z-10 flex-shrink-0">
          <div className="max-w-[1440px] w-full mx-auto px-0 lg:px-6">
            <div className="border-l-0 border-r-0 lg:border-l lg:border-r border-attio-border-light dark:border-attio-border-dark">
              {/* Middle Sitemap Cards Grid (No gap/padding, no border radius, border-t only on < md) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-0 p-0 py-0 px-0 border-b border-attio-border-light dark:border-attio-border-dark">
                {/* Card 1: NAVIGATE */}
                <div className="flex flex-col space-y-4 p-6 sm:p-8 rounded-none border-t md:border-t-0 border-b md:border-b-0 md:border-r border-attio-border-light dark:border-attio-border-dark bg-white/40 dark:bg-zinc-900/30 backdrop-blur-sm">
                  <span className="text-sm font-semibold tracking-wider uppercase text-neutral-400 dark:text-neutral-500">
                    NAVIGATE
                  </span>
                  <div className="flex flex-col space-y-2.5">
                    <Link
                      to="/"
                      className="text-sm font-medium text-neutral-900 dark:text-white hover:text-neutral-500 dark:hover:text-neutral-400 transition-colors py-0.5"
                    >
                      <RollingText>Home</RollingText>
                    </Link>
                    <Link
                      to="/about"
                      className="text-sm font-medium text-neutral-900 dark:text-white hover:text-neutral-500 dark:hover:text-neutral-400 transition-colors py-0.5"
                    >
                      <RollingText>About</RollingText>
                    </Link>
                    <Link
                      to="/work"
                      className="text-sm font-medium text-neutral-900 dark:text-white hover:text-neutral-500 dark:hover:text-neutral-400 transition-colors py-0.5"
                    >
                      <RollingText>Work</RollingText>
                    </Link>
                    <Link
                      to="/exploration"
                      className="text-sm font-medium text-neutral-900 dark:text-white hover:text-neutral-500 dark:hover:text-neutral-400 transition-colors py-0.5"
                    >
                      <RollingText>Exploration</RollingText>
                    </Link>
                  </div>
                </div>

                {/* Card 2: SOCIAL */}
                <div className="flex flex-col space-y-4 p-6 sm:p-8 rounded-none border-t md:border-t-0 border-b md:border-b-0 md:border-r border-attio-border-light dark:border-attio-border-dark bg-white/40 dark:bg-zinc-900/30 backdrop-blur-sm">
                  <span className="text-sm font-semibold tracking-wider uppercase text-neutral-400 dark:text-neutral-500">
                    SOCIAL
                  </span>
                  <div className="flex flex-col space-y-2.5">
                    <a
                      href="https://linkedin.com/in/alifiahamzah"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-neutral-900 dark:text-white hover:text-neutral-500 dark:hover:text-neutral-400 transition-colors py-0.5"
                    >
                      <RollingText>LinkedIn</RollingText>
                    </a>
                    <a
                      href="https://www.threads.com/@hamzahalifia"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-neutral-900 dark:text-white hover:text-neutral-500 dark:hover:text-neutral-400 transition-colors py-0.5"
                    >
                      <RollingText>Threads</RollingText>
                    </a>
                    <a
                      href="https://x.com/hamzahalifia"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-neutral-900 dark:text-white hover:text-neutral-500 dark:hover:text-neutral-400 transition-colors py-0.5"
                    >
                      <RollingText>X</RollingText>
                    </a>
                    <a
                      href="https://instagram.com/hamzahalifia"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-neutral-900 dark:text-white hover:text-neutral-500 dark:hover:text-neutral-400 transition-colors py-0.5"
                    >
                      <RollingText>Instagram</RollingText>
                    </a>
                  </div>
                </div>

                {/* Card 3: WORK CASE STUDIES */}
                <div className="flex flex-col space-y-4 p-6 sm:p-8 rounded-none border-t md:border-t-0 border-attio-border-light dark:border-attio-border-dark bg-white/40 dark:bg-zinc-900/30 backdrop-blur-sm">
                  <span className="text-sm font-semibold tracking-wider uppercase text-neutral-400 dark:text-neutral-500">
                    WORK
                  </span>
                  <div className="flex flex-col space-y-2.5">
                    <Link
                      to="/work/how-automation-cut-processing-time-by-96-point-83-persent-for-a-japanese-fnb-giant"
                      className="text-sm font-medium text-neutral-900 dark:text-white hover:text-neutral-500 dark:hover:text-neutral-400 transition-colors py-0.5"
                    >
                      <RollingText>Amigos Group</RollingText>
                    </Link>
                    <Link
                      to="/work/boosted-operational-efficiency-by-40-percent-in-door-v3-timeshift-management"
                      className="text-sm font-medium text-neutral-900 dark:text-white hover:text-neutral-500 dark:hover:text-neutral-400 transition-colors py-0.5"
                    >
                      <RollingText>DOOR V3</RollingText>
                    </Link>
                    <Link
                      to="/work/rebalancing-a-two-sided-marketplace-a-conceptual-ux-audit--landing-page-redesign-for-kontencom"
                      className="text-sm font-medium text-neutral-900 dark:text-white hover:text-neutral-500 dark:hover:text-neutral-400 transition-colors py-0.5"
                    >
                      <RollingText>Konten</RollingText>
                    </Link>
                    <Link
                      to="/work/a-failure-analysis-and-iteration-strategy-for-jaga-sehat-telemedicine-flow"
                      className="text-sm font-medium text-neutral-900 dark:text-white hover:text-neutral-500 dark:hover:text-neutral-400 transition-colors py-0.5"
                    >
                      <RollingText>Jaga Sehat</RollingText>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Bottom Metadata Bar (Timezone & Copyright) */}
              <div className="py-6 px-6 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
                <div className="flex flex-col items-center sm:items-start space-y-1 text-center sm:text-left">
                  <span className="font-normal text-neutral-900 dark:text-white">
                    Based in Bandung, Indonesia
                  </span>
                  <span className="font-mono text-neutral-500 dark:text-neutral-400 flex flex-wrap items-center justify-center sm:justify-start gap-1">
                    <span>{clockLabel || "Loading..."},</span>
                    <span className="inline-flex items-center">
                      <SlidingNumber value={clockHours} padStart={true} />
                      <span className="text-neutral-400 dark:text-neutral-500">
                        :
                      </span>
                      <SlidingNumber value={clockMinutes} padStart={true} />
                      <span className="text-neutral-400 dark:text-neutral-500">
                        :
                      </span>
                      <SlidingNumber value={clockSeconds} padStart={true} />
                    </span>
                    <span>(GMT+7)</span>
                  </span>
                </div>

                <span className="text-neutral-900 dark:text-white font-normal text-center sm:text-right">
                  Hamzah Design © {new Date().getFullYear()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Lets Talk Contact Modal */}
      <LetsTalkModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
    </>
  );
}
