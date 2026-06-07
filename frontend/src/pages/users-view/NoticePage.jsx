import { useState } from 'react';
import UsersHeader from '../../components/users-view/users-header';
import UsersFooter from '../../components/users-view/users-footer';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Bell, Calendar, ChevronDown, ChevronUp, AlertCircle, Info, CheckCircle } from 'lucide-react';

const NOTICES = [
  {
    id: 1,
    title: 'Website Maintenance Scheduled – June 15, 2026',
    type: 'maintenance',
    date: '2026-06-07',
    summary: 'The website will undergo scheduled maintenance on June 15 from 2:00 AM to 5:00 AM NPT.',
    content: 'We will be performing essential server upgrades and database optimizations on June 15, 2026, between 2:00 AM and 5:00 AM Nepal Time. During this period, the website and mobile app may be intermittently unavailable. We apologize for any inconvenience and thank you for your patience. All scheduled articles will be published as normal once maintenance is complete.',
  },
  {
    id: 2,
    title: 'New Premium Subscription Plans Available',
    type: 'info',
    date: '2026-06-05',
    summary: 'We have launched new affordable premium plans with exclusive features for our readers.',
    content: 'Starting June 5, 2026, Sidha Reporting offers three premium subscription tiers: Basic (NPR 99/month), Standard (NPR 199/month), and Pro (NPR 399/month). Premium subscribers get ad-free browsing, early access to breaking news, exclusive investigative reports, and a weekly newsletter digest. Subscribe via Khalti on the Payment page.',
  },
  {
    id: 3,
    title: 'Updated Privacy Policy – Effective July 1, 2026',
    type: 'policy',
    date: '2026-06-01',
    summary: 'Our privacy policy has been updated to comply with new data protection regulations.',
    content: 'In line with Nepal\'s evolving data protection framework, we have updated our Privacy Policy effective July 1, 2026. Key changes include: enhanced transparency around data collection, a new data deletion request process, and clearer cookie consent options. We encourage all users to review the updated policy. No action is required, but continued use of the platform constitutes acceptance.',
  },
  {
    id: 4,
    title: 'Press Freedom Award 2026 – Sidha Reporting Recognized',
    type: 'achievement',
    date: '2026-05-25',
    summary: 'We are honored to receive the National Press Freedom Award for investigative journalism.',
    content: 'Sidha Reporting has been awarded the National Press Freedom Award 2026 in the category of Investigative Digital Journalism. This recognition is a testament to the courage and dedication of our entire editorial team. We dedicate this award to every source who trusted us with their story and every reader who stood by independent journalism. We will continue to hold truth above all.',
  },
  {
    id: 5,
    title: 'Comment Section Temporarily Disabled',
    type: 'maintenance',
    date: '2026-05-20',
    summary: 'Article comments have been paused while we upgrade our moderation system.',
    content: 'To combat misinformation and ensure a healthy discussion environment, we are upgrading our comment moderation infrastructure. During this transition (estimated 2–3 weeks), the comment section on all articles will be temporarily disabled. We appreciate your understanding and look forward to relaunching comments with improved tools.',
  },
];

const TYPE_CONFIG = {
  maintenance: { color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: <AlertCircle className="w-4 h-4" />, dot: 'bg-yellow-500' },
  info: { color: 'bg-blue-100 text-blue-700 border-blue-200', icon: <Info className="w-4 h-4" />, dot: 'bg-blue-500' },
  policy: { color: 'bg-purple-100 text-purple-700 border-purple-200', icon: <Bell className="w-4 h-4" />, dot: 'bg-purple-500' },
  achievement: { color: 'bg-green-100 text-green-700 border-green-200', icon: <CheckCircle className="w-4 h-4" />, dot: 'bg-green-500' },
};

export default function NoticePage() {
  const [expanded, setExpanded] = useState(null);
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? NOTICES : NOTICES.filter(n => n.type === filter);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <UsersHeader />

      {/* Hero */}
      <section className="bg-gradient-to-r from-red-600 to-red-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <Badge className="bg-white/20 text-white border-0 mb-4 text-sm">Official Announcements</Badge>
          <h1 className="text-4xl font-bold mb-3">Notices & Updates</h1>
          <p className="text-red-100 text-lg">Stay informed about platform updates, policies, and announcements.</p>
        </div>
      </section>

      {/* Filter tabs */}
      <section className="bg-white border-b py-4">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {['all', 'maintenance', 'info', 'policy', 'achievement'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium flex-shrink-0 transition-colors border ${
                  filter === f
                    ? 'bg-red-600 text-white border-red-600'
                    : 'bg-white text-gray-600 border-gray-300 hover:border-red-300 hover:text-red-600'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Notices list */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-6 space-y-4">
          {filtered.length === 0 && (
            <div className="text-center py-16 text-gray-500">No notices found for this category.</div>
          )}
          {filtered.map(notice => {
            const config = TYPE_CONFIG[notice.type];
            const isOpen = expanded === notice.id;
            return (
              <Card
                key={notice.id}
                className={`border transition-all duration-200 ${isOpen ? 'border-red-300 shadow-md' : 'border-gray-200 hover:shadow-sm'}`}
              >
                <CardContent className="p-0">
                  <button
                    className="w-full text-left p-5 flex items-start gap-4"
                    onClick={() => setExpanded(isOpen ? null : notice.id)}
                  >
                    <span className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${config.dot}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap gap-2 mb-1">
                        <Badge className={`text-xs border ${config.color} flex items-center gap-1`}>
                          {config.icon} {notice.type}
                        </Badge>
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(notice.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </span>
                      </div>
                      <h3 className="font-bold text-gray-900 text-base">{notice.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">{notice.summary}</p>
                    </div>
                    <div className="flex-shrink-0 mt-1 text-gray-400">
                      {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-0 border-t border-gray-100">
                      <p className="text-sm text-gray-700 leading-relaxed mt-4">{notice.content}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <UsersFooter />
    </div>
  );
}