"use client";

import { useState } from "react";

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

// ─── Constants ────────────────────────────────────────────────────────────────

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

interface FieldProps {
  label: string;
  children: React.ReactNode;
}

function Field({ label, children }: FieldProps) {
  return (
    <div className="field">
      <label className="field-label">{label}</label>
      {children}
    </div>
  );
}

interface SelectFieldProps<T extends string> {
  label: string;
  name: keyof FormState;
  value: T;
  options: { label: string; value: T }[];
  onChange: (name: keyof FormState, value: string) => void;
}

function SelectField<T extends string>({
  label,
  name,
  value,
  options,
  onChange,
}: SelectFieldProps<T>) {
  return (
    <Field label={label}>
      <select
        name={name}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        className="input"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </Field>
  );
}

interface NumberInputProps {
  label: string;
  name: keyof FormState;
  value: string;
  placeholder: string;
  onChange: (name: keyof FormState, value: string) => void;
}

function NumberInput({ label, name, value, placeholder, onChange }: NumberInputProps) {
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
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [result, setResult] = useState<string>("");
  const [status, setStatus] = useState<PredictionStatus>("idle");
  const [error, setError] = useState<string>("");

  const handleChange = (name: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePredict = async () => {
    setStatus("loading");
    setError("");
    setResult("");

    const token = localStorage.getItem("token");

    if (!token) {
      setStatus("error");
      setError("Not logged in. Please login first.");
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          ApplicantIncome: Number(form.ApplicantIncome),
          CoapplicantIncome: Number(form.CoapplicantIncome),
          LoanAmount: Number(form.LoanAmount),
          Loan_Amount_Term: Number(form.Loan_Amount_Term),
          Credit_History: Number(form.Credit_History),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Prediction failed");
      }

      setResult(data.prediction);
      setStatus("success");
    } catch (err: any) {
      setStatus("error");
      setError(err.message || "Server error");
    }
  };

  const isFormValid =
    form.ApplicantIncome !== "" &&
    form.LoanAmount !== "";

  return (
    <>
      <style>{styles}</style>

      <div className="page">
        <div className="card">
          <div className="card-header">
            <h1 className="title">Loan Eligibility</h1>
            <p className="subtitle">Fill in the details below to check approval chances.</p>
          </div>

          <div className="form-grid">

            {/* Personal Info */}
            <section className="section">
              <h2 className="section-title">Personal Information</h2>
              <div className="row">
                <SelectField
                  label="Gender"
                  name="Gender"
                  value={form.Gender}
                  onChange={handleChange}
                  options={[
                    { label: "Male", value: "Male" },
                    { label: "Female", value: "Female" },
                  ]}
                />

                <SelectField
                  label="Marital Status"
                  name="Married"
                  value={form.Married}
                  onChange={handleChange}
                  options={[
                    { label: "Married", value: "Yes" },
                    { label: "Single", value: "No" },
                  ]}
                />

                <SelectField
                  label="Dependents"
                  name="Dependents"
                  value={form.Dependents}
                  onChange={handleChange}
                  options={[
                    { label: "None", value: "0" },
                    { label: "1", value: "1" },
                    { label: "2", value: "2" },
                    { label: "3 or more", value: "3+" },
                  ]}
                />
              </div>

              <div className="row">
                <SelectField
                  label="Education"
                  name="Education"
                  value={form.Education}
                  onChange={handleChange}
                  options={[
                    { label: "Graduate", value: "Graduate" },
                    { label: "Not Graduate", value: "Not Graduate" },
                  ]}
                />

                <SelectField
                  label="Self Employed"
                  name="Self_Employed"
                  value={form.Self_Employed}
                  onChange={handleChange}
                  options={[
                    { label: "No", value: "No" },
                    { label: "Yes", value: "Yes" },
                  ]}
                />
              </div>
            </section>

            {/* Financial Info */}
            <section className="section">
              <h2 className="section-title">Financial Details</h2>

              <div className="row">
                <NumberInput
                  label="Applicant Income"
                  name="ApplicantIncome"
                  value={form.ApplicantIncome}
                  placeholder="e.g. 5000"
                  onChange={handleChange}
                />

                <NumberInput
                  label="Co-applicant Income"
                  name="CoapplicantIncome"
                  value={form.CoapplicantIncome}
                  placeholder="e.g. 0"
                  onChange={handleChange}
                />
              </div>

              <div className="row">
                <NumberInput
                  label="Loan Amount (in thousands)"
                  name="LoanAmount"
                  value={form.LoanAmount}
                  placeholder="e.g. 150"
                  onChange={handleChange}
                />

                <SelectField
                  label="Loan Term (months)"
                  name="Loan_Amount_Term"
                  value={form.Loan_Amount_Term as FormState["Loan_Amount_Term"]}
                  onChange={handleChange}
                  options={[
                    { label: "12 months", value: "12" },
                    { label: "36 months", value: "36" },
                    { label: "60 months", value: "60" },
                    { label: "84 months", value: "84" },
                    { label: "120 months", value: "120" },
                    { label: "180 months", value: "180" },
                    { label: "240 months", value: "240" },
                    { label: "300 months", value: "300" },
                    { label: "360 months", value: "360" },
                    { label: "480 months", value: "480" },
                  ]}
                />
              </div>
            </section>

            {/* Other Details */}
            <section className="section">
              <h2 className="section-title">Other Details</h2>

              <div className="row">
                <SelectField
                  label="Credit History"
                  name="Credit_History"
                  value={form.Credit_History}
                  onChange={handleChange}
                  options={[
                    { label: "Good (meets guidelines)", value: "1" },
                    { label: "Bad (does not meet)", value: "0" },
                  ]}
                />

                <SelectField
                  label="Property Area"
                  name="Property_Area"
                  value={form.Property_Area}
                  onChange={handleChange}
                  options={[
                    { label: "Urban", value: "Urban" },
                    { label: "Semiurban", value: "Semiurban" },
                    { label: "Rural", value: "Rural" },
                  ]}
                />
              </div>
            </section>

          </div>

          <div className="actions">
            <button
              onClick={handlePredict}
              disabled={!isFormValid || status === "loading"}
              className="predict-btn"
            >
              {status === "loading" ? "Predicting…" : "Check Eligibility"}
            </button>
          </div>

          {status === "success" && result && (
            <div className={`result ${result === "Approved" ? "approved" : "rejected"}`}>
              <span className="result-icon">
                {result === "Approved" ? "✓" : "✗"}
              </span>
              <div>
                <p className="result-label">Prediction Result</p>
                <p className="result-value">{result}</p>
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="result error">
              <span className="result-icon">!</span>
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

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .page {
    min-height: 100vh;
    background: #f4f6f9;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding: 40px 16px;
    font-family: 'Segoe UI', system-ui, sans-serif;
  }

  .card {
    background: #fff;
    border-radius: 16px;
    box-shadow: 0 4px 24px rgba(0,0,0,0.08);
    width: 100%;
    max-width: 760px;
    overflow: hidden;
  }

  .card-header {
    background: #1a56db;
    color: #fff;
    padding: 28px 32px;
  }

  .title { font-size: 1.6rem; font-weight: 700; }
  .subtitle { margin-top: 4px; font-size: 0.9rem; opacity: 0.85; }

  .form-grid { padding: 24px 32px; display: flex; flex-direction: column; gap: 28px; }

  .section-title {
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
    color: #6b7280;
    margin-bottom: 14px;
  }

  .row {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 14px;
  }

  .field { display: flex; flex-direction: column; gap: 5px; }
  .field-label { font-size: 0.8rem; font-weight: 600; }

  .input {
    padding: 9px 12px;
    border: 1.5px solid #d1d5db;
    border-radius: 8px;
  }

  .actions { padding: 0 32px 28px; }

  .predict-btn {
    width: 100%;
    padding: 13px;
    background: #1a56db;
    color: #fff;
    border: none;
    border-radius: 10px;
  }

  .result {
    margin: 0 32px 28px;
    padding: 16px;
    border-radius: 10px;
    border-left: 4px solid;
  }

  .result.approved { background: #f0fdf4; border-color: #16a34a; }
  .result.rejected { background: #fff1f2; border-color: #e11d48; }
  .result.error { background: #fff7ed; border-color: #f97316; }

  .result-icon { font-size: 1.4rem; font-weight: 800; }
  .result-label { font-size: 0.75rem; opacity: 0.7; }
  .result-value { font-weight: 700; }
`;