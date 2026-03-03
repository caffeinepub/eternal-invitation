import { Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles } from "lucide-react";
import { type Variants, motion } from "motion/react";
// ── Static collections data (not from backend) ─────────────────────────────
const COLLECTIONS = [
  {
    name: "Wedding Invitations",
    image: "/assets/generated/category-wedding.dim_600x400.jpg",
  },
  {
    name: "Save the Date",
    image: "/assets/generated/category-savethedate.dim_600x400.jpg",
  },
  {
    name: "Engagement",
    image: "/assets/generated/category-engagement.dim_600x400.jpg",
  },
  {
    name: "Birthday",
    image: "/assets/generated/category-birthday.dim_600x400.jpg",
  },
  {
    name: "Anniversary",
    image: "/assets/generated/category-anniversary.dim_600x400.jpg",
  },
  {
    name: "Reception",
    image: "/assets/generated/category-reception.dim_600x400.jpg",
  },
  {
    name: "Special Occasions",
    image: "/assets/generated/category-special.dim_600x400.jpg",
  },
] as const;

// ── Gallery previews ────────────────────────────────────────────────────────
const GALLERY = [
  "/assets/generated/gallery-preview-1.dim_480x640.jpg",
  "/assets/generated/gallery-preview-2.dim_480x640.jpg",
  "/assets/generated/gallery-preview-3.dim_480x640.jpg",
  "/assets/generated/gallery-preview-4.dim_480x640.jpg",
] as const;

// ── Inline SVG icons (thin gold, 32×32) ────────────────────────────────────
function SparkleIcon() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M16 4v5M16 23v5M4 16h5M23 16h5" />
      <path d="M7.76 7.76l3.53 3.53M20.71 20.71l3.53 3.53M7.76 24.24l3.53-3.53M20.71 11.29l3.53-3.53" />
      <circle cx="16" cy="16" r="3" />
    </svg>
  );
}

function HourglassIcon() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M8 4h16M8 28h16" />
      <path d="M10 4c0 6 6 8 6 12s-6 6-6 12" />
      <path d="M22 4c0 6-6 8-6 12s6 6 6 12" />
      <path d="M12 20h8" />
    </svg>
  );
}

function FilmIcon() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="4" y="7" width="24" height="18" rx="2" />
      <path d="M4 12h24M4 20h24M10 7v5M16 7v5M22 7v5M10 20v5M16 20v5M22 20v5" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="16" cy="16" r="12" />
      <path d="M4 16h24" />
      <path d="M16 4c-3 4-4.5 7.5-4.5 12s1.5 8 4.5 12" />
      <path d="M16 4c3 4 4.5 7.5 4.5 12S19 28 16 28" />
    </svg>
  );
}

// ── Feature block data ──────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: SparkleIcon,
    title: "Thoughtfully Crafted Designs",
    body: "Every invitation is designed with refined typography, balance, and timeless elegance.",
  },
  {
    icon: HourglassIcon,
    title: "Delivered in 4 Days",
    body: "Crafted carefully to ensure every detail meets our quality standards.",
  },
  {
    icon: FilmIcon,
    title: "Elegant Animations",
    body: "Smooth, cinematic transitions that elevate your invitation experience.",
  },
  {
    icon: GlobeIcon,
    title: "Effortless Global Sharing",
    body: "Instantly share your invitation via WhatsApp, email, or social platforms worldwide.",
  },
] as const;

// ── Animation variants ──────────────────────────────────────────────────────
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.18, delayChildren: 1.0 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] },
  },
};

const fadeUpVariant: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] },
  },
};

const staggerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

