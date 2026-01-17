import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Download, Github, Linkedin, Mail, Twitter, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { supabase } from '@/lib/supabase';
import type { Hero, SocialLink, About } from '@/types';

// Icon mapping for social links
const iconMap: Record<string, React.ElementType> = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  email: Mail,
};

// Animation variants for staggered entrance
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function HeroSection() {
  const [hero, setHero] = useState<Hero | null>(null);
  const [socials, setSocials] = useState<SocialLink[]>([]);
  const [about, setAbout] = useState<About | null>(null);

  useEffect(() => {
    Promise.all([
      supabase.from('hero').select('*').single(),
      supabase.from('social_links').select('*').eq('is_visible', true).order('display_order'),
      supabase.from('about').select('*').single(),
    ]).then(([heroRes, socialsRes, aboutRes]) => {
      setHero(heroRes.data);
      setSocials(socialsRes.data || []);
      setAbout(aboutRes.data);
    });
  }, []);

  if (!hero) {
    return (
      <section className="min-h-[60vh] flex items-center justify-center bg-gray-50 dark:bg-[#0a0f1a]">
        <div className="animate-pulse text-gray-500">Loading...</div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-[#0a0f1a] dark:via-[#0d1424] dark:to-[#0a0f1a]">
      {/* Background decorations - simplified for performance */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -right-32 w-64 md:w-96 h-64 md:h-96 bg-emerald-500/20 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-32 -left-32 w-64 md:w-96 h-64 md:h-96 bg-teal-500/20 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      {/* Main content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-14 pt-20 sm:pt-22 lg:pt-24">
        <div className="grid md:grid-cols-2 gap-8 md:gap-10 lg:gap-12 items-center">

          {/* Text Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center md:text-left order-2 md:order-1 space-y-4 sm:space-y-5"
          >
            {/* Status badge */}
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 dark:bg-emerald-500/20 backdrop-blur-sm rounded-full border border-emerald-500/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-xs sm:text-sm text-emerald-600 dark:text-emerald-400 font-medium">Available for work</span>
            </motion.div>

            {/* Name & Title */}
            <motion.h1 variants={itemVariants} className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight tracking-tight">
              Hi, I'm <span className="gradient-text">{hero.name}</span>
            </motion.h1>

            <motion.p variants={itemVariants} className="text-lg sm:text-xl md:text-2xl text-gray-600 dark:text-gray-300 font-medium">
              {hero.title}
            </motion.p>

            {hero.tagline && (
              <motion.p variants={itemVariants} className="text-sm sm:text-base text-gray-500 dark:text-gray-400 max-w-lg mx-auto md:mx-0 leading-relaxed">
                {hero.tagline}
              </motion.p>
            )}

            {/* CTA Buttons */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3 pt-2 justify-center md:justify-start">
              <Button
                size="lg"
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 rounded-full h-11 sm:h-12 text-sm sm:text-base font-medium shadow-lg shadow-emerald-500/25 hover:shadow-xl transition-all"
                asChild
              >
                <a href="#contact">
                  Let's Talk
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
              {hero.resume_url && (
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-gray-200 dark:border-gray-700 hover:border-emerald-500 dark:hover:border-emerald-500 px-6 rounded-full h-11 sm:h-12 text-sm sm:text-base font-medium transition-all"
                  asChild
                >
                  <a href={hero.resume_url} target="_blank" rel="noopener noreferrer">
                    <Download className="mr-2 h-4 w-4" />
                    Download CV
                  </a>
                </Button>
              )}
            </motion.div>

            {/* Social links */}
            {socials.length > 0 && (
              <motion.div variants={itemVariants} className="flex items-center gap-3 pt-2 justify-center md:justify-start">
                <span className="text-xs text-gray-400 dark:text-gray-500">Follow me</span>
                <div className="h-px w-6 bg-gray-300 dark:bg-gray-700" />
                <div className="flex items-center gap-1.5">
                  {socials.map((social) => {
                    const Icon = iconMap[social.platform.toLowerCase()] || Mail;
                    return (
                      <a
                        key={social.id}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800/80 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-emerald-500 hover:text-white transition-all duration-200 hover:scale-105"
                        title={social.platform}
                      >
                        <Icon className="h-4 w-4" />
                      </a>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Profile Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex justify-center order-1 md:order-2"
          >
            <div className="relative">
              {/* Decorative ring - only on larger screens */}
              <div className="hidden md:block absolute inset-0 -m-3 lg:-m-4 rounded-full border-2 border-dashed border-emerald-500/20 animate-[spin_30s_linear_infinite]" />

              {/* Glow effect */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 blur-2xl opacity-20 scale-105" />

              {hero.avatar_url ? (
                <div className="relative w-36 h-36 sm:w-44 sm:h-44 md:w-52 md:h-52 lg:w-72 lg:h-72 xl:w-80 xl:h-80">
                  {/* Gradient border */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-400 via-teal-400 to-cyan-400 p-0.5 sm:p-1">
                    <div className="w-full h-full rounded-full overflow-hidden bg-white dark:bg-gray-900">
                      <img
                        src={hero.avatar_url}
                        alt={hero.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Floating stats - hidden on mobile, positioned outside the image */}
                  <motion.div
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 }}
                    className="hidden lg:flex absolute left-0 top-1/4 -translate-x-[calc(100%+0.75rem)] bg-white dark:bg-gray-800 rounded-xl shadow-lg p-2.5 lg:p-3 border border-gray-100 dark:border-gray-700"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 lg:w-9 lg:h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                        <Sparkles className="h-4 w-4 text-emerald-500" />
                      </div>
                      <div>
                        <p className="text-base lg:text-xl font-bold text-gray-900 dark:text-white">{about?.years_experience || 5}+</p>
                        <p className="text-[10px] lg:text-xs text-gray-500 dark:text-gray-400">Years Exp.</p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 }}
                    className="hidden lg:flex absolute right-0 bottom-1/4 translate-x-[calc(100%+0.75rem)] bg-white dark:bg-gray-800 rounded-xl shadow-lg p-2.5 lg:p-3 border border-gray-100 dark:border-gray-700"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 lg:w-9 lg:h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                        <span className="text-emerald-500 font-bold text-xs lg:text-sm">50+</span>
                      </div>
                      <div>
                        <p className="text-[10px] lg:text-xs text-gray-500 dark:text-gray-400">Projects</p>
                        <p className="text-xs lg:text-sm font-semibold text-gray-900 dark:text-white">Completed</p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              ) : (
                <div className="w-36 h-36 sm:w-44 sm:h-44 md:w-52 md:h-52 lg:w-72 lg:h-72 xl:w-80 xl:h-80 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                  <span className="text-3xl sm:text-4xl lg:text-5xl text-white font-bold">{hero.name.charAt(0)}</span>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator - desktop only */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="hidden lg:flex justify-center mt-12"
        >
          <a href="#about" className="flex flex-col items-center gap-1.5 text-gray-400 hover:text-emerald-500 transition-colors group">
            <span className="text-xs tracking-widest uppercase">Scroll</span>
            <div className="w-5 h-8 border-2 border-current rounded-full flex justify-center pt-1.5 group-hover:border-emerald-500 transition-colors">
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-1 h-1 bg-current rounded-full"
              />
            </div>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
