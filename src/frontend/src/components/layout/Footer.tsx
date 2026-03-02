import { Link } from "@tanstack/react-router";
import { SiFacebook, SiInstagram, SiWhatsapp, SiX } from "react-icons/si";
import { useGetSiteSettings } from "../../hooks/useQueries";

export function Footer() {
  const { data: settings } = useGetSiteSettings();
  const year = new Date().getFullYear();

  const whatsappHref = settings?.whatsappLink || "https://wa.me/";
  const instagramHref =
    settings?.instagramLink || "https://instagram.com/eternalinvitation";
  const contactEmail = settings?.contactEmail || "hello@eternalinvitation.com";

  return (
    <footer className="bg-foreground text-ivory py-16">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <img
                src="/assets/generated/eternal-logo-transparent.dim_200x200.png"
                alt="Eternal Invitation"
                className="w-10 h-10 object-contain"
                style={{
                  filter:
                    "sepia(1) saturate(2) hue-rotate(10deg) brightness(1.2)",
                }}
              />
              <span className="font-display text-xl text-ivory">
                Eternal Invitation
              </span>
            </div>

            {/* Brand tagline */}
            <p className="font-body text-sm text-ivory/60 italic leading-relaxed mb-3">
              Designed for couples worldwide.
            </p>

            <p className="font-body text-sm text-ivory/50 leading-relaxed">
              {settings?.tagline ||
                "Timeless Digital Invitations for Moments That Last Forever."}
            </p>

            {/* Social Links — always visible */}
            <div className="flex gap-4 mt-6">
              <a
                href={instagramHref}
                target="_blank"
                rel="noopener noreferrer"
                className="text-ivory/50 hover:text-gold transition-colors"
                aria-label="Instagram"
              >
                <SiInstagram size={18} />
              </a>

              {settings?.facebookLink && (
                <a
                  href={settings.facebookLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ivory/50 hover:text-gold transition-colors"
                  aria-label="Facebook"
                >
                  <SiFacebook size={18} />
                </a>
              )}

              {settings?.twitterLink && (
                <a
                  href={settings.twitterLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ivory/50 hover:text-gold transition-colors"
                  aria-label="X (Twitter)"
                >
                  <SiX size={18} />
                </a>
              )}

              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="text-ivory/50 hover:text-gold transition-colors"
                aria-label="WhatsApp"
              >
                <SiWhatsapp size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-base font-semibold text-gold mb-4 tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {[
                { href: "/", label: "Home" },
                { href: "/categories", label: "Browse Designs" },
                { href: "/about", label: "About Us" },
                { href: "/contact", label: "Contact" },
                { href: "/admin/login", label: "Admin Login" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="font-body text-sm text-ivory/60 hover:text-gold transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact — always shows fallback */}
          <div>
            <h4 className="font-display text-base font-semibold text-gold mb-4 tracking-wider">
              Contact
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href={`mailto:${contactEmail}`}
                  className="font-body text-sm text-ivory/60 hover:text-gold transition-colors"
                >
                  {contactEmail}
                </a>
              </li>

              {settings?.contactPhone && (
                <li>
                  <a
                    href={`tel:${settings.contactPhone}`}
                    className="font-body text-sm text-ivory/60 hover:text-gold transition-colors"
                  >
                    {settings.contactPhone}
                  </a>
                </li>
              )}

              <li>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body text-sm text-ivory/60 hover:text-gold transition-colors inline-flex items-center gap-1.5"
                >
                  <SiWhatsapp size={14} />
                  WhatsApp
                </a>
              </li>

              <li>
                <Link
                  to="/contact"
                  className="font-body text-sm text-ivory/60 hover:text-gold transition-colors"
                >
                  Contact Page →
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="divider-gold mb-6 opacity-30" />

        {/* Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-2">
          <p className="font-body text-xs text-ivory/40">
            © {year} Eternal Invitation. All rights reserved.
          </p>
          <p className="font-body text-xs text-ivory/30">
            Built with love using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gold transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