export function HomePage() {
  return (
    <main>
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Base cream/beige background */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 30%, oklch(0.96 0.022 82), oklch(0.97 0.018 88) 40%, oklch(0.95 0.025 80) 100%)",
          }}
        />

        {/* Subtle parchment texture overlay */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23noise)' opacity='0.15'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
            backgroundSize: "200px 200px",
          }}
        />

        {/* ── ANIMATION LAYER — hands, ring glow, shimmer (unchanged) ──── */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ opacity: 0.83 }}
        >
          {/* Groom's hand — slides in from left */}
          <motion.div
            className="absolute bottom-0 left-0 h-full w-1/2"
            initial={{ x: "-120%" }}
            animate={{ x: "-8%" }}
            transition={{ duration: 1.1, ease: [0.4, 0, 0.2, 1], delay: 0.1 }}
            style={{ filter: "blur(2.5px)" }}
          >
            <img
              src="/assets/generated/hero-groom-hand.dim_960x900.jpg"
              alt=""
              aria-hidden="true"
              className="w-full h-full object-cover object-right"
              style={{ userSelect: "none" }}
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to right, transparent 40%, oklch(0.96 0.022 82 / 0.85) 100%)",
              }}
            />
          </motion.div>

          {/* Bride's hand — slides in from right */}
          <motion.div
            className="absolute bottom-0 right-0 h-full w-1/2"
            initial={{ x: "120%" }}
            animate={{ x: "8%" }}
            transition={{ duration: 1.1, ease: [0.4, 0, 0.2, 1], delay: 0.1 }}
            style={{ filter: "blur(2.5px)" }}
          >
            <img
              src="/assets/generated/hero-bride-hand.dim_960x900.jpg"
              alt=""
              aria-hidden="true"
              className="w-full h-full object-cover object-left"
              style={{ userSelect: "none" }}
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to left, transparent 40%, oklch(0.96 0.022 82 / 0.85) 100%)",
              }}
            />
          </motion.div>

          {/* Golden ring glow — blooms at center when hands meet */}
          <motion.div
            className="absolute left-1/2 -translate-x-1/2"
            style={{
              bottom: "18%",
              width: "380px",
              height: "380px",
              borderRadius: "50%",
              background:
                "radial-gradient(circle, oklch(0.85 0.14 80 / 0.75) 0%, oklch(0.78 0.12 76 / 0.45) 35%, oklch(0.72 0.10 74 / 0.15) 65%, transparent 80%)",
              filter: "blur(18px)",
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.15, 1], opacity: [0, 0.9, 0.65] }}
            transition={{ duration: 1.2, ease: [0.0, 0.0, 0.2, 1], delay: 1.0 }}
          />

          {/* Pulsing glow — gentle heartbeat after bloom */}
          <motion.div
            className="absolute left-1/2 -translate-x-1/2"
            style={{
              bottom: "22%",
              width: "220px",
              height: "220px",
              borderRadius: "50%",
              background:
                "radial-gradient(circle, oklch(0.90 0.15 82 / 0.8) 0%, oklch(0.80 0.12 78 / 0.3) 50%, transparent 75%)",
              filter: "blur(8px)",
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: [0, 1, 1.08, 1, 1.06, 1],
              opacity: [0, 0.9, 0.7, 0.85, 0.7, 0.8],
            }}
            transition={{
              duration: 4,
              ease: "easeInOut",
              delay: 1.2,
              times: [0, 0.25, 0.4, 0.55, 0.75, 1],
              repeat: Number.POSITIVE_INFINITY,
              repeatDelay: 0.5,
            }}
          />

          {/* Shimmer radial sweep */}
          <motion.div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 70% 55% at 50% 65%, oklch(0.92 0.10 80 / 0.38) 0%, oklch(0.88 0.07 78 / 0.18) 40%, transparent 70%)",
            }}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: [0, 0.7, 0.35], scale: [0.85, 1.05, 1] }}
            transition={{ duration: 1.8, ease: "easeInOut", delay: 2.4 }}
          />

          {/* Soft sparkling rays */}
          <motion.div
            className="absolute inset-0"
            style={{
              background:
                "conic-gradient(from 225deg at 50% 60%, transparent 0deg, oklch(0.88 0.10 80 / 0.12) 15deg, transparent 30deg, oklch(0.85 0.08 78 / 0.09) 50deg, transparent 70deg, oklch(0.88 0.10 80 / 0.1) 90deg, transparent 110deg, transparent 360deg)",
            }}
            initial={{ opacity: 0, rotate: -5 }}
            animate={{ opacity: [0, 0.8, 0.5], rotate: [-5, 2, 0] }}
            transition={{ duration: 2.2, ease: "easeOut", delay: 2.8 }}
          />
        </div>

        {/* Soft vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 120% 100% at 50% 50%, transparent 40%, oklch(0.90 0.020 80 / 0.4) 80%, oklch(0.88 0.018 80 / 0.7) 100%)",
          }}
        />

        {/* ── Text Content ─────────────────────────────────────────────── */}
        <motion.div
          className="relative z-10 text-center px-6 max-w-3xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Logo mark */}
          <motion.div variants={itemVariants} className="mb-5">
            <div className="flex flex-col items-center gap-2">
              <span
                className="font-display leading-none select-none"
                style={{
                  fontSize: "clamp(3rem, 7vw, 5rem)",
                  background:
                    "linear-gradient(135deg, oklch(0.82 0.10 82), oklch(0.68 0.14 72), oklch(0.80 0.11 80))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  filter: "drop-shadow(0 2px 12px oklch(0.72 0.12 76 / 0.4))",
                }}
              >
                ∞
              </span>
              <span
                className="font-body text-xs tracking-[0.3em] uppercase"
                style={{ color: "oklch(0.50 0.04 70)" }}
              >
                Eternal Invitation
              </span>
            </div>
          </motion.div>

          {/* Luxury tag */}
          <motion.div variants={itemVariants} className="mb-6">
            <span
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-body tracking-widest uppercase"
              style={{
                borderColor: "oklch(0.72 0.12 76 / 0.5)",
                color: "oklch(0.62 0.10 72)",
                background: "oklch(0.97 0.008 85 / 0.6)",
              }}
            >
              <Sparkles size={11} />
              Luxury Digital Invitations
            </span>
          </motion.div>

          {/* Main text block */}
          <motion.div variants={itemVariants} className="relative mb-10">
            {/* Soft blurred backdrop */}
            <div
              className="absolute inset-0 -mx-8 -my-4 rounded-2xl"
              style={{
                background: "oklch(0.97 0.012 88 / 0.55)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
              }}
            />
            <div className="relative z-10 py-4">
              <h1
                className="font-display font-light leading-tight mb-4"
                style={{
                  fontSize: "clamp(2rem, 5.5vw, 4rem)",
                  color: "oklch(0.20 0.02 55)",
                  letterSpacing: "-0.01em",
                }}
              >
                Where Your Love Story
                <br />
                <em
                  className="font-semibold not-italic"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.75 0.12 80), oklch(0.62 0.13 72), oklch(0.72 0.11 78))",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Begins Beautifully.
                </em>
              </h1>
              <p
                className="font-body text-base md:text-lg font-light leading-relaxed max-w-lg mx-auto"
                style={{ color: "oklch(0.42 0.025 60)" }}
              >
                Timeless digital invitations designed to celebrate love —
                wherever your story unfolds.
              </p>
            </div>
          </motion.div>

          {/* Single CTA + occasion tags */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col items-center gap-5"
          >
            <Link
              to="/categories"
              className="btn-gold inline-flex items-center justify-center gap-2.5 px-10 py-4 rounded-sm font-body text-xs tracking-[0.22em] uppercase font-semibold"
              style={{
                letterSpacing: "0.22em",
                boxShadow: "0 4px 28px oklch(0.72 0.12 76 / 0.35)",
              }}
            >
              Explore Collection
              <ArrowRight size={15} />
            </Link>

            {/* Occasion tags */}
            <p
              className="font-body text-xs tracking-wider leading-relaxed flex flex-wrap justify-center gap-x-2 gap-y-1"
              style={{ color: "oklch(0.62 0.06 72 / 0.8)" }}
            >
              {[
                "Wedding",
                "Engagement",
                "Save the Date",
                "Birthday",
                "Anniversary",
                "Reception",
                "Special Occasions",
              ].map((tag, i, arr) => (
                <span key={tag} className="whitespace-nowrap">
                  {tag}
                  {i < arr.length - 1 && <span className="mx-1">•</span>}
                </span>
              ))}
            </p>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5, duration: 0.8 }}
        >
          <motion.div
            className="w-px h-10"
            style={{
              background:
                "linear-gradient(to bottom, oklch(0.72 0.12 76 / 0.6), transparent)",
            }}
            animate={{ scaleY: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          />
        </motion.div>
      </section>

      {/* ── BRAND INTRODUCTION (stats removed) ───────────────────────────── */}
      <section className="py-24 bg-ivory">
        <div className="container mx-auto px-6 max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="font-body text-xs tracking-widest uppercase text-gold mb-4 block">
              Our Story
            </span>
            <h2 className="font-display text-4xl md:text-5xl text-foreground mb-6 section-title">
              Crafted With Love &amp; Elegance
            </h2>
            <div className="divider-gold mb-8" />
            <p className="font-body text-muted-foreground leading-relaxed text-base md:text-lg">
              We craft each digital invitation as a unique work of art — because
              your celebration deserves nothing less than perfection. From
              intimate gatherings to grand affairs, our designs capture the
              essence of your most cherished moments with timeless
              sophistication.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── SECTION 2 — COLLECTIONS (image cards) ────────────────────────── */}
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
              Collections
            </span>
            <h2 className="font-display text-4xl md:text-5xl text-foreground section-title">
              Designed for Every Celebration
            </h2>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            variants={staggerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {COLLECTIONS.map((cat) => (
              <motion.div key={cat.name} variants={fadeUpVariant}>
                <Link to="/categories" className="group block">
                  <div
                    className="overflow-hidden rounded-sm transition-all duration-300"
                    style={{
                      border: "1px solid transparent",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLDivElement).style.borderColor =
                        "oklch(0.72 0.12 76 / 0.8)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLDivElement).style.borderColor =
                        "transparent";
                    }}
                  >
                    {/* Image */}
                    <div className="aspect-[9/16] overflow-hidden">
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                    {/* Caption */}
                    <div className="pt-3 pb-1 px-1">
                      <h3
                        className="font-display text-sm font-semibold tracking-wider text-foreground group-hover:text-gold transition-colors duration-300"
                        style={{ letterSpacing: "0.06em" }}
                      >
                        {cat.name}
                      </h3>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          <div className="text-center mt-12">
            <Link
              to="/categories"
              className="btn-outline-gold inline-flex items-center gap-2 px-8 py-3 rounded-sm font-body text-sm tracking-widest uppercase"
            >
              View All Collections
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── SECTION 3 — WHY CHOOSE ETERNAL INVITATION ────────────────────── */}
      <section className="py-24 bg-ivory">
        <div className="container mx-auto px-6 max-w-6xl">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="font-body text-xs tracking-widest uppercase text-gold mb-3 block">
              Our Promise
            </span>
            <h2 className="font-display text-4xl md:text-5xl text-foreground section-title">
              Why Choose Eternal Invitation?
            </h2>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={staggerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  variants={fadeUpVariant}
                  className="flex flex-col items-center text-center gap-5 p-8 rounded-sm card-luxury"
                >
                  <div className="text-gold">
                    <Icon />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-foreground leading-snug">
                    {feature.title}
                  </h3>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed">
                    {feature.body}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ── SECTION 4 — DESIGN PHILOSOPHY ────────────────────────────────── */}
      <section className="py-28 bg-ivory-mid">
        <div className="container mx-auto px-6 max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
          >
            <span className="font-body text-xs tracking-widest uppercase text-gold mb-6 block">
              Our Design Philosophy
            </span>

            <blockquote
              className="font-display font-light italic leading-snug text-foreground mb-8"
              style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)" }}
            >
              "Every celebration begins with an impression."
            </blockquote>

            <div className="divider-gold mb-8 max-w-sm mx-auto" />

            <p className="font-body text-muted-foreground leading-relaxed text-base md:text-lg">
              We believe an invitation is more than information — it sets the
              tone for your entire event. Every detail, every transition, every
              font is chosen to create something truly unforgettable.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── SECTION 5 — DESIGN GALLERY ───────────────────────────────────── */}
      <section className="py-24 bg-ivory">
        <div className="container mx-auto px-6 max-w-6xl">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="font-body text-xs tracking-widest uppercase text-gold mb-3 block">
              Design Gallery
            </span>
            <h2 className="font-display text-4xl md:text-5xl text-foreground section-title">
              A Glimpse of Our Work
            </h2>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
            variants={staggerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {GALLERY.map((src, i) => (
              <motion.div
                key={src}
                variants={fadeUpVariant}
                transition={{ delay: i * 0.08 }}
                className="group relative overflow-hidden rounded-sm"
              >
                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src={src}
                    alt={`Invitation design preview ${i + 1}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 flex items-end justify-center pb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(to top, oklch(0.15 0.02 50 / 0.7) 0%, transparent 60%)",
                    }}
                  />
                  <Link
                    to="/categories"
                    className="relative z-10 font-body text-xs tracking-widest uppercase text-ivory border px-4 py-2 transition-all duration-200 hover:bg-gold/20"
                    style={{ borderColor: "oklch(0.72 0.12 76 / 0.7)" }}
                  >
                    View Design
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── ABOUT US (dark section) ───────────────────────────────────────── */}
      <section
        className="py-24 bg-foreground relative overflow-hidden"
        id="about"
      >
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute top-10 right-10 w-96 h-96 rounded-full bg-gold blur-3xl" />
          <div className="absolute bottom-10 left-10 w-64 h-64 rounded-full bg-gold blur-2xl" />
        </div>
        <div className="container mx-auto px-6 max-w-3xl text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="font-body text-xs tracking-widest uppercase text-gold mb-4 block">
              About Us
            </span>
            <h2 className="font-display text-4xl md:text-5xl text-ivory mb-8 section-title">
              Every Love Story <em>Deserves</em>
              <br />
              to be Celebrated
            </h2>
            <div className="divider-gold mb-8 opacity-60" />
            <p className="font-body text-ivory/70 leading-relaxed text-base md:text-lg">
              At Eternal Invitation, we believe that every love story deserves
              to be celebrated in style. Our mission is to create timeless
              digital invitations that capture the magic of your special day.
              From weddings to anniversaries, engagements to baby showers, we
              design each invitation with care, elegance, and attention to every
              detail.
            </p>
            <p className="font-body text-ivory/70 leading-relaxed text-base md:text-lg mt-4">
              Explore stunning designs, preview videos, and select the perfect
              invitation for your celebration—all in one seamless experience.
              We're passionate about helping your moments shine forever, because
              every love story is unique, and your invitations should be too.
            </p>
            <Link
              to="/about"
              className="mt-10 btn-outline-gold inline-flex items-center gap-2 px-8 py-3 rounded-sm font-body text-sm tracking-widest uppercase"
              style={{
                borderColor: "oklch(var(--gold))",
                color: "oklch(var(--gold))",
              }}
            >
              Learn More About Us
              <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── CTA SECTION ──────────────────────────────────────────────────── */}
      <section className="py-24 ivory-gradient">
        <div className="container mx-auto px-6 max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="font-display text-4xl md:text-5xl text-foreground mb-6">
              Ready to Create Your{" "}
              <span className="gold-text-gradient italic">
                Perfect Invitation?
              </span>
            </h2>
            <p className="font-body text-muted-foreground mb-10 text-base md:text-lg">
              Browse our curated collection and find the design that speaks to
              your heart.
            </p>
            <Link
              to="/categories"
              className="btn-gold inline-flex items-center gap-2 px-10 py-4 rounded-sm font-body text-sm tracking-widest uppercase font-medium"
            >
              Start Exploring
              <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── MOBILE STICKY CTA ────────────────────────────────────────────── */}
      <motion.div
        className="block md:hidden fixed bottom-0 left-0 right-0 z-40"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 3.0, duration: 0.6 }}
        style={{
          borderTop: "1px solid oklch(0.72 0.12 76 / 0.25)",
          background: "oklch(0.97 0.012 88 / 0.95)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
      >
        <div className="px-4 py-3">
          <Link
            to="/categories"
            className="btn-gold flex items-center justify-center gap-2 w-full py-3 px-6 rounded-sm font-body text-xs tracking-[0.18em] uppercase font-semibold"
          >
            Explore Collection
            <ArrowRight size={14} />
          </Link>
        </div>
      </motion.div>

      {/* Spacer so mobile sticky CTA doesn't overlap footer content */}
      <div className="block md:hidden h-16" aria-hidden="true" />
    </main>
  );
}
