# 📡 Smart Cafeteria — API Documentation

**Base URL (Production):** `https://smart-cafeteria-backend.azurewebsites.net`  
**Base URL (Local Dev):** <a href="https://smart-cafe-backend-c8h7d7g4a2dpe8ck.malaysiawest-01.azurewebsites.net" target="_blank">https://smart-cafe-backend-c8h7d7g4a2dpe8ck.malaysiawest-01.azurewebsites.net</a>
**API Version:** v1  
**Authentication:** Bearer JWT Token (`Authorization: Bearer <token>`)

---

## 🔐 Authentication (`/auth`)

### POST `/auth/send-otp`
Send a 6-digit OTP to a college email for registration or password reset.

**Request Body:**
```json
{
  "email": "cb.sc.u4cse23001@cb.students.amrita.edu",
  "purpose": "REGISTER"
}
```
> `purpose` can be `"REGISTER"` or `"RESET_PASSWORD"`

**Response:**
```json
{ "message": "OTP sent successfully" }
```

---

### POST `/auth/verify-otp`
Verify the OTP sent to the email.

**Request Body:**
```json
{
  "email": "cb.sc.u4cse23001@cb.students.amrita.edu",
  "otp": "482910"
}
```
**Response:**
```json
{ "message": "OTP verified" }
```

---

### POST `/auth/register/complete`
Complete student registration after OTP is verified.

**Request Body:**
```json
{
  "email": "cb.sc.u4cse23001@cb.students.amrita.edu",
  "otp": "482910",
  "name": "Arjun Kumar",
  "password": "securePass123",
  "confirm_password": "securePass123"
}
```
**Response:**
```json
{ "message": "Registration successful. Please login." }
```

---

### POST `/auth/login`
Login with email and password. Returns JWT access token.

**Request Body:**
```json
{
  "email": "cb.sc.u4cse23001@cb.students.amrita.edu",
  "password": "securePass123"
}
```
**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "student_name": "Arjun Kumar",
  "register_no": "u4cse23001",
  "email": "cb.sc.u4cse23001@cb.students.amrita.edu",
  "profile_image": null,
  "role": "student"
}
```

---

### POST `/auth/admin/login`
Login for admin or staff users (hardcoded credentials for demo).

**Request Body:**
```json
{
  "email": "admin@amrita.edu",
  "password": "admin123"
}
```
**Response:**
```json
{
  "access_token": "eyJhbGciOi...",
  "role": "admin",
  "username": "Administrator"
}
```
> Use `staff@amrita.edu` / `staff123` for kitchen staff login.

---

### POST `/auth/reset-password/complete`
Complete the password reset flow.

**Request Body:**
```json
{
  "email": "cb.sc.u4cse23001@cb.students.amrita.edu",
  "otp": "293847",
  "new_password": "newPass456",
  "confirm_password": "newPass456"
}
```
**Response:**
```json
{ "message": "Password updated successfully" }
```

---

### POST `/auth/qr-login`
Login or auto-register using Amrita ID card QR code scan.

**Request Body:**
```json
{ "qr_code": "CB.SC.U4CSE23523" }
```
**Response (existing user):**
```json
{
  "status": "LOGIN_SUCCESS",
  "access_token": "eyJ...",
  "email": "cb.sc.u4cse23523@cb.students.amrita.edu",
  "student_name": "Priya Sharma",
  "register_no": "u4cse23523",
  "message": "Login Successful",
  "role": "student"
}
```
**Response (new user):**
```json
{
  "status": "OTP_SENT",
  "email": "cb.sc.u4cse23523@cb.students.amrita.edu",
  "message": "User not found. OTP sent to email to register."
}
```

---

### GET `/auth/me` 🔒
Get the currently logged-in student's profile.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "id": 1,
  "name": "Arjun Kumar",
  "email": "cb.sc.u4cse23001@cb.students.amrita.edu",
  "register_no": "u4cse23001",
  "profile_image": "https://...",
  "phone": "9876543210",
  "course": "B.Tech CSE",
  "batch": "2023-2027",
  "role": "student"
}
```

---

