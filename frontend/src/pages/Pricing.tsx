import React from 'react';
import { Link } from 'react-router-dom';

const Pricing: React.FC = () => {
  const plans = [
    {
      name: "Starter",
      price: "₹0",
      period: "per month",
      description: "Perfect for individuals getting started with influencer marketing",
      features: [
        "Up to 5 campaigns per month",
        "Basic analytics dashboard",
        "Email support",
        "Access to 100+ influencers",
        "Standard contract templates"
      ],
      cta: "Get Started",
      popular: false
    },
    {
      name: "Professional",
      price: "₹2,999",
      period: "per month",
      description: "Ideal for growing businesses and agencies",
      features: [
        "Unlimited campaigns",
        "Advanced analytics & reporting",
        "Priority email support",
        "Access to 10,000+ influencers",
        "Custom contract templates",
        "Campaign collaboration tools",
        "Performance insights"
      ],
      cta: "Try Free for 14 Days",
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "For large organizations with complex needs",
      features: [
        "Everything in Professional plan",
        "Dedicated account manager",
        "Custom integrations",
        "SLA guarantees",
        "White-label solutions",
        "API access",
        "Custom reporting"
      ],
      cta: "Contact Sales",
      popular: false
    }
  ];

  const faqs = [
    {
      question: "Can I change plans anytime?",
      answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately."
    },
    {
      question: "Do you offer discounts for non-profits?",
      answer: "Yes, we offer special pricing for registered non-profit organizations. Contact our sales team for more information."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards including Visa, Mastercard, and American Express, as well as bank transfers."
    },
    {
      question: "Is there a setup fee?",
      answer: "No, there are no setup fees for any of our plans."
    }
  ];

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">Simple, Transparent Pricing</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Choose the perfect plan for your needs. All plans include core features to help you manage influencer partnerships effectively.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`rounded-2xl shadow-lg overflow-hidden ${
                plan.popular 
                  ? 'ring-2 ring-primary relative bg-white dark:bg-gray-800' 
                  : 'bg-white dark:bg-gray-800'
              }`}
            >
              {plan.popular && (
                <div className="bg-primary text-white text-sm font-bold text-center py-2">
                  MOST POPULAR
                </div>
              )}
              <div className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{plan.name}</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">{plan.description}</p>
                
                <div className="mb-8">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">{plan.price}</span>
                  {plan.period && <span className="text-gray-600 dark:text-gray-300">/{plan.period}</span>}
                </div>
                
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-600 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Link
                  to={plan.name === "Enterprise" ? "/contact" : "/signup"}
                  className={`w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md ${
                    plan.popular
                      ? 'text-white bg-primary hover:bg-primary-dark shadow-sm'
                      : 'text-primary bg-primary/10 hover:bg-primary/20'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {faqs.map((faq, index) => (
              <div key={index}>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{faq.question}</h3>
                <p className="text-gray-600 dark:text-gray-300">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-lg mb-6 opacity-90 max-w-2xl mx-auto">
            Join thousands of brands and influencers who use InfluencerHub to build successful partnerships.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/signup" 
              className="px-8 py-3 bg-white text-primary font-bold rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
            >
              Start Free Trial
            </Link>
            <Link 
              to="/contact" 
              className="px-8 py-3 bg-white/10 text-white font-bold rounded-lg hover:bg-white/20 transition-colors border border-white/20"
            >
              Schedule a Demo
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;