import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Mail, Calendar, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { supabase } from '@/lib/supabase';
import type { About } from '@/types';

export default function AboutSection() {
  const [about, setAbout] = useState<About | null>(null);

  useEffect(() => {
    supabase.from('about').select('*').single().then(({ data }) => setAbout(data));
  }, []);

  if (!about) return null;

  return (
    <section id="about" className="py-10 sm:py-12 md:py-14 px-4 bg-white dark:bg-gray-900">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-6 sm:mb-8"
        >
          <span className="inline-block px-3 py-1 sm:px-4 sm:py-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm font-medium rounded-full mb-3 sm:mb-4">
            About Me
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white px-4">
            Passionate about creating
            <span className="text-emerald-500"> impactful solutions</span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 md:gap-12">
          {/* Bio */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 space-y-5 sm:space-y-6"
          >
            <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg leading-relaxed">
              {about.bio}
            </p>

            {/* Info row */}
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-6 text-sm">
              {about.location && (
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                  <MapPin className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                  <span>{about.location}</span>
                </div>
              )}
              {about.email && (
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                  <Mail className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                  <span className="truncate">{about.email}</span>
                </div>
              )}
              {about.years_experience > 0 && (
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                  <Calendar className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                  <span>{about.years_experience}+ Years Experience</span>
                </div>
              )}
            </div>

            <Button
              size="lg"
              className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-full px-6 sm:px-8 w-full sm:w-auto"
              asChild
            >
              <a href="#contact">
                Let's Work Together
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </motion.div>

          {/* Stats - Compact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 sm:p-4 text-center">
                <p className="text-xl sm:text-2xl font-bold text-emerald-500">50+</p>
                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Projects</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 sm:p-4 text-center">
                <p className="text-xl sm:text-2xl font-bold text-emerald-500">{about.years_experience}+</p>
                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Years Exp.</p>
              </div>
            </div>

            {/* Tech stack */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 sm:p-4">
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mb-2 sm:mb-3">Tech Stack</p>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {['React', 'TypeScript', 'Node.js', 'Tailwind'].map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-1 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-[10px] sm:text-xs rounded-md border border-gray-200 dark:border-gray-600"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
