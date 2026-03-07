# 🛠️ Smart Cafeteria — Developer Documentation

**Project:** Smart Cafeteria Demand Forecasting & Token-Based Queue Optimization  
**Stack:** FastAPI (Backend) · Flutter (Mobile App) · React + TypeScript (Admin Panel)  
**Cloud:** Microsoft Azure (App Service, PostgreSQL Flexible Server, Blob Storage, Application Insights)

---

## 🗂️ Repository Structure

The project is organized as three separate sub-projects under `smart cafe prod/`:

```
smart cafe prod/
├── smart-cafeteria-backend/       # Python FastAPI Backend
├── smart-cafeteria-frontend/      # Flutter Mobile App (Student)
└── smart-cafeteria-admin/         # React + TypeScript Admin Panel (Staff/Admin)
```

---

## ⚙️ Backend — `smart-cafeteria-backend/`

**Language:** Python 3.11+  
**Framework:** FastAPI (async)  
**Database:** PostgreSQL (via SQLAlchemy async ORM)  
**Auth:** JWT Bearer Tokens (python-jose + passlib/bcrypt)  
**ML:** Scikit-learn, XGBoost (served via in-process joblib models)

### Directory Structure

```
smart-cafeteria-backend/
├── app/
│   ├── main.py                  # FastAPI app entry point, router registration, CORS config
│   ├── config.py                # Environment variables (DB URL, JWT secret, Azure blob)
│   ├── database.py              # SQLAlchemy async engine + session factory
│   │
│   ├── models/
│   │   └── models.py            # SQLAlchemy ORM models (Student, Order, Token, Slot, etc.)
│   │
│   ├── schemas/
│   │   ├── auth.py              # Pydantic schemas for Auth endpoints
│   │   └── schemas.py           # Pydantic schemas for Menu, Orders, Tokens, Queue
│   │
│   ├── routers/
│   │   ├── auth.py              # /auth — Login, Register, OTP, QR login, Profile
│   │   ├── menu.py              # /menu — CRUD for menu items with meal-type filtering
│   │   ├── orders.py            # /orders — Create, Pay, Cancel, Walk-in orders
│   │   ├── slots.py             # /slots — Time slot CRUD and availability
│   │   ├── tokens.py            # /tokens — Token lookup, arrive, arrive-by-number
│   │   ├── queue.py             # /queue — Pending, arrived, served queues + serve action
│   │   ├── analytics.py         # /analytics — ML predictions, trends, peak hours
│   │   └── websockets.py        # /ws — WebSocket endpoint
│   │
│   ├── crud/
│   │   ├── menu.py              # DB query functions for menu
│   │   ├── orders.py            # DB query functions for orders (create, pay, cancel)
│   │   ├── slots.py             # DB query functions for slots + availability calc
│   │   ├── queue.py             # DB query functions for queue management
│   │   └── tokens.py            # DB query functions for tokens
│   │
│   ├── dependencies/
│   │   └── auth.py              # get_current_student / get_current_admin FastAPI deps
│   │
│   ├── utils/
│   │   ├── security.py          # JWT creation/decoding, password hashing (bcrypt)
│   │   ├── email.py             # OTP email sending (SMTP / SendGrid)
│   │   └── blob_storage.py      # Azure Blob Storage upload (profile images)
│   │
│   ├── ml/
│   │   ├── train.py             # ML model training script (XGBoost demand forecaster)
│   │   ├── weather.py           # Weather API integration (OpenWeatherMap)
│   │   └── models/              # Serialized .pkl model files
│   │
│   ├── services/
│   │   └── prediction_service.py # Business logic layer for ML predictions
│   │
│   └── websockets/
│       └── manager.py           # WebSocket connection manager (broadcast by channel)
│
├── datasets/                    # Historical order data CSVs for ML training
├── tests/                       # Pytest integration tests
├── requirements.txt             # Python dependencies
├── Procfile                     # Azure App Service startup command
└── .env                         # Environment variables (not committed)
```

### Key Data Models (`app/models/models.py`)

| Model | Key Fields | Description |
|---|---|---|
| `Student` | `id`, `email`, `name`, `register_no`, `hashed_password`, `is_active`, `role`, `profile_image`, `phone`, `course`, `batch` | Student user account |
| `MenuItem` | `id`, `name`, `price`, `category`, `meal_types[]`, `is_available`, `quantity` | Menu item |
| `Slot` | `id`, `start_time`, `end_time`, `capacity`, `date` | Time slot |
| `Order` | `id`, `student_id`, `slot_id`, `total_amount`, `status`, `order_type`, `payment_id` | Order record |
| `OrderItem` | `id`, `order_id`, `menu_item_id`, `quantity`, `price_at_order`, `is_served` | Line item in an order |
| `Token` | `id`, `token_number`, `order_id`, `status`, `arrival_time`, `served_time`, `dining_duration` | Queue token |
| `ActiveQueue` | `id`, `token_id`, `arrival_time` | Currently active tokens at counter |
| `OTP` | `id`, `email`, `otp_code`, `expires_at`, `is_used` | OTP for email verification |
| `ContactQuery` | `id`, `name`, `email`, `phone`, `query_text` | Support queries |

