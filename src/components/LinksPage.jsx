import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import { toast } from "sonner";
import { useTheme } from "../context/ThemeContext";
import { FlickeringGrid } from "./magicui/FlickeringGrid";
import LetsTalkModal from "./LetsTalkModal";
import { RollingText } from "./magicui/RollingText";
import { RainbowButton } from "@/components/ui/rainbow-button";

const LINKS_DATA = [
  {
    id: "portfolio",
    title: "Personal Portfolio",
    description: "All my latest design projects & work",
    url: "https://hamzah.design",
    isExternal: true,
    icon: "solar:globe-linear",
    badge: "Official Site",
  },
  {
    id: "figma",
    title: "Design Work Portfolio (NDA)",
    description: "Latest design works: WebApps, Mobile, Dashboard",
    url: "https://www.figma.com/design/Dreig7tfuZWJvwwBXxkpyu/Design-Work-Portfolio---%E3%83%87%E3%82%B6%E3%82%A4%E3%83%B3%E3%83%AF%E3%83%BC%E3%82%AF%E3%83%9D%E3%83%BC%E3%83%88%E3%83%95%E3%82%A9%E3%83%AA%E3%82%AA?node-id=0-1&t=fQSXVd2cVQFW43rE-1",
    isExternal: true,
    icon: "solar:figma-linear",
  },
  {
    id: "ui8",
    title: "Onfire Studio on UI8",
    description: "Premium UI kits & digital assets",
    url: "https://ui8.net/users/onfire-studio",
    isExternal: true,
    icon: "solar:shop-linear",
  },
  {
    id: "resume",
    title: "Product Design Resume",
    description: "PDF version of background & experience",
    url: "https://drive.google.com/file/d/1Y18tRL9FbpHFL5zpf5dDPMmcg2WxcNoH/view?usp=sharing",
    isExternal: true,
    icon: "solar:document-text-linear",
  },
  {
    id: "cal",
    title: "Schedule 30-min Call",
    description: "Book a quick call to discuss design projects",
    url: "https://cal.com/alifiahamzah/30min",
    isExternal: true,
    icon: "solar:videocamera-record-linear",
  },
];

const SOCIAL_LINKS = [
  {
    name: "LinkedIn",
    icon: "simple-icons:linkedin",
    url: "https://linkedin.com/in/hamzahalifia",
  },
  {
    name: "Twitter / X",
    icon: "simple-icons:x",
    url: "https://twitter.com/hamzahalifia",
  },
  {
    name: "Dribbble",
    icon: "simple-icons:dribbble",
    url: "https://dribbble.com/hamzahalifia",
  },
  {
    name: "GitHub",
    icon: "simple-icons:github",
    url: "https://github.com/hamzahalifia",
  },
  {
    name: "Email",
    icon: "solar:letter-unread-linear",
    url: "mailto:alifiahamzah@gmail.com",
  },
];

const subscribeToMailchimp = (email) => {
  return new Promise((resolve) => {
    const callbackName = `mc_callback_${Math.random().toString(36).substring(2, 9)}`;
    const baseUrl = "https://design.us22.list-manage.com/subscribe/post-json";
    const queryParams = new URLSearchParams({
      u: "6777235d7d0314785e6ccc737",
      id: "a6c77c304c",
      f_id: "0059c2e1f0",
      EMAIL: email,
      c: callbackName,
    });

    const script = document.createElement("script");
    script.src = `${baseUrl}?${queryParams.toString()}`;

    window[callbackName] = (data) => {
      delete window[callbackName];
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
      resolve(data);
    };

    script.onerror = () => {
      delete window[callbackName];
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
      resolve({ result: "error", msg: "Network error. Please try again." });
    };

    document.body.appendChild(script);
  });
};

