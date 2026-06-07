import UsersHeader from '../../components/users-view/users-header';
import UsersFooter from '../../components/users-view/users-footer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Briefcase, MapPin, Clock, ChevronRight, Users, Target, Heart } from 'lucide-react';
import { useState } from 'react';

const JOBS = [
  {
    id: 1,
    title: 'Senior Reporter',
    department: 'Editorial',
    location: 'Kathmandu, Nepal',
    type: 'Full-time',
    description: 'We are looking for an experienced reporter to cover breaking news and in-depth stories across Nepal.',
    requirements: ['5+ years of journalism experience', 'Excellent written and verbal communication', 'Ability to work under tight deadlines', 'Experience with digital media'],
  },
  {
    id: 2,
    title: 'Video Journalist',
    department: 'Media',
    location: 'Kathmandu, Nepal',
    type: 'Full-time',
    description: 'Join our growing video team to produce compelling video content for our digital platforms.',
    requirements: ['3+ years video production experience', 'Proficiency in video editing software', 'Strong storytelling skills', 'Experience with live streaming'],
  },
  {
    id: 3,
    title: 'Digital Content Writer',
    department: 'Editorial',
    location: 'Remote',
    type: 'Part-time',
    description: 'Create engaging digital content covering politics, business, and lifestyle topics.',
    requirements: ['2+ years content writing experience', 'SEO knowledge', 'Strong research skills', 'Fluent in Nepali and English'],
  },
  {
    id: 4,
    title: 'Social Media Manager',
    department: 'Marketing',
    location: 'Kathmandu, Nepal',
    type: 'Full-time',
    description: 'Manage and grow our social media presence across all platforms.',
    requirements: ['3+ years social media experience', 'Strong analytical skills', 'Creative mindset', 'Experience with social media tools'],
  },
  {
    id: 5,
    title: 'Frontend Developer',
    department: 'Technology',
    location: 'Kathmandu / Remote',
    type: 'Full-time',
    description: 'Build and maintain our digital news platform with modern web technologies.',
    requirements: ['3+ years React experience', 'Strong CSS and Tailwind skills', 'API integration experience', 'Performance optimization knowledge'],
  },
];

const VALUES = [
  { icon: <Target className="w-6 h-6 text-red-600" />, title: 'Truth First', desc: 'We are committed to honest, accurate, and unbiased reporting at all times.' },
  { icon: <Users className="w-6 h-6 text-red-600" />, title: 'Inclusive Team', desc: 'We celebrate diversity and believe great journalism comes from diverse perspectives.' },
  { icon: <Heart className="w-6 h-6 text-red-600" />, title: 'People Driven', desc: 'Our team is our greatest asset. We invest in your growth and wellbeing.' },
];

export default function CareerPage() {
  const [selectedJob, setSelectedJob] = useState(null);
  const [applied, setApplied] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });

  const handleApply = (e) => {
    e.preventDefault();
    setApplied(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <UsersHeader />

      {/* Hero */}
      <section className="bg-gradient-to-r from-red-600 to-red-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <Badge className="bg-white/20 text-white border-0 mb-4 text-sm">We're Hiring</Badge>
          <h1 className="text-5xl font-bold mb-4">Join Sidha Reporting</h1>
          <p className="text-red-100 text-lg max-w-2xl mx-auto">
            Be part of Nepal's most trusted news platform. Help us tell the stories that matter.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="bg-white py-16 border-b">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Why Work With Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {VALUES.map((v, i) => (
              <div key={i} className="text-center p-6 rounded-xl bg-gray-50 border border-gray-100">
                <div className="flex justify-center mb-4">{v.icon}</div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{v.title}</h3>
                <p className="text-gray-600 text-sm">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Job Listings */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-10">Open Positions</h2>
          <div className="space-y-4">
            {JOBS.map(job => (
              <Card
                key={job.id}
                className={`cursor-pointer hover:shadow-md transition-all border ${selectedJob?.id === job.id ? 'border-red-400 ring-1 ring-red-300' : 'border-gray-200'}`}
                onClick={() => setSelectedJob(selectedJob?.id === job.id ? null : job)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex flex-wrap gap-2 mb-2">
                        <Badge className="bg-red-100 text-red-700 border-0">{job.department}</Badge>
                        <Badge variant="outline" className="text-gray-600">
                          <Clock className="w-3 h-3 mr-1" />{job.type}
                        </Badge>
                        <Badge variant="outline" className="text-gray-600">
                          <MapPin className="w-3 h-3 mr-1" />{job.location}
                        </Badge>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <Briefcase className="w-5 h-5 text-red-600" /> {job.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">{job.description}</p>
                    </div>
                    <ChevronRight className={`w-5 h-5 text-gray-400 mt-1 flex-shrink-0 transition-transform ${selectedJob?.id === job.id ? 'rotate-90' : ''}`} />
                  </div>

                  {selectedJob?.id === job.id && (
                    <div className="mt-5 pt-5 border-t border-gray-100">
                      <h4 className="font-semibold text-gray-800 mb-3">Requirements</h4>
                      <ul className="space-y-1 mb-6">
                        {job.requirements.map((req, i) => (
                          <li key={i} className="text-sm text-gray-600 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-red-500 rounded-full flex-shrink-0" />
                            {req}
                          </li>
                        ))}
                      </ul>

                      {!applied ? (
                        <form onSubmit={handleApply} className="space-y-3 bg-gray-50 p-4 rounded-lg border border-gray-100">
                          <h4 className="font-semibold text-gray-800 mb-2">Apply for this position</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <input required placeholder="Full Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                              className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-red-300" />
                            <input required type="email" placeholder="Email Address" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                              className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-red-300" />
                          </div>
                          <input placeholder="Phone Number" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                            className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-red-300" />
                          <textarea rows={3} placeholder="Why do you want to join us?" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                            className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-red-300 resize-none" />
                          <Button type="submit" className="bg-red-600 hover:bg-red-700 text-white w-full">
                            Submit Application
                          </Button>
                        </form>
                      ) : (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                          <p className="text-green-700 font-semibold">✅ Application submitted!</p>
                          <p className="text-green-600 text-sm mt-1">We'll get back to you within 5–7 business days.</p>
                          <button onClick={() => { setApplied(false); setForm({ name: '', email: '', phone: '', message: '' }); }}
                            className="text-xs text-gray-500 underline mt-2">Apply for another position</button>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <UsersFooter />
    </div>
  );
}