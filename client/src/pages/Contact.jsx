import React, { useState } from 'react';
import { contactAPI } from '../services/api';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { 
  FaMapMarkerAlt, 
  FaPhone, 
  FaEnvelope, 
  FaClock, 
  FaPaperPlane,
  FaUser,
  FaGlobeAfrica,
  FaBuilding,
  FaUsers,
  FaHandshake
} from 'react-icons/fa';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');
    try {
      await contactAPI.submit(formData);
      setSuccess('Your message has been sent successfully! We will get back to you within 24 hours.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setError(err?.message || 'Failed to send message. Please try again or email us directly.');
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: <FaMapMarkerAlt className="w-5 h-5" />,
      title: "Our Location",
      details: ["Matakiri Village", "Tharaka County, Kenya"],
      color: "from-emerald-500 to-teal-500"
    },
    {
      icon: <FaPhone className="w-5 h-5" />,
      title: "Phone Numbers",
      details: ["+254 712 345 678", "+254 722 456 789"],
      color: "from-emerald-500 to-green-500"
    },
    {
      icon: <FaEnvelope className="w-5 h-5" />,
      title: "Email Address",
      details: ["info@matakiritrust.org", "support@matakiritrust.org"],
      color: "from-teal-500 to-emerald-500"
    },
    {
      icon: <FaClock className="w-5 h-5" />,
      title: "Working Hours",
      details: ["Mon - Fri: 8:00 AM - 5:00 PM", "Sat: 9:00 AM - 2:00 PM"],
      color: "from-green-500 to-teal-500"
    }
  ];

  const departments = [
    {
      name: "AI Projects",
      email: "ai@matakiritrust.org",
      icon: <FaGlobeAfrica className="w-4 h-4" />
    },
    {
      name: "Community Development",
      email: "community@matakiritrust.org",
      icon: <FaUsers className="w-4 h-4" />
    },
    {
      name: "Partnerships",
      email: "partners@matakiritrust.org",
      icon: <FaHandshake className="w-4 h-4" />
    }
  ];

  return (
    <>
      <Helmet>
        <title>Contact Us - Matakiri Tumaini Centre</title>
        <meta name="description" content="Get in touch with Matakiri Tumaini Centre. We'd love to hear from you about our AI initiatives and community development programs." />
      </Helmet>

      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-600 text-white py-20">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 rounded-full mix-blend-overlay filter blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-teal-500/20 rounded-full mix-blend-overlay filter blur-3xl"></div>
          
          <div className="container relative mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mb-6">
                <FaPaperPlane className="text-2xl text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-light font-display mb-6">
                Get In <span className="font-medium">Touch</span>
              </h1>
              <p className="text-lg text-emerald-100 max-w-2xl mx-auto">
                Have questions about our AI initiatives or want to collaborate? 
                We're here to help and would love to hear from you.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="relative group"
              >
                <div className="absolute -inset-0.5  rounded-2xl blur opacity-25 group-hover:opacity-30 transition duration-300"></div>
                <div className="relative bg-white rounded-2xl p-8 shadow-lg">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-3 rounded-lg bg-emerald-50">
                      <FaPaperPlane className="w-5 h-5 text-emerald-600" />
                    </div>
                    <h2 className="text-2xl font-medium text-gray-900">Send us a Message</h2>
                  </div>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {success && (
                      <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium">{success}</p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {error && (
                      <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium">{error}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                          <span className="flex items-center">
                            <FaUser className="w-3 h-3 mr-2 text-emerald-500" />
                            Full Name *
                          </span>
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none transition-colors"
                          placeholder="Your full name"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none transition-colors"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                        Subject *
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none transition-colors"
                        placeholder="How can we help you?"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                        Message *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={6}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none transition-colors resize-none"
                        placeholder="Tell us more about your inquiry, project idea, or collaboration..."
                      />
                    </div>
                    
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 px-6 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      <FaPaperPlane className={`${loading ? 'animate-pulse' : ''}`} />
                      <span>{loading ? 'Sending Message...' : 'Send Message'}</span>
                    </button>
                    
                    <div className="text-center text-sm text-gray-500 pt-4 border-t border-gray-100">
                      <p>We typically respond within 24 hours</p>
                    </div>
                  </form>
                </div>
              </motion.div>

              {/* Contact Information */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-8"
              >
                <div>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-3 rounded-lg bg-emerald-50">
                      <FaBuilding className="w-5 h-5 text-emerald-600" />
                    </div>
                    <h2 className="text-2xl font-medium text-gray-900">Contact Information</h2>
                  </div>
                  <p className="text-gray-600 mb-8">
                    Reach out to us through any of the following channels. We're here to help and collaborate on innovative solutions for community development.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {contactInfo.map((info, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
                      whileHover={{ y: -2 }}
                      className="group"
                    >
                      <div className="bg-white rounded-xl p-6 border border-gray-100 hover:border-emerald-200 transition-all duration-300">
                        <div className="flex items-start space-x-4">
                          <div className={`p-3 rounded-lg bg-gradient-to-br ${info.color}`}>
                            <div className="text-white">
                              {info.icon}
                            </div>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-medium text-gray-900 mb-2 group-hover:text-emerald-700 transition-colors">
                              {info.title}
                            </h3>
                            {info.details.map((detail, idx) => (
                              <p key={idx} className="text-gray-600">
                                {detail}
                              </p>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Department Contacts */}
                {/* <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Specific Inquiries</h3>
                  <p className="text-gray-600 text-sm mb-6">
                    For specific department inquiries, please contact:
                  </p>
                  <div className="space-y-3">
                    {departments.map((dept, index) => (
                      <div key={index} className="flex items-center justify-between bg-white/80 rounded-lg p-3">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-emerald-100 rounded">
                            {dept.icon}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{dept.name}</div>
                          </div>
                        </div>
                        <div className="text-sm text-emerald-600 font-medium">{dept.email}</div>
                      </div>
                    ))}
                  </div>
                </div> */}

                {/* Map Placeholder */}
                {/* <div className="bg-white rounded-2xl p-6 border border-gray-100">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Our Location</h3>
                  <div className="aspect-w-16 aspect-h-9 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl overflow-hidden">
                    <div className="flex flex-col items-center justify-center h-48">
                      <div className="mb-4">
                        <div className="relative">
                          <div className="w-16 h-16 bg-emerald-500/20 rounded-full"></div>
                          <FaMapMarkerAlt className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-emerald-600 text-2xl" />
                        </div>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-700 font-medium">Matakiri Village</p>
                        <p className="text-sm text-gray-500">Kisumu County, Kenya</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 text-center">
                    <button className="text-emerald-600 hover:text-emerald-700 font-medium text-sm">
                      Get Directions →
                    </button>
                  </div>
                </div> */}
              </motion.div>
            </div>
          </div>
        </section>

        {/* FAQ Preview */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-8"
            >
              <h2 className="text-2xl font-medium text-gray-900 mb-4">Common Questions</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Quick answers to frequently asked questions
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {[
                { question: "How can I volunteer?", answer: "Fill out our volunteer form or email us directly." },
                { question: "Do you accept partnerships?", answer: "Yes! We welcome collaborations with organizations and businesses." },
                { question: "Response time?", answer: "We aim to respond within 24 hours during business days." }
              ].map((faq, index) => (
                <div key={index} className="bg-white rounded-xl p-6 border border-gray-100">
                  <div className="text-emerald-600 font-medium mb-2">{faq.question}</div>
                  <div className="text-gray-600 text-sm">{faq.answer}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Contact;