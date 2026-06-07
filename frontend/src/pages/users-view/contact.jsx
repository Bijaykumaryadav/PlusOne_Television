import React, { useState } from 'react';
import UsersHeader from '@/components/users-view/users-header';
import UsersFooter from '@/components/users-view/users-footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { AlertCircle, CheckCircle2, Mail, Phone, MapPin } from 'lucide-react';
import { publicClient } from '@/services/axiosInstance';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'ad-inquiry',
    message: '',
    adType: '',
    budget: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate form
    if (!formData.name || !formData.email || !formData.phone || !formData.message) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    try {
      const response = await publicClient.post('/contacts', formData);
      if (response.data.success) {
        setSubmitted(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: 'ad-inquiry',
          message: '',
          adType: '',
          budget: '',
        });
        // Reset submitted message after 5 seconds
        setTimeout(() => setSubmitted(false), 5000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit form. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <UsersHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">Contact Us for Advertisements</h1>
            <p className="text-lg text-blue-100">
              Reach millions of readers across Sidha Reporting. Let's work together!
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {/* Contact Info Cards */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center mb-4">
                <Mail className="w-6 h-6 text-blue-600 mr-3" />
                <h3 className="text-lg font-semibold">Email</h3>
              </div>
              <p className="text-gray-600">ads@sidhareporting.com</p>
              <p className="text-sm text-gray-500 mt-2">We'll respond within 24 hours</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center mb-4">
                <Phone className="w-6 h-6 text-blue-600 mr-3" />
                <h3 className="text-lg font-semibold">Phone</h3>
              </div>
              <p className="text-gray-600">+977-1-XXXXXXX</p>
              <p className="text-sm text-gray-500 mt-2">Monday - Friday, 9AM - 5PM</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center mb-4">
                <MapPin className="w-6 h-6 text-blue-600 mr-3" />
                <h3 className="text-lg font-semibold">Address</h3>
              </div>
              <p className="text-gray-600">Kathmandu, Nepal</p>
              <p className="text-sm text-gray-500 mt-2">Visit our office</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">Send Us a Message</h2>

            {submitted && (
              <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start">
                <CheckCircle2 className="w-6 h-6 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-green-800">Success!</h3>
                  <p className="text-green-700">
                    Your message has been sent successfully. Our team will contact you soon.
                  </p>
                </div>
              </div>
            )}

            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
                <AlertCircle className="w-6 h-6 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-red-800">Error</h3>
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Your name"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your@email.com"
                  required
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <Input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+977-1-XXXXXXX"
                  required
                />
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={(e) => handleSelectChange('subject', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="ad-inquiry">Advertisement Inquiry</option>
                  <option value="partnership">Partnership Opportunity</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Ad Type (conditional) */}
              {formData.subject === 'ad-inquiry' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Advertisement Type
                  </label>
                  <select
                    name="adType"
                    value={formData.adType}
                    onChange={(e) => handleSelectChange('adType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select ad type...</option>
                    <option value="sidebar">Sidebar Ad</option>
                    <option value="header">Header Ad</option>
                    <option value="footer">Footer Ad</option>
                    <option value="popup">Popup Ad</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              )}

              {/* Budget */}
              {formData.subject === 'ad-inquiry' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Budget Range
                  </label>
                  <select
                    name="budget"
                    value={formData.budget}
                    onChange={(e) => handleSelectChange('budget', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select budget...</option>
                    <option value="low">Low (Under $500)</option>
                    <option value="medium">Medium ($500 - $2000)</option>
                    <option value="high">High ($2000+)</option>
                    <option value="flexible">Flexible</option>
                  </select>
                </div>
              )}

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <Textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Tell us about your advertisement needs..."
                  rows={6}
                  required
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
              >
                {loading ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          </div>
        </div>
      </main>

      <UsersFooter />
    </div>
  );
};

export default ContactPage;
