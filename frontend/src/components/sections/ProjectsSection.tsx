import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Github, ExternalLink } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Project } from '@/types';

export default function ProjectsSection() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    supabase.from('projects').select('*').eq('is_visible', true).order('display_order').then(({ data }) => setProjects(data || []));
  }, []);

  if (projects.length === 0) return null;

  return (
    <section id="projects" className="py-10 sm:py-12 md:py-14 px-4 bg-white dark:bg-gray-900">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-6 sm:mb-8"
        >
          <span className="inline-block px-3 py-1 sm:px-4 sm:py-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm font-medium rounded-full mb-3 sm:mb-4">
            My Work
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            Recent Projects<span className="text-emerald-500">.</span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <div className="relative overflow-hidden bg-gray-50 dark:bg-gray-800 rounded-xl shadow-sm">
                {/* Image */}
                {project.image_url ? (
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={project.image_url}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                ) : (
                  <div className="aspect-video bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 flex items-center justify-center">
                    <span className="text-3xl sm:text-4xl font-bold text-emerald-500/30 dark:text-emerald-400/30">{project.title[0]}</span>
                  </div>
                )}

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-emerald-500/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 sm:gap-4">
                  {project.github_url && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white flex items-center justify-center text-emerald-500 hover:bg-white/90 transition-colors"
                    >
                      <Github className="h-4 w-4 sm:h-5 sm:w-5" />
                    </a>
                  )}
                  {project.live_url && (
                    <a
                      href={project.live_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white flex items-center justify-center text-emerald-500 hover:bg-white/90 transition-colors"
                    >
                      <ExternalLink className="h-4 w-4 sm:h-5 sm:w-5" />
                    </a>
                  )}
                </div>

                {/* Featured badge */}
                {project.is_featured && (
                  <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-emerald-500 text-white text-[10px] sm:text-xs font-medium px-2 py-0.5 sm:px-3 sm:py-1 rounded-full">
                    Featured
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="pt-4 sm:pt-5">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-1.5 sm:mb-2">{project.title}</h3>
                <p className="text-gray-600 dark:text-white/60 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">{project.description}</p>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {project.technologies.slice(0, 4).map((tech) => (
                    <span
                      key={tech}
                      className="text-[10px] sm:text-xs text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 dark:border-emerald-400/30 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
