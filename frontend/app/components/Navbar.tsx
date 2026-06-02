"use client";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../auth/AuthContext";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Dashboard", path: "/dashboard" },
    { label: "Metrics", path: "/metrics" },
  ];

  return (
    <>
      <style>{navStyles}</style>
      <nav className="navbar">
        <div className="navbar-inner">
          <div className="navbar-brand" onClick={() => router.push("/")}>
            <div className="brand-icon" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2"/>
                <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
                <line x1="12" y1="12" x2="12" y2="16"/>
                <line x1="10" y1="14" x2="14" y2="14"/>
              </svg>
            </div>
            <span className="brand-text">LoanAI</span>
          </div>

          <div className="nav-links">
            {navLinks.map(({ label, path }) => (
              <button
                key={path}
                onClick={() => router.push(path)}
                className={`nav-link ${pathname === path ? "active" : ""}`}
              >
                {label}
                {pathname === path && <span className="active-dot" aria-hidden="true" />}
              </button>
            ))}
          </div>

          <div className="nav-right">
            {!user ? (
              <>
                <button className="nav-btn ghost" onClick={() => router.push("/login")}>Sign In</button>
                <button className="nav-btn solid" onClick={() => router.push("/register")}>Get Started</button>
              </>
            ) : (
              <>
                <div className="user-chip">
                  <div className="user-avatar" aria-hidden="true">
                    {user.charAt(0).toUpperCase()}
                  </div>
                  <span className="user-name">{user}</span>
                </div>
                <button className="nav-btn logout" onClick={() => { logout(); router.push("/login"); }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                    aria-hidden="true">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                    <polyline points="16 17 21 12 16 7"/>
                    <line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}

const navStyles = `
  .navbar {
    position: sticky; top: 0; z-index: 100;
    background: rgba(255,255,255,0.92);
    backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
    border-bottom: 1px solid rgba(0,0,0,0.07);
    box-shadow: 0 1px 12px rgba(0,0,0,0.05);
    font-family: 'Segoe UI', system-ui, sans-serif;
  }
  .navbar-inner {
    max-width: 1100px; margin: 0 auto;
    display: flex; align-items: center; gap: 8px;
    padding: 0 24px; height: 60px;
  }
  .navbar-brand {
    display: flex; align-items: center; gap: 9px;
    cursor: pointer; text-decoration: none; margin-right: 8px;
  }
  .brand-icon {
    width: 34px; height: 34px; background: #1a56db;
    border-radius: 9px; display: flex; align-items: center; justify-content: center;
    color: #fff; flex-shrink: 0;
    box-shadow: 0 2px 8px rgba(26,86,219,0.35);
  }
  .brand-text {
    font-size: 1rem; font-weight: 800; color: #111827;
    letter-spacing: -0.03em;
  }
  .nav-links {
    display: flex; align-items: center; gap: 2px; flex: 1; margin-left: 8px;
  }
  .nav-link {
    position: relative; background: none; border: none;
    padding: 6px 14px; border-radius: 8px; cursor: pointer;
    font-size: 0.875rem; font-weight: 500; color: #6b7280;
    transition: color 0.15s, background 0.15s;
    display: flex; flex-direction: column; align-items: center; gap: 3px;
  }
  .nav-link:hover { color: #111827; background: #f3f4f6; }
  .nav-link.active { color: #1a56db; font-weight: 600; }
  .active-dot {
    width: 4px; height: 4px; background: #1a56db;
    border-radius: 50%; position: absolute; bottom: 2px;
  }
  .nav-right { display: flex; align-items: center; gap: 8px; margin-left: auto; }
  .nav-btn {
    display: flex; align-items: center; gap: 6px;
    padding: 7px 16px; border-radius: 8px;
    font-size: 0.845rem; font-weight: 600; cursor: pointer;
    transition: all 0.15s; border: 1.5px solid transparent;
  }
  .nav-btn.ghost {
    background: none; border-color: #e5e7eb; color: #374151;
  }
  .nav-btn.ghost:hover { background: #f3f4f6; border-color: #d1d5db; }
  .nav-btn.solid {
    background: #1a56db; color: #fff; border-color: #1a56db;
    box-shadow: 0 2px 8px rgba(26,86,219,0.25);
  }
  .nav-btn.solid:hover { background: #1648c0; transform: translateY(-1px); }
  .nav-btn.logout {
    background: none; border-color: #fecaca; color: #dc2626;
  }
  .nav-btn.logout:hover { background: #fff1f2; }
  .user-chip {
    display: flex; align-items: center; gap: 8px;
    padding: 5px 12px 5px 5px; background: #f3f4f6;
    border-radius: 99px; border: 1px solid #e5e7eb;
  }
  .user-avatar {
    width: 26px; height: 26px; background: #1a56db;
    border-radius: 50%; display: flex; align-items: center; justify-content: center;
    color: #fff; font-size: 0.75rem; font-weight: 700;
  }
  .user-name { font-size: 0.83rem; font-weight: 600; color: #374151; }
`;