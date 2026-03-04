import { Link } from 'react-router-dom';
import { Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

export default function UsersFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-red-600 to-red-800 text-white px-6 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <h3 className="text-2xl font-bold mb-2">Subscribe to Our Newsletter</h3>
          <p className="text-sm opacity-90 mb-6">Get the latest news delivered straight to your inbox</p>

          <form className="flex gap-2 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              className="bg-white text-gray-900"
              required
            />
            <Button
              type="submit"
              variant="secondary"
              className="px-6 whitespace-nowrap bg-white text-red-600 hover:bg-gray-100"
            >
              Subscribe
            </Button>
          </form>
        </div>
      </div>

      {/* Footer Content */}
      <div className="px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {/* About Section */}
            <div>
              <h4 className="text-white font-bold text-lg mb-4">About Us</h4>
              <p className="text-sm leading-relaxed mb-4">
                Sidha Reporting is a leading news media platform dedicated to bringing you the latest, most accurate news from around the world.
              </p>
              <div className="flex gap-3">
                {[
                  { Icon: Facebook, label: 'Facebook' },
                  { Icon: Twitter, label: 'Twitter' },
                  { Icon: Instagram, label: 'Instagram' },
                  { Icon: Linkedin, label: 'LinkedIn' },
                ].map(({ Icon, label }) => (
                  <Button
                    key={label}
                    asChild
                    variant="ghost"
                    size="icon"
                    className="rounded-full bg-white/10 text-white hover:bg-red-600 transition-colors"
                    title={label}
                  >
                    <a href="#">
                      <Icon className="w-5 h-5" />
                    </a>
                  </Button>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div>
              <h4 className="text-white font-bold text-lg mb-4">Categories</h4>
              <ul className="space-y-2 text-sm">
                {['Politics', 'Sports', 'Business', 'Technology', 'Entertainment'].map(cat => (
                  <li key={cat}>
                    <Link
                      to={`/articles?category=${cat}`}
                      className="hover:text-red-500 transition-colors"
                    >
                      {cat}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-bold text-lg mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                {[
                  { label: 'Home', href: '/' },
                  { label: 'All News', href: '/articles' },
                  { label: 'Contact Us', href: '#contact' },
                  { label: 'About', href: '#about' },
                  { label: 'Advertise', href: '#advertise' },
                ].map(link => (
                  <li key={link.label}>
                    <Link to={link.href} className="hover:text-red-500 transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-white font-bold text-lg mb-4">Contact</h4>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <Mail className="w-4 h-4 mt-1 text-red-500 flex-shrink-0" />
                  <span>binarybytebishal267@gmail.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-red-500 flex-shrink-0" />
                  <span>+977 9804211151</span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-1 text-red-500 flex-shrink-0" />
                  <span>Birgunj,Parsa,Nepal</span>
                </div>
              </div>
            </div>
          </div>

          <Separator className="bg-gray-800" />

          {/* Footer Bottom */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-8 text-sm">
            <p>&copy; {currentYear} Sidha Reporting. All rights reserved.</p>
            <div className="flex gap-4">
              {[
                { label: 'Privacy Policy', href: '#privacy' },
                { label: 'Terms & Conditions', href: '#terms' },
                { label: 'Cookie Policy', href: '#cookies' },
              ].map((link, idx, arr) => (
                <div key={link.label} className="flex items-center gap-4">
                  <a href={link.href} className="hover:text-red-500 transition-colors">
                    {link.label}
                  </a>
                  {idx < arr.length - 1 && <span className="text-gray-700">•</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}