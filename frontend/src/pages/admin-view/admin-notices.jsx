import { useState } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, Plus, Trash2, Edit2, Save, X, AlertCircle, Info, CheckCircle } from 'lucide-react';

const TYPE_OPTIONS = ['maintenance', 'info', 'policy', 'achievement'];

const TYPE_CONFIG = {
  maintenance: 'bg-yellow-100 text-yellow-700',
  info: 'bg-blue-100 text-blue-700',
  policy: 'bg-purple-100 text-purple-700',
  achievement: 'bg-green-100 text-green-700',
};

const DEFAULT_NOTICES = [
  { id: 1, title: 'Website Maintenance Scheduled – June 15, 2026', type: 'maintenance', date: '2026-06-07', summary: 'Scheduled maintenance on June 15 from 2:00 AM to 5:00 AM NPT.', content: 'Full maintenance details here.' },
  { id: 2, title: 'New Premium Subscription Plans Available', type: 'info', date: '2026-06-05', summary: 'New affordable premium plans with exclusive features.', content: 'Full subscription details here.' },
];

const EMPTY_FORM = { title: '', type: 'info', date: '', summary: '', content: '' };

export default function AdminNotices() {
  const [notices, setNotices] = useState(DEFAULT_NOTICES);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      setNotices(notices.map(n => n.id === editingId ? { ...form, id: editingId } : n));
      setEditingId(null);
      toast.success('Notice updated successfully');
    } else {
      setNotices([{ ...form, id: Date.now() }, ...notices]);
      toast.success('Notice created successfully');
    }
    setForm(EMPTY_FORM);
    setShowForm(false);
  };

  const handleEdit = (notice) => {
    setForm({ title: notice.title, type: notice.type, date: notice.date, summary: notice.summary, content: notice.content });
    setEditingId(notice.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    setNotices(notices.filter(n => n.id !== id));
    setDeleteConfirm(null);
    toast.success('Notice deleted successfully');
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Bell className="w-6 h-6 text-red-600" /> Notices Management
          </h1>
          <p className="text-gray-500 text-sm mt-1">Create and manage public notices and announcements</p>
        </div>
        <Button
          onClick={() => { setShowForm(!showForm); setEditingId(null); setForm(EMPTY_FORM); }}
          className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> New Notice
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {TYPE_OPTIONS.map(type => (
          <Card key={type} className="border border-gray-200">
            <CardContent className="p-4 text-center">
              <div className={`inline-block px-2 py-1 rounded text-xs font-medium mb-2 ${TYPE_CONFIG[type]}`}>
                {type}
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {notices.filter(n => n.type === type).length}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Form */}
      {showForm && (
        <Card className="border border-red-200 shadow-md">
          <CardHeader className="border-b border-gray-100 pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              {editingId ? <><Edit2 className="w-4 h-4 text-blue-600" /> Edit Notice</> : <><Plus className="w-4 h-4 text-red-600" /> Create Notice</>}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Title *</label>
                  <input
                    required
                    value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })}
                    placeholder="Notice title"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">Type *</label>
                    <select
                      value={form.type}
                      onChange={e => setForm({ ...form, type: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
                    >
                      {TYPE_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">Date *</label>
                    <input
                      required
                      type="date"
                      value={form.date}
                      onChange={e => setForm({ ...form, date: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
                    />
                  </div>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Summary *</label>
                <input
                  required
                  value={form.summary}
                  onChange={e => setForm({ ...form, summary: e.target.value })}
                  placeholder="Short summary shown in the list"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Full Content *</label>
                <textarea
                  required
                  rows={5}
                  value={form.content}
                  onChange={e => setForm({ ...form, content: e.target.value })}
                  placeholder="Full notice content shown when expanded"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300 resize-none"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="submit" className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2">
                  <Save className="w-4 h-4" /> {editingId ? 'Update Notice' : 'Publish Notice'}
                </Button>
                <Button type="button" variant="outline" onClick={handleCancel} className="flex items-center gap-2">
                  <X className="w-4 h-4" /> Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Notices Table */}
      <Card className="border border-gray-200">
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="text-lg">All Notices ({notices.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {notices.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <Bell className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p>No notices yet. Create your first one.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {notices.map(notice => (
                <div key={notice.id} className="p-5 flex items-start gap-4 hover:bg-gray-50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap gap-2 mb-1">
                      <Badge className={`text-xs ${TYPE_CONFIG[notice.type]}`}>{notice.type}</Badge>
                      <span className="text-xs text-gray-400">{new Date(notice.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 text-sm">{notice.title}</h3>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-1">{notice.summary}</p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(notice)}
                      className="h-8 w-8 p-0 border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </Button>
                    {deleteConfirm === notice.id ? (
                      <div className="flex gap-1">
                        <Button size="sm" onClick={() => handleDelete(notice.id)} className="h-8 px-2 bg-red-600 hover:bg-red-700 text-white text-xs">
                          Confirm
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setDeleteConfirm(null)} className="h-8 px-2 text-xs">
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setDeleteConfirm(notice.id)}
                        className="h-8 w-8 p-0 border-red-200 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}