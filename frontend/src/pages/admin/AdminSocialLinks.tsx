import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Link as LinkIcon, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/Dialog';
import { toast } from '@/components/ui/Toaster';
import AdminLayout from '@/components/admin/AdminLayout';
import { supabase } from '@/lib/supabase';
import type { SocialLink } from '@/types';

const platformOptions = [
  { value: 'github', label: 'GitHub' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'twitter', label: 'Twitter' },
  { value: 'email', label: 'Email' },
  { value: 'website', label: 'Website' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'dribbble', label: 'Dribbble' },
];

export default function AdminSocialLinks() {
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<SocialLink | null>(null);
  const [formData, setFormData] = useState({
    platform: 'github',
    url: '',
    is_visible: true,
  });

  useEffect(() => {
    fetchLinks();
  }, []);

  async function fetchLinks() {
    const { data } = await supabase
      .from('social_links')
      .select('*')
      .order('display_order');
    setLinks(data || []);
    setLoading(false);
  }

  const openDialog = (link?: SocialLink) => {
    if (link) {
      setEditingLink(link);
      setFormData({
        platform: link.platform,
        url: link.url,
        is_visible: link.is_visible,
      });
    } else {
      setEditingLink(null);
      setFormData({
        platform: 'github',
        url: '',
        is_visible: true,
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingLink) {
        await supabase
          .from('social_links')
          .update(formData)
          .eq('id', editingLink.id);
        toast({ title: 'Link updated', variant: 'success' });
      } else {
        const newOrder = links.length;
        await supabase
          .from('social_links')
          .insert([{ ...formData, display_order: newOrder }]);
        toast({ title: 'Link added', variant: 'success' });
      }
      setIsDialogOpen(false);
      fetchLinks();
    } catch (error) {
      toast({ title: 'Error saving link', variant: 'destructive' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this social link?')) return;
    await supabase.from('social_links').delete().eq('id', id);
    toast({ title: 'Link deleted', variant: 'success' });
    fetchLinks();
  };

  const toggleVisibility = async (link: SocialLink) => {
    await supabase
      .from('social_links')
      .update({ is_visible: !link.is_visible })
      .eq('id', link.id);
    fetchLinks();
  };

  return (
    <AdminLayout title="Social Links">
      <div className="flex justify-between items-center mb-6">
        <p className="text-muted-foreground">{links.length} social links</p>
        <Button onClick={() => openDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          Add Link
        </Button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-muted rounded-xl animate-pulse" />
          ))}
        </div>
      ) : links.length === 0 ? (
        <div className="text-center py-12">
          <LinkIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">No social links yet</p>
          <Button onClick={() => openDialog()}>
            <Plus className="mr-2 h-4 w-4" />
            Add Your First Link
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {links.map((link) => (
            <Card
              key={link.id}
              className={!link.is_visible ? 'opacity-60' : ''}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <GripVertical className="h-5 w-5 text-muted-foreground cursor-move" />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium capitalize">{link.platform}</span>
                      {!link.is_visible && <Badge variant="secondary">Hidden</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{link.url}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleVisibility(link)}
                    >
                      {link.is_visible ? 'Hide' : 'Show'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openDialog(link)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(link.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingLink ? 'Edit Social Link' : 'Add Social Link'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Platform</Label>
              <select
                value={formData.platform}
                onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                className="w-full mt-1.5 px-3 py-2 border border-input bg-background rounded-md text-sm"
              >
                {platformOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label>URL</Label>
              <Input
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder={
                  formData.platform === 'email'
                    ? 'mailto:your@email.com'
                    : 'https://...'
                }
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                {formData.platform === 'email'
                  ? 'Use mailto: prefix for email links'
                  : 'Enter the full URL including https://'}
              </p>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_visible}
                onChange={(e) => setFormData({ ...formData, is_visible: e.target.checked })}
                className="rounded"
              />
              <span className="text-sm">Visible on website</span>
            </label>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {editingLink ? 'Update' : 'Add'} Link
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
