import React from 'react';

const Terms: React.FC = () => {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Terms of Service</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8">
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              By accessing or using the InfluencerHub platform ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of the terms, you may not access the Service.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">2. Description of Service</h2>
            <p className="text-gray-600 dark:text-gray-300">
              InfluencerHub provides a platform that connects brands with influencers for marketing partnerships. The Service includes tools for campaign management, communication, analytics, and payment processing.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">3. Account Registration</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              To access certain features of the Service, you may be required to create an account. You agree to:
            </p>
            <ul className="list-disc pl-8 text-gray-600 dark:text-gray-300 space-y-2">
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain and promptly update your account information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Notify us immediately of any unauthorized use of your account</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">4. User Responsibilities</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              You are responsible for your use of the Service and for any content you provide. You agree not to:
            </p>
            <ul className="list-disc pl-8 text-gray-600 dark:text-gray-300 space-y-2">
              <li>Use the Service for any illegal purpose</li>
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe upon the rights of others</li>
              <li>Post false or misleading information</li>
              <li>Interfere with or disrupt the Service</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">5. Intellectual Property</h2>
            <p className="text-gray-600 dark:text-gray-300">
              The Service and its original content, features, and functionality are owned by InfluencerHub and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">6. Payments and Fees</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Certain features of the Service may require payment of fees. By using these features, you agree to:
            </p>
            <ul className="list-disc pl-8 text-gray-600 dark:text-gray-300 space-y-2">
              <li>Pay all fees and charges incurred</li>
              <li>Provide valid payment information</li>
              <li>Authorize us to charge your payment method</li>
              <li>Accept that fees may change with prior notice</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">7. Termination</h2>
            <p className="text-gray-600 dark:text-gray-300">
              We may terminate or suspend your account and access to the Service immediately, without prior notice, for any reason whatsoever, including without limitation if you breach the Terms.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">8. Disclaimer of Warranties</h2>
            <p className="text-gray-600 dark:text-gray-300">
              The Service is provided on an "as is" and "as available" basis. We disclaim all warranties, express or implied, including but not limited to the implied warranties of merchantability, fitness for a particular purpose, and non-infringement.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">9. Limitation of Liability</h2>
            <p className="text-gray-600 dark:text-gray-300">
              In no event shall InfluencerHub, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">10. Changes to Terms</h2>
            <p className="text-gray-600 dark:text-gray-300">
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide notice of any significant changes by posting the new Terms on this page.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">11. Contact Us</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              If you have any questions about these Terms, please contact us:
            </p>
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-gray-600 dark:text-gray-300">
                <span className="font-semibold">Email:</span> legal@influencerhub.com
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                <span className="font-semibold">Address:</span> 123 Marketing Street, San Francisco, CA 94107
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Terms;