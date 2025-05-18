"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation"; // Import useRouter for navigation

import "./styles/index.css"; // Import your CSS file
// import router from "next/router";

export default function Index() {
  useEffect(() => {
    const particles = document.getElementById("particles");
    const particleCount = 50;
    
    if (particles) {
      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement("div");
        particle.classList.add("particle");

        const size = Math.random() * 3 + 1;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.opacity = `${Math.random() * 0.5}`;
        const duration = Math.random() * 20 + 10;
        particle.style.animationDuration = `${duration}s`;
        particle.style.animationDelay = `${Math.random() * 5}s`;

        particles.appendChild(particle);
      }
    }

    const faqItems = document.querySelectorAll(".faq-item");
    faqItems.forEach((item) => {
      const question = item.querySelector(".faq-question");
      if (question) {
        question.addEventListener("click", () => {
          item.classList.toggle("active");
          faqItems.forEach((otherItem) => {
            if (otherItem !== item && otherItem.classList.contains("active")) {
              otherItem.classList.remove("active");
            }
          });
        });
      }
    });

    return () => {
      if (particles) {
        particles.innerHTML = "";
      }
      faqItems.forEach((item) => {
        const question = item.querySelector(".faq-question");
        if (question) {
          question.removeEventListener("click", () => {});
        }
      });
    };
  }, []);

  const router = useRouter();
  const handleCallZoey = () => {
    router.push("/assistant"); // Navigate to the assistant page
  };
  
  return (
    <div>
      <div className="noise"></div>
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>
      <div className="orb orb-3"></div>

      <div className="container">
        <header>
          <a href="#" className="logo">
            <span className="logo-icon"></span>
            <span>ZOEY</span>
          </a>
          <nav className="nav">
            <a href="#" className="nav-link">About</a>
            <a href="#" className="nav-link">Features</a>
            <a href="#" className="nav-link">Technology</a>
            <a href="#" className="nav-link">Pricing</a>
          </nav>
        </header>

        <section className="hero">
          <div className="hero-content">
            <h1 className="hero-title">Let AI Help You Meet Your Perfect Match</h1>
            <p className="hero-subtitle">
              ZOEY AI uses advanced artificial intelligence to understand your
              deepest emotional patterns and desires, connecting you with your
              Soul match who truly resonates with your essence.
            </p>
            <div className="action-buttons">
              <a href="#download" className="btn">
                Download App
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 17V3M12 17l-5-5M12 17l5-5" />
                </svg>
              </a>
              <a onClick={handleCallZoey}  className="btn btn-secondary">Call ZOEY</a>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-sphere"></div>
            <div className="hero-title" style={{ marginLeft: "200px" }}>
              <div style={{ textAlign: "center", fontSize: "smaller" }}>Finally, No More</div>
              <div style={{ textAlign: "center", fontSize: "smaller" }}>Swiping!</div>
            </div>
          </div>

          <div className="particles" id="particles"></div>
        </section>

        <section className="features" id="learn-more">
          <h2 className="section-title">Meet the SOUL of your life!</h2>
          <p className="section-subtitle">
            Skip the process and filling long forms page after page. Talk to ZOEY
            - and it will connect you with your most compatible mate. Our
            proprietary algorithms decode emotional compatibility at a level never
            seen before in relationship technology.
          </p>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="30"
                  height="30"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 16.25" />
                  <line x1="8" y1="16" x2="8.01" y2="16" />
                  <line x1="8" y1="20" x2="8.01" y2="20" />
                  <line x1="12" y1="18" x2="12.01" y2="18" />
                  <line x1="12" y1="22" x2="12.01" y2="22" />
                  <line x1="16" y1="16" x2="16.01" y2="16" />
                  <line x1="16" y1="20" x2="16.01" y2="20" />
                </svg>
              </div>
              <h3 className="feature-title">One Connection at a time</h3>
              <p className="feature-description">
                Promoting Loyalty and Authenticity, ZOEY AI focuses on one
                connection at a time, ensuring a deeper, more meaningful
                interaction.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                💬
              </div>
              <h3 className="feature-title">Talk, Don’t Type</h3>
              <p className="feature-description">
                Start with a conversation, not a bio. ZOEY learns your values,
                humor, and heart to find someone who truly fits.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                🧠
              </div>
              <h3 className="feature-title">Emotional AI Matchmaking</h3>
              <p className="feature-description">
                ZOEY isn’t just smart — she’s emotionally intelligent. Our system
                understands feelings to create more human, heart-led matches.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                🔒
              </div>
              <h3 className="feature-title">Private and Secure</h3>
              <p className="feature-description">
                All your conversations are encrypted, and ZOEY only keeps what’s
                needed to improve your matchmaking experience.
              </p>
            </div>
          </div>
        </section>
      </div>

      <footer className="footer">
        <div className="footer-content">
          <div className="copyright">&copy; 2025 GEC All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
