"use client";

import { useRouter } from "next/navigation";
import Navbar from "./components/Navbar";

export default function Home() {
  const router = useRouter();

  const features = [
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
        </svg>
      ),
      title: "Instant Predictions",
      desc: "Get loan eligibility results in milliseconds, powered by a trained ML model.",
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
      ),
      title: "Secure & Private",
      desc: "JWT-protected endpoints and bcrypt-hashed passwords keep your data safe.",
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
          <line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/>
        </svg>
      ),
      title: "Model Metrics",
      desc: "Live accuracy, precision, recall & F1 score from the model's validation run.",
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/>
          <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
        </svg>
      ),
      title: "MongoDB Backed",
      desc: "All users, logs, and metrics are persisted in a cloud-ready MongoDB database.",
    },
  ];

  const steps = [
    { num: "01", title: "Create Account", desc: "Register with a username and password — takes under a minute." },
    { num: "02", title: "Enter Loan Details", desc: "Fill in your financial profile on the secure dashboard." },
    { num: "03", title: "Get Your Result", desc: "Receive an Approved or Rejected prediction instantly." },
  ];

  return (
    <>
      <style>{styles}</style>
      <Navbar />

      <main className="main">

        {/* ── Hero ── */}
        <section className="hero">
          <div className="hero-badge">
            <span className="badge-dot" aria-hidden="true" />
            AI-Powered Loan Intelligence
          </div>
          <h1 className="hero-title">
            Know Your Loan<br />
            <span className="hero-accent">Eligibility Instantly</span>
          </h1>
          <p className="hero-sub">
            A full-stack machine learning system that evaluates your loan application
            in real time — with enterprise-grade security and transparent model metrics.
          </p>
          <div className="hero-actions">
            <button className="btn-primary" onClick={() => router.push("/register")}>
              Get Started Free
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                aria-hidden="true">
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
              </svg>
            </button>
            <button className="btn-secondary" onClick={() => router.push("/login")}>
              Sign In
            </button>
          </div>
          <div className="hero-stats">
            {[
              { value: "~85%", label: "Model Accuracy" },
              { value: "<50ms", label: "Inference Time" },
              { value: "11", label: "Input Features" },
            ].map(({ value, label }) => (
              <div className="stat-item" key={label}>
                <span className="stat-value">{value}</span>
                <span className="stat-label">{label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Features ── */}
        <section className="section">
          <div className="section-inner">
            <h2 className="section-heading">Everything you need</h2>
            <p className="section-sub">Built on a modern full-stack AI architecture.</p>
            <div className="features-grid">
              {features.map(({ icon, title, desc }) => (
                <div className="feature-card" key={title}>
                  <div className="feature-icon" aria-hidden="true">{icon}</div>
                  <h3 className="feature-title">{title}</h3>
                  <p className="feature-desc">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── How it works ── */}
        <section className="section alt">
          <div className="section-inner">
            <h2 className="section-heading">How it works</h2>
            <p className="section-sub">Three steps from sign-up to prediction.</p>
            <div className="steps-row">
              {steps.map(({ num, title, desc }, i) => (
                <div className="step" key={num}>
                  <div className="step-num">{num}</div>
                  <h3 className="step-title">{title}</h3>
                  <p className="step-desc">{desc}</p>
                  {i < steps.length - 1 && <div className="step-arrow" aria-hidden="true">→</div>}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="cta-section">
          <div className="cta-inner">
            <h2 className="cta-title">Ready to check your eligibility?</h2>
            <p className="cta-sub">Create a free account and get your first prediction in minutes.</p>
            <button className="btn-primary large" onClick={() => router.push("/register")}>
              Create Free Account
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                aria-hidden="true">
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
              </svg>
            </button>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="footer">
          <div className="footer-brand">
            <div className="footer-logo" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2"/>
                <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
              </svg>
            </div>
            <span>LoanAI System</span>
          </div>
          <p className="footer-copy">Built with Next.js · FastAPI · MongoDB · scikit-learn</p>
        </footer>

      </main>
    </>
  );
}

const styles = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Segoe UI', system-ui, sans-serif; }

  .main { background: #f4f6f9; min-height: 100vh; }

  /* ── Hero ── */
  .hero {
    background: #fff; text-align: center;
    padding: 80px 24px 72px;
    border-bottom: 1px solid #e5e7eb;
  }
  .hero-badge {
    display: inline-flex; align-items: center; gap: 7px;
    background: #eff6ff; color: #1a56db; border: 1px solid #bfdbfe;
    border-radius: 99px; padding: 5px 14px; font-size: 0.78rem; font-weight: 600;
    margin-bottom: 24px; letter-spacing: 0.02em;
  }
  .badge-dot {
    width: 7px; height: 7px; background: #1a56db; border-radius: 50%;
    animation: pulse 2s infinite;
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(0.85); }
  }
  .hero-title {
    font-size: clamp(2rem, 5vw, 3rem); font-weight: 800;
    color: #111827; line-height: 1.15; letter-spacing: -0.03em;
    margin-bottom: 18px;
  }
  .hero-accent { color: #1a56db; }
  .hero-sub {
    max-width: 520px; margin: 0 auto 32px;
    font-size: 1rem; color: #6b7280; line-height: 1.6;
  }
  .hero-actions { display: flex; justify-content: center; gap: 12px; flex-wrap: wrap; margin-bottom: 48px; }
  .btn-primary {
    display: inline-flex; align-items: center; gap: 8px;
    background: #1a56db; color: #fff; border: none;
    padding: 13px 24px; border-radius: 10px;
    font-size: 0.95rem; font-weight: 600; cursor: pointer;
    box-shadow: 0 4px 14px rgba(26,86,219,0.35);
    transition: background 0.15s, transform 0.1s, box-shadow 0.15s;
  }
  .btn-primary:hover { background: #1648c0; transform: translateY(-2px); box-shadow: 0 6px 20px rgba(26,86,219,0.4); }
  .btn-primary.large { padding: 15px 32px; font-size: 1rem; }
  .btn-secondary {
    display: inline-flex; align-items: center;
    background: #fff; color: #374151; border: 1.5px solid #d1d5db;
    padding: 13px 24px; border-radius: 10px;
    font-size: 0.95rem; font-weight: 600; cursor: pointer;
    transition: background 0.15s, border-color 0.15s, transform 0.1s;
  }
  .btn-secondary:hover { background: #f9fafb; border-color: #9ca3af; transform: translateY(-1px); }
  .hero-stats {
    display: inline-flex; gap: 0; border: 1.5px solid #e5e7eb;
    border-radius: 12px; overflow: hidden; background: #fff;
    box-shadow: 0 1px 6px rgba(0,0,0,0.05);
  }
  .stat-item {
    padding: 14px 28px; display: flex; flex-direction: column; align-items: center; gap: 2px;
    border-right: 1.5px solid #e5e7eb;
  }
  .stat-item:last-child { border-right: none; }
  .stat-value { font-size: 1.35rem; font-weight: 800; color: #1a56db; letter-spacing: -0.03em; }
  .stat-label { font-size: 0.72rem; font-weight: 500; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.06em; }

  /* ── Sections ── */
  .section { padding: 72px 24px; }
  .section.alt { background: #fff; border-top: 1px solid #e5e7eb; border-bottom: 1px solid #e5e7eb; }
  .section-inner { max-width: 900px; margin: 0 auto; }
  .section-heading {
    font-size: 1.75rem; font-weight: 800; color: #111827;
    text-align: center; letter-spacing: -0.03em; margin-bottom: 8px;
  }
  .section-sub { text-align: center; color: #6b7280; font-size: 0.95rem; margin-bottom: 44px; }

  /* ── Features ── */
  .features-grid {
    display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px;
  }
  .feature-card {
    background: #fff; border: 1.5px solid #e5e7eb; border-radius: 14px;
    padding: 24px 20px; display: flex; flex-direction: column; gap: 12px;
    transition: box-shadow 0.15s, border-color 0.15s, transform 0.15s;
  }
  .feature-card:hover {
    box-shadow: 0 8px 24px rgba(0,0,0,0.08); border-color: #c7d2fe; transform: translateY(-2px);
  }
  .feature-icon {
    width: 44px; height: 44px; background: #eff6ff; border-radius: 10px;
    display: flex; align-items: center; justify-content: center; color: #1a56db;
  }
  .feature-title { font-size: 0.95rem; font-weight: 700; color: #111827; }
  .feature-desc  { font-size: 0.83rem; color: #6b7280; line-height: 1.55; }

  /* ── Steps ── */
  .steps-row {
    display: flex; gap: 0; align-items: flex-start; flex-wrap: wrap; justify-content: center;
  }
  .step {
    position: relative; flex: 1; min-width: 200px; max-width: 280px;
    text-align: center; padding: 0 24px;
  }
  .step-num {
    font-size: 2.5rem; font-weight: 900; color: #e5e7eb;
    line-height: 1; letter-spacing: -0.05em; margin-bottom: 10px;
  }
  .step-title { font-size: 1rem; font-weight: 700; color: #111827; margin-bottom: 8px; }
  .step-desc  { font-size: 0.83rem; color: #6b7280; line-height: 1.55; }
  .step-arrow {
    position: absolute; right: -12px; top: 10px;
    font-size: 1.5rem; color: #d1d5db; font-weight: 300;
  }

  /* ── CTA ── */
  .cta-section {
    padding: 72px 24px;
    background: linear-gradient(135deg, #1a56db 0%, #1648c0 100%);
  }
  .cta-inner { max-width: 600px; margin: 0 auto; text-align: center; }
  .cta-title { font-size: 1.75rem; font-weight: 800; color: #fff; letter-spacing: -0.03em; margin-bottom: 10px; }
  .cta-sub   { color: rgba(255,255,255,0.8); font-size: 0.95rem; margin-bottom: 32px; }
  .cta-section .btn-primary {
    background: #fff; color: #1a56db;
    box-shadow: 0 4px 14px rgba(0,0,0,0.15);
  }
  .cta-section .btn-primary:hover { background: #f0f4ff; }

  /* ── Footer ── */
  .footer {
    background: #fff; border-top: 1px solid #e5e7eb;
    padding: 24px; display: flex; flex-direction: column; align-items: center; gap: 6px;
  }
  .footer-brand {
    display: flex; align-items: center; gap: 8px;
    font-size: 0.9rem; font-weight: 700; color: #374151;
  }
  .footer-logo {
    width: 28px; height: 28px; background: #1a56db; border-radius: 7px;
    display: flex; align-items: center; justify-content: center; color: #fff;
  }
  .footer-copy { font-size: 0.75rem; color: #9ca3af; }
`;