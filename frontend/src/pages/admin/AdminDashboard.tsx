import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FolderKanban, Sparkles, Briefcase, MessageSquare, Plus, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import AdminLayout from '@/components/admin/AdminLayout';
import { supabase } from '@/lib/supabase';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ projects: 0, skills: 0, experiences: 0, messages: 0, unread: 0 });

  useEffect(() => {
    async function fetchStats() {
      const [projects, skills, experiences, messages] = await Promise.all([
        supabase.from('projects').select('id', { count: 'exact' }),
        supabase.from('skills').select('id', { count: 'exact' }),
        supabase.from('experiences').select('id', { count: 'exact' }),
        supabase.from('contacts').select('id, is_read', { count: 'exact' }),
      ]);
      const unread = messages.data?.filter((m) => !m.is_read).length || 0;
      setStats({
        projects: projects.count || 0,
        skills: skills.count || 0,
        experiences: experiences.count || 0,
        messages: messages.count || 0,
        unread,
      });
    }
    fetchStats();
  }, []);

  const statCards = [
    { label: 'Projects', value: stats.projects, icon: FolderKanban, href: '/admin/projects', color: 'text-blue-500' },
    { label: 'Skills', value: stats.skills, icon: Sparkles, href: '/admin/skills', color: 'text-yellow-500' },
    { label: 'Experiences', value: stats.experiences, icon: Briefcase, href: '/admin/experiences', color: 'text-green-500' },
    { label: 'Messages', value: stats.messages, icon: MessageSquare, href: '/admin/messages', color: 'text-purple-500', badge: stats.unread },
  ];

  return (
    <AdminLayout title="Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => (
          <Link key={stat.label} to={stat.href}>
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold flex items-center gap-2">
                  {stat.value}
                  {stat.badge ? <Badge variant="destructive">{stat.badge} new</Badge> : null}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          <Button className="w-full justify-start" asChild><Link to="/admin/projects"><Plus className="mr-2 h-4 w-4" />Add Project</Link></Button>
          <Button className="w-full justify-start" variant="outline" asChild><Link to="/admin/skills"><Plus className="mr-2 h-4 w-4" />Add Skill</Link></Button>
          <Button className="w-full justify-start" variant="outline" asChild><Link to="/admin/experiences"><Plus className="mr-2 h-4 w-4" />Add Experience</Link></Button>
          <Button className="w-full justify-start" variant="secondary" asChild><Link to="/"><ExternalLink className="mr-2 h-4 w-4" />View Live Site</Link></Button>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}