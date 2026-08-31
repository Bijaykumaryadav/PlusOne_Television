import { useEffect, useState } from 'react';
import UsersHeader from '../../components/users-view/users-header';
import UsersFooter from '../../components/users-view/users-footer';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, Phone, MapPin } from 'lucide-react';
import { getAboutContent } from '@/lib/siteContent';
import { setPageSEO } from '@/utils/seoUtils';

const ICONS = {
  Email: <Mail className="w-5 h-5 text-red-600" />,
  Phone: <Phone className="w-5 h-5 text-red-600" />,
  Address: <MapPin className="w-5 h-5 text-red-600" />,
};

function getInitials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase() || '')
    .join('') || 'NA';
}

export default function AboutPage() {
  const [content, setContent] = useState(getAboutContent());

  useEffect(() => {
    setContent(getAboutContent());
    setPageSEO({
      title: 'About Sidha Reporting | Nepal News and Journalism',
      description: 'Learn about Sidha Reporting, our mission, values, and commitment to trustworthy Nepal news and independent journalism.',
      keywords: 'about Sidha Reporting, Nepal journalism, Nepal news media, independent news channel Nepal',
      canonical: 'https://sidhareporting.com/about',
    });
  }, []);

  const stats = content.stats || [];
  const team = content.team || [];
  const contact = content.contact || [];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <UsersHeader />

      <section className="bg-gradient-to-r from-red-600 to-red-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <Badge className="bg-white/20 text-white border-0 mb-4 text-sm">Our Story</Badge>
          <h1 className="text-5xl font-bold mb-4">{content.heroTitle || 'About Us'}</h1>
          <p className="text-red-100 text-lg max-w-2xl mx-auto">{content.heroSubtitle}</p>
        </div>
      </section>

      {content.heroImage ? (
        <section className="max-w-7xl mx-auto px-6 py-8">
          <img src={content.heroImage} alt="About page hero" className="w-full h-72 object-cover rounded-2xl border border-slate-200" />
        </section>
      ) : null}

      <section className="bg-white py-14 border-b">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((item, i) => (
              <div key={`${item.label}-${i}`} className="text-center p-6 rounded-xl bg-gray-50 border border-gray-100">
                <div className="text-3xl font-bold text-gray-900">{item.value}</div>
                <div className="text-sm text-gray-500 mt-1">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="bg-red-100 text-red-700 border-0 mb-4">Our Mission</Badge>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{content.missionTitle || 'Our Mission'}</h2>
              <p className="text-gray-600 leading-relaxed mb-4">{content.missionText}</p>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-8 border border-red-200">
              <blockquote className="text-xl font-semibold text-red-800 italic leading-relaxed">
                "{content.quote || 'We believe in honest reporting.'}"
              </blockquote>
              <p className="text-red-600 font-medium mt-4">— {content.quoteAuthor || 'Our Team'}</p>
            </div>
          </div>
        </div>
      </section>

      {(content.messageTitle || content.messageText) && (
        <section className="bg-white py-12 border-t border-b">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{content.messageTitle || 'Message'}</h2>
            <p className="text-gray-600 leading-relaxed">{content.messageText}</p>
          </div>
        </section>
      )}

      {(content.infoTitle || content.infoText) && (
        <section className="py-12">
          <div className="max-w-4xl mx-auto px-6">
            <div className="rounded-2xl border border-red-100 bg-red-50 p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{content.infoTitle || 'Information'}</h3>
              <p className="text-gray-700 leading-relaxed">{content.infoText}</p>
            </div>
          </div>
        </section>
      )}

      <section className="bg-white py-16 border-t border-b">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Meet the Team</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {team.map((member, i) => (
              <div key={`${member.name}-${i}`} className="text-center">
                <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 border-4 border-red-100 bg-red-50 flex items-center justify-center text-xl font-bold text-red-700">
                  {member.avatar ? (
                    <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                  ) : (
                    <span>{getInitials(member.name)}</span>
                  )}
                </div>
                <h3 className="font-bold text-gray-900">{member.name}</h3>
                <p className="text-sm text-red-600">{member.role}</p>
                {member.message && <p className="text-xs text-slate-500 mt-2">{member.message}</p>}
                {member.info && <p className="text-xs text-slate-400 mt-1">{member.info}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Get In Touch</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {contact.map((item, i) => (
              <Card key={`${item.label}-${i}`} className="border border-gray-200">
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-3">{ICONS[item.label] || <Mail className="w-5 h-5 text-red-600" />}</div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{item.label}</p>
                  <p className="text-sm font-semibold text-gray-800">{item.value}</p>
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