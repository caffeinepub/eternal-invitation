import { Link, useLocation } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { useInternetIdentity } from "../../hooks/useInternetIdentity";
import { useIsCallerAdmin } from "../../hooks/useQueries";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { identity } = useInternetIdentity();
  const { data: isAdmin } = useIsCallerAdmin();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const isHome = location.pathname === "/";

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/categories", label: "Categories" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled || !isHome ? "scrolled-nav py-3" : "bg-transparent py-5"
      }`}
    >
      <nav className="container mx-auto px-6 flex items-center justify-between max-w-6xl">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src="/assets/generated/eternal-logo-transparent.dim_200x200.png"
            alt="Eternal Invitation"
            className="w-10 h-10 object-contain group-hover:scale-110 transition-transform duration-300"
          />
          <span
            className="font-display text-xl font-semibold tracking-wide"
            style={{
              color:
                scrolled || !isHome
                  ? "oklch(var(--foreground))"
                  : "oklch(var(--ivory))",
            }}
          >
            Eternal Invitation
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="nav-link font-body text-sm tracking-widest uppercase"
              style={{
                color:
                  scrolled || !isHome ? undefined : "oklch(var(--ivory) / 0.9)",
              }}
            >
              {link.label}
            </Link>
          ))}
          {identity && isAdmin ? (
            <Link
              to="/admin"
              className="nav-link font-body text-sm tracking-widest uppercase text-gold"
            >
              Admin
            </Link>
          ) : (
            <Link
              to="/admin/login"
              className="nav-link font-body text-sm tracking-widest uppercase text-gold/70 hover:text-gold transition-colors"
            >
              Admin Login
            </Link>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          type="button"
          className="md:hidden p-2 rounded-md"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <X
              size={22}
              style={{
                color:
                  scrolled || !isHome
                    ? "oklch(var(--foreground))"
                    : "oklch(var(--ivory))",
              }}
            />
          ) : (
            <Menu
              size={22}
              style={{
                color:
                  scrolled || !isHome
                    ? "oklch(var(--foreground))"
                    : "oklch(var(--ivory))",
              }}
            />
          )}
        </button>
      </nav>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden absolute top-full left-0 right-0 bg-ivory/98 backdrop-blur-md border-b border-border shadow-luxury"
          >
            <div className="container mx-auto px-6 py-4 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="font-body text-sm tracking-widest uppercase py-2 border-b border-border/50 text-foreground hover:text-gold transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              {identity && isAdmin ? (
                <Link
                  to="/admin"
                  className="font-body text-sm tracking-widest uppercase py-2 text-gold"
                >
                  Admin
                </Link>
              ) : (
                <Link
                  to="/admin/login"
                  className="font-body text-sm tracking-widest uppercase py-2 text-gold/70"
                >
                  Admin Login
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
