"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async () => {
    if (!username.trim() || !password) return;
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("http://127.0.0.1:8000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.detail || "Registration failed. Please try again.");
        return;
      }

      setSuccess(data.message || "Account created! Redirecting to login…");
      setTimeout(() => router.push("/login"), 1800);
    } catch {
      setError("Cannot reach the server. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleRegister();
  };

  const isValid = username.trim().length > 0 && password.length > 0 && confirmPassword.length > 0;

  return (
    <>
      <style>{styles}</style>

      <div className="page">
        <div className="card">

          <div className="card-header">
            <div className="header-icon" aria-hidden="true">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <line x1="19" y1="8" x2="19" y2="14"/>
                <line x1="22" y1="11" x2="16" y2="11"/>
              </svg>
            </div>
            <div>
              <h1 className="title">Create Account</h1>
              <p className="subtitle">Join the Loan AI System today.</p>
            </div>
          </div>

          <div className="form-body">

            {/* Username */}
            <div className="field">
              <label className="field-label" htmlFor="username">Username</label>
              <div className="input-wrapper">
                <span className="input-icon" aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </span>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Choose a username"
                  className="input"
                  autoComplete="username"
                  autoFocus
                />
              </div>
            </div>

            {/* Password */}
            <div className="field">
              <label className="field-label" htmlFor="password">Password</label>
              <div className="input-wrapper">
                <span className="input-icon" aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </span>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="At least 6 characters"
                  className="input"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="toggle-pw"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="field">
              <label className="field-label" htmlFor="confirm-password">Confirm Password</label>
              <div className="input-wrapper">
                <span className="input-icon" aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </span>
                <input
                  id="confirm-password"
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Re-enter your password"
                  className={`input ${confirmPassword && confirmPassword !== password ? "input-error" : ""}`}
                  autoComplete="new-password"
                />
                {confirmPassword && confirmPassword === password && (
                  <span className="match-icon" aria-label="Passwords match">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                      stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </span>
                )}
              </div>
            </div>

            {/* Password strength hint */}
            {password.length > 0 && (
              <div className="strength-row">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className={`strength-bar ${
                      password.length >= [3, 6, 9, 12][i] ? getStrengthColor(password.length) : "empty"
                    }`}
                  />
                ))}
                <span className="strength-label">{getStrengthLabel(password.length)}</span>
              </div>
            )}

            {error && (
              <div className="error-banner" role="alert">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                  aria-hidden="true">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {error}
              </div>
            )}

            {success && (
              <div className="success-banner" role="status">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                  aria-hidden="true">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                {success}
              </div>
            )}

            <button
              onClick={handleRegister}
              disabled={!isValid || loading}
              className="submit-btn"
            >
              {loading ? (
                <span className="btn-inner">
                  <span className="spinner" aria-hidden="true" /> Creating account…
                </span>
              ) : "Create Account"}
            </button>

            <p className="footer-text">
              Already have an account?{" "}
              <button className="link-btn" onClick={() => router.push("/login")}>
                Sign in
              </button>
            </p>

          </div>
        </div>
      </div>
    </>
  );
}

function getStrengthColor(len: number) {
  if (len < 6) return "weak";
  if (len < 9) return "fair";
  if (len < 12) return "good";
  return "strong";
}

function getStrengthLabel(len: number) {
  if (len < 3) return "";
  if (len < 6) return "Weak";
  if (len < 9) return "Fair";
  if (len < 12) return "Good";
  return "Strong";
}

