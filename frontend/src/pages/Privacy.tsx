import React from 'react';

const Privacy: React.FC = () => {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Privacy Policy</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8">
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Introduction</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              At InfluencerHub ("we," "us," or "our"), we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              Please read this Privacy Policy carefully. If you do not agree with the terms of this Privacy Policy, please do not access the site or use our services.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Information We Collect</h2>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Personal Information</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              We may collect personally identifiable information, such as:
            </p>
            <ul className="list-disc pl-8 text-gray-600 dark:text-gray-300 space-y-2 mb-4">
              <li>Name</li>
              <li>Email address</li>
              <li>Phone number</li>
              <li>Company name and position</li>
              <li>Payment information</li>
              <li>Social media account details</li>
            </ul>
            
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Usage Data</h3>
            <p className="text-gray-600 dark:text-gray-300">
              We may also collect information about how you access and use our services, including:
            </p>
            <ul className="list-disc pl-8 text-gray-600 dark:text-gray-300 space-y-2">
              <li>IP address</li>
              <li>Browser type and version</li>
              <li>Pages visited</li>
              <li>Time and date of visit</li>
              <li>Referring website</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">How We Use Your Information</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              We use the information we collect for various purposes, including:
            </p>
            <ul className="list-disc pl-8 text-gray-600 dark:text-gray-300 space-y-2">
              <li>To provide, maintain, and improve our services</li>
              <li>To process transactions and send related information</li>
              <li>To send you technical notices and support messages</li>
              <li>To respond to your comments and questions</li>
              <li>To monitor and analyze usage and trends</li>
              <li>To detect, prevent, and address technical issues</li>
              <li>To comply with legal obligations</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Information Sharing</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              We may share your information in the following situations:
            </p>
            <ul className="list-disc pl-8 text-gray-600 dark:text-gray-300 space-y-2">
              <li>With your consent</li>
              <li>With service providers who perform services on our behalf</li>
              <li>To comply with legal obligations</li>
              <li>To protect and defend our rights and property</li>
              <li>In connection with a business transfer or merger</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Data Security</h2>
            <p className="text-gray-600 dark:text-gray-300">
              We implement appropriate technical and organizational measures to protect your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure, so we cannot guarantee absolute security.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Your Rights</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Depending on your location, you may have certain rights regarding your personal information, including:
            </p>
            <ul className="list-disc pl-8 text-gray-600 dark:text-gray-300 space-y-2">
              <li>The right to access, update, or delete your information</li>
              <li>The right to data portability</li>
              <li>The right to restrict or object to processing</li>
              <li>The right to withdraw consent</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Contact Us</h2>
            <p className="text-gray-600 dark:text-gray-300">
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-gray-600 dark:text-gray-300">
                <span className="font-semibold">Email:</span> privacy@influencerhub.com
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

export default Privacy;