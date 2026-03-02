import { CheckCircle, Mail, MessageSquare, Phone, Send } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { SiFacebook, SiInstagram, SiWhatsapp, SiX } from "react-icons/si";
import { useGetSiteSettings } from "../hooks/useQueries";

interface ContactForm {
  name: string;
  email: string;
  message: string;
}

export function ContactPage() {
  const { data: settings } = useGetSiteSettings();

  const [form, setForm] = useState<ContactForm>({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState<Partial<ContactForm>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function validate(): boolean {
    const newErrors: Partial<ContactForm> = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!form.message.trim()) newErrors.message = "Message is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    await new Promise((res) => setTimeout(res, 800));
    setSubmitting(false);
    setSubmitted(true);
  }

  function setField(key: keyof ContactForm, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  const contactItems = [
    ...(settings?.contactEmail
      ? [
          {
            icon: <Mail size={20} className="text-gold" />,
            label: "Email",
            value: settings.contactEmail,
            href: `mailto:${settings.contactEmail}`,
          },
        ]
      : []),
    ...(settings?.contactPhone
      ? [
          {
            icon: <Phone size={20} className="text-gold" />,
            label: "Phone",
            value: settings.contactPhone,
            href: `tel:${settings.contactPhone}`,
          },
        ]
      : []),
    ...(settings?.whatsappLink
      ? [
          {
            icon: <SiWhatsapp size={20} className="text-gold" />,
            label: "WhatsApp",
            value: "Chat with us",
            href: settings.whatsappLink,
          },
        ]
      : []),
  ];

  const socialLinks = [
    ...(settings?.instagramLink
      ? [
          {
            icon: <SiInstagram size={20} />,
            href: settings.instagramLink,
            label: "Instagram",
          },
        ]
      : []),
    ...(settings?.facebookLink
      ? [
          {
            icon: <SiFacebook size={20} />,
            href: settings.facebookLink,
            label: "Facebook",
          },
        ]
      : []),
    ...(settings?.twitterLink
      ? [
          {
            icon: <SiX size={20} />,
            href: settings.twitterLink,
            label: "X (Twitter)",
          },
        ]
      : []),
  ];

  return (
    <main>
      {/* Header */}
      <section className="pt-32 pb-16 bg-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-gold blur-3xl" />
        </div>
        <div className="container mx-auto px-6 max-w-4xl text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="font-body text-xs tracking-widest uppercase text-gold mb-4 block">
              Get in Touch
            </span>
            <h1 className="font-display text-5xl md:text-6xl text-ivory font-light mb-4">
              Contact{" "}
              <span className="gold-text-gradient italic font-semibold">
                Us
              </span>
            </h1>
            <div className="divider-gold mt-6 mb-6 opacity-60" />
            <p className="font-body text-ivory/70 text-lg max-w-xl mx-auto">
              We'd love to hear from you. Reach out to discuss your perfect
              invitation.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-24 bg-ivory">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Contact Info */}
            <motion.div
              className="lg:col-span-2"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="font-display text-2xl font-semibold text-foreground mb-6">
                Let's Connect
              </h2>
              <div className="divider-gold mb-8" />

              {contactItems.length > 0 ? (
                <ul className="space-y-5 mb-10">
                  {contactItems.map((item) => (
                    <li key={item.label}>
                      <a
                        href={item.href}
                        target={
                          item.href.startsWith("http") ? "_blank" : undefined
                        }
                        rel="noopener noreferrer"
                        className="flex items-start gap-4 group"
                      >
                        <div className="w-10 h-10 rounded-sm bg-gold/10 border border-gold/20 flex items-center justify-center flex-shrink-0 group-hover:bg-gold/20 transition">
                          {item.icon}
                        </div>
                        <div>
                          <p className="font-body text-xs text-muted-foreground tracking-widest uppercase">
                            {item.label}
                          </p>
                          <p className="font-body text-sm text-foreground group-hover:text-gold transition-colors">
                            {item.value}
                          </p>
                        </div>
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="mb-10 p-5 rounded-sm border border-dashed border-border">
                  <p className="font-body text-sm text-muted-foreground italic">
                    Contact details will be added soon by the admin.
                  </p>
                </div>
              )}

              {/* Social Media */}
              {socialLinks.length > 0 && (
                <div>
                  <h3 className="font-body text-xs text-muted-foreground tracking-widest uppercase mb-4">
                    Follow Us
                  </h3>
                  <div className="flex gap-3">
                    {socialLinks.map((social) => (
                      <a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={social.label}
                        className="w-10 h-10 rounded-sm bg-foreground/5 border border-border flex items-center justify-center text-muted-foreground hover:text-gold hover:border-gold transition-all"
                      >
                        {social.icon}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Contact Form */}
            <motion.div
              className="lg:col-span-3"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="h-full flex flex-col items-center justify-center text-center py-12"
                  >
                    <div className="w-16 h-16 rounded-full gold-gradient flex items-center justify-center mb-6">
                      <CheckCircle size={28} className="text-ivory" />
                    </div>
                    <h3 className="font-display text-2xl text-foreground mb-3">
                      Message Sent!
                    </h3>
                    <p className="font-body text-muted-foreground">
                      Thank you for reaching out. We'll get back to you soon.
                    </p>
                  </motion.div>
                ) : (
                  <motion.div key="form">
                    <div className="card-luxury rounded-sm p-8">
                      <div className="flex items-center gap-3 mb-6">
                        <MessageSquare size={18} className="text-gold" />
                        <h3 className="font-display text-xl font-semibold text-foreground">
                          Send a Message
                        </h3>
                      </div>
                      <form
                        onSubmit={handleSubmit}
                        className="space-y-5"
                        noValidate
                      >
                        <div>
                          <label
                            htmlFor="cf-name"
                            className="font-body text-xs tracking-widest uppercase text-muted-foreground mb-2 block"
                          >
                            Full Name <span className="text-gold">*</span>
                          </label>
                          <input
                            id="cf-name"
                            type="text"
                            value={form.name}
                            onChange={(e) => setField("name", e.target.value)}
                            placeholder="Your name"
                            className={`w-full px-4 py-3 rounded-sm border font-body text-sm bg-card focus:outline-none focus:ring-2 focus:ring-gold/30 transition ${
                              errors.name
                                ? "border-destructive"
                                : "border-input"
                            }`}
                          />
                          {errors.name && (
                            <p className="font-body text-xs text-destructive mt-1">
                              {errors.name}
                            </p>
                          )}
                        </div>
                        <div>
                          <label
                            htmlFor="cf-email"
                            className="font-body text-xs tracking-widest uppercase text-muted-foreground mb-2 block"
                          >
                            Email <span className="text-gold">*</span>
                          </label>
                          <input
                            id="cf-email"
                            type="email"
                            value={form.email}
                            onChange={(e) => setField("email", e.target.value)}
                            placeholder="you@example.com"
                            autoComplete="email"
                            className={`w-full px-4 py-3 rounded-sm border font-body text-sm bg-card focus:outline-none focus:ring-2 focus:ring-gold/30 transition ${
                              errors.email
                                ? "border-destructive"
                                : "border-input"
                            }`}
                          />
                          {errors.email && (
                            <p className="font-body text-xs text-destructive mt-1">
                              {errors.email}
                            </p>
                          )}
                        </div>
                        <div>
                          <label
                            htmlFor="cf-message"
                            className="font-body text-xs tracking-widest uppercase text-muted-foreground mb-2 block"
                          >
                            Message <span className="text-gold">*</span>
                          </label>
                          <textarea
                            id="cf-message"
                            value={form.message}
                            onChange={(e) =>
                              setField("message", e.target.value)
                            }
                            placeholder="Tell us about your event..."
                            rows={5}
                            className={`w-full px-4 py-3 rounded-sm border font-body text-sm bg-card focus:outline-none focus:ring-2 focus:ring-gold/30 transition resize-none ${
                              errors.message
                                ? "border-destructive"
                                : "border-input"
                            }`}
                          />
                          {errors.message && (
                            <p className="font-body text-xs text-destructive mt-1">
                              {errors.message}
                            </p>
                          )}
                        </div>
                        <button
                          type="submit"
                          disabled={submitting}
                          className="btn-gold w-full flex items-center justify-center gap-2 px-8 py-4 rounded-sm font-body text-sm tracking-widest uppercase font-medium disabled:opacity-60"
                        >
                          {submitting ? (
                            <>
                              <div className="w-4 h-4 border-2 border-ivory/30 border-t-ivory rounded-full animate-spin" />
                              Sending...
                            </>
                          ) : (
                            <>
                              <Send size={16} />
                              Send Message
                            </>
                          )}
                        </button>
                      </form>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}
