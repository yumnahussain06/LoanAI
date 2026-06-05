# LoanAI 

A full-stack machine learning web application that predicts whether a bank should **Approve or Reject** a loan application. Users register, log in, fill an 11-field form, and receive an instant prediction from a trained ML model. All predictions, user activity, and model metrics are persisted in MongoDB.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Dataset](#dataset)
- [Prerequisites](#prerequisites)
- [Installation & Running](#installation--running)
- [Environment & Configuration](#environment--configuration)
- [ML Pipeline](#ml-pipeline)
- [API Reference](#api-reference)
- [Authentication Flow](#authentication-flow)
- [Frontend Pages](#frontend-pages)
- [Database Collections](#database-collections)
- [Known Issues & Notes](#known-issues--notes)

---

## Overview

This project implements a complete AI lifecycle — from raw data to a live web interface:

1. A Kaggle loan dataset (614 rows, 13 columns) was cleaned, preprocessed, and used to train three classifiers
2. The best model (Logistic Regression) was saved as a `.pkl` file
3. A FastAPI backend loads the model at startup and serves predictions via a secure REST API
4. A Next.js frontend provides authenticated users with a loan form and an interactive metrics dashboard

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend framework | Next.js 16 (App Router, Turbopack) |
| Frontend language | TypeScript + React 18 |
| Data visualisation | Recharts (BarChart) |
| Backend framework | FastAPI (Python) |
| ML model | Logistic Regression via scikit-learn |
| Model serialisation | joblib (`.pkl`) |
| Data processing | pandas, NumPy |
| Database | MongoDB (local, port 27017) |
| Auth standard | OAuth2 Password Flow |
| Token format | JWT — HS256 signed (`python-jose`) |
| Password hashing | bcrypt |
| Frontend routing guard | Next.js `proxy.ts` (edge layer) |

---

## Project Structure

```
loan-ai-system/                  ← GitHub repo root
│
├── main.py                      ← FastAPI app — all routes
├── auth.py                      ← JWT create & verify
├── security.py                  ← bcrypt hash & verify
├── mongodb.py                   ← MongoClient + collection refs
├── requirements.txt             ← Python dependencies
│
├── Ml/
│   ├── LoanApproval.ipynb       ← Full ML pipeline (training notebook)
│   ├── data_file.csv            ← Kaggle loan dataset (614 rows)
│   ├── best_loan_risk_model.pkl ← Trained Logistic Regression model
│   ├── preprocessor_pipeline.pkl← Fitted ColumnTransformer (encoding + scaling)
│   └── model_metrics.json       ← accuracy, precision, recall, f1_score
│
└── frontend/
    ├── proxy.ts                 ← Edge route protection (replaces middleware)
    ├── package.json
    ├── tsconfig.json
    ├── next.config.ts
    │
    └── app/
        ├── layout.tsx           ← Root server layout — reads cookie, seeds AuthProvider
        ├── page.tsx             ← Landing page
        │
        ├── auth/
        │   └── AuthContext.tsx  ← Cookie-based global auth state
        │
        ├── login/
        │   └── page.tsx
        │
        ├── register/
        │   └── page.tsx
        │
        ├── components/
        │   └── Navbar.tsx
        │
        └── (protected)/        ← Route group — dashboard + metrics
            ├── dashboard/
            │   └── page.tsx    ← Loan prediction form (CSR)
            └── metrics/
                ├── page.tsx    ← Model performance charts (CSR)
                └── MetricsChart.tsx
```

---

## Dataset

**Source:** [Loan Approval Prediction Dataset — Kaggle](https://www.kaggle.com/datasets/altruistdelhite04/loan-prediction-problem-dataset)

| Property | Value |
|---|---|
| Rows | 614 |
| Columns | 13 (12 features + 1 target) |
| Target column | `Loan_Status` (Y = Approved, N = Rejected) |
| Missing values | Yes — in Gender (13), Dependents (15), Self_Employed (32), LoanAmount (22), Loan_Amount_Term (14), Credit_History (50) |

**Features used for prediction:**

| Column | Type | Values |
|---|---|---|
| Gender | Categorical | Male, Female |
| Married | Categorical | Yes, No |
| Dependents | Categorical | 0, 1, 2, 3+ |
| Education | Categorical | Graduate, Not Graduate |
| Self_Employed | Categorical | Yes, No |
| ApplicantIncome | Numerical | Integer ≥ 0 |
| CoapplicantIncome | Numerical | Integer ≥ 0 |
| LoanAmount | Numerical | Integer ≥ 1 (thousands) |
| Loan_Amount_Term | Numerical | Integer ≥ 1 (months) |
| Credit_History | Binary | 1 (good), 0 (bad) |
| Property_Area | Categorical | Urban, Semiurban, Rural |

---

## Prerequisites

- Python 3.10+
- Node.js 18+
- MongoDB Community Server running locally on port `27017`

---

## Installation & Running

Follow this exact order every time you run the project:

### Step 1 — Start MongoDB

```bash
# Windows
net start MongoDB

# macOS (Homebrew)
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

### Step 2 — Backend (FastAPI)

```bash
# Clone the repo and go to root
git clone <your-repo-url>
cd loan-ai-system

# Create and activate virtual environment
python -m venv .venv

# Windows
.venv\Scripts\activate

# macOS / Linux
source .venv/bin/activate

# Install all Python dependencies
pip install -r requirements.txt

# Start the API server
uvicorn main:app --reload
```

Backend runs at: `http://127.0.0.1:8000`
Interactive API docs: `http://127.0.0.1:8000/docs`

### Step 3 — Frontend (Next.js)

```bash
# Open a new terminal
cd frontend

# Install Node dependencies
npm install

# Start the dev server
npm run dev
```

Frontend runs at: `http://localhost:3000`

---

## Environment & Configuration

No `.env` file required for local development. All values are hardcoded:

| Setting | Value | File |
|---|---|---|
| JWT Secret Key | `loan_project_secret_key` | `auth.py` |
| JWT Algorithm | `HS256` | `auth.py` |
| Token expiry | 30 minutes | `auth.py` |
| MongoDB URI | `mongodb://localhost:27017` | `mongodb.py` |
| MongoDB database | `loan_approval_project` | `mongodb.py` |
| Backend URL (in frontend) | `http://127.0.0.1:8000` | fetch calls in pages |
| Allowed CORS origins | `localhost:3000`, `127.0.0.1:3000` | `main.py` |

> ⚠️ Before any deployment: move the JWT secret and MongoDB URI to environment variables and rotate the secret key.

---

## ML Pipeline

The full pipeline is documented and reproducible in `Ml/LoanApproval.ipynb`.

### Stage 1 — Data Gathering

Downloaded from Kaggle. Loaded with pandas:
```python
df = pd.read_csv("data_file.csv")
# Shape: (614, 13)
```

### Stage 2 — Data Cleaning

```python
df.drop(columns=["Loan_ID"], inplace=True)  # irrelevant ID column removed
# Missing values handled by SimpleImputer inside the preprocessing pipeline
# Categorical: most_frequent strategy
# Numerical: mean strategy
```

### Stage 3 — Feature Engineering

A `ColumnTransformer` was built with two sub-pipelines:

**Categorical columns** (`Gender`, `Married`, `Dependents`, `Education`, `Self_Employed`, `Property_Area`):
```
SimpleImputer(strategy="most_frequent") → OneHotEncoder(handle_unknown="ignore")
```

**Numerical columns** (`ApplicantIncome`, `CoapplicantIncome`, `LoanAmount`, `Loan_Amount_Term`, `Credit_History`):
```
SimpleImputer(strategy="mean") → StandardScaler()
```

The fitted `ColumnTransformer` was saved as `preprocessor_pipeline.pkl` so the exact same transformations are applied at prediction time.

### Stage 4 — Model Training & Selection

Three classifiers were trained and compared:

| Model | Notes |
|---|---|
| Logistic Regression | Linear decision boundary, fast, interpretable |
| Random Forest | Ensemble of decision trees, handles non-linearity |
| XGBoost | Gradient boosted trees, generally high performance |

Each model was wrapped in a `Pipeline` with the preprocessor:
```python
Pipeline(steps=[
    ("preprocessor", preprocessor),
    ("classifier", model)
])
```

All three were evaluated on a held-out test set. **Logistic Regression was selected as the best model** and saved:
```python
joblib.dump(best_model, "best_loan_risk_model.pkl")
```

### Stage 5 — Model Evaluation

Metrics computed on the test set and saved to `model_metrics.json`:
```json
{
    "model_name": "Logistic Regression",
    "accuracy": 0.xx,
    "precision": 0.xx,
    "recall": 0.xx,
    "f1_score": 0.xx
}
```

This file is read by FastAPI on startup and inserted into MongoDB once. The `/metrics` endpoint returns it to the frontend where it is displayed as stat cards, a bar chart, a radar chart, and an interpretation table.

### How Prediction Works at Runtime

```
User submits form (11 fields as JSON)
        ↓
FastAPI validates with Pydantic LoanInput model
        ↓
pd.DataFrame([data.model_dump()])  ← one-row DataFrame
        ↓
model.predict(input_df)
  ↳ preprocessor_pipeline transforms the row
      (same imputation + encoding + scaling as training)
  ↳ Logistic Regression outputs 0 or 1
        ↓
1 or 'Y' → "Approved"
0 or 'N' → "Rejected"
        ↓
Result saved to MongoDB + returned to frontend
```

---

## API Reference

### Public Endpoints

| Method | Route | Description |
|---|---|---|
| `GET` | `/` | Health check |
| `POST` | `/register` | Register a new user |
| `POST` | `/token` | Login — returns JWT |

### Protected Endpoints (require `Authorization: Bearer <token>`)

| Method | Route | Description |
|---|---|---|
| `POST` | `/predict` | Submit loan application, get Approved/Rejected |
| `GET` | `/metrics` | Get model evaluation metrics |

---

### `POST /register`

```json
// Request body
{ "username": "ahmed", "password": "mypassword" }

// Response
{ "message": "User registered successfully" }
```

---

### `POST /token`

```
// Request — application/x-www-form-urlencoded (OAuth2 requirement)
username=ahmed&password=mypassword

// Response
{ "access_token": "<jwt>", "token_type": "bearer" }
```

---

### `POST /predict`

```json
// Request body
{
  "Gender": "Male",
  "Married": "Yes",
  "Dependents": 0,
  "Education": "Graduate",
  "Self_Employed": "No",
  "ApplicantIncome": 5000,
  "CoapplicantIncome": 0,
  "LoanAmount": 150,
  "Loan_Amount_Term": 360,
  "Credit_History": 1,
  "Property_Area": "Urban"
}

// Response
{ "loan_status_code": "1", "prediction": "Approved" }
```

---

### `GET /metrics`

```json
// Response
{
  "model_name": "Logistic Regression",
  "accuracy": 0.82,
  "precision": 0.79,
  "recall": 0.88,
  "f1_score": 0.83
}
```

---

## Authentication Flow

```
REGISTER
  User POSTs username + password
  → bcrypt.gensalt() generates random salt
  → bcrypt.hashpw(password, salt) produces hash
  → { username, hashed_password } stored in MongoDB
  → Raw password is never stored

LOGIN
  User POSTs username + password
  → MongoDB lookup by username
  → bcrypt.checkpw(submitted, stored_hash)
  → If match: jwt.encode({sub: username, exp: now+30min}, SECRET_KEY)
  → Token returned to frontend
  → Frontend stores token in browser cookie (7-day max-age)

PAGE LOAD (e.g. /dashboard)
  → proxy.ts reads cookie on the server edge
  → No cookie: redirect to /login before page loads
  → Has cookie: allow through
  → layout.tsx reads cookie server-side via Next.js cookies()
  → Passes token as initialToken to AuthProvider
  → useState initialised with correct value on render #1
  → No flicker

PREDICTION REQUEST
  Frontend sends POST /predict
  Header: Authorization: Bearer <token>
  → FastAPI Depends(get_current_user) fires
  → jwt.decode() verifies signature + checks expiry
  → Valid: prediction runs
  → Invalid / expired: HTTP 401 → frontend redirects to /login
```

---

## Frontend Pages

| Route | Description | Rendering | Auth Required |
|---|---|---|---|
| `/` | Landing page | CSR | No |
| `/login` | Sign in form | CSR | No |
| `/register` | Create account | CSR | No |
| `/dashboard` | 11-field loan prediction form | CSR | Yes |
| `/metrics` | Stat cards + bar chart + radar chart + interpretation table | CSR | Yes |

> **Rendering note:** `app/layout.tsx` is the only Server Component — it reads the auth cookie server-side before any HTML is sent to the browser. All pages are Client Components (`"use client"`) because they use React state, browser events, and fetch calls.

---

## Database Collections

| Collection | Documents stored |
|---|---|
| `users` | `username`, `hashed_password`, `last_login` |
| `predictions` | `username`, `input_data` (all 11 fields), `prediction`, `timestamp` |
| `metrics` | `model_name`, `accuracy`, `precision`, `recall`, `f1_score` — inserted once at startup |
| `user_activity` | `username`, `action` (`"login"`), `timestamp` |

---

## Known Issues & Notes

- The JWT secret key is hardcoded in `auth.py` — move to an environment variable before any deployment
- `verify_token()` contains `print()` debug statements — remove before deploying
- MongoDB expects no authentication — configure credentials for any shared environment
- CORS is locked to `localhost:3000` — update `allow_origins` in `main.py` when deploying to a real domain
- Token expiry is 30 minutes — after expiry the backend returns `401` and the frontend automatically redirects to `/login`
- The `(protected)` folder in the frontend is a Next.js **route group** — the parentheses mean it does not appear in the URL path. `/dashboard` and `/metrics` are the actual routes, not `/(protected)/dashboard`
