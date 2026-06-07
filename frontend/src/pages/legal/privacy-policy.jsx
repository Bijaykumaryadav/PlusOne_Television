import React from 'react';
import UsersHeader from '@/components/users-view/users-header';
import UsersFooter from '@/components/users-view/users-footer';

const PrivacyPolicy = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <UsersHeader />

      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
          <p className="text-gray-600 mb-8">Last updated: January 2024</p>

          <div className="space-y-8 text-gray-700">
            <section>
              <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
              <p>
                Welcome to Sidha Reporting ("Company", "we", "our", or "us"). We are committed to protecting your privacy. 
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">2. Information We Collect</h2>
              <h3 className="text-lg font-semibold mb-2">Personal Information</h3>
              <p className="mb-4">
                We may collect information about you in a variety of ways. The information we may collect on the Site includes:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Name and Email Address (when you register or contact us)</li>
                <li>Phone Number (when provided)</li>
                <li>Address (when provided)</li>
                <li>Payment Information (processed securely through payment gateways)</li>
              </ul>

              <h3 className="text-lg font-semibold mb-2">Automatic Data Collection</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Log Data: IP address, browser type, pages visited, and time spent</li>
                <li>Device Information: Device type, operating system, and unique device identifiers</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">3. Use of Your Information</h2>
              <p>Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Create and manage your account</li>
                <li>Process your payment transactions</li>
                <li>Send you promotional communications (with your consent)</li>
                <li>Respond to your inquiries and support requests</li>
                <li>Monitor and analyze website usage and trends</li>
                <li>Improve the website and user experience</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">4. Disclosure of Your Information</h2>
              <p className="mb-4">We may share your information in the following situations:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Third-Party Service Providers:</strong> We may share information with vendors, consultants, and service providers who assist us in operating our website</li>
                <li><strong>Payment Processors:</strong> Your payment information is shared with secure payment processors</li>
                <li><strong>Legal Requirements:</strong> If required by law or if we believe in good faith that disclosure is necessary</li>
                <li><strong>Business Transfers:</strong> Information may be transferred as part of a merger, acquisition, or sale of assets</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">5. Security of Your Information</h2>
              <p>
                We use administrative, technical, and physical security measures to protect your personal information. However, 
                no method of transmission over the Internet or electronic storage is 100% secure. While we strive to use commercially 
                acceptable means to protect your Personal Information, we cannot guarantee its absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">6. Cookies and Tracking</h2>
              <p className="mb-4">
                We use cookies to understand and save your preferences for future visits. You can instruct your browser to refuse 
                all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able 
                to use some portions of our Site.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">7. Third-Party Links</h2>
              <p>
                The Site may contain links to third-party websites. We are not responsible for the privacy practices of these external sites. 
                We encourage you to review the privacy policies of any third-party sites before providing personal information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">8. Your Privacy Rights</h2>
              <p className="mb-4">You have the right to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Access your personal information</li>
                <li>Correct inaccurate information</li>
                <li>Request deletion of your information (subject to legal requirements)</li>
                <li>Opt-out of promotional communications</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">9. Data Retention</h2>
              <p>
                We retain your personal information for as long as necessary to provide our services and fulfill the purposes for which it was collected. 
                You can request deletion of your data at any time by contacting us.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">10. Changes to This Privacy Policy</h2>
              <p>
                We may update this Privacy Policy from time to time in order to reflect, for example, changes to our practices or 
                for other operational, legal or regulatory reasons. We will notify you of any changes by posting the new Privacy Policy 
                on the Site and updating the "Last updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">11. Contact Us</h2>
              <p>
                If you have questions or comments about this Privacy Policy, please contact us at:
              </p>
              <div className="mt-4 bg-gray-100 p-4 rounded">
                <p><strong>Sidha Reporting</strong></p>
                <p>Email: privacy@sidhareporting.com</p>
                <p>Address: Kathmandu, Nepal</p>
              </div>
            </section>
          </div>
        </div>
      </main>

      <UsersFooter />
    </div>
  );
};

export default PrivacyPolicy;
