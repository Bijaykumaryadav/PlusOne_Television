import React, { useEffect, useState } from 'react';
import { privateClient } from '@/services/axiosInstance';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { AlertCircle, CheckCircle2, Clock, Mail, Phone, MessageSquare, Trash2 } from 'lucide-react';

const AdminContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedContact, setSelectedContact] = useState(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchContacts();
    fetchStats();
  }, [statusFilter]);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      let url = '/contacts?page=1&limit=50';
      if (statusFilter) {
        url += `&status=${statusFilter}`;
      }
      const response = await privateClient.get(url);
      if (response.data.success) {
        setContacts(response.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch contacts');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await privateClient.get('/contacts/stats/overview');
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  const handleStatusUpdate = async (contactId, newStatus) => {
    try {
      const response = await privateClient.put(`/contacts/${contactId}`, {
        status: newStatus,
        adminNotes: adminNotes,
      });
      if (response.data.success) {
        setContacts(contacts.map(c =>
          c._id === contactId ? response.data.data : c
        ));
        setSelectedContact(null);
        setAdminNotes('');
        fetchStats();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update contact');
    }
  };

  const handleDelete = async (contactId) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      try {
        const response = await privateClient.delete(`/contacts/${contactId}`);
        if (response.data.success) {
          setContacts(contacts.filter(c => c._id !== contactId));
          fetchStats();
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete contact');
      }
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      new: 'bg-blue-100 text-blue-800',
      contacted: 'bg-yellow-100 text-yellow-800',
      'in-progress': 'bg-purple-100 text-purple-800',
      completed: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getSubjectLabel = (subject) => {
    const labels = {
      'ad-inquiry': 'Ad Inquiry',
      'partnership': 'Partnership',
      'other': 'Other',
    };
    return labels[subject] || subject;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm">{label}</p>
          <p className="text-3xl font-bold">{value}</p>
        </div>
        <div className={`${color} p-3 rounded-full`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Contact Form Submissions</h1>
          <p className="text-gray-600">Manage all advertisement and partnership inquiries</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
            <AlertCircle className="w-6 h-6 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-800">Error</h3>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Statistics */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <StatCard icon={Mail} label="Total Contacts" value={stats.total} color="bg-blue-500" />
            <StatCard icon={Clock} label="New" value={stats.byStatus?.find(s => s._id === 'new')?.count || 0} color="bg-yellow-500" />
            <StatCard icon={CheckCircle2} label="Completed" value={stats.byStatus?.find(s => s._id === 'completed')?.count || 0} color="bg-green-500" />
          </div>
        )}

        {/* Filter */}
        <div className="mb-6 flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Status</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {/* Contacts List */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading contacts...</p>
          </div>
        ) : contacts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <Mail className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No contacts found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {contacts.map((contact) => (
              <Card key={contact._id} className="p-6 hover:shadow-lg transition">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{contact.name}</h3>
                      <Badge className={getStatusColor(contact.status)}>
                        {contact.status}
                      </Badge>
                      <Badge className="bg-gray-100 text-gray-800">
                        {getSubjectLabel(contact.subject)}
                      </Badge>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        {contact.email}
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        {contact.phone}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">
                      {formatDate(contact.submittedAt)}
                    </p>
                  </div>
                </div>

                <div className="mb-4 bg-gray-50 rounded p-3">
                  <p className="text-sm font-medium text-gray-700 mb-1">Message:</p>
                  <p className="text-sm text-gray-600">{contact.message}</p>
                </div>

                {contact.adType && (
                  <div className="mb-4 text-sm">
                    <span className="font-medium text-gray-700">Ad Type:</span>
                    <span className="ml-2 text-gray-600">{contact.adType}</span>
                  </div>
                )}

                {contact.budget && (
                  <div className="mb-4 text-sm">
                    <span className="font-medium text-gray-700">Budget:</span>
                    <span className="ml-2 text-gray-600">{contact.budget}</span>
                  </div>
                )}

                {contact.adminNotes && (
                  <div className="mb-4 bg-blue-50 rounded p-3">
                    <p className="text-xs font-medium text-blue-700 mb-1">Admin Notes:</p>
                    <p className="text-sm text-blue-600">{contact.adminNotes}</p>
                  </div>
                )}

                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        onClick={() => {
                          setSelectedContact(contact);
                          setAdminNotes(contact.adminNotes || '');
                        }}
                        variant="outline"
                        className="flex-1"
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Update Status
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Update Contact Status</DialogTitle>
                        <DialogDescription>
                          Update the status and add admin notes for {contact.name}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Status
                          </label>
                          <select
                            value={contact.status}
                            onChange={(e) => {
                              setSelectedContact({
                                ...selectedContact,
                                status: e.target.value
                              });
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="new">New</option>
                            <option value="contacted">Contacted</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Admin Notes
                          </label>
                          <Textarea
                            value={adminNotes}
                            onChange={(e) => setAdminNotes(e.target.value)}
                            placeholder="Add notes about this contact..."
                            rows={4}
                          />
                        </div>
                        <Button
                          onClick={() => handleStatusUpdate(contact._id, selectedContact.status)}
                          className="w-full bg-blue-600 hover:bg-blue-700"
                        >
                          Update Contact
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Button
                    onClick={() => handleDelete(contact._id)}
                    variant="outline"
                    className="px-4 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminContacts;
