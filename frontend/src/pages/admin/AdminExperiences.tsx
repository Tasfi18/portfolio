import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Label } from '@/components/ui/Label';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/Dialog';
import { toast } from '@/components/ui/Toaster';
import AdminLayout from '@/components/admin/AdminLayout';
import { supabase } from '@/lib/supabase';
import { formatDate } from '@/lib/utils';
import type { Experience } from '@/types';

export default function AdminExperiences() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingExp, setEditingExp] = useState<Experience | null>(null);
  const [formData, setFormData] = useState({ company: '', position: '', description: '', start_date: '', end_date: '', is_current: false, location: '', company_url: '', is_visible: true });

  useEffect(() => { fetchExperiences(); }, []);

  async function fetchExperiences() {
    const { data } = await supabase.from('experiences').select('*').order('start_date', { ascending: false });
    setExperiences(data || []);
    setLoading(false);
  }

  const openDialog = (exp?: Experience) => {
    if (exp) {
      setEditingExp(exp);
      setFormData({ company: exp.company, position: exp.position, description: exp.description || '', start_date: exp.start_date, end_date: exp.end_date || '', is_current: exp.is_current, location: exp.location || '', company_url: exp.company_url || '', is_visible: exp.is_visible });
    } else {
      setEditingExp(null);
      setFormData({ company: '', position: '', description: '', start_date: '', end_date: '', is_current: false, location: '', company_url: '', is_visible: true });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = { ...formData, end_date: formData.is_current ? null : formData.end_date || null };
    try {
      if (editingExp) {
        await supabase.from('experiences').update(data).eq('id', editingExp.id);
        toast({ title: 'Experience updated', variant: 'success' });
      } else {
        await supabase.from('experiences').insert([data]);
        toast({ title: 'Experience created', variant: 'success' });
      }
      setIsDialogOpen(false);
      fetchExperiences();
    } catch (error) {
      toast({ title: 'Error', variant: 'destructive' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this experience?')) return;
    await supabase.from('experiences').delete().eq('id', id);
    toast({ title: 'Deleted', variant: 'success' });
    fetchExperiences();
  };

  return (
    <AdminLayout title="Experiences">
      <div className="flex justify-between items-center mb-6">
        <p className="text-muted-foreground">{experiences.length} experiences</p>
        <Button onClick={() => openDialog()}><Plus className="mr-2 h-4 w-4" />Add Experience</Button>
      </div>

      {loading ? (
        <div className="space-y-4">{[1,2,3].map((i) => <div key={i} className="h-32 bg-muted rounded-xl animate-pulse" />)}</div>
      ) : experiences.length === 0 ? (
        <div className="text-center py-12"><Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" /><p className="text-muted-foreground">No experiences yet</p></div>
      ) : (
        <div className="space-y-4">
          {experiences.map((exp) => (
            <Card key={exp.id} className={!exp.is_visible ? 'opacity-60' : ''}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{exp.position}</h3>
                      {exp.is_current && <Badge>Current</Badge>}
                      {!exp.is_visible && <Badge variant="secondary">Hidden</Badge>}
                    </div>
                    <p className="text-muted-foreground">{exp.company}</p>
                    <p className="text-sm text-muted-foreground">{formatDate(exp.start_date)} - {exp.is_current ? 'Present' : exp.end_date ? formatDate(exp.end_date) : 'Present'}</p>
                    {exp.location && <p className="text-sm text-muted-foreground">{exp.location}</p>}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => openDialog(exp)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(exp.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editingExp ? 'Edit Experience' : 'Add Experience'}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><Label>Company</Label><Input value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} required /></div>
            <div><Label>Position</Label><Input value={formData.position} onChange={(e) => setFormData({ ...formData, position: e.target.value })} required /></div>
            <div><Label>Description</Label><Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Start Date</Label><Input type="date" value={formData.start_date} onChange={(e) => setFormData({ ...formData, start_date: e.target.value })} required /></div>
              <div><Label>End Date</Label><Input type="date" value={formData.end_date} onChange={(e) => setFormData({ ...formData, end_date: e.target.value })} disabled={formData.is_current} /></div>
            </div>
            <div><Label>Location</Label><Input value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} /></div>
            <div><Label>Company URL</Label><Input value={formData.company_url} onChange={(e) => setFormData({ ...formData, company_url: e.target.value })} /></div>
            <div className="flex gap-4">
              <label className="flex items-center gap-2"><input type="checkbox" checked={formData.is_current} onChange={(e) => setFormData({ ...formData, is_current: e.target.checked })} />Currently working here</label>
              <label className="flex items-center gap-2"><input type="checkbox" checked={formData.is_visible} onChange={(e) => setFormData({ ...formData, is_visible: e.target.checked })} />Visible</label>
            </div>
            <DialogFooter><Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button><Button type="submit">Save</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}