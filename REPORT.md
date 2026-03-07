# Smart Cafeteria Project Report

## 1. Abstract
The Smart Cafeteria system is an intelligent demand forecasting and token-based pre-ordering platform built to optimize college cafeteria operations. By combining a mobile app for students with a real-time ML-powered web panel for staff and administrators, the system eliminates traditional queuing, predicts daily food demand to minimize waste, and streamlines digital payments.

## 2. Core Objectives
1. **Reduce Wait Times:** Eliminate physical queues through a slot-based pre-ordering system and live wait-time tracking.
2. **Minimize Food Waste:** Utilize Machine Learning (XGBoost) to predict food demand based on historical data, weather, and day-of-week trends.
3. **Digitize Payments:** Provide seamless digital checkout integrated with Razorpay for secure student transactions.
4. **Real-time Counter Operations:** Equip kitchen staff with instant QR scanning, walk-in management, and live order tracking via WebSockets.

## 3. System Architecture
The application leverages a robust **4-Tier Cloud Architecture** deployed on Azure:
- **Client Tier (Frontend):** 
  - Flutter Mobile App for Students (iOS/Android).
  - React (Vite) + TypeScript Admin Dashboard for Counter Staff & Administrators.
- **Backend/API Tier:** 
  - Asynchronous Python FastAPI Engine serving RESTful endpoints and WebSocket streams.
- **Data Tier:** 
  - PostgreSQL (hosted on Azure / Supabase) for transactional relational data.
  - Azure Blob Storage for media assets.
- **Intelligence Tier:** 
  - Integrated XGBoost ML Models for historical demand forecasting and queue duration estimation.

## 4. Key Features Implemented
### For Students:
- **Amrita ID Integration:** Sign up and login instantly using the institutional email ID or ID Card QR Code.
- **Slot Selection:** Pick available time intervals (e.g., Lunch 12:30-1:00 PM) to manage crowd flow.
- **Live Queue Tracking:** View live queue position and estimated wait time directly from the app.

### For Staff/Administrators:
- **Rapid QR Check-in:** Instantly verify pre-orders via QR scanner at the counter.
- **Dynamic Menu Management:** Toggle availability, update prices, or add categories instantly.
- **Demand Forecasting Analytics:** View projected item sales to prepare bulk ingredients efficiently.

## 5. Technology Stack Summary
- **Mobile app:** Flutter 3.x, Dart, SharedPreferences.
- **Web Admin:** React 18, Vite, TypeScript, Recharts, Axios.
- **Backend API:** Python 3.11+, FastAPI, SQLAlchemy, Pydantic, WebSockets, JWT.
- **Database:** PostgreSQL (Relational Data), Azure Blob Storage.
- **Cloud & DevOps:** GitHub Actions (CI/CD), Azure App Services, Firebase Hosting.
- **External Services:** Razorpay (Payments), SMTP (Emails).

## 6. Project Outcomes & Future Scope
The system successfully established an end-to-end flow from student pre-ordering to kitchen handoff. Future iterations will focus on:
1. Integrating hardware IoT buzzers for real-time counter notifications without checking screens.
2. Enhancing the ML model with additional variables (like college festival days or exams) to improve prediction accuracy.