### PUT `/auth/profile` 🔒
Update student profile (name, phone, course, batch, profile_image).

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "Arjun K.",
  "phone": "9876543210",
  "course": "B.Tech CSE",
  "batch": "2023-2027",
  "profile_image": "https://storage.blob.core.windows.net/..."
}
```
**Response:** Same as `/auth/login` response (returns updated JWT).

---

### POST `/auth/contact` 🔒
Submit a support/contact query.

**Request Body:**
```json
{ "query_text": "I am unable to cancel my order." }
```
**Response:**
```json
{ "message": "Your query has been submitted. We'll get back to you soon!" }
```

---

## 🍽️ Menu (`/menu`)

### GET `/menu`
Fetch all available menu items. Filters by meal type based on slot time.

| Query Param | Type | Description |
|---|---|---|
| `available_only` | bool | Default `true`. Only show available items |
| `slot_time` | string `HH:MM` | Filter by meal period (Breakfast 7-11, Lunch 11:30-15:30, Dinner 17-21) |

**Example:** `GET /menu?slot_time=12:00`

**Response:**
```json
[
  {
    "id": 1,
    "name": "Samosa",
    "price": 15.0,
    "description": "Crispy fried pastry with spiced potato filling",
    "category": "SNACKS",
    "meal_types": ["ALL_DAY"],
    "is_available": true,
    "quantity": 50
  },
  {
    "id": 2,
    "name": "Veg Thali",
    "price": 60.0,
    "description": "Full meal with roti, rice, dal, and sabzi",
    "category": "MAIN_COURSE",
    "meal_types": ["LUNCH"],
    "is_available": true,
    "quantity": 25
  }
]
```

---

### POST `/menu`
Create a new menu item (Admin use).

**Request Body:**
```json
{
  "name": "Veg Puff",
  "price": 20.0,
  "description": "Baked puff pastry with vegetable filling",
  "category": "SNACKS",
  "meal_types": ["ALL_DAY"],
  "quantity": 100
}
```
**Response:** Created `MenuItemResponse` object.

---

### PUT `/menu/{item_id}`
Update an existing menu item (Admin use).

**Response:** Updated `MenuItemResponse` object.

---

### DELETE `/menu/{item_id}`
Delete a menu item (Admin use).

**Response:**
```json
{ "message": "Item deleted successfully" }
```

---

## 📅 Slots (`/slots`)

### GET `/slots/available?target_date=YYYY-MM-DD`
Get all available time slots for a specific date with remaining capacity.

**Example:** `GET /slots/available?target_date=2025-03-10`

**Response:**
```json
[
  {
    "id": 1,
    "start_time": "12:00",
    "end_time": "12:30",
    "capacity": 50,
    "date": "2025-03-10",
    "remaining_capacity": 23
  },
  {
    "id": 2,
    "start_time": "12:30",
    "end_time": "13:00",
    "capacity": 50,
    "date": "2025-03-10",
    "remaining_capacity": 45
  }
]
```

---

### POST `/slots`
Create a new time slot (Admin use).

**Request Body:**
```json
{
  "start_time": "13:00",
  "end_time": "13:30",
  "capacity": 50,
  "date": "2025-03-10"
}
```

---

### PUT `/slots/{slot_id}`
Update an existing slot.

---

### DELETE `/slots/{slot_id}`
Delete a slot.

---

## 🛒 Orders (`/orders`)

### POST `/orders` 🔒
Create a new pre-order (Regular student flow – selected slot + items).

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "slot_id": 1,
  "items": [
    { "menu_item_id": 1, "quantity": 2 },
    { "menu_item_id": 3, "quantity": 1 }
  ]
}
```
**Response:** Full `OrderResponse` object with order ID, status, and token.

---

### POST `/orders/walk-in`
Create a walk-in order (Admin/Staff counter use, no account required).

**Request Body:**
```json
{
  "items": [
    { "menu_item_id": 2, "quantity": 1 }
  ],
  "customer_name": "Walk-in Customer"
}
```
**Response:** `OrderResponse` with a `W-` prefixed token number (e.g., `W-483`).

---

### GET `/orders/my` 🔒
Get all orders for the currently logged-in student.

