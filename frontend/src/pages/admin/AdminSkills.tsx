import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/Dialog';
import { toast } from '@/components/ui/Toaster';
import AdminLayout from '@/components/admin/AdminLayout';
import { supabase } from '@/lib/supabase';
import type { Skill } from '@/types';

export default function AdminSkills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [formData, setFormData] = useState({ name: '', category: 'frontend' as Skill['category'], proficiency: 80, is_visible: true });

  useEffect(() => { fetchSkills(); }, []);

  async function fetchSkills() {
    const { data } = await supabase.from('skills').select('*').order('display_order');
    setSkills(data || []);
    setLoading(false);
  }

  const openDialog = (skill?: Skill) => {
    if (skill) {
      setEditingSkill(skill);
      setFormData({ name: skill.name, category: skill.category, proficiency: skill.proficiency, is_visible: skill.is_visible });
    } else {
      setEditingSkill(null);
      setFormData({ name: '', category: 'frontend', proficiency: 80, is_visible: true });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingSkill) {
        await supabase.from('skills').update(formData).eq('id', editingSkill.id);
        toast({ title: 'Skill updated', variant: 'success' });
      } else {
        await supabase.from('skills').insert([formData]);
        toast({ title: 'Skill created', variant: 'success' });
      }
      setIsDialogOpen(false);
      fetchSkills();
    } catch (error) {
      toast({ title: 'Error', variant: 'destructive' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this skill?')) return;
    await supabase.from('skills').delete().eq('id', id);
    toast({ title: 'Deleted', variant: 'success' });
    fetchSkills();
  };

  const grouped = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <AdminLayout title="Skills">
      <div className="flex justify-between items-center mb-6">
        <p className="text-muted-foreground">{skills.length} skills</p>
        <Button onClick={() => openDialog()}><Plus className="mr-2 h-4 w-4" />Add Skill</Button>
      </div>

      {loading ? (
        <div className="space-y-4">{[1, 2, 3].map((i) => <div key={i} className="h-20 bg-muted rounded-xl animate-pulse" />)}</div>
      ) : skills.length === 0 ? (
        <div className="text-center py-12"><Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" /><p className="text-muted-foreground">No skills yet</p></div>
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).map(([category, categorySkills]) => (
            <div key={category}>
              <h3 className="text-lg font-semibold mb-4 capitalize">{category}</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categorySkills.map((skill) => (
                  <Card key={skill.id} className={!skill.is_visible ? 'opacity-60' : ''}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{skill.name}</span>
                        <div className="flex items-center gap-2">
                          {!skill.is_visible && <Badge variant="secondary">Hidden</Badge>}
                          <Button variant="ghost" size="sm" onClick={() => openDialog(skill)}><Pencil className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(skill.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: `${skill.proficiency}%` }} />
                        </div>
                        <span className="text-sm text-muted-foreground">{skill.proficiency}%</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editingSkill ? 'Edit Skill' : 'Add Skill'}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><Label>Name</Label><Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required /></div>
            <div>
              <Label>Category</Label>
              <select className="w-full h-10 px-3 rounded-md border bg-background" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value as Skill['category'] })}>
                <option value="frontend">Frontend</option>
                <option value="backend">Backend</option>
                <option value="fullstack">Full Stack</option>
                <option value="tools">Tools</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <Label>Proficiency: {formData.proficiency}%</Label>
              <input type="range" min="0" max="100" value={formData.proficiency} onChange={(e) => setFormData({ ...formData, proficiency: Number(e.target.value) })} className="w-full" />
            </div>
            <label className="flex items-center gap-2"><input type="checkbox" checked={formData.is_visible} onChange={(e) => setFormData({ ...formData, is_visible: e.target.checked })} />Visible</label>
            <DialogFooter><Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button><Button type="submit">Save</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}