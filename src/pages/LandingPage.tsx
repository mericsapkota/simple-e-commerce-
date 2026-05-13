import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./LandingPage.css";
import { CarTaxiFrontIcon, ListOrdered, Lock, MessageSquareIcon, ShoppingBag, TreePalmIcon } from "lucide-react";

const services = [
  {
    icon: <ShoppingBag />,
    title: "Smart Shopping",
    description:
      "Browse thousands of curated products with intelligent search, filters, and personalized recommendations tailored just for you.",
  },
  {
    icon: <CarTaxiFrontIcon />,
    title: "Fast Delivery",
    description:
      "Lightning-fast shipping with real-time tracking. Your orders arrive fresh, safe, and right on time — every time.",
  },
  {
    icon: <Lock />,
    title: "Secure Payments",
    description:
      "Your transactions are protected with bank-level encryption and multi-factor authentication for complete peace of mind.",
  },
  {
    icon: <ListOrdered />,
    title: "Order Management",
    description:
      "Track, manage, and review all your orders from a single elegant dashboard. Cancel, return, or reorder with ease.",
  },
  {
    icon: <MessageSquareIcon />,
    title: "24/7 Support",
    description:
      "Our dedicated support team is always just a message away. Get help instantly via chat, email, or phone anytime.",
  },
  {
    icon: <TreePalmIcon />,
    title: "Eco-Friendly",
    description:
      "We partner only with sustainable brands and use eco-conscious packaging — because we care about the planet too.",
  },
];

const testimonials = [
  {
    name: "Sophia Laurent",
    role: "Fashion Blogger",
    avatar: "SL",
    rating: 5,
    text: "Absolutely stunning experience! The product quality exceeded my expectations and delivery was incredibly fast. I've never felt so confident shopping online.",
  },
  {
    name: "Marcus Chen",
    role: "Tech Entrepreneur",
    avatar: "MC",
    rating: 5,
    text: "The order management dashboard is a game-changer. I handle bulk orders for my business and everything just works seamlessly. Highly recommend!",
  },
  {
    name: "Aisha Patel",
    role: "Lifestyle Creator",
    avatar: "AP",
    rating: 5,
    text: "From browsing to checkout, every step felt premium. The eco-friendly packaging was such a wonderful touch. This is now my go-to store!",
  },
  {
    name: "James Whitmore",
    role: "Small Business Owner",
    avatar: "JW",
    rating: 5,
    text: "Customer support resolved my query within minutes. The platform is intuitive, the prices are great, and I love the seamless returns process.",
  },
];

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
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
      <nav className={`lp-nav ${scrollY > 60 ? "lp-nav--scrolled" : ""}`}>
        <div className="lp-nav-inner">
          <div className="lp-logo">
            <span className="lp-logo-text">Lumina</span>
          </div>
          <div className="lp-nav-links">
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
        </div>
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
            <div className="lp-card-chip">🛍️ New Arrivals</div>
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
            <span>🚚</span> Delivered in 2 hrs
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
      <section id="testimonials" className="lp-testimonials">
        <div className="lp-section-header lp-animate">
          <div className="lp-section-badge">Testimonials</div>
          <h2 className="lp-section-title">
            Loved by thousands
            <br />
            <span className="lp-accent">around the world</span>
          </h2>
        </div>
        <div className="lp-testimonials-grid">
          {testimonials.map((t, i) => (
            <div key={i} className={`lp-testimonial-card lp-animate ${i === 1 ? "lp-testimonial-card--featured" : ""}`}>
              <StarRating count={t.rating} />
              <p className="lp-testimonial-text">"{t.text}"</p>
              <div className="lp-testimonial-author">
                <div className={`lp-author-avatar lp-author-avatar--${i + 1}`}>{t.avatar}</div>
                <div>
                  <div className="lp-author-name">{t.name}</div>
                  <div className="lp-author-role">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

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
