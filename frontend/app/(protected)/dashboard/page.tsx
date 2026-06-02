"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../auth/AuthContext";
import Navbar from "../../components/Navbar";

// ─── Types ────────────────────────────────────────────────────────────────────

type FormState = {
  Gender: "Male" | "Female";
  Married: "Yes" | "No";
  Dependents: "0" | "1" | "2" | "3+";
  Education: "Graduate" | "Not Graduate";
  Self_Employed: "Yes" | "No";
  ApplicantIncome: string;
  CoapplicantIncome: string;
  LoanAmount: string;
  Loan_Amount_Term: string;
  Credit_History: "1" | "0";
  Property_Area: "Urban" | "Semiurban" | "Rural";
};

type PredictionStatus = "idle" | "loading" | "success" | "error";

const INITIAL_FORM: FormState = {
  Gender: "Male",
  Married: "Yes",
  Dependents: "0",
  Education: "Graduate",
  Self_Employed: "No",
  ApplicantIncome: "",
  CoapplicantIncome: "0",
  LoanAmount: "",
  Loan_Amount_Term: "360",
  Credit_History: "1",
  Property_Area: "Urban",
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="field">
      <label className="field-label">{label}</label>
      {children}
    </div>
  );
}

function SelectField<T extends string>({
  label, name, value, options, onChange,
}: {
  label: string;
  name: keyof FormState;
  value: T;
  options: { label: string; value: T }[];
  onChange: (name: keyof FormState, value: string) => void;
}) {
  return (
    <Field label={label}>
      <select name={name} value={value} onChange={(e) => onChange(name, e.target.value)} className="input">
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </Field>
  );
}

