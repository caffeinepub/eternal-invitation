import { Link, useParams, useSearch } from "@tanstack/react-router";
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  Heart,
  Loader2,
  Mail,
  MessageSquare,
  Phone,
  User,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useCreateSelection } from "../hooks/useQueries";

interface FormData {
  customerName: string;
  email: string;
  phone: string;
  brideGroomNames: string;
  eventDate: string;
  message: string;
}

export function SelectionFormPage() {
  const { designId } = useParams({ from: "/design/$designId/select" });
  const search = useSearch({ from: "/design/$designId/select" }) as {
    name?: string;
  };
  const designName = search.name || "Selected Design";

  const createSelection = useCreateSelection();

  const [form, setForm] = useState<FormData>({
    customerName: "",
    email: "",
    phone: "",
    brideGroomNames: "",
    eventDate: "",
    message: "",
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [submitted, setSubmitted] = useState(false);

  function validate(): boolean {
    const newErrors: Partial<FormData> = {};
    if (!form.customerName.trim()) newErrors.customerName = "Name is required";
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!form.phone.trim()) newErrors.phone = "Phone number is required";
    if (!form.eventDate) newErrors.eventDate = "Event date is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    try {
      await createSelection.mutateAsync({
        designId: BigInt(designId),
        designName,
        customerName: form.customerName,
        email: form.email,
        phone: form.phone,
        brideGroomNames: form.brideGroomNames,
        eventDate: form.eventDate,
        message: form.message,
      });
      setSubmitted(true);
    } catch (err) {
      console.error("Selection error:", err);
    }
  }

  function setField(key: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  if (submitted) {
    return (
      <main className="min-h-screen bg-ivory flex items-center justify-center pt-24 px-6">
        <motion.div
          className="max-w-md mx-auto text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-20 h-20 rounded-full gold-gradient flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={36} className="text-ivory" />
          </div>
          <h2 className="font-display text-3xl md:text-4xl text-foreground mb-4">
            Your Selection is Confirmed!
          </h2>
          <div className="divider-gold mb-6" />
          <p className="font-body text-muted-foreground leading-relaxed mb-8">
            Your invitation selection has been received! We'll be in touch soon
            to help you create the perfect invitation for your special day.
          </p>
          <div className="card-luxury rounded-sm p-5 mb-8 text-left">
            <p className="font-body text-xs text-muted-foreground tracking-widest uppercase mb-1">
              Selected Design
            </p>
            <p className="font-display text-lg text-gold font-semibold">
              {designName}
            </p>
          </div>
          <Link
            to="/categories"
            className="btn-gold inline-flex items-center gap-2 px-8 py-3 rounded-sm font-body text-sm tracking-widest uppercase"
          >
            Browse More Designs
          </Link>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-ivory">
      {/* Header */}
      <section className="pt-32 pb-12 bg-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-gold blur-3xl" />
        </div>
        <div className="container mx-auto px-6 max-w-3xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Link
              to="/categories"
              className="inline-flex items-center gap-2 font-body text-xs text-ivory/50 hover:text-gold transition-colors tracking-widest uppercase mb-6"
            >
              <ArrowLeft size={14} />
              Back to Designs
            </Link>
            <span className="font-body text-xs tracking-widest uppercase text-gold mb-4 block">
              Reservation
            </span>
            <h1 className="font-display text-4xl md:text-5xl text-ivory font-light">
              Select Your{" "}
              <span className="gold-text-gradient italic font-semibold">
                Invitation
              </span>
            </h1>
            <div className="divider-gold mt-5 opacity-60" />
          </motion.div>
        </div>
      </section>

      {/* Form */}
      <section className="py-16">
        <div className="container mx-auto px-6 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Selected Design Banner */}
            <div className="card-luxury rounded-sm p-5 mb-8 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full gold-gradient flex items-center justify-center flex-shrink-0">
                <Heart size={18} className="text-ivory" />
              </div>
              <div>
                <p className="font-body text-xs text-muted-foreground tracking-widest uppercase">
                  You've selected
                </p>
                <p className="font-display text-lg text-gold font-semibold">
                  {designName}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              {/* Customer Name */}
              <div>
                <label
                  htmlFor="sf-name"
                  className="flex items-center gap-2 font-body text-xs tracking-widest uppercase text-muted-foreground mb-2"
                >
                  <User size={12} className="text-gold" />
                  Full Name <span className="text-gold">*</span>
                </label>
                <input
                  id="sf-name"
                  type="text"
                  value={form.customerName}
                  onChange={(e) => setField("customerName", e.target.value)}
                  placeholder="Your full name"
                  className={`w-full px-4 py-3 rounded-sm border font-body text-sm bg-card focus:outline-none focus:ring-2 focus:ring-gold/30 transition ${
                    errors.customerName ? "border-destructive" : "border-input"
                  }`}
                />
                {errors.customerName && (
                  <p className="font-body text-xs text-destructive mt-1">
                    {errors.customerName}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="sf-email"
                  className="flex items-center gap-2 font-body text-xs tracking-widest uppercase text-muted-foreground mb-2"
                >
                  <Mail size={12} className="text-gold" />
                  Email Address <span className="text-gold">*</span>
                </label>
                <input
                  id="sf-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setField("email", e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className={`w-full px-4 py-3 rounded-sm border font-body text-sm bg-card focus:outline-none focus:ring-2 focus:ring-gold/30 transition ${
                    errors.email ? "border-destructive" : "border-input"
                  }`}
                />
                {errors.email && (
                  <p className="font-body text-xs text-destructive mt-1">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="sf-phone"
                  className="flex items-center gap-2 font-body text-xs tracking-widest uppercase text-muted-foreground mb-2"
                >
                  <Phone size={12} className="text-gold" />
                  Phone Number <span className="text-gold">*</span>
                </label>
                <input
                  id="sf-phone"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setField("phone", e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  autoComplete="tel"
                  className={`w-full px-4 py-3 rounded-sm border font-body text-sm bg-card focus:outline-none focus:ring-2 focus:ring-gold/30 transition ${
                    errors.phone ? "border-destructive" : "border-input"
                  }`}
                />
                {errors.phone && (
                  <p className="font-body text-xs text-destructive mt-1">
                    {errors.phone}
                  </p>
                )}
              </div>

              {/* Bride & Groom Names */}
              <div>
                <label
                  htmlFor="sf-names"
                  className="flex items-center gap-2 font-body text-xs tracking-widest uppercase text-muted-foreground mb-2"
                >
                  <Heart size={12} className="text-gold" />
                  Bride &amp; Groom / Honoree Names
                </label>
                <input
                  id="sf-names"
                  type="text"
                  value={form.brideGroomNames}
                  onChange={(e) => setField("brideGroomNames", e.target.value)}
                  placeholder="e.g. Sarah & James / Emma's 1st Birthday"
                  className="w-full px-4 py-3 rounded-sm border border-input font-body text-sm bg-card focus:outline-none focus:ring-2 focus:ring-gold/30 transition"
                />
              </div>

              {/* Event Date */}
              <div>
                <label
                  htmlFor="sf-date"
                  className="flex items-center gap-2 font-body text-xs tracking-widest uppercase text-muted-foreground mb-2"
                >
                  <Calendar size={12} className="text-gold" />
                  Event Date <span className="text-gold">*</span>
                </label>
                <input
                  id="sf-date"
                  type="date"
                  value={form.eventDate}
                  onChange={(e) => setField("eventDate", e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className={`w-full px-4 py-3 rounded-sm border font-body text-sm bg-card focus:outline-none focus:ring-2 focus:ring-gold/30 transition ${
                    errors.eventDate ? "border-destructive" : "border-input"
                  }`}
                />
                {errors.eventDate && (
                  <p className="font-body text-xs text-destructive mt-1">
                    {errors.eventDate}
                  </p>
                )}
              </div>

              {/* Message */}
              <div>
                <label
                  htmlFor="sf-message"
                  className="flex items-center gap-2 font-body text-xs tracking-widest uppercase text-muted-foreground mb-2"
                >
                  <MessageSquare size={12} className="text-gold" />
                  Custom Message / Details
                </label>
                <textarea
                  id="sf-message"
                  value={form.message}
                  onChange={(e) => setField("message", e.target.value)}
                  placeholder="Any special requirements, venue details, or personal message..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-sm border border-input font-body text-sm bg-card focus:outline-none focus:ring-2 focus:ring-gold/30 transition resize-none"
                />
              </div>

              {/* Error from mutation */}
              <AnimatePresence>
                {createSelection.isError && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="p-4 rounded-sm bg-destructive/10 border border-destructive/30"
                  >
                    <p className="font-body text-sm text-destructive">
                      Something went wrong. Please try again.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit */}
              <button
                type="submit"
                disabled={createSelection.isPending}
                className="btn-gold w-full flex items-center justify-center gap-3 px-8 py-4 rounded-sm font-body text-sm tracking-widest uppercase font-medium disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {createSelection.isPending ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Heart size={16} />
                    Confirm Selection
                  </>
                )}
              </button>

              <p className="font-body text-xs text-muted-foreground text-center">
                No payment required. We'll contact you to finalize the details.
              </p>
            </form>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
