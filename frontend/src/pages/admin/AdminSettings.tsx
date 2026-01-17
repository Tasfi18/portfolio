import { useEffect, useState } from 'react';
import { Save, User, FileText } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Label } from '@/components/ui/Label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { FileUpload } from '@/components/ui/FileUpload';
import { toast } from '@/components/ui/Toaster';
import AdminLayout from '@/components/admin/AdminLayout';
import { supabase } from '@/lib/supabase';
import type { Hero, About } from '@/types';

export default function AdminSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [heroData, setHeroData] = useState<Partial<Hero>>({ name: '', title: '', tagline: '', avatar_url: '', resume_url: '' });
  const [aboutData, setAboutData] = useState<Partial<About>>({ bio: '', location: '', email: '', years_experience: 0 });

  useEffect(() => {
    async function fetchData() {
      const [heroRes, aboutRes] = await Promise.all([
        supabase.from('hero').select('*').single(),
        supabase.from('about').select('*').single(),
      ]);
      if (heroRes.data) setHeroData(heroRes.data);
      if (aboutRes.data) setAboutData(aboutRes.data);
      setLoading(false);
    }
    fetchData();
  }, []);

  const saveHero = async () => {
    setSaving(true);
    try {
      const { data: existing } = await supabase.from('hero').select('id').single();
      if (existing) await supabase.from('hero').update(heroData).eq('id', existing.id);
      else await supabase.from('hero').insert([heroData]);
      toast({ title: 'Hero section saved!', variant: 'success' });
    } catch (error) {
      toast({ title: 'Failed to save', variant: 'destructive' });
    } finally { setSaving(false); }
  };

  const saveAbout = async () => {
    setSaving(true);
    try {
      const { data: existing } = await supabase.from('about').select('id').single();
      if (existing) await supabase.from('about').update(aboutData).eq('id', existing.id);
      else await supabase.from('about').insert([aboutData]);
      toast({ title: 'About section saved!', variant: 'success' });
    } catch (error) {
      toast({ title: 'Failed to save', variant: 'destructive' });
    } finally { setSaving(false); }
  };

  if (loading) return <AdminLayout title="Settings"><div className="space-y-6">{[1,2].map((i) => <div key={i} className="h-64 bg-muted rounded-xl animate-pulse" />)}</div></AdminLayout>;

  return (
    <AdminLayout title="Settings">
      <div className="space-y-8 max-w-2xl">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><User className="h-5 w-5" />Hero Section</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><Label>Name</Label><Input value={heroData.name || ''} onChange={(e) => setHeroData({ ...heroData, name: e.target.value })} placeholder="Your Name" /></div>
            <div><Label>Title</Label><Input value={heroData.title || ''} onChange={(e) => setHeroData({ ...heroData, title: e.target.value })} placeholder="Full Stack Developer" /></div>
            <div><Label>Tagline</Label><Textarea value={heroData.tagline || ''} onChange={(e) => setHeroData({ ...heroData, tagline: e.target.value })} rows={2} placeholder="A short description about yourself" /></div>
            <div>
              <Label>Profile Photo</Label>
              <p className="text-sm text-muted-foreground mb-2">Displayed in hero section (recommended: square image, min 400x400px)</p>
              <FileUpload value={heroData.avatar_url || ''} onChange={(url) => setHeroData({ ...heroData, avatar_url: url })} folder="hero" accept="image/*" label="Upload Photo" rounded />
            </div>
            <div>
              <Label>Resume</Label>
              <FileUpload value={heroData.resume_url || ''} onChange={(url) => setHeroData({ ...heroData, resume_url: url })} folder="resumes" accept=".pdf,.doc,.docx" label="Upload Resume" />
            </div>
            <Button onClick={saveHero} disabled={saving}><Save className="mr-2 h-4 w-4" />Save Hero</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5" />About Section</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Bio</Label>
              <p className="text-sm text-muted-foreground mb-2">Write about yourself, your background, and what you do</p>
              <Textarea value={aboutData.bio || ''} onChange={(e) => setAboutData({ ...aboutData, bio: e.target.value })} rows={5} placeholder="I am a passionate developer..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Location</Label><Input value={aboutData.location || ''} onChange={(e) => setAboutData({ ...aboutData, location: e.target.value })} placeholder="City, Country" /></div>
              <div><Label>Years of Experience</Label><Input type="number" value={aboutData.years_experience || 0} onChange={(e) => setAboutData({ ...aboutData, years_experience: parseInt(e.target.value) || 0 })} /></div>
            </div>
            <div><Label>Email</Label><Input type="email" value={aboutData.email || ''} onChange={(e) => setAboutData({ ...aboutData, email: e.target.value })} placeholder="your@email.com" /></div>
            <Button onClick={saveAbout} disabled={saving}><Save className="mr-2 h-4 w-4" />Save About</Button>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
