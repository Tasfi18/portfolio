import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Mail, MapPin, Send, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Label } from '@/components/ui/Label';
import { toast } from '@/components/ui/Toaster';
import { supabase } from '@/lib/supabase';
import type { About } from '@/types';

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function ContactSection() {
  const [about, setAbout] = useState<About | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactForm>();

  useEffect(() => {
    supabase.from('about').select('*').single().then(({ data }) => setAbout(data));
  }, []);

  const onSubmit = async (data: ContactForm) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('contacts').insert([data]);
      if (error) throw error;
      setIsSuccess(true);
      reset();
      toast({ title: 'Message sent!', description: 'Thanks for reaching out.', variant: 'success' });
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to send message.', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-10 sm:py-12 md:py-14 px-4 bg-white dark:bg-gray-900">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-6 sm:mb-8"
        >
          <span className="inline-block px-3 py-1 sm:px-4 sm:py-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm font-medium rounded-full mb-3 sm:mb-4">
            Get In Touch
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            Contact Me<span className="text-emerald-500">.</span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-start">
          {/* Left side - Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6 sm:space-y-8 order-2 lg:order-1"
          >
            <div>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">Let's work together</h3>
              <p className="text-gray-600 dark:text-white/60 text-sm sm:text-base leading-relaxed">
                Have a project in mind or just want to chat? Feel free to reach out. I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
              </p>
            </div>

            <div className="space-y-4 sm:space-y-6">
              {about?.email && (
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-500/10 dark:bg-emerald-400/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-500 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-white/50 text-xs sm:text-sm">Email</p>
                    <a
                      href={`mailto:${about.email}`}
                      className="text-gray-900 dark:text-white text-sm sm:text-base font-medium hover:text-emerald-500 transition-colors"
                    >
                      {about.email}
                    </a>
                  </div>
                </div>
              )}

              {about?.location && (
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-500/10 dark:bg-emerald-400/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-500 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-white/50 text-xs sm:text-sm">Location</p>
                    <p className="text-gray-900 dark:text-white text-sm sm:text-base font-medium">{about.location}</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Right side - Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="order-1 lg:order-2"
          >
            {isSuccess ? (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8 sm:p-12 text-center">
                <CheckCircle className="h-12 w-12 sm:h-16 sm:w-16 text-emerald-500 dark:text-emerald-400 mx-auto mb-3 sm:mb-4" />
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-1.5 sm:mb-2">Message Sent!</h3>
                <p className="text-gray-600 dark:text-white/60 text-sm sm:text-base">I'll get back to you soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-5 sm:p-6 md:p-8 space-y-4 sm:space-y-6">
                <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <Label htmlFor="name" className="text-gray-700 dark:text-white/80 text-sm">Name</Label>
                    <Input
                      id="name"
                      {...register('name', { required: 'Name is required' })}
                      placeholder="Your name"
                      className="mt-1.5 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-sm"
                    />
                    {errors.name && <p className="text-xs sm:text-sm text-red-500 mt-1">{errors.name.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-gray-700 dark:text-white/80 text-sm">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' } })}
                      placeholder="your@email.com"
                      className="mt-1.5 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-sm"
                    />
                    {errors.email && <p className="text-xs sm:text-sm text-red-500 mt-1">{errors.email.message}</p>}
                  </div>
                </div>

                <div>
                  <Label htmlFor="subject" className="text-gray-700 dark:text-white/80 text-sm">Subject</Label>
                  <Input
                    id="subject"
                    {...register('subject')}
                    placeholder="What's this about?"
                    className="mt-1.5 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-sm"
                  />
                </div>

                <div>
                  <Label htmlFor="message" className="text-gray-700 dark:text-white/80 text-sm">Message</Label>
                  <Textarea
                    id="message"
                    {...register('message', { required: 'Message is required' })}
                    placeholder="Your message..."
                    rows={4}
                    className="mt-1.5 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-sm resize-none"
                  />
                  {errors.message && <p className="text-xs sm:text-sm text-red-500 mt-1">{errors.message.message}</p>}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white rounded-full py-5 sm:py-6 text-sm sm:text-base"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