export default function LinksPage() {
  const { theme, toggleTheme } = useTheme();
  const isDarkTheme = theme === "dark";
  const [isTalkModalOpen, setIsTalkModalOpen] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!emailInput || !emailInput.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await subscribeToMailchimp(emailInput);
      setIsSubmitting(false);

      if (response.result === "success") {
        setEmailInput("");
        toast.success("Thank you for subscribing! Check your inbox.");
      } else {
        const cleanMsg = response.msg
          ? response.msg.replace(/<[^>]*>?/gm, "").trim()
          : "Subscription failed. Please try again.";
        toast.info(cleanMsg);
      }
    } catch (err) {
      setIsSubmitting(false);
      toast.error("An error occurred. Please try again.");
    }
  };

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText("https://hamzah.design/links");
      toast.success("Link copied to clipboard!");
    } else {
      toast.info("URL: https://hamzah.design/links");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <div className="min-h-screen w-full bg-[#FAF8F5] dark:bg-[#0A0A0B] text-black dark:text-white transition-colors duration-300 relative overflow-x-hidden flex flex-col justify-between selection:bg-neutral-200 dark:selection:bg-neutral-800">
      {/* ── SEO Exclusion Tag ── */}
      <Helmet>
        <title>Links — Alifia Hamzah</title>
        <meta name="robots" content="noindex, nofollow, noarchive" />
        <meta name="googlebot" content="noindex, nofollow" />
      </Helmet>

      {/* ── Background Flickering Grid Pattern ── */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden [mask-image:radial-gradient(600px_circle_at_center,white,transparent)]">
        <FlickeringGrid
          squareSize={4}
          gridGap={6}
          flickerChance={0.08}
          color={isDarkTheme ? "#FFFFFF" : "#4B5563"}
          maxOpacity={isDarkTheme ? 0.12 : 0.08}
          className="w-full h-full"
          speed={0.02}
        />
      </div>

      {/* ── Main Bio Links Content Stack ── */}
      <main className="relative z-10 w-full max-w-[480px] mx-auto px-4 pt-8 pb-6 sm:pt-12 sm:pb-8 flex-1 flex flex-col justify-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4 w-full"
        >
          {/* ── 1. Profile Header Card ── */}
          <motion.div
            variants={itemVariants}
            className="rounded-3xl bg-white/90 dark:bg-[#121215]/90 border border-attio-border-light dark:border-neutral-800/90 backdrop-blur-md p-6 sm:p-7 flex flex-col items-center text-center shadow-xl relative overflow-hidden"
          >
            {/* Subtle Top Inner Glow */}
            <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-neutral-100/60 dark:from-neutral-800/30 to-transparent pointer-events-none" />

            {/* Profile Avatar */}
            <div className="relative z-10 w-20 h-20 sm:w-22 sm:h-22 mb-4 flex items-center justify-center">
              <div className="w-[72px] h-[72px] sm:w-[80px] sm:h-[80px] rounded-2xl overflow-hidden border-[2px] border-white dark:border-neutral-700 shadow-md group">
                <img
                  src="/images/general/profilephoto.webp"
                  alt="Alifia Hamzah"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            </div>

            {/* Profile Name & Title */}
            <div className="relative z-10 space-y-1">
              <h1 className="font-sans font-semibold text-2xl sm:text-[26px] leading-tight tracking-tight text-black dark:text-white">
                Alifia Hamzah
              </h1>
              <p className="text-xs sm:text-sm font-medium text-neutral-500 dark:text-neutral-400">
                Senior Product & Mobile App Designer
              </p>
            </div>

            {/* Bio Paragraph */}
            <p className="relative z-10 text-xs sm:text-sm leading-relaxed text-neutral-600 dark:text-neutral-300 font-normal mt-3 max-w-[360px]">
              Digital Product Designer Focusing On Building Simple And Intuitive
              Interfaces.
            </p>

            {/* Primary Action Button: Let's Connect */}
            <div className="relative z-10 w-full mt-5">
              <RainbowButton
                onClick={() => setIsTalkModalOpen(true)}
                className="w-full h-11 text-sm font-semibold btn-radius-lg shadow-sm"
              >
                <RollingText>Let's connect</RollingText>
              </RainbowButton>
            </div>
          </motion.div>

          {/* ── 2. Links Stack Section ── */}
          <motion.div variants={itemVariants} className="space-y-2.5 w-full">
            {LINKS_DATA.map((link) => {
              const Content = (
                <div className="w-full rounded-2xl bg-white/90 dark:bg-[#121215]/90 border border-attio-border-light dark:border-neutral-800/80 backdrop-blur-md p-3.5 sm:p-4 hover:border-neutral-400 dark:hover:border-neutral-600 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg flex items-center justify-between group cursor-pointer">
                  {/* Left Side: Icon + Text */}
                  <div className="flex items-center gap-3.5 min-w-0 pr-2">
                    <div className="w-11 h-11 shrink-0 rounded-xl bg-neutral-100/90 dark:bg-[#1A1A1E] border border-neutral-200/80 dark:border-neutral-700/70 flex items-center justify-center text-neutral-800 dark:text-neutral-200 group-hover:scale-105 transition-transform duration-200 shadow-xs">
                      <Icon icon={link.icon} className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col min-w-0 text-left">
                      <div className="flex items-center gap-2">
                        <span className="text-sm sm:text-base font-semibold text-black dark:text-white truncate">
                          {link.title}
                        </span>
                        {link.badge && (
                          <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700">
                            {link.badge}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-neutral-500 dark:text-neutral-400 font-normal truncate mt-0.5">
                        {link.description}
                      </span>
                    </div>
                  </div>

                  {/* Right Side: Arrow Icon */}
                  <div className="shrink-0 text-neutral-400 group-hover:text-black dark:group-hover:text-white transition-colors duration-200">
                    <Icon
                      icon="solar:arrow-right-up-linear"
                      className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200"
                    />
                  </div>
                </div>
              );

              return (
                <motion.div key={link.id} variants={itemVariants}>
                  {link.isExternal ? (
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full text-left"
                    >
                      {Content}
                    </a>
                  ) : (
                    <Link to={link.url} className="block w-full text-left">
                      {Content}
                    </Link>
                  )}
                </motion.div>
              );
            })}
          </motion.div>

          {/* ── 3. Newsletter Subscription Card ── */}
          <motion.div
            variants={itemVariants}
            className="rounded-3xl bg-white/90 dark:bg-[#121215]/90 border border-attio-border-light dark:border-neutral-800/90 backdrop-blur-md p-5 sm:p-6 text-left shadow-lg space-y-3"
          >
            <div className="space-y-1">
              <h2 className="text-base font-semibold text-black dark:text-white tracking-tight">
                Signup to my newsletter
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 font-normal">
                Get occasional updates on design systems, templates & articles.
              </p>
            </div>

            <form onSubmit={handleSubscribe} className="space-y-2.5 pt-1">
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="Your email"
                className="w-full h-11 px-4 text-sm rounded-xl bg-neutral-50 dark:bg-[#1A1A1E] border border-neutral-200 dark:border-neutral-700/80 text-black dark:text-white placeholder:text-neutral-400 focus:outline-none focus:border-black dark:focus:border-white transition-colors duration-200"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 rounded-xl bg-black dark:bg-white text-white dark:text-black font-semibold text-sm hover:opacity-90 active:scale-[0.99] transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Icon
                    icon="solar:restart-linear"
                    className="w-4 h-4 animate-spin"
                  />
                ) : (
                  "Subscribe"
                )}
              </button>
            </form>
          </motion.div>
        </motion.div>
      </main>

      {/* ── Footer Social Icons & Copyright ── */}
      <footer className="relative z-10 w-full max-w-[480px] mx-auto pb-6 px-4 pt-2 text-center space-y-3">
        {/* Social Icons Row */}
        <div className="flex items-center justify-center gap-3">
          {SOCIAL_LINKS.map((soc) => (
            <a
              key={soc.name}
              href={soc.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={soc.name}
              title={soc.name}
              className="w-9 h-9 rounded-full bg-white/80 dark:bg-neutral-900/80 border border-attio-border-light dark:border-neutral-800 flex items-center justify-center text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white hover:border-neutral-400 dark:hover:border-neutral-700 transition-all duration-200 hover:scale-105 active:scale-95 shadow-xs"
            >
              <Icon icon={soc.icon} className="w-4 h-4" />
            </a>
          ))}
        </div>

        <p className="text-[11px] text-neutral-400 dark:text-neutral-600 font-normal">
          © {new Date().getFullYear()} Alifia Hamzah. All rights reserved.
        </p>
      </footer>

      {/* ── Communication Modal ── */}
      <LetsTalkModal
        isOpen={isTalkModalOpen}
        onClose={() => setIsTalkModalOpen(false)}
      />
    </div>
  );
}