function NumberInput({
  label, name, value, placeholder, onChange,
}: {
  label: string;
  name: keyof FormState;
  value: string;
  placeholder: string;
  onChange: (name: keyof FormState, value: string) => void;
}) {
  return (
    <Field label={label}>
      <input
        type="number"
        name={name}
        value={value}
        placeholder={placeholder}
        min={0}
        onChange={(e) => onChange(name, e.target.value)}
        className="input"
      />
    </Field>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { token } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [result, setResult] = useState<string>("");
  const [status, setStatus] = useState<PredictionStatus>("idle");
  const [error, setError] = useState<string>("");

  // If no token, redirect immediately — no flicker because cookie is
  // already read server-side and token is set on first render
  useEffect(() => {
    if (!token) router.replace("/login");
  }, [token, router]);

  if (!token) return null;

  const handleChange = (name: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePredict = async () => {
    setStatus("loading");
    setError("");
    setResult("");

    try {
      const res = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          Dependents: form.Dependents === "3+" ? 3 : Number(form.Dependents),
          ApplicantIncome: Number(form.ApplicantIncome),
          CoapplicantIncome: Number(form.CoapplicantIncome),
          LoanAmount: Number(form.LoanAmount),
          Loan_Amount_Term: Number(form.Loan_Amount_Term),
          Credit_History: Number(form.Credit_History),
        }),
      });

      if (res.status === 401) { router.replace("/login"); return; }
      if (!res.ok) throw new Error(`Server responded with ${res.status}: ${res.statusText}`);

      const data = await res.json();
      setResult(data.prediction ?? data.loan_approval_prediction ?? "Unknown");
      setStatus("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
      setStatus("error");
    }
  };

  const isFormValid = form.ApplicantIncome !== "" && form.LoanAmount !== "";

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
                <rect x="2" y="7" width="20" height="14" rx="2"/>
                <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
                <line x1="12" y1="12" x2="12" y2="16"/>
                <line x1="10" y1="14" x2="14" y2="14"/>
              </svg>
            </div>
            <div>
              <h1 className="title">Loan Eligibility Check</h1>
              <p className="subtitle">Fill in the details below to check approval chances.</p>
            </div>
          </div>

          <div className="form-grid">

            <section className="section">
              <h2 className="section-title">Personal Information</h2>
              <div className="row">
                <SelectField label="Gender" name="Gender" value={form.Gender} onChange={handleChange}
                  options={[{ label: "Male", value: "Male" }, { label: "Female", value: "Female" }]} />
                <SelectField label="Marital Status" name="Married" value={form.Married} onChange={handleChange}
                  options={[{ label: "Married", value: "Yes" }, { label: "Single", value: "No" }]} />
                <SelectField label="Dependents" name="Dependents" value={form.Dependents} onChange={handleChange}
                  options={[
                    { label: "None", value: "0" }, { label: "1", value: "1" },
                    { label: "2", value: "2" }, { label: "3 or more", value: "3+" },
                  ]} />
              </div>
              <div className="row" style={{ marginTop: 14 }}>
                <SelectField label="Education" name="Education" value={form.Education} onChange={handleChange}
                  options={[{ label: "Graduate", value: "Graduate" }, { label: "Not Graduate", value: "Not Graduate" }]} />
                <SelectField label="Self Employed" name="Self_Employed" value={form.Self_Employed} onChange={handleChange}
                  options={[{ label: "No", value: "No" }, { label: "Yes", value: "Yes" }]} />
              </div>
            </section>

            <section className="section">
              <h2 className="section-title">Financial Details</h2>
              <div className="row">
                <NumberInput label="Applicant Income (₨ / month)" name="ApplicantIncome"
                  value={form.ApplicantIncome} placeholder="e.g. 50000" onChange={handleChange} />
                <NumberInput label="Co-applicant Income" name="CoapplicantIncome"
                  value={form.CoapplicantIncome} placeholder="e.g. 0" onChange={handleChange} />
              </div>
              <div className="row" style={{ marginTop: 14 }}>
                <NumberInput label="Loan Amount (thousands)" name="LoanAmount"
                  value={form.LoanAmount} placeholder="e.g. 150" onChange={handleChange} />
                <SelectField label="Loan Term (months)" name="Loan_Amount_Term"
                  value={form.Loan_Amount_Term as FormState["Loan_Amount_Term"]} onChange={handleChange}
                  options={[
                    { label: "12 months", value: "12" }, { label: "36 months", value: "36" },
                    { label: "60 months", value: "60" }, { label: "84 months", value: "84" },
                    { label: "120 months", value: "120" }, { label: "180 months", value: "180" },
                    { label: "240 months", value: "240" }, { label: "300 months", value: "300" },
                    { label: "360 months", value: "360" }, { label: "480 months", value: "480" },
                  ]} />
              </div>
            </section>

            <section className="section">
              <h2 className="section-title">Other Details</h2>
              <div className="row">
                <SelectField label="Credit History" name="Credit_History" value={form.Credit_History} onChange={handleChange}
                  options={[
                    { label: "Good (meets guidelines)", value: "1" },
                    { label: "Bad (does not meet)", value: "0" },
                  ]} />
                <SelectField label="Property Area" name="Property_Area" value={form.Property_Area} onChange={handleChange}
                  options={[
                    { label: "Urban", value: "Urban" },
                    { label: "Semiurban", value: "Semiurban" },
                    { label: "Rural", value: "Rural" },
                  ]} />
              </div>
            </section>

          </div>

          <div className="actions">
            <button onClick={handlePredict} disabled={!isFormValid || status === "loading"} className="predict-btn">
              {status === "loading" ? (
                <span className="btn-inner"><span className="spinner" aria-hidden="true" /> Predicting…</span>
              ) : "Check Eligibility"}
            </button>
          </div>

          {status === "success" && result && (
            <div className={`result ${result === "Approved" ? "approved" : "rejected"}`}>
              <span className="result-icon" aria-hidden="true">{result === "Approved" ? "✓" : "✗"}</span>
              <div>
                <p className="result-label">Prediction Result</p>
                <p className="result-value">{result}</p>
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="result error">
              <span className="result-icon" aria-hidden="true">!</span>
              <div>
                <p className="result-label">Error</p>
                <p className="result-value">{error}</p>
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
    box-shadow: 0 4px 24px rgba(0,0,0,0.08); width: 100%; max-width: 780px; overflow: hidden;
  }
  .card-header {
    background: #1a56db; color: #fff; padding: 28px 32px;
    display: flex; align-items: center; gap: 16px;
  }
  .header-icon {
    width: 48px; height: 48px; background: rgba(255,255,255,0.15);
    border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .title   { font-size: 1.5rem; font-weight: 700; letter-spacing: -0.02em; }
  .subtitle { margin-top: 3px; font-size: 0.875rem; opacity: 0.82; }
  .form-grid { padding: 28px 32px; display: flex; flex-direction: column; gap: 28px; }
  .section-title {
    font-size: 0.68rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
    color: #6b7280; margin-bottom: 14px; padding-bottom: 8px; border-bottom: 1.5px solid #e5e7eb;
  }
  .row { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 14px; }
  .field { display: flex; flex-direction: column; gap: 5px; }
  .field-label { font-size: 0.78rem; font-weight: 600; color: #374151; }
  .input {
    padding: 9px 12px; border: 1.5px solid #d1d5db; border-radius: 8px;
    font-size: 0.9rem; color: #111827; background: #fff;
    transition: border-color 0.15s, box-shadow 0.15s; outline: none; width: 100%; appearance: auto;
  }
  .input:focus { border-color: #1a56db; box-shadow: 0 0 0 3px rgba(26,86,219,0.12); }
  input[type="number"].input { -moz-appearance: textfield; }
  input[type="number"].input::-webkit-inner-spin-button { opacity: 0.4; }
  .actions { padding: 0 32px 28px; }
  .predict-btn {
    width: 100%; padding: 13px; background: #1a56db; color: #fff;
    font-size: 0.95rem; font-weight: 600; border: none; border-radius: 10px; cursor: pointer;
    transition: background 0.15s, opacity 0.15s, transform 0.1s;
  }
  .predict-btn:hover:not(:disabled) { background: #1648c0; transform: translateY(-1px); }
  .predict-btn:active:not(:disabled) { transform: translateY(0); }
  .predict-btn:disabled { opacity: 0.5; cursor: not-allowed; }
  .btn-inner { display: flex; align-items: center; justify-content: center; gap: 8px; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .spinner {
    width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.4);
    border-top-color: #fff; border-radius: 50%; animation: spin 0.7s linear infinite; display: inline-block;
  }
  .result {
    margin: 0 32px 28px; display: flex; align-items: center; gap: 14px;
    padding: 16px 20px; border-radius: 10px; border-left: 4px solid; animation: fadeIn 0.25s ease;
  }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
  .result.approved { background: #f0fdf4; border-color: #16a34a; color: #15803d; }
  .result.rejected { background: #fff1f2; border-color: #e11d48; color: #be123c; }
  .result.error    { background: #fff7ed; border-color: #f97316; color: #c2410c; }
  .result-icon  { font-size: 1.4rem; font-weight: 800; width: 32px; text-align: center; flex-shrink: 0; }
  .result-label { font-size: 0.72rem; font-weight: 600; opacity: 0.7; text-transform: uppercase; letter-spacing: 0.06em; }
  .result-value { font-size: 1rem; font-weight: 700; margin-top: 2px; }
`;