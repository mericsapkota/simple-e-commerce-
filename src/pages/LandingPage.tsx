import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./LandingPage.css";
import { services } from "../constants/services";
import { testimonials } from "../constants/testomonials";
import { Car, ShoppingBag, Menu, X } from "lucide-react";
import Testimonials from "./Testimonials";

const stats = [
  { value: "50K+", label: "Happy Customers" },
  { value: "10K+", label: "Products" },
  { value: "98%", label: "Satisfaction Rate" },
  { value: "24/7", label: "Support" },
];

function StarRating({ count }: { count: number }) {
  return (
    <div className="lp-stars">
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} className="lp-star">
          ★
        </span>
      ))}
    </div>
  );
}

export default function LandingPage() {
  const [scrollY, setScrollY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("lp-visible");
          }
        });
      },
      { threshold: 0.1 },
    );

    document.querySelectorAll(".lp-animate").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="lp-root">
      {/* Navbar */}
      <nav className={`lp-nav ${scrollY > 100 ? "lp-nav--scrolled" : ""}`}>
        <div className="lp-nav-inner">
          <div className="lp-logo">
            <span className="lp-logo-text">Lumina</span>
          </div>
          <div className="lp-nav-links">
            <a href="/products" className="lp-nav-link">
              Products
            </a>
            <a href="#services" className="lp-nav-link">
              Services
            </a>
            <a href="#testimonials" className="lp-nav-link">
              Reviews
            </a>
            <Link to="/login" className="lp-nav-btn-ghost">
              Sign In
            </Link>
            <Link to="/signup" className="lp-nav-btn">
              Get Started
            </Link>
          </div>
          <button className="lp-hamburger" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu">
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lp-mobile-menu">
            <a href="/products" className="lp-mobile-link" onClick={() => setMobileMenuOpen(false)}>
              Products
            </a>
            <a href="#services" className="lp-mobile-link" onClick={() => setMobileMenuOpen(false)}>
              Services
            </a>
            <a href="#testimonials" className="lp-mobile-link" onClick={() => setMobileMenuOpen(false)}>
              Reviews
            </a>
            <Link to="/login" className="lp-mobile-link" onClick={() => setMobileMenuOpen(false)}>
              Sign In
            </Link>
            <Link to="/signup" className="lp-mobile-link lp-mobile-link--cta" onClick={() => setMobileMenuOpen(false)}>
              Get Started
            </Link>
          </div>
        )}
      </nav>
      {/* Hero */}
      <section className="lp-hero" ref={heroRef}>
        <div className="lp-hero-orb lp-hero-orb--1" />
        <div className="lp-hero-orb lp-hero-orb--2" />
        <div className="lp-hero-orb lp-hero-orb--3" />
        <div className="lp-hero-content">
          <div className="lp-hero-badge lp-animate"> Premium Shopping Experience</div>
          <h1 className="lp-hero-title lp-animate">
            Shop Smarter,
            <br />
            <span className="lp-hero-title-accent">Live Better</span>
          </h1>
          <p className="lp-hero-subtitle lp-animate">
            Discover a curated marketplace where quality meets convenience. Thousands of premium products,
            lightning-fast delivery, and an experience that feels truly personal.
          </p>
          <div className="lp-hero-actions lp-animate">
            <Link to="/signup" className="lp-btn-primary">
              Start Shopping Free
              <span className="lp-btn-arrow">→</span>
            </Link>
            <a href="#services" className="lp-btn-secondary">
              Explore Features
            </a>
          </div>
          <div className="lp-hero-trust lp-animate">
            <div className="lp-trust-avatars">
              {["A", "B", "C", "D"].map((l, i) => (
                <div key={i} className={`lp-trust-avatar lp-trust-avatar--${i + 1}`}>
                  {l}
                </div>
              ))}
            </div>
            <span className="lp-trust-text">
              Trusted by <strong>50,000+</strong> customers worldwide
            </span>
          </div>
        </div>
        <div className="lp-hero-visual lp-animate">
          <div className="lp-hero-card lp-hero-card--main">
            <div className="lp-card-chip flex gap-2">
              <span>
                <ShoppingBag className="w-4 h-4" />
              </span>{" "}
              New Arrivals
            </div>
            <div className="lp-card-product">
              <div className="lp-product-img-placeholder">
                <span>👟</span>
              </div>
              <div className="lp-product-info">
                <div className="lp-product-name">Premium Sneakers</div>
                <div className="lp-product-price">$129.00</div>
              </div>
            </div>
            <div className="lp-card-cta">Add to Cart</div>
          </div>
          <div className="lp-hero-card lp-hero-card--float1">
            <span>
              <Car />{" "}
            </span>{" "}
            Delivered in 2 hrs
          </div>
          <div className="lp-hero-card lp-hero-card--float2">
            <StarRating count={5} />
            <span>4.9 / 5 rating</span>
          </div>
        </div>
      </section>
      {/* Stats */}
      <section className="lp-stats">
        <div className="lp-stats-grid">
          {stats.map((stat, i) => (
            <div key={i} className="lp-stat lp-animate">
              <div className="lp-stat-value">{stat.value}</div>
              <div className="lp-stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>
      {/* Services */}
      <section id="services" className="lp-services">
        <div className="lp-section-header lp-animate">
          <div className="lp-section-badge">Our Services</div>
          <h2 className="lp-section-title">
            Everything you need,
            <br />
            <span className="lp-accent">in one place</span>
          </h2>
          <p className="lp-section-subtitle">
            From discovery to delivery, we've built every feature to make your shopping journey delightful.
          </p>
        </div>
        <div className="lp-services-grid">
          {services.map((s, i) => (
            <div key={i} className="lp-service-card lp-animate">
              <div className="lp-service-icon">{s.icon}</div>
              <h3 className="lp-service-title">{s.title}</h3>
              <p className="lp-service-desc">{s.description}</p>
              <div className="lp-service-line" />
            </div>
          ))}
        </div>
      </section>
      {/* Feature Highlight */}
      <section className="lp-feature">
        <div className="lp-feature-inner">
          <div className="lp-feature-text lp-animate">
            <div className="lp-section-badge">Why Lumina?</div>
            <h2 className="lp-section-title">
              A shopping platform
              <br />
              <span className="lp-accent">built for you</span>
            </h2>
            <ul className="lp-feature-list">
              {[
                "Curated products from top brands worldwide",
                "AI-powered personal recommendations",
                "One-click reorder for your favorites",
                "Hassle-free returns within 30 days",
                "Exclusive member deals and early access",
              ].map((item, i) => (
                <li key={i} className="lp-feature-item">
                  <span className="lp-feature-check">✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <Link to="/signup" className="lp-btn-primary" style={{ display: "inline-flex", marginTop: "2rem" }}>
              Join for Free <span className="lp-btn-arrow">→</span>
            </Link>
          </div>
          <div className="lp-feature-visual lp-animate">
            <div className="lp-feature-mockup">
              <div className="lp-mockup-header">
                <div className="lp-mockup-dot" />
                <div className="lp-mockup-dot" />
                <div className="lp-mockup-dot" />
              </div>
              <div className="lp-mockup-body">
                <div className="lp-mockup-row">
                  <div className="lp-mockup-label">Dashboard</div>
                  <div className="lp-mockup-pill">Live</div>
                </div>
                {[
                  { icon: "📦", name: "Order #1042", status: "Delivered", color: "#22c55e" },
                  { icon: "🚚", name: "Order #1041", status: "In Transit", color: "#f59e0b" },
                  { icon: "🛒", name: "Order #1040", status: "Processing", color: "#6366f1" },
                ].map((o, i) => (
                  <div key={i} className="lp-mockup-order">
                    <span className="lp-mockup-order-icon">{o.icon}</span>
                    <span className="lp-mockup-order-name">{o.name}</span>
                    <span className="lp-mockup-order-status" style={{ color: o.color }}>
                      {o.status}
                    </span>
                  </div>
                ))}
                <div className="lp-mockup-bar-section">
                  <div className="lp-mockup-bar-label">Monthly Revenue</div>
                  <div className="lp-mockup-bars">
                    {[40, 70, 55, 90, 65, 80].map((h, i) => (
                      <div key={i} className="lp-mockup-bar" style={{ height: `${h}%` }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Testimonials */}
      <Testimonials />
      {/* CTA */}
      <section className="lp-cta">
        <div className="lp-cta-orb lp-cta-orb--1" />
        <div className="lp-cta-orb lp-cta-orb--2" />
        <div className="lp-cta-content lp-animate">
          <div className="lp-section-badge">Get Started Today</div>
          <h2 className="lp-cta-title">
            Ready to transform
            <br />
            your shopping?
          </h2>
          <p className="lp-cta-subtitle">
            Join 50,000+ happy shoppers and experience the future of e-commerce. Free to sign up, no credit card
            required.
          </p>
          <div className="lp-cta-actions">
            <Link to="/signup" className="lp-btn-primary lp-btn-primary--large">
              Create Free Account <span className="lp-btn-arrow">→</span>
            </Link>
            <Link to="/login" className="lp-btn-ghost">
              Already have an account? Sign in
            </Link>
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="lp-footer">
        <div className="lp-footer-inner">
          <div className="lp-logo">
            <span className="lp-logo-icon">✦</span>
            <span className="lp-logo-text">Lumina</span>
          </div>
          <p className="lp-footer-copy">© 2026 Lumina. Crafted with care for a better shopping world.</p>
          <div className="lp-footer-links">
            <Link to="/login" className="lp-footer-link">
              Login
            </Link>
            <Link to="/signup" className="lp-footer-link">
              Sign Up
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
