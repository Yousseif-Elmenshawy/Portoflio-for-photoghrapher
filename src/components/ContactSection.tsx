import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, Mail, MapPin, Globe } from 'lucide-react';
import { Settings } from '../types';
import { saveContactMessage } from '../mockApi';

interface ContactSectionProps {
  settings: Settings | null;
  onMessageSent?: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ settings, onMessageSent }) => {
  const [formData, setFormData] = useState({
    sender_name: '',
    sender_email: '',
    subject: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const contactEmail = settings?.contact_email || 'yussefelshenawy@gmail.com';
  const location = settings?.location || 'Berlin & Reykjavik';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.sender_name || !formData.sender_email || !formData.message) {
      setStatusMessage({
        type: 'error',
        text: 'Please fill in all required fields (Name, Email, Message).',
      });
      return;
    }

    setLoading(true);
    setStatusMessage(null);

    try {
      saveContactMessage(formData);
      setStatusMessage({
        type: 'success',
        text: 'Your inquiry has been saved in this browser preview. No email was sent.',
      });
      setFormData({
        sender_name: '',
        sender_email: '',
        subject: '',
        message: '',
      });
      onMessageSent?.();
    } catch (error) {
      setStatusMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Could not save your inquiry in this browser.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="contact"
      className="py-24 px-6 max-w-7xl mx-auto transition-colors duration-300"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        
        {/* Left Column: Direct Inquiries & Agency Info */}
        <div className="lg:col-span-5">
          <div className="text-xs uppercase tracking-[0.25em] text-neutral-500 dark:text-neutral-400 font-medium mb-3">
            04. Collaborations &amp; Prints
          </div>
          <h2 className="text-3xl md:text-5xl font-serif-luxury font-normal text-neutral-900 dark:text-white leading-tight mb-8">
            Initiate a <br />
            <span className="italic font-light text-neutral-500 dark:text-neutral-400">Commission</span>
          </h2>

          <p className="text-neutral-700 dark:text-neutral-300 text-sm sm:text-base leading-relaxed font-light mb-10">
            Available for commercial commissions, editorial assignments, and private architectural documentation globally. Signed archival gallery prints are prepared to museum conservation standards.
          </p>

          <div className="space-y-4 text-xs">
            <div className="flex items-center gap-3 text-neutral-800 dark:text-neutral-300">
              <Mail size={15} className="text-amber-500 shrink-0" />
              <a href={`mailto:${contactEmail}`} className="hover:underline font-mono">
                {contactEmail}
              </a>
            </div>

            <div className="flex items-center gap-3 text-neutral-800 dark:text-neutral-300">
              <MapPin size={15} className="text-amber-500 shrink-0" />
              <span>Studio: {location}</span>
            </div>

            <div className="flex items-center gap-3 text-neutral-800 dark:text-neutral-300">
              <Globe size={15} className="text-amber-500 shrink-0" />
              <span>Global Availability · Fast Turnaround Worldwide</span>
            </div>
          </div>
        </div>

        {/* Right Column: Contact Form */}
        <div className="lg:col-span-7 bg-white dark:bg-[#141414] p-6 sm:p-10 border border-neutral-200 dark:border-white/10 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2 font-medium">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.sender_name}
                  onChange={(e) => setFormData({ ...formData, sender_name: e.target.value })}
                  placeholder="e.g. Julian Thorne"
                  className="w-full bg-neutral-50 dark:bg-[#0D0D0D] border border-neutral-300 dark:border-white/10 px-4 py-3 text-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2 font-medium">
                  Your Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.sender_email}
                  onChange={(e) => setFormData({ ...formData, sender_email: e.target.value })}
                  placeholder="e.g. julian@curatorial.org"
                  className="w-full bg-neutral-50 dark:bg-[#0D0D0D] border border-neutral-300 dark:border-white/10 px-4 py-3 text-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2 font-medium">
                Subject / Project Scope
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="e.g. Editorial Feature or Print Acquisition"
                className="w-full bg-neutral-50 dark:bg-[#0D0D0D] border border-neutral-300 dark:border-white/10 px-4 py-3 text-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2 font-medium">
                Message &amp; Timeline Details *
              </label>
              <textarea
                required
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Describe project context, location, desired deliverables or print dimensions..."
                className="w-full bg-neutral-50 dark:bg-[#0D0D0D] border border-neutral-300 dark:border-white/10 px-4 py-3 text-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:border-amber-500 transition-colors resize-none"
              />
            </div>

            {statusMessage && (
              <div
                className={`p-4 text-xs flex items-start gap-3 border ${
                  statusMessage.type === 'success'
                    ? 'bg-amber-500/10 text-amber-800 dark:text-amber-300 border-amber-500/30'
                    : 'bg-rose-500/10 text-rose-800 dark:text-rose-300 border-rose-500/30'
                }`}
              >
                {statusMessage.type === 'success' ? (
                  <CheckCircle2 size={16} className="shrink-0 mt-0.5 text-amber-500" />
                ) : (
                  <AlertCircle size={16} className="shrink-0 mt-0.5 text-rose-500" />
                )}
                <span>{statusMessage.text}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-8 py-3.5 bg-neutral-900 text-white dark:bg-white dark:text-black text-xs font-semibold uppercase tracking-widest hover:bg-neutral-800 dark:hover:bg-neutral-200 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
            >
              <span>{loading ? 'Transmitting...' : 'Dispatch Inquiry'}</span>
              <Send size={13} />
            </button>
          </form>
        </div>

      </div>
    </section>
  );
};
