import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import type { Skill } from '@/types';

export default function SkillsSection() {
  const [skills, setSkills] = useState<Skill[]>([]);

  useEffect(() => {
    supabase.from('skills').select('*').eq('is_visible', true).order('display_order').then(({ data }) => setSkills(data || []));
  }, []);

  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  const categoryLabels: Record<string, string> = {
    frontend: 'Frontend',
    backend: 'Backend',
    tools: 'Tools & Others',
    other: 'Other',
  };

  if (skills.length === 0) return null;

  return (
    <section id="skills" className="py-10 sm:py-12 md:py-14 px-4 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-6 sm:mb-8"
        >
          <span className="inline-block px-3 py-1 sm:px-4 sm:py-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm font-medium rounded-full mb-3 sm:mb-4">
            My Skills
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            Technologies I work with<span className="text-emerald-500">.</span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {Object.entries(groupedSkills).map(([category, categorySkills], catIndex) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: catIndex * 0.1 }}
              className="bg-white dark:bg-gray-900 p-4 sm:p-5 md:p-6 rounded-xl shadow-sm"
            >
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6 pb-2 border-b border-gray-100 dark:border-gray-700">
                {categoryLabels[category] || category}
              </h3>
              <div className="space-y-3 sm:space-y-4">
                {categorySkills.map((skill, index) => (
                  <div key={skill.id}>
                    <div className="flex justify-between items-center mb-1.5 sm:mb-2">
                      <span className="text-sm sm:text-base text-gray-700 dark:text-white/80">{skill.name}</span>
                      <span className="text-emerald-500 dark:text-emerald-400 text-xs sm:text-sm">{skill.proficiency}%</span>
                    </div>
                    <div className="h-1 sm:h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.proficiency}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                        className="h-full bg-emerald-500 dark:bg-emerald-400 rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
