import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import {
  Menu,
  X,
  Globe,
  Users,
  Mail,
  Activity,
  BarChart3,
  Pen,
  Flag,
} from 'lucide-react';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { id: 'home', name: 'Home', path: '/', icon: Globe },
    { id: 'articles', name: 'Articles', path: '/articles', icon: Globe },
    { id: 'nepal-elections', name: 'Nepal Elections', icon: Flag },
    { id: 'cricket', name: 'Cricket', icon: Activity },
    { id: 'world', name: 'World', icon: Globe },
    { id: 'business', name: 'Business', icon: BarChart3 },
    { id: 'tech', name: 'Tech', icon: Pen },
    { id: 'opinion', name: 'Opinion', icon: Users },
    { id: 'contact', name: 'Contact', icon: Mail },
  ];

  return (
    <header className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <div className="text-2xl font-bold text-slate-900">SidhaReporting</div>
            <div className="text-sm text-slate-500">Reliable. Authoritative. Local & Global.</div>
          </div>

          <nav className="hidden md:flex items-center gap-2">
            {navigation.map((n) => (
              n.path ? (
                <Link key={n.id} to={n.path} className="text-sm">
                  <Button variant={n.id === 'articles' ? 'default' : 'ghost'} className={n.id === 'articles' ? 'text-sm bg-slate-900 text-white' : 'text-sm'}>
                    {n.icon && <n.icon className="h-4 w-4 mr-2" />} {n.name}
                  </Button>
                </Link>
              ) : (
                <Button key={n.id} variant="ghost" className="text-sm" onClick={() => {}}>
                  {n.icon && <n.icon className="h-4 w-4 mr-2" />} {n.name}
                </Button>
              )
            ))}
          </nav>

          <div className="md:hidden">
            <Button variant="ghost" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-2">
            <div className="flex flex-col gap-2">
              {navigation.map((n) => (
                <Button key={n.id} variant="ghost" className="justify-start" onClick={() => setMobileMenuOpen(false)}>
                  <n.icon className="h-4 w-4 mr-2" /> {n.name}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
