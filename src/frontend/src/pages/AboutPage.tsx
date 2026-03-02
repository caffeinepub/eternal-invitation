import { Link } from "@tanstack/react-router";
import { ArrowRight, Heart, Sparkles, Star } from "lucide-react";
import { motion } from "motion/react";

export function AboutPage() {
  const values = [
    {
      icon: <Heart size={22} className="text-gold" />,
      title: "Crafted with Love",
      text: "Every design is created with deep care and attention to emotional resonance.",
    },
    {
      icon: <Star size={22} className="text-gold" />,
      title: "Premium Quality",
      text: "We hold ourselves to the highest standards of aesthetic excellence.",
    },
    {
      icon: <Sparkles size={22} className="text-gold" />,
      title: "Unique to You",
      text: "Your story is one-of-a-kind, and your invitation should reflect that.",
    },
  ];

  return (
    <main>
      {/* Hero */}
      <section className="pt-32 pb-20 bg-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-gold blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-gold blur-2xl" />
        </div>
        <div className="container mx-auto px-6 max-w-4xl text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="font-body text-xs tracking-widest uppercase text-gold mb-4 block">
              Our Story
            </span>
            <h1 className="font-display text-5xl md:text-6xl text-ivory font-light mb-4">
              About{" "}
              <span className="gold-text-gradient italic font-semibold">
                Eternal Invitation
              </span>
            </h1>
            <div className="divider-gold mt-6 mb-6 opacity-60" />
            <p className="font-body text-ivory/70 text-lg max-w-xl mx-auto">
              Where elegance meets heartfelt storytelling.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24 bg-ivory">
        <div className="container mx-auto px-6 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="prose max-w-none">
              <p className="font-display text-2xl md:text-3xl text-foreground font-light leading-relaxed mb-8 italic">
                "At Eternal Invitation, we believe that every love story
                deserves to be celebrated in style."
              </p>
              <div className="divider-gold mb-8" />
              <p className="font-body text-base text-muted-foreground leading-relaxed mb-6">
                Our mission is to create timeless digital invitations that
                capture the magic of your special day. From weddings to
                anniversaries, engagements to baby showers, we design each
                invitation with care, elegance, and attention to every detail.
              </p>
              <p className="font-body text-base text-muted-foreground leading-relaxed mb-6">
                Explore stunning designs, preview videos, and select the perfect
                invitation for your celebration—all in one seamless experience.
                We're passionate about helping your moments shine forever,
                because every love story is unique, and your invitations should
                be too.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-ivory-mid">
        <div className="container mx-auto px-6 max-w-6xl">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="font-body text-xs tracking-widest uppercase text-gold mb-4 block">
              Our Values
            </span>
            <h2 className="font-display text-4xl md:text-5xl text-foreground section-title">
              What We Stand For
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((val, i) => (
              <motion.div
                key={val.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
              >
                <div className="card-luxury rounded-sm p-8 text-center h-full">
                  <div className="w-14 h-14 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center mx-auto mb-6">
                    {val.icon}
                  </div>
                  <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                    {val.title}
                  </h3>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed">
                    {val.text}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-foreground">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { num: "500+", label: "Happy Clients" },
              { num: "50+", label: "Unique Designs" },
              { num: "7", label: "Collections" },
              { num: "100%", label: "Custom Made" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
              >
                <div className="font-display text-4xl text-gold font-semibold mb-2">
                  {stat.num}
                </div>
                <div className="font-body text-xs text-ivory/50 tracking-widest uppercase">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-ivory">
        <div className="container mx-auto px-6 max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="font-display text-3xl md:text-4xl text-foreground mb-4">
              Ready to begin your{" "}
              <span className="gold-text-gradient italic">journey?</span>
            </h2>
            <p className="font-body text-muted-foreground mb-8">
              Explore our curated collections and find your perfect invitation.
            </p>
            <Link
              to="/categories"
              className="btn-gold inline-flex items-center gap-2 px-8 py-4 rounded-sm font-body text-sm tracking-widest uppercase font-medium"
            >
              Browse Designs
              <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
