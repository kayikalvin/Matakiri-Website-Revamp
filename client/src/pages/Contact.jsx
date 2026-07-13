import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import {
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon,
  PaperAirplaneIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { contactAPI } from '../services/api';

// ---------- Subtle texture for form card ----------
const SoilCrackOverlay = () => (
  <div
    className="absolute inset-0 opacity-[0.03] bg-repeat pointer-events-none"
    style={{
      backgroundImage:
        "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cpath d=\"M10,10 L25,15 L40,10 L50,30 L30,50 L10,40 Z\" fill=\"none\" stroke=\"%23B5522E\" stroke-width=\"0.5\"/%3E%3C/svg%3E')",
    }}
  />
);

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');
    try {
      await contactAPI.submit(formData);
      setSuccess('Your message has been sent! We will get back to you within 24 hours.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setError(err?.message || 'Failed to send message. Please try again or email us directly.');
    } finally {
      setLoading(false);
    }
  };

  const contactDetails = [
    {
      icon: MapPinIcon,
      title: 'Our Location',
      details: ['Tharaka South Division', 'Tharaka, Kenya'],
    },
    {
      icon: PhoneIcon,
      title: 'Phone',
      details: ['+254 112 727 453'],
    },
    {
      icon: EnvelopeIcon,
      title: 'Email',
      details: ['info@matakiri.org'],
    },
    {
      icon: ClockIcon,
      title: 'Hours',
      details: ['Mon–Fri 8:00–17:00', 'Sat 9:00–14:00'],
    },
  ];

  return (
    <>
      <Helmet>
        <title>Contact Us – Matakiri Tumaini Centre</title>
        <meta
          name="description"
          content="Get in touch with Matakiri Tumaini Centre. We'd love to hear from you."
        />
      </Helmet>

      {/* Hero – full‑bleed dark with signal accent line */}
      <section className="relative bg-soil-950 text-parchment-50 py-20 md:py-28">
        <div className="absolute top-0 left-0 right-0 h-1 bg-signal" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-maize-400 font-sans">
              Get In Touch
            </span>
            <h1 className="font-display text-display-xl md:text-display-hero font-medium mt-3 mb-6">
              Contact Us
            </h1>
            <p className="text-parchment-100/70 max-w-xl mx-auto text-sm">
              Have questions about our initiatives or want to collaborate? We'd love to hear from you.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main content – asymmetric split */}
      <section className="py-16 md:py-24 bg-parchment-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Form – takes 3 columns on large screens */}
            <motion.div
              className="lg:col-span-3"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="bg-white border border-border p-8 relative overflow-hidden">
                <SoilCrackOverlay />
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <PaperAirplaneIcon className="h-6 w-6 text-laterite-500" />
                    <h2 className="font-display text-display-md font-medium text-ink-800">
                      Send us a Message
                    </h2>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    {success && (
                      <div className="flex items-start gap-2.5 border border-acacia-500/30 bg-acacia-50 px-4 py-3 text-sm text-acacia-700">
                        <CheckCircleIcon className="h-5 w-5 mt-0.5 shrink-0" />
                        <span>{success}</span>
                      </div>
                    )}
                    {error && (
                      <div className="flex items-start gap-2.5 border border-status-danger/30 bg-status-danger/5 px-4 py-3 text-sm text-status-danger">
                        <ExclamationCircleIcon className="h-5 w-5 mt-0.5 shrink-0" />
                        <span>{error}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="block text-xs font-semibold uppercase tracking-[0.06em] text-ink-500 font-sans">
                          Full Name <span className="text-laterite-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          placeholder="Your full name"
                          className="w-full border border-border bg-white px-4 py-2.5 text-sm text-ink-800 placeholder:text-ink-400 outline-none focus:border-laterite-500 transition-colors focus-visible:ring-2 focus-visible:ring-laterite-500/30"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-xs font-semibold uppercase tracking-[0.06em] text-ink-500 font-sans">
                          Email Address <span className="text-laterite-500">*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          placeholder="your@email.com"
                          className="w-full border border-border bg-white px-4 py-2.5 text-sm text-ink-800 placeholder:text-ink-400 outline-none focus:border-laterite-500 transition-colors focus-visible:ring-2 focus-visible:ring-laterite-500/30"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold uppercase tracking-[0.06em] text-ink-500 font-sans">
                        Subject <span className="text-laterite-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        placeholder="How can we help you?"
                        className="w-full border border-border bg-white px-4 py-2.5 text-sm text-ink-800 placeholder:text-ink-400 outline-none focus:border-laterite-500 transition-colors focus-visible:ring-2 focus-visible:ring-laterite-500/30"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold uppercase tracking-[0.06em] text-ink-500 font-sans">
                        Message <span className="text-laterite-500">*</span>
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={6}
                        placeholder="Tell us about your inquiry..."
                        className="w-full border border-border bg-white px-4 py-2.5 text-sm text-ink-800 placeholder:text-ink-400 outline-none focus:border-laterite-500 transition-colors resize-none focus-visible:ring-2 focus-visible:ring-laterite-500/30"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-soil-900 hover:bg-soil-950 text-parchment-50 py-3 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-laterite-400"
                    >
                      <PaperAirplaneIcon className={`h-4 w-4 ${loading ? 'animate-pulse' : ''}`} />
                      {loading ? 'Sending…' : 'Send Message'}
                    </button>

                    <p className="text-center text-xs text-ink-400 font-mono">
                      We typically respond within 24 hours.
                    </p>
                  </form>
                </div>
              </div>
            </motion.div>

            {/* Contact info + FAQ – takes 2 columns on large screens, stacked */}
            <motion.div
              className="lg:col-span-2 space-y-8"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div>
                <h2 className="font-display text-display-md font-medium text-ink-800 mb-2">
                  Reach Out
                </h2>
                <p className="text-ink-500 text-sm">
                  Through any of the channels below. We're here to help.
                </p>
              </div>

              {/* Asymmetric contact info – 2×2 but first item spans full width */}
              <div className="space-y-4">
                {contactDetails.map((info, index) => (
                  <div
                    key={index}
                    className="bg-white border border-border p-5 hover:border-laterite-500/30 transition-colors group"
                  >
                    <info.icon className="h-5 w-5 text-laterite-500 mb-3" />
                    <h3 className="font-sans font-semibold text-ink-800 text-sm">{info.title}</h3>
                    {info.details.map((detail, i) => (
                      <p key={i} className="text-xs text-ink-500 font-mono mt-0.5">
                        {detail}
                      </p>
                    ))}
                  </div>
                ))}
              </div>

              {/* FAQ – clean text items */}
              <div className="pt-4">
                <h3 className="font-display text-lg font-medium text-ink-800 mb-4">
                  Quick Answers
                </h3>
                <div className="space-y-3">
                  {[
                    { q: 'How can I volunteer?', a: 'Fill out our contact form or email us directly.' },
                    { q: 'Do you accept partnerships?', a: 'Yes! We welcome collaborations with organizations and businesses.' },
                    { q: 'Response time?', a: 'We aim to respond within 24 hours during business days.' },
                  ].map((faq, i) => (
                    <div key={i} className="border border-border bg-white p-4">
                      <div className="font-sans font-semibold text-ink-800 text-sm mb-1">{faq.q}</div>
                      <div className="text-xs text-ink-500">{faq.a}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;