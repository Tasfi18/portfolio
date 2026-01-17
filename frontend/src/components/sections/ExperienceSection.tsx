import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, ExternalLink, Briefcase } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { formatDate } from '@/lib/utils';
import type { Experience } from '@/types';

export default function ExperienceSection() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('experiences')
      .select('*')
      .eq('is_visible', true)
      .order('start_date', { ascending: false })
      .then(({ data }) => {
        setExperiences(data || []);
        setLoading(false);
      });
  }, []);

  if (loading || experiences.length === 0) return null;

  return (
    <section id="experience" className="py-10 sm:py-12 md:py-14 px-4 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-6 sm:mb-8"
        >
          <span className="inline-block px-3 py-1 sm:px-4 sm:py-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm font-medium rounded-full mb-3 sm:mb-4">
            My Journey
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            Work Experience<span className="text-emerald-500">.</span>
          </h2>
        </motion.div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 sm:left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-emerald-500/30 dark:bg-emerald-400/30 md:-translate-x-px" />

          <div className="space-y-6 sm:space-y-8">
            {experiences.map((exp, index) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative pl-10 sm:pl-14 md:pl-0 ${index % 2 === 0 ? 'md:pr-[calc(50%+1.5rem)]' : 'md:pl-[calc(50%+1.5rem)]'}`}
              >
                {/* Timeline dot */}
                <div className="absolute left-2 sm:left-4 md:left-1/2 top-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-emerald-500 dark:bg-emerald-400 border-4 border-gray-50 dark:border-gray-800 -translate-x-1/2 flex items-center justify-center">
                  <Briefcase className="h-2 w-2 sm:h-2.5 sm:w-2.5 text-white dark:text-gray-800" />
                </div>

                <div className={`bg-white dark:bg-gray-900 rounded-xl p-4 sm:p-5 md:p-6 shadow-sm ${index % 2 === 0 ? 'md:text-right' : ''}`}>
                  <span className="inline-block text-emerald-500 dark:text-emerald-400 text-xs sm:text-sm font-medium mb-1.5 sm:mb-2">
                    {formatDate(exp.start_date)} — {exp.is_current ? 'Present' : exp.end_date ? formatDate(exp.end_date) : 'Present'}
                  </span>

                  <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-0.5 sm:mb-1">
                    {exp.position}
                  </h3>

                  <div className={`flex items-center gap-2 text-gray-600 dark:text-white/60 mb-1.5 sm:mb-2 text-sm ${index % 2 === 0 ? 'md:justify-end' : 'justify-start'}`}>
                    {exp.company_url ? (
                      <a
                        href={exp.company_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-emerald-500 dark:hover:text-emerald-400 flex items-center gap-1 transition-colors"
                      >
                        {exp.company}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    ) : (
                      <span>{exp.company}</span>
                    )}
                  </div>

                  {exp.location && (
                    <p className={`text-xs sm:text-sm text-gray-500 dark:text-white/50 flex items-center gap-1 mb-2 sm:mb-3 ${index % 2 === 0 ? 'md:justify-end' : 'justify-start'}`}>
                      <MapPin className="h-3 w-3 flex-shrink-0" />
                      {exp.location}
                    </p>
                  )}

                  {exp.description && (
                    <p className="text-gray-600 dark:text-white/60 text-xs sm:text-sm leading-relaxed">
                      {exp.description}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