**Response:**
```json
[
  {
    "id": 42,
    "status": "PAID",
    "order_type": "PRE_ORDER",
    "total_amount": 75.0,
    "created_at": "2025-03-10T10:15:00Z",
    "token": { "id": 18, "token_number": "T-204", "status": "PENDING" },
    "items": [
      { "name": "Samosa", "quantity": 2, "price": 15.0 },
      { "name": "Tea", "quantity": 1, "price": 10.0 }
    ]
  }
]
```

---

### GET `/orders/{order_id}` 🔒
Get details for a specific order.

---

### POST `/orders/{order_id}/pay` 🔒
Process payment for an order.

**Request Body:**
```json
{ "payment_id": "rzp_live_xxxxxxxxxxxx" }
```
**Response:** Updated `OrderResponse` with `status: "PAID"`.

---

### DELETE `/orders/{order_id}/cancel` 🔒
Cancel an order.

---

## 🏷️ Tokens (`/tokens`)

### GET `/tokens/{token_id}`
Get detailed token info including queue position and estimated wait time.

**Response:**
```json
{
  "id": 18,
  "token_number": "T-204",
  "order_id": 42,
  "status": "ARRIVED",
  "arrival_time": "2025-03-10T12:05:00Z",
  "served_time": null,
  "created_at": "2025-03-10T10:15:00Z",
  "position_in_queue": 3,
  "estimated_wait_minutes": 6,
  "dining_duration": null
}
```

---

### GET `/tokens/order/{order_id}`
Get the token associated with a specific order.

---

### GET `/tokens/pending/all`
Get all tokens in PENDING status (waiting for student arrival).

---

### POST `/tokens/{token_id}/arrive`
Mark a token as ARRIVED (scanned at cafeteria counter).

**Response:** HTTP 200 OK + WebSocket broadcast to `queue` channel.

---

### POST `/tokens/arrive-by-number`
Mark a token as arrived using its display number (e.g., scanned by staff).

**Request Body:**
```json
{ "token_number": "T-204" }
```
**Response:**
```json
{ "message": "Arrived", "token_number": "T-204" }
```

---

## 🚶 Queue (`/queue`)

### GET `/queue/status`
Get overall queue status — count, wait time, and active tokens.

**Response:**
```json
{
  "total_in_queue": 8,
  "estimated_wait_minutes": 16,
  "tokens": [...]
}
```

---

### GET `/queue/pending`
Get all PENDING tokens (pre-orders awaiting student arrival).

---

### GET `/queue/arrived`
Get all ARRIVED tokens currently being served. Optional filter by category.

| Query Param | Type | Description |
|---|---|---|
| `category` | string | e.g., `SNACKS`, `MAIN_COURSE`, `BEVERAGES` |

**Example:** `GET /queue/arrived?category=MAIN_COURSE`

---

### GET `/queue/served`
Get last 50 served tokens (history).

---

### POST `/queue/serve/{token_id}`
Serve a token's order (mark items as served). Staff action.

| Query Param | Type | Description |
|---|---|---|
| `category` | string | Optional. Serve only items of this category |

**Response (partial):**
```json
{ "message": "Category SNACKS served", "status": "PARTIAL" }
```
**Response (full):**
```json
{ "message": "Token fully served", "status": "SERVED" }
```

---

## 📊 Analytics (`/analytics`)

### GET `/analytics/demand`
Get ML-based demand predictions / historical demand trends.

### GET `/analytics/popular-items`
Get top ordered menu items.

### GET `/analytics/peak-hours`
Get peak ordering hour analysis.

### GET `/analytics/orders/summary`
Get daily/weekly order summary statistics.

---

## 🌐 WebSockets (`/ws`)

### `WS /ws/{channel}`
Real-time WebSocket connection. Channels: `queue`, `menu`.

**Events received:**
| Event Type | Description |
|---|---|
| `queue_update` | A new order was added to the queue |
| `token_arrived` | A student scanned their QR at the counter |
| `token_served` | A token has been fully served |
| `menu_update` | Menu stock has changed |

---

## 📌 Error Codes

| Code | Meaning |
|---|---|
| 400 | Bad Request (invalid input) |
| 401 | Unauthorized (invalid credentials / expired token) |
| 403 | Forbidden (inactive account / insufficient role) |
| 404 | Resource not found |
| 409 | Conflict (e.g., delete blocked by linked data) |
| 422 | Validation Error (missing/wrong type fields) |
| 500 | Internal Server Error |
