import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, StarIcon } from "lucide-react";

// Use your existing testimonials data from constants/testomonials.js
// or define them here if needed
const defaultTestimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Fashion Blogger",
    text: "Absolutely love shopping here! The quality is amazing and delivery is super fast. Best online shopping experience I've ever had.",
    rating: 4,
    avatarInitial: "SJ",
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Tech Enthusiast",
    text: "Great selection of products and excellent customer service. The return process was hassle-free when I needed it.",
    rating: 5,
    avatarInitial: "MC",
  },
  {
    id: 3,
    name: "Emma Williams",
    role: "Interior Designer",
    text: "The curated collections are fantastic. Found unique pieces that I couldn't find anywhere else. Highly recommended!",
    rating: 4,
    avatarInitial: "EW",
  },
  {
    id: 4,
    name: "David Kim",
    role: "Business Owner",
    text: "Reliable platform with consistent quality. My go-to place for professional and personal shopping needs.",
    rating: 1,
    avatarInitial: "DK",
  },
  {
    id: 5,
    name: "Lisa Thompson",
    role: "Frequent Shopper",
    text: "The AI recommendations are spot on! Found so many products I love that I wouldn't have discovered otherwise.",
    rating: 5,
    avatarInitial: "LT",
  },
];

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex space-x-5">
      {Array.from({ length: 5 }).map((_, i) => (
        <StarIcon className={i < count ? "fill-yellow-400 text-white" : "fill-gray-300 text-white"} />
      ))}
    </div>
  );
}

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const testimonialsData = defaultTestimonials;

  const nextTestimonial = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);
    setTimeout(() => setCurrentIndex((prev) => (prev + 1) % testimonialsData.length), 300);
  };

  const prevTestimonial = () => {
    if (isAnimating) return;
    setIsAnimating(true);

    setTimeout(() => setCurrentIndex((prev) => (prev - 1 + testimonialsData.length) % testimonialsData.length), 300);
  };

  const goToTestimonial = (index: number) => {
    if (isAnimating || index === currentIndex) return;
    setIsAnimating(true);
    setCurrentIndex(index);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const current = testimonialsData[currentIndex];

  return (
    <section id="testimonials" className="testimonials-section">
      <div className="testimonials-container">
        {/* Header */}
        <div className="testimonials-header">
          <div className="testimonials-badge">Testimonials</div>
          <h2 className="testimonials-title">
            What Our <span className="testimonials-title-accent">Customers Say</span>
          </h2>
          <p className="testimonials-subtitle">Join thousands of happy customers who love shopping with Lumina</p>
        </div>

        {/* Main Carousel */}
        <div className="testimonials-carousel">
          <button
            onClick={prevTestimonial}
            className="testimonials-nav testimonials-nav--prev"
            aria-label="Previous testimonial"
          >
            <ChevronLeft size={24} />
          </button>

          <div className="testimonials-card-wrapper">
            <div className={`testimonials-card ${isAnimating ? "testimonials-card--animating" : ""}`}>
              {/* Quote Icon */}
              <div className="testimonials-quote">"</div>
              <br></br>
              {/* Rating */}
              <div className="testimonials-rating">
                <StarRating count={current.rating} />
              </div>

              {/* Text */}
              <p className="testimonials-text">{current.text}</p>

              {/* Author */}
              <div className="testimonials-author">
                <div className="testimonials-avatar">{current.avatarInitial}</div>
                <div className="testimonials-info">
                  <div className="testimonials-name">{current.name}</div>
                  <div className="testimonials-role">{current.role}</div>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={nextTestimonial}
            className="testimonials-nav testimonials-nav--next"
            aria-label="Next testimonial"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Dots Indicator */}
        <div className="testimonials-dots">
          {testimonialsData.map((_, index) => (
            <button
              key={index}
              onClick={() => goToTestimonial(index)}
              className={`testimonials-dot ${index === currentIndex ? "testimonials-dot--active" : ""}`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