const styles = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  .page {
    min-height: 100vh; background: #f4f6f9;
    display: flex; justify-content: center; align-items: center;
    padding: 40px 16px; font-family: 'Segoe UI', system-ui, sans-serif;
  }
  .card {
    background: #fff; border-radius: 16px;
    box-shadow: 0 4px 24px rgba(0,0,0,0.08); width: 100%; max-width: 440px; overflow: hidden;
    animation: slideUp 0.25s ease;
  }
  @keyframes slideUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
  .card-header {
    background: #1a56db; color: #fff; padding: 28px 32px;
    display: flex; align-items: center; gap: 16px;
  }
  .header-icon {
    width: 48px; height: 48px; background: rgba(255,255,255,0.15);
    border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .title    { font-size: 1.5rem; font-weight: 700; letter-spacing: -0.02em; }
  .subtitle { margin-top: 3px; font-size: 0.875rem; opacity: 0.82; }
  .form-body { padding: 28px 32px 32px; display: flex; flex-direction: column; gap: 16px; }
  .field { display: flex; flex-direction: column; gap: 5px; }
  .field-label { font-size: 0.78rem; font-weight: 600; color: #374151; }
  .input-wrapper { position: relative; display: flex; align-items: center; }
  .input-icon { position: absolute; left: 12px; color: #9ca3af; display: flex; pointer-events: none; }
  .input {
    width: 100%; padding: 10px 42px 10px 38px;
    border: 1.5px solid #d1d5db; border-radius: 8px;
    font-size: 0.9rem; color: #111827; background: #fff; outline: none;
    transition: border-color 0.15s, box-shadow 0.15s;
  }
  .input:focus { border-color: #1a56db; box-shadow: 0 0 0 3px rgba(26,86,219,0.12); }
  .input::placeholder { color: #9ca3af; }
  .input.input-error { border-color: #e11d48; }
  .input.input-error:focus { box-shadow: 0 0 0 3px rgba(225,29,72,0.12); }
  .toggle-pw {
    position: absolute; right: 12px; background: none; border: none;
    cursor: pointer; color: #9ca3af; display: flex; padding: 2px; border-radius: 4px;
    transition: color 0.15s;
  }
  .toggle-pw:hover { color: #374151; }
  .match-icon {
    position: absolute; right: 12px; display: flex; align-items: center;
    pointer-events: none;
  }
  /* strength bar */
  .strength-row { display: flex; align-items: center; gap: 5px; }
  .strength-bar {
    flex: 1; height: 3px; border-radius: 99px; background: #e5e7eb;
    transition: background 0.3s;
  }
  .strength-bar.weak   { background: #ef4444; }
  .strength-bar.fair   { background: #f59e0b; }
  .strength-bar.good   { background: #3b82f6; }
  .strength-bar.strong { background: #16a34a; }
  .strength-bar.empty  { background: #e5e7eb; }
  .strength-label { font-size: 0.72rem; font-weight: 600; color: #6b7280; min-width: 36px; }
  /* banners */
  .error-banner {
    display: flex; align-items: center; gap: 8px; padding: 11px 14px;
    background: #fff1f2; border: 1.5px solid #fecdd3; border-left: 4px solid #e11d48;
    border-radius: 8px; color: #be123c; font-size: 0.85rem; font-weight: 500;
    animation: fadeIn 0.2s ease;
  }
  .success-banner {
    display: flex; align-items: center; gap: 8px; padding: 11px 14px;
    background: #f0fdf4; border: 1.5px solid #bbf7d0; border-left: 4px solid #16a34a;
    border-radius: 8px; color: #15803d; font-size: 0.85rem; font-weight: 500;
    animation: fadeIn 0.2s ease;
  }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  .submit-btn {
    width: 100%; padding: 13px; background: #1a56db; color: #fff;
    font-size: 0.95rem; font-weight: 600; border: none; border-radius: 10px; cursor: pointer;
    margin-top: 4px; transition: background 0.15s, transform 0.1s, opacity 0.15s;
  }
  .submit-btn:hover:not(:disabled) { background: #1648c0; transform: translateY(-1px); }
  .submit-btn:active:not(:disabled) { transform: translateY(0); }
  .submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }
  .btn-inner { display: flex; align-items: center; justify-content: center; gap: 8px; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .spinner {
    width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.4);
    border-top-color: #fff; border-radius: 50%; animation: spin 0.7s linear infinite; display: inline-block;
  }
  .footer-text { text-align: center; font-size: 0.83rem; color: #6b7280; }
  .link-btn {
    background: none; border: none; color: #1a56db; font-size: inherit;
    font-weight: 600; cursor: pointer; padding: 0;
    text-decoration: underline; text-underline-offset: 2px;
  }
  .link-btn:hover { color: #1648c0; }
`;