### Enums

```python
class OrderStatus(str, Enum):    PENDING, PAID, CANCELLED, SERVED
class TokenStatus(str, Enum):    PENDING, ARRIVED, SERVED, EXPIRED
class OrderType(str, Enum):      PRE_ORDER, WALK_IN
class MenuCategory(str, Enum):   SNACKS, MAIN_COURSE, BEVERAGES, DESSERTS
class MealType(str, Enum):       BREAKFAST, LUNCH, DINNER, ALL_DAY
```

### ML Module (`app/ml/`)

| File | Purpose |
|---|---|
| `train.py` | Trains an XGBoost regressor on historical order data. Features include: day-of-week, weather (temperature, condition), slot time, and past sales. Model is saved as a `.pkl` file. |
| `weather.py` | Fetches real-time weather data from OpenWeatherMap API for the cafeteria location to pass as a feature to the ML model. |
| `models/` | Stores serialized `demand_model.pkl` and any scaler files used during inference. |

The ML model predicts **expected demand per slot** to help admins pre-prepare inventory and staffing.

### WebSockets (`app/websockets/manager.py`)

A simple pub-sub manager that maintains WebSocket connections by channel. Currently has:
- **`queue` channel** — broadcasts token and queue events to admin panel
- **`menu` channel** — broadcasts stock changes

Events emitted:
- `queue_update` — New order added
- `token_arrived` — Student scanned QR
- `token_served` — Order fully served
- `menu_update` — Menu stock changed

### Running the Backend Locally

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set environment variables
cp .env.example .env          # Fill in DB URL, JWT secret, etc.

# Run the server
uvicorn app.main:app --reload

# API docs available at:
# http://localhost:8000/docs
```

### Running Tests

```bash
pytest tests/ -v
```

---

## 📱 Flutter Mobile App — `smart-cafeteria-frontend/`

**Language:** Dart  
**Framework:** Flutter 3.x  
**State Management:** `setState` + `SharedPreferences` for session storage  
**HTTP Client:** `http` package  
**Platform:** Android & iOS

### Directory Structure

```
smart-cafeteria-frontend/
└── lib/
    ├── main.dart                     # App entry point, MaterialApp, route definitions
    │
    ├── screens/
    │   ├── splash_screen.dart        # App logo + auto-redirect (login or home)
    │   ├── login_screen.dart         # Email/password login + QR login option
    │   ├── register_screen.dart      # Multi-step registration (email → OTP → details)
    │   ├── reset_password_screen.dart # Forgot password via OTP
    │   ├── slot_selection_screen.dart # Pick time slot for ordering
    │   ├── menu_screen.dart          # Browse menu, add to cart, filtered by slot time
    │   ├── cart_screen.dart          # Review cart, place order, initiate payment
    │   ├── token_screen.dart         # Show token + QR, queue position, wait time
    │   ├── home_screen.dart          # Post-login home with shortcuts and profile
    │   ├── profile_screen.dart       # View user profile and settings
    │   ├── edit_profile_screen.dart  # Edit name, phone, course, batch, photo
    │   ├── history_screen.dart       # Past orders with status
    │   ├── qr_scan_screen.dart       # QR code scan screen (ID card login)
    │   ├── contact_screen.dart       # Contact/support query form
    │   ├── terms_screen.dart         # Terms & Conditions page
    │   └── admin_queries_screen.dart # View submitted queries (admin feature in app)
    │
    ├── services/
    │   ├── api_service.dart          # HTTP client: all API call functions
    │   ├── auth_service.dart         # Token storage, login/logout session management
    │   └── order_service.dart        # Order creation + payment flow coordination
    │
    └── utils/
        └── constants.dart            # Base URL, shared constants
```

### Architecture

```
Flutter UI Layer (Screens / Widgets)
          ↕
   Services Layer (api_service.dart, auth_service.dart)
          ↕
   Backend REST API (FastAPI)
          ↕
   Database (PostgreSQL on Azure)
```

- Screens call **service methods**; they never call `http` directly.
- `SharedPreferences` stores the JWT access token and basic user info locally.
- Screen navigation uses `Navigator.push` and `Navigator.pushReplacement`.
- All API base URL is configured in `utils/constants.dart`.

### Running the App

```bash
# Install dependencies
flutter pub get

# Run on connected device / emulator
flutter run

# Build APK
flutter build apk --release
```

---

## 🖥️ Admin Web Panel — `smart-cafeteria-admin/`

**Language:** TypeScript  
**Framework:** React 18 + Vite  
**Styling:** Vanilla CSS (custom dark theme)  
**HTTP Client:** Axios (via `src/api.ts`)  
**WebSocket:** Native `WebSocket` API  
**Deployment:** Firebase Hosting / Azure Static Web Apps

### Directory Structure

```
smart-cafeteria-admin/
└── src/
    ├── main.tsx                      # React entry point
    ├── App.tsx                       # Router + auth guard
    ├── api.ts                        # Axios instance + all API functions
    ├── index.css                     # Global dark theme styles
    │
    ├── components/
    │   ├── Login.tsx                 # Admin / staff login form
    │   ├── Sidebar.tsx               # Navigation sidebar (role-aware)
    │   ├── AnalyticsDashboard.tsx    # Charts: demand forecast, top items, peak hours
    │   ├── MenuManager.tsx           # Menu CRUD with form + table
    │   ├── SlotManager.tsx           # Slot CRUD with date selector
    │   ├── QueueMonitor.tsx          # Real-time queue status with WebSocket
    │   ├── PendingQueue.tsx          # Pending tokens (waiting to arrive)
    │   ├── KitchenView.tsx           # Kitchen-level token assignment
    │   ├── KitchenSummary.tsx        # Summary of kitchen prep counts
    │   ├── StationQueue.tsx          # Per-station order view (category filter)
    │   ├── QRScanner.tsx             # Camera-based QR scanner for token arrival
    │   ├── WalkInOrder.tsx           # Walk-in order creation form
    │   ├── ServedHistory.tsx         # Last 50 served tokens
    │   └── TokenDetailModal.tsx      # Modal popup for full token order details
    │
    └── utils/
        ├── auth.ts                   # JWT decode, role check helpers
        ├── time.ts                   # Time formatting utilities
        ├── format.ts                 # Currency + string formatters
        └── websocket.ts              # WebSocket connection factory
```

### Architecture

```
React Component (UI)
        ↕
   api.ts (Axios) ←→ REST API (FastAPI Backend)
        ↕
   WebSocket (wsUrl) ←→ WS Server (/ws/queue, /ws/menu)
```

- `App.tsx` checks for a valid JWT on load and routes accordingly.
- Components call functions from `api.ts` (which wraps Axios with the `Authorization` header).
- WebSocket events are received in `QueueMonitor`/`StationQueue` and trigger state re-renders.
- Role-based UI: `admin` sees analytics, menu, slots, queries; `staff` sees kitchen/queue/QR only.

### Running the Admin Panel Locally

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open at http://localhost:5173
```

### Building for Production

```bash
npm run build
# Output in dist/
```

---

## ☁️ Cloud Architecture (Microsoft Azure)

| Service | Usage |
|---|---|
| **Azure App Service** | Hosts the FastAPI backend (Python 3.11, Linux, B1 tier) |
| **Azure Database for PostgreSQL Flexible Server** | Primary relational database |
| **Azure Blob Storage** | Stores student profile images and ML model artifacts |
| **Azure Application Insights** | Backend monitoring, request tracing, error logging |
| **Firebase Hosting** | Hosts the React Admin Panel (CDN-backed) |
| **OpenWeatherMap API** | External weather data for ML feature engineering |

### Environment Variables (Backend `.env`)

```env
DATABASE_URL=postgresql+asyncpg://user:pass@host/dbname
JWT_SECRET_KEY=your-secret-key
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
AZURE_BLOB_CONNECTION_STRING=DefaultEndpointsProtocol=https;...
AZURE_BLOB_CONTAINER=profile-images
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
OPENWEATHER_API_KEY=your-key
```

---

## 🧪 Testing

### Backend Tests

```bash
cd smart-cafeteria-backend
pytest tests/ -v
```

Test files in `tests/`:
- `test_auth.py` — OTP flow, login, registration
- `test_menu.py` — Menu CRUD
- `test_orders.py` — Order creation and payment
- `test_queue.py` — Token and queue operations

### Admin Panel Linting

```bash
cd smart-cafeteria-admin
npm run lint
```

### Flutter Tests

```bash
cd smart-cafeteria-frontend
flutter test
```

---

## 🔑 Key Design Decisions

| Decision | Rationale |
|---|---|
| **Async FastAPI** | Handles concurrent WebSocket + REST requests efficiently |
| **JWT Stateless Auth** | No server-side session storage needed; scalable |
| **OTP via Email** | Restricts registration to verified college email addresses |
| **SQLAlchemy Async** | Non-blocking DB queries for better throughput |
| **WebSockets for Queue** | Real-time updates without polling; better UX |
| **XGBoost for Demand** | Handles mixed numerical/categorical features well; fast inference |
| **Per-Station Queue View** | Allows parallel serving at different food counters |
| **Walk-in Orders** | Supports students who didn't pre-order; keeps system inclusive |
