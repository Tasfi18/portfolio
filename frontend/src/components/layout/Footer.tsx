import { useEffect, useState } from 'react';
import { Github, Linkedin, Mail, Twitter } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { SocialLink } from '@/types';

const iconMap: Record<string, React.ElementType> = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  email: Mail,
};

export default function Footer() {
  const [socials, setSocials] = useState<SocialLink[]>([]);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    supabase
      .from('social_links')
      .select('*')
      .eq('is_visible', true)
      .order('display_order')
      .then(({ data }) => setSocials(data || []));
  }, []);

  return (
    <footer className="bg-gray-900 dark:bg-[#1a202c] py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src="/assets/logo.jpg" alt="Logo" className="h-5 w-5 sm:h-6 sm:w-6 rounded-full object-cover" />
            <p className="text-gray-400 dark:text-white/50 text-xs sm:text-sm">
              © {currentYear} Portfolio. All rights reserved.
            </p>
          </div>
          
          {socials.length > 0 && (
            <div className="flex items-center gap-3 sm:gap-4">
              {socials.map((social) => {
                const Icon = iconMap[social.platform.toLowerCase()] || Mail;
                return (
                  <a
                    key={social.id}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 dark:text-white/50 hover:text-emerald-400 transition-colors"
                    title={social.platform}
                  >
                    <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
