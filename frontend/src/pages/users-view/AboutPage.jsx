import UsersHeader from '../../components/users-view/users-header';
import UsersFooter from '../../components/users-view/users-footer';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Newspaper, Users, Globe, Award, Mail, Phone, MapPin } from 'lucide-react';

const TEAM = [
  { name: 'Rajesh Sharma', role: 'Editor in Chief', avatar: 'https://i.pravatar.cc/150?img=11' },
  { name: 'Priya Thapa', role: 'Senior Reporter', avatar: 'https://i.pravatar.cc/150?img=47' },
  { name: 'Bikash Rai', role: 'Head of Technology', avatar: 'https://i.pravatar.cc/150?img=15' },
  { name: 'Sita Gurung', role: 'Multimedia Editor', avatar: 'https://i.pravatar.cc/150?img=45' },
];

const STATS = [
  { icon: <Newspaper className="w-6 h-6 text-red-600" />, value: '10,000+', label: 'Articles Published' },
  { icon: <Users className="w-6 h-6 text-red-600" />, value: '500K+', label: 'Monthly Readers' },
  { icon: <Globe className="w-6 h-6 text-red-600" />, value: '25+', label: 'Districts Covered' },
  { icon: <Award className="w-6 h-6 text-red-600" />, value: '8+', label: 'Years of Service' },
];

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <UsersHeader />

      {/* Hero */}
      <section className="bg-gradient-to-r from-red-600 to-red-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <Badge className="bg-white/20 text-white border-0 mb-4 text-sm">Our Story</Badge>
          <h1 className="text-5xl font-bold mb-4">About Sidha Reporting</h1>
          <p className="text-red-100 text-lg max-w-2xl mx-auto">
            Nepal's trusted source for honest, fearless, and independent journalism since 2016.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white py-14 border-b">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((s, i) => (
              <div key={i} className="text-center p-6 rounded-xl bg-gray-50 border border-gray-100">
                <div className="flex justify-center mb-3">{s.icon}</div>
                <div className="text-3xl font-bold text-gray-900">{s.value}</div>
                <div className="text-sm text-gray-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="bg-red-100 text-red-700 border-0 mb-4">Our Mission</Badge>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Journalism That Serves the People</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Sidha Reporting was founded with a single purpose: to deliver news that is direct, unfiltered, and in service of the Nepali people. In a media landscape often clouded by bias and commercial interests, we stand for clarity and truth.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                Our reporters are embedded in communities across Nepal — from the hills of Humla to the streets of Kathmandu — ensuring that every story gets the attention it deserves, regardless of political pressure or commercial influence.
              </p>
              <p className="text-gray-600 leading-relaxed">
                We believe an informed citizenry is the foundation of a healthy democracy. That's why everything we publish is fact-checked, sourced, and written with integrity.
              </p>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-8 border border-red-200">
              <blockquote className="text-xl font-semibold text-red-800 italic leading-relaxed">
                "Our job is not to tell people what to think, but to give them what they need to think for themselves."
              </blockquote>
              <p className="text-red-600 font-medium mt-4">— Rajesh Sharma, Editor in Chief</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="bg-white py-16 border-t border-b">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Meet the Team</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {TEAM.map((member, i) => (
              <div key={i} className="text-center">
                <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 border-4 border-red-100">
                  <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="font-bold text-gray-900">{member.name}</h3>
                <p className="text-sm text-red-600">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Get In Touch</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              { icon: <Mail className="w-5 h-5 text-red-600" />, label: 'Email', value: 'contact@sidhareporting.com' },
              { icon: <Phone className="w-5 h-5 text-red-600" />, label: 'Phone', value: '+977 01-4XXXXXX' },
              { icon: <MapPin className="w-5 h-5 text-red-600" />, label: 'Address', value: 'Kathmandu, Nepal' },
            ].map((c, i) => (
              <Card key={i} className="border border-gray-200">
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-3">{c.icon}</div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{c.label}</p>
                  <p className="text-sm font-semibold text-gray-800">{c.value}</p>
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