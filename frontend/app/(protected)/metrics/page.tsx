"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../auth/AuthContext";
import Navbar from "../../components/Navbar";
import MetricsChart from "./MetricsChart";

type Metrics = {
  accuracy: number;
  precision: number;
  recall: number;
  f1_score: number;
};

export default function MetricsPage() {
  const { token } = useAuth();
  const router = useRouter();
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [fetchError, setFetchError] = useState(false);

  useEffect(() => {
    if (!token) {
      router.replace("/login");
      return;
    }

    fetch("http://127.0.0.1:8000/metrics", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => {
        if (r.status === 401) { router.replace("/login"); return null; }
        if (!r.ok) throw new Error("Failed to fetch");
        return r.json();
      })
      .then((data) => { if (data) setMetrics(data); })
      .catch(() => setFetchError(true));
  }, [token, router]);

  if (!token) return null;

  return (
    <>
      <style>{styles}</style>
      <Navbar />

      <div className="page">
        <div className="card">

          <div className="card-header">
            <div className="header-icon" aria-hidden="true">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="20" x2="18" y2="10"/>
                <line x1="12" y1="20" x2="12" y2="4"/>
                <line x1="6"  y1="20" x2="6"  y2="14"/>
                <line x1="2"  y1="20" x2="22" y2="20"/>
              </svg>
            </div>
            <div>
              <h1 className="title">Model Performance</h1>
              <p className="subtitle">Evaluation metrics from the trained loan risk model.</p>
            </div>
          </div>

          {/* ── States ── */}
          {fetchError && (
            <div className="state-box error">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                aria-hidden="true">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              Could not load metrics. Make sure the backend is running.
            </div>
          )}

          {!fetchError && !metrics && (
            <div className="state-box loading">
              <span className="spinner" aria-hidden="true" />
              Loading metrics…
            </div>
          )}

          {/* ── Stat cards ── */}
          {metrics && (
            <div className="metrics-body">

              <div className="stat-grid">
                {([
                  { label: "Accuracy",  value: metrics.accuracy,  color: "#1a56db", desc: "Overall correct predictions" },
                  { label: "Precision", value: metrics.precision, color: "#0e9f6e", desc: "True positives out of predicted positives" },
                  { label: "Recall",    value: metrics.recall,    color: "#8b5cf6", desc: "True positives out of actual positives" },
                  { label: "F1 Score",  value: metrics.f1_score,  color: "#f59e0b", desc: "Harmonic mean of precision & recall" },
                ] as const).map(({ label, value, color, desc }) => (
                  <div className="stat-card" key={label}>
                    <div className="stat-bar-bg">
                      <div
                        className="stat-bar-fill"
                        style={{ width: `${(value * 100).toFixed(1)}%`, background: color }}
                      />
                    </div>
                    <div className="stat-info">
                      <span className="stat-label">{label}</span>
                      <span className="stat-value" style={{ color }}>{(value * 100).toFixed(1)}%</span>
                    </div>
                    <p className="stat-desc">{desc}</p>
                  </div>
                ))}
              </div>

              <div className="chart-section">
                <h2 className="section-title">Visual Breakdown</h2>
                <MetricsChart metrics={metrics} />
              </div>

            </div>
          )}

        </div>
      </div>
    </>
  );
}

const styles = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .page {
    min-height: 100vh; background: #f4f6f9;
    display: flex; justify-content: center; align-items: flex-start;
    padding: 40px 16px 60px; font-family: 'Segoe UI', system-ui, sans-serif;
  }

  .card {
    background: #fff; border-radius: 16px;
    box-shadow: 0 4px 24px rgba(0,0,0,0.08);
    width: 100%; max-width: 780px; overflow: hidden;
  }

  /* ── Header — same as dashboard & login ── */
  .card-header {
    background: #1a56db; color: #fff;
    padding: 28px 32px; display: flex; align-items: center; gap: 16px;
  }
  .header-icon {
    width: 48px; height: 48px; background: rgba(255,255,255,0.15);
    border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .title    { font-size: 1.5rem; font-weight: 700; letter-spacing: -0.02em; }
  .subtitle { margin-top: 3px; font-size: 0.875rem; opacity: 0.82; }

  /* ── States ── */
  .state-box {
    margin: 32px; padding: 18px 20px; border-radius: 10px;
    display: flex; align-items: center; gap: 12px;
    font-size: 0.9rem; font-weight: 500;
  }
  .state-box.loading { background: #eff6ff; color: #1a56db; border: 1.5px solid #bfdbfe; }
  .state-box.error   { background: #fff1f2; color: #be123c; border-left: 4px solid #e11d48; }

  @keyframes spin { to { transform: rotate(360deg); } }
  .spinner {
    width: 18px; height: 18px; border: 2px solid rgba(26,86,219,0.25);
    border-top-color: #1a56db; border-radius: 50%;
    animation: spin 0.7s linear infinite; flex-shrink: 0;
  }

  /* ── Metrics body ── */
  .metrics-body { padding: 28px 32px 32px; display: flex; flex-direction: column; gap: 32px; }

  /* ── Stat cards ── */
  .stat-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; }

  .stat-card {
    background: #f9fafb; border: 1.5px solid #e5e7eb;
    border-radius: 12px; padding: 18px 16px;
    display: flex; flex-direction: column; gap: 10px;
    transition: box-shadow 0.15s, border-color 0.15s;
  }
  .stat-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.07); border-color: #d1d5db; }

  .stat-bar-bg {
    width: 100%; height: 6px; background: #e5e7eb; border-radius: 99px; overflow: hidden;
  }
  .stat-bar-fill {
    height: 100%; border-radius: 99px;
    transition: width 0.8s cubic-bezier(0.4,0,0.2,1);
  }

  .stat-info { display: flex; justify-content: space-between; align-items: baseline; }
  .stat-label { font-size: 0.78rem; font-weight: 600; color: #374151; text-transform: uppercase; letter-spacing: 0.05em; }
  .stat-value { font-size: 1.5rem; font-weight: 700; line-height: 1; }
  .stat-desc  { font-size: 0.75rem; color: #6b7280; line-height: 1.4; }

  /* ── Chart section ── */
  .chart-section { display: flex; flex-direction: column; gap: 14px; }
  .section-title {
    font-size: 0.68rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
    color: #6b7280; padding-bottom: 8px; border-bottom: 1.5px solid #e5e7eb;
  }
`;