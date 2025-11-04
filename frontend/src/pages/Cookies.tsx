import React from 'react';

const Cookies: React.FC = () => {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Cookie Policy</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8">
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">What Are Cookies</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Cookies are small text files that are stored on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and to provide information to the website owners.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">How We Use Cookies</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              We use cookies to enhance your experience on our website. Cookies allow us to:
            </p>
            <ul className="list-disc pl-8 text-gray-600 dark:text-gray-300 space-y-2">
              <li>Remember your preferences and settings</li>
              <li>Analyze how you use our website</li>
              <li>Improve website performance and functionality</li>
              <li>Provide personalized content and advertisements</li>
              <li>Understand the effectiveness of our marketing campaigns</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Types of Cookies We Use</h2>
            
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Essential Cookies</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-2">
                These cookies are necessary for the website to function and cannot be switched off in our systems. They are usually only set in response to actions made by you which amount to a request for services, such as setting your privacy preferences or logging in.
              </p>
            </div>
            
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Performance Cookies</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-2">
                These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. They help us to know which pages are the most and least popular and see how visitors move around the site.
              </p>
            </div>
            
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Functionality Cookies</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-2">
                These cookies enable the website to provide enhanced functionality and personalization. They may be set by us or by third party providers whose services we have added to our pages.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Targeting Cookies</h3>
              <p className="text-gray-600 dark:text-gray-300">
                These cookies may be set through our site by our advertising partners. They may be used by those companies to build a profile of your interests and show you relevant adverts on other sites. They do not store directly personal information, but are based on uniquely identifying your browser and internet device.
              </p>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Third-Party Cookies</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              In some special cases, we also use cookies provided by trusted third parties. The following section details which third party cookies you might encounter through our website:
            </p>
            
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Google Analytics</h3>
              <p className="text-gray-600 dark:text-gray-300">
                We use Google Analytics to monitor website traffic and usage patterns. These cookies may track things such as how long you spend on the site or pages you visit, which helps us to understand how we can improve the site experience for users.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Social Media Platforms</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Our website may include features from social media platforms such as sharing buttons. These features may collect your IP address and which page you're visiting on our site, and may set a cookie to enable the feature to function properly.
              </p>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Managing Cookies</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              You can control and/or delete cookies as you wish. You can delete all cookies that are already on your computer and you can set most browsers to prevent them from being placed. If you do this, however, you may have to manually adjust some preferences every time you visit a site and some services and functionalities may not work.
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              For more information about how to manage cookies in your browser, please visit your browser's help pages:
            </p>
            <ul className="list-disc pl-8 text-gray-600 dark:text-gray-300 mt-2">
              <li>
                <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  Google Chrome
                </a>
              </li>
              <li>
                <a href="https://support.mozilla.org/en-US/kb/enable-and-disable-cookies-website-preferences" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  Mozilla Firefox
                </a>
              </li>
              <li>
                <a href="https://support.microsoft.com/en-us/help/4468242/microsoft-edge-browsing-data-and-privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  Microsoft Edge
                </a>
              </li>
              <li>
                <a href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  Safari
                </a>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Changes to This Cookie Policy</h2>
            <p className="text-gray-600 dark:text-gray-300">
              We may update our Cookie Policy from time to time. We will notify you of any changes by posting the new Cookie Policy on this page and updating the "Last updated" date.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Cookies;