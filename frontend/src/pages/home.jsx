import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Menu, X, Tv, Radio, Newspaper, Users, Mail, Phone, MapPin, Play, ChevronRight } from 'lucide-react';

const PlusOneTV = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const navigation = [
    { name: 'Home', id: 'home', icon: Tv },
    { name: 'About Us', id: 'about', icon: Users },
    { name: 'Programs', id: 'programs', icon: Play },
    { name: 'News', id: 'news', icon: Newspaper },
    { name: 'Contact', id: 'contact', icon: Mail },
  ];

  const programs = [
    { title: 'Morning Headlines', time: '6:00 AM - 8:00 AM', description: 'Start your day with comprehensive news coverage' },
    { title: 'Prime Time News', time: '8:00 PM - 9:00 PM', description: 'In-depth analysis of the day\'s top stories' },
    { title: 'Sports Tonight', time: '9:00 PM - 10:00 PM', description: 'Complete sports coverage and highlights' },
    { title: 'Business Hour', time: '12:00 PM - 1:00 PM', description: 'Market updates and financial insights' },
    { title: 'Entertainment Plus', time: '7:00 PM - 8:00 PM', description: 'Celebrity interviews and entertainment news' },
    { title: 'Tech Talk', time: '10:00 PM - 11:00 PM', description: 'Latest in technology and innovation' },
  ];

  const newsItems = [
    { title: 'Breaking: Major Policy Announcement', date: 'December 18, 2025', category: 'Politics' },
    { title: 'Local Community Initiative Launches', date: 'December 17, 2025', category: 'Community' },
    { title: 'Sports Team Achieves Historic Victory', date: 'December 16, 2025', category: 'Sports' },
    { title: 'Technology Sector Shows Growth', date: 'December 15, 2025', category: 'Business' },
  ];

  const handleSubmit = () => {
    setFormSubmitted(true);
    setTimeout(() => setFormSubmitted(false), 5000);
    setFormData({ name: '', email: '', message: '' });
  };

  const HomePage = () => (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg p-12 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full blur-3xl opacity-20"></div>
        <div className="relative z-10">
          <h1 className="text-5xl font-bold mb-4">Welcome to Plus One Television</h1>
          <p className="text-xl mb-6 max-w-2xl">Your trusted source for news, entertainment, and information. Broadcasting excellence 24/7.</p>
          <Button size="lg" className="bg-white text-red-600 hover:bg-gray-100">
            Watch Live <Play className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Featured Programs */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Featured Programs</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {programs.slice(0, 3).map((program, index) => (
            <Card key={index} className="border-t-4 border-red-600 hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-red-600">{program.title}</CardTitle>
                <CardDescription className="text-blue-600 font-semibold">{program.time}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{program.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Latest News Preview */}
      <div className="bg-blue-50 rounded-lg p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Latest Updates</h2>
        <div className="space-y-4">
          {newsItems.slice(0, 2).map((item, index) => (
            <div key={index} className="bg-white p-4 rounded-lg border-l-4 border-red-600 hover:shadow-md transition-shadow">
              <span className="text-blue-600 text-sm font-semibold">{item.category}</span>
              <h3 className="text-lg font-bold text-gray-900 mt-1">{item.title}</h3>
              <p className="text-gray-500 text-sm mt-1">{item.date}</p>
            </div>
          ))}
        </div>
        <Button variant="outline" className="mt-6 border-red-600 text-red-600 hover:bg-red-50" onClick={() => setCurrentPage('news')}>
          View All News <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  const AboutPage = () => (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-red-600 to-blue-600 text-white rounded-lg p-8">
        <h1 className="text-4xl font-bold mb-4">About Plus One Television</h1>
        <p className="text-lg">Excellence in Broadcasting Since Our Inception</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-red-600">Our Mission</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 leading-relaxed">
            Plus One Television is committed to delivering high-quality, accurate, and engaging content to our viewers. We strive to inform, educate, and entertain while maintaining the highest standards of journalism and broadcasting excellence.
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-t-4 border-red-600">
          <CardHeader>
            <CardTitle className="text-blue-600">Integrity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">We uphold the highest ethical standards in all our broadcasts and maintain transparency with our audience.</p>
          </CardContent>
        </Card>
        <Card className="border-t-4 border-blue-600">
          <CardHeader>
            <CardTitle className="text-red-600">Innovation</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Embracing cutting-edge technology to deliver content across multiple platforms and devices.</p>
          </CardContent>
        </Card>
        <Card className="border-t-4 border-red-600">
          <CardHeader>
            <CardTitle className="text-blue-600">Community</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Serving our local and global communities with relevant, impactful programming.</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-blue-600">Our Team</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 leading-relaxed mb-4">
            Our dedicated team of journalists, producers, technicians, and creative professionals work tirelessly to bring you the best in television broadcasting. With decades of combined experience, we are passionate about delivering content that matters.
          </p>
          <p className="text-gray-700 leading-relaxed">
            From breaking news to entertainment specials, our team is committed to excellence in every aspect of production and presentation.
          </p>
        </CardContent>
      </Card>
    </div>
  );

  const ProgramsPage = () => (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-blue-600 to-red-600 text-white rounded-lg p-8">
        <h1 className="text-4xl font-bold mb-4">Our Programs</h1>
        <p className="text-lg">Quality content throughout the day</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {programs.map((program, index) => (
          <Card key={index} className="hover:shadow-xl transition-shadow border-l-4 border-red-600">
            <CardHeader className="bg-gradient-to-r from-red-50 to-blue-50">
              <CardTitle className="text-xl text-red-600">{program.title}</CardTitle>
              <CardDescription className="text-blue-600 font-semibold text-base">{program.time}</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-gray-700">{program.description}</p>
              <Button variant="outline" className="mt-4 border-blue-600 text-blue-600 hover:bg-blue-50">
                Learn More
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-gradient-to-r from-red-600 to-blue-600 text-white">
        <CardHeader>
          <CardTitle className="text-2xl">Custom Programming</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Interested in sponsoring a program or proposing new content? We're always looking for innovative programming ideas.</p>
          <Button className="bg-white text-red-600 hover:bg-gray-100" onClick={() => setCurrentPage('contact')}>
            Contact Us
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const NewsPage = () => (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-red-600 to-blue-600 text-white rounded-lg p-8">
        <h1 className="text-4xl font-bold mb-4">Latest News</h1>
        <p className="text-lg">Stay informed with Plus One Television</p>
      </div>

      <div className="space-y-4">
        {newsItems.map((item, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow border-l-4 border-blue-600">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-red-600 text-sm font-semibold uppercase">{item.category}</span>
                  <CardTitle className="text-xl mt-2">{item.title}</CardTitle>
                  <CardDescription className="mt-1">{item.date}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Stay tuned for detailed coverage and analysis of this developing story.</p>
              <Button variant="outline" className="border-red-600 text-red-600 hover:bg-red-50">
                Read More <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-blue-50">
        <CardHeader>
          <CardTitle className="text-2xl text-blue-600">News Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 mb-4">Subscribe to receive breaking news alerts directly to your inbox.</p>
          <div className="flex gap-2">
            <Input placeholder="Enter your email" className="max-w-md" />
            <Button className="bg-red-600 hover:bg-red-700">Subscribe</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const ContactPage = () => (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-red-600 to-blue-600 text-white rounded-lg p-8">
        <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
        <p className="text-lg">We'd love to hear from you</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-red-600">Get In Touch</CardTitle>
            <CardDescription>Fill out the form and we'll get back to you shortly</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <Input 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <Input 
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <Textarea 
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  rows={5}
                />
              </div>
              <Button onClick={handleSubmit} className="w-full bg-red-600 hover:bg-red-700">
                Send Message
              </Button>
            </div>
            {formSubmitted && (
              <Alert className="mt-4 border-green-600 bg-green-50">
                <AlertDescription className="text-green-800">
                  Thank you! Your message has been sent successfully.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-l-4 border-red-600">
            <CardHeader>
              <CardTitle className="flex items-center text-blue-600">
                <Phone className="mr-2 h-5 w-5" />
                Phone
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">+977-1-XXXXXXX</p>
              <p className="text-gray-500 text-sm mt-1">Mon-Fri, 9:00 AM - 6:00 PM</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-blue-600">
            <CardHeader>
              <CardTitle className="flex items-center text-red-600">
                <Mail className="mr-2 h-5 w-5" />
                Email
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">info@plusonetv.com</p>
              <p className="text-gray-500 text-sm mt-1">We'll respond within 24 hours</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-red-600">
            <CardHeader>
              <CardTitle className="flex items-center text-blue-600">
                <MapPin className="mr-2 h-5 w-5" />
                Location
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">Kathmandu, Nepal</p>
              <p className="text-gray-500 text-sm mt-1">Visit us during business hours</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  const renderPage = () => {
    switch(currentPage) {
      case 'home': return <HomePage />;
      case 'about': return <AboutPage />;
      case 'programs': return <ProgramsPage />;
      case 'news': return <NewsPage />;
      case 'contact': return <ContactPage />;
      default: return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-red-600 to-blue-600 text-white p-2 rounded-lg">
                <Tv className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Plus One Television</h1>
                <p className="text-sm text-blue-600">Broadcasting Excellence</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-1">
              {navigation.map((item) => (
                <Button
                  key={item.id}
                  variant={currentPage === item.id ? "default" : "ghost"}
                  className={currentPage === item.id ? "bg-red-600 hover:bg-red-700" : "text-gray-700 hover:text-red-600"}
                  onClick={() => setCurrentPage(item.id)}
                >
                  <item.icon className="h-4 w-4 mr-2" />
                  {item.name}
                </Button>
              ))}
            </nav>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="md:hidden py-4 space-y-2">
              {navigation.map((item) => (
                <Button
                  key={item.id}
                  variant={currentPage === item.id ? "default" : "ghost"}
                  className={`w-full justify-start ${currentPage === item.id ? "bg-red-600 hover:bg-red-700" : "text-gray-700 hover:text-red-600"}`}
                  onClick={() => {
                    setCurrentPage(item.id);
                    setMobileMenuOpen(false);
                  }}
                >
                  <item.icon className="h-4 w-4 mr-2" />
                  {item.name}
                </Button>
              ))}
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderPage()}
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-red-600 to-blue-600 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Plus One Television</h3>
              <p className="text-blue-100">Your trusted source for news and entertainment.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-blue-100">
                <li><button onClick={() => setCurrentPage('home')} className="hover:text-white">Home</button></li>
                <li><button onClick={() => setCurrentPage('about')} className="hover:text-white">About Us</button></li>
                <li><button onClick={() => setCurrentPage('programs')} className="hover:text-white">Programs</button></li>
                <li><button onClick={() => setCurrentPage('news')} className="hover:text-white">News</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Programs</h4>
              <ul className="space-y-2 text-blue-100">
                <li className="hover:text-white">Morning Headlines</li>
                <li className="hover:text-white">Prime Time News</li>
                <li className="hover:text-white">Sports Tonight</li>
                <li className="hover:text-white">Entertainment Plus</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <p className="text-blue-100 mb-2">Kathmandu, Nepal</p>
              <p className="text-blue-100 mb-2">info@plusonetv.com</p>
              <p className="text-blue-100">+977-1-XXXXXXX</p>
            </div>
          </div>
          <div className="border-t border-blue-400 mt-8 pt-8 text-center text-blue-100">
            <p>&copy; 2025 Plus One Television. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PlusOneTV;