import { useEffect, useState } from 'react';
import { Mail, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/Dialog';
import { toast } from '@/components/ui/Toaster';
import AdminLayout from '@/components/admin/AdminLayout';
import { supabase } from '@/lib/supabase';
import { formatFullDate } from '@/lib/utils';
import type { Contact } from '@/types';

export default function AdminMessages() {
  const [messages, setMessages] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<Contact | null>(null);

  useEffect(() => { fetchMessages(); }, []);

  async function fetchMessages() {
    const { data } = await supabase.from('contacts').select('*').order('created_at', { ascending: false });
    setMessages(data || []);
    setLoading(false);
  }

  const markAsRead = async (id: string) => {
    await supabase.from('contacts').update({ is_read: true }).eq('id', id);
    fetchMessages();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this message?')) return;
    await supabase.from('contacts').delete().eq('id', id);
    toast({ title: 'Deleted', variant: 'success' });
    fetchMessages();
    setSelectedMessage(null);
  };

  const openMessage = async (message: Contact) => {
    setSelectedMessage(message);
    if (!message.is_read) await markAsRead(message.id);
  };

  const unreadCount = messages.filter((m) => !m.is_read).length;

  return (
    <AdminLayout title="Messages">
      <div className="flex justify-between items-center mb-6">
        <p className="text-muted-foreground">{messages.length} messages {unreadCount > 0 && <Badge variant="destructive" className="ml-2">{unreadCount} unread</Badge>}</p>
      </div>

      {loading ? (
        <div className="space-y-4">{[1,2,3].map((i) => <div key={i} className="h-20 bg-muted rounded-xl animate-pulse" />)}</div>
      ) : messages.length === 0 ? (
        <div className="text-center py-12"><Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" /><p className="text-muted-foreground">No messages yet</p></div>
      ) : (
        <div className="space-y-4">
          {messages.map((message) => (
            <Card key={message.id} className={`cursor-pointer hover:shadow-md transition-shadow ${!message.is_read ? 'border-primary/50 bg-primary/5' : ''}`} onClick={() => openMessage(message)}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold">{message.name}</span>
                      {!message.is_read && <Badge>New</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{message.email}</p>
                    {message.subject && <p className="text-sm font-medium mb-1">{message.subject}</p>}
                    <p className="text-sm text-muted-foreground truncate">{message.message}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-xs text-muted-foreground whitespace-nowrap">{formatFullDate(message.created_at)}</span>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); openMessage(message); }}><Eye className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); handleDelete(message.id); }}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!selectedMessage} onOpenChange={() => setSelectedMessage(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Message from {selectedMessage?.name}</DialogTitle></DialogHeader>
          {selectedMessage && (
            <div className="space-y-4">
              <div><p className="text-sm text-muted-foreground">From</p><p className="font-medium">{selectedMessage.name}</p><a href={`mailto:${selectedMessage.email}`} className="text-sm text-primary hover:underline">{selectedMessage.email}</a></div>
              {selectedMessage.subject && <div><p className="text-sm text-muted-foreground">Subject</p><p className="font-medium">{selectedMessage.subject}</p></div>}
              <div><p className="text-sm text-muted-foreground">Message</p><p className="whitespace-pre-wrap">{selectedMessage.message}</p></div>
              <div><p className="text-sm text-muted-foreground">Received</p><p>{formatFullDate(selectedMessage.created_at)}</p></div>
              <div className="flex gap-2 pt-4">
                <Button asChild className="flex-1"><a href={`mailto:${selectedMessage.email}`}>Reply via Email</a></Button>
                <Button variant="destructive" onClick={() => handleDelete(selectedMessage.id)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}