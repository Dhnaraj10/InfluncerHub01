import React from 'react';
import { Link } from 'react-router-dom';

const Careers: React.FC = () => {
  const positions = [
    {
      id: 1,
      title: "Frontend Developer",
      department: "Engineering",
      location: "San Francisco, CA",
      type: "Full-time",
      description: "We're looking for a skilled Frontend Developer to help us build exceptional digital experiences for our users."
    },
    {
      id: 2,
      title: "Marketing Manager",
      department: "Marketing",
      location: "New York, NY",
      type: "Full-time",
      description: "Lead our marketing efforts to grow our brand and attract top talent in the influencer marketing space."
    },
    {
      id: 3,
      title: "Data Analyst",
      department: "Analytics",
      location: "Remote",
      type: "Full-time",
      description: "Help us derive insights from our platform data to improve user experience and inform business decisions."
    },
    {
      id: 4,
      title: "Customer Success Specialist",
      department: "Customer Support",
      location: "Austin, TX",
      type: "Full-time",
      description: "Provide exceptional support to our clients and help them achieve their marketing goals."
    }
  ];

  const benefits = [
    "Competitive salary and equity package",
    "Health, dental, and vision insurance",
    "Flexible working hours and remote options",
    "Professional development budget",
    "Unlimited vacation policy",
    "State-of-the-art equipment",
    "Team retreats twice a year"
  ];

  const values = [
    {
      title: "Innovation",
      description: "We push boundaries and embrace new technologies to stay ahead."
    },
    {
      title: "Transparency",
      description: "We believe in open communication and honest feedback."
    },
    {
      title: "Collaboration",
      description: "We work together to achieve shared goals and celebrate wins."
    },
    {
      title: "Growth",
      description: "We invest in our team members' personal and professional development."
    }
  ];

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">Join Our Team</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Help us revolutionize the way brands and influencers connect and collaborate. 
            We're looking for passionate individuals to join our growing team.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div className="bg-gradient-to-br from-primary to-secondary rounded-2xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">Why Work With Us?</h2>
            <p className="text-lg mb-6 opacity-90">
              At InfluencerHub, we're building the future of influencer marketing. Join a team that values innovation, collaboration, and growth.
            </p>
            <ul className="space-y-3">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-start">
                  <svg className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {values.map((value, index) => (
                <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-5">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{value.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-4">Open Positions</h2>
          <p className="text-center text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
            We're always looking for talented individuals to join our team. Check out our current openings.
          </p>

          <div className="grid grid-cols-1 gap-6">
            {positions.map((position) => (
              <div key={position.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="mb-4 md:mb-0">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{position.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">{position.description}</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                        {position.department}
                      </span>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                        {position.location}
                      </span>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100">
                        {position.type}
                      </span>
                    </div>
                  </div>
                  <div>
                    <Link 
                      to={`/careers/${position.id}`}
                      className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    >
                      Apply Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Don't see the right position?</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
            We're always looking for talented individuals who share our passion for innovation. 
            Send us your resume and we'll reach out if there's a fit.
          </p>
          <Link 
            to="/contact"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Careers;