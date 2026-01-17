import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, FolderKanban } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Label } from '@/components/ui/Label';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/Dialog';
import { FileUpload } from '@/components/ui/FileUpload';
import { toast } from '@/components/ui/Toaster';
import AdminLayout from '@/components/admin/AdminLayout';
import { supabase } from '@/lib/supabase';
import type { Project } from '@/types';

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({ title: '', description: '', technologies: '', github_url: '', live_url: '', image_url: '', is_featured: false, is_visible: true });

  useEffect(() => { fetchProjects(); }, []);

  async function fetchProjects() {
    const { data } = await supabase.from('projects').select('*').order('display_order');
    setProjects(data || []);
    setLoading(false);
  }

  const openDialog = (project?: Project) => {
    if (project) {
      setEditingProject(project);
      setFormData({ title: project.title, description: project.description, technologies: project.technologies.join(', '), github_url: project.github_url || '', live_url: project.live_url || '', image_url: project.image_url || '', is_featured: project.is_featured, is_visible: project.is_visible });
    } else {
      setEditingProject(null);
      setFormData({ title: '', description: '', technologies: '', github_url: '', live_url: '', image_url: '', is_featured: false, is_visible: true });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const projectData = { ...formData, technologies: formData.technologies.split(',').map((t) => t.trim()).filter(Boolean) };
    try {
      if (editingProject) {
        await supabase.from('projects').update(projectData).eq('id', editingProject.id);
        toast({ title: 'Project updated', variant: 'success' });
      } else {
        await supabase.from('projects').insert([projectData]);
        toast({ title: 'Project created', variant: 'success' });
      }
      setIsDialogOpen(false);
      fetchProjects();
    } catch (error) {
      toast({ title: 'Error', variant: 'destructive' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this project?')) return;
    await supabase.from('projects').delete().eq('id', id);
    toast({ title: 'Deleted', variant: 'success' });
    fetchProjects();
  };

  return (
    <AdminLayout title="Projects">
      <div className="flex justify-between items-center mb-6">
        <p className="text-muted-foreground">{projects.length} projects</p>
        <Button onClick={() => openDialog()}><Plus className="mr-2 h-4 w-4" />Add Project</Button>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">{[1,2,3].map((i) => <div key={i} className="h-48 bg-muted rounded-xl animate-pulse" />)}</div>
      ) : projects.length === 0 ? (
        <div className="text-center py-12"><FolderKanban className="h-12 w-12 text-muted-foreground mx-auto mb-4" /><p className="text-muted-foreground">No projects yet</p></div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card key={project.id} className={!project.is_visible ? 'opacity-60' : ''}>
              {project.image_url && <img src={project.image_url} alt={project.title} className="w-full h-40 object-cover rounded-t-lg" />}
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold">{project.title}</h3>
                  <div className="flex gap-1">
                    {project.is_featured && <Badge>Featured</Badge>}
                    {!project.is_visible && <Badge variant="secondary">Hidden</Badge>}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{project.description}</p>
                <div className="flex flex-wrap gap-1 mb-3">{project.technologies.slice(0, 3).map((tech) => <Badge key={tech} variant="outline" className="text-xs">{tech}</Badge>)}</div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => openDialog(project)}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(project.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editingProject ? 'Edit Project' : 'Add Project'}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><Label>Title</Label><Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required /></div>
            <div><Label>Description</Label><Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required /></div>
            <div><Label>Technologies (comma-separated)</Label><Input value={formData.technologies} onChange={(e) => setFormData({ ...formData, technologies: e.target.value })} placeholder="React, TypeScript, Node.js" /></div>
            <div><Label>GitHub URL</Label><Input value={formData.github_url} onChange={(e) => setFormData({ ...formData, github_url: e.target.value })} /></div>
            <div><Label>Live URL</Label><Input value={formData.live_url} onChange={(e) => setFormData({ ...formData, live_url: e.target.value })} /></div>
            <div>
              <Label>Project Image</Label>
              <FileUpload value={formData.image_url} onChange={(url) => setFormData({ ...formData, image_url: url })} folder="projects" accept="image/*" label="Upload Image" />
            </div>
            <div className="flex gap-4">
              <label className="flex items-center gap-2"><input type="checkbox" checked={formData.is_featured} onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })} />Featured</label>
              <label className="flex items-center gap-2"><input type="checkbox" checked={formData.is_visible} onChange={(e) => setFormData({ ...formData, is_visible: e.target.checked })} />Visible</label>
            </div>
            <DialogFooter><Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button><Button type="submit">Save</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
