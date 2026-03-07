# 📖 Smart Cafeteria — User Documentation

**System:** Smart Cafeteria Demand Forecasting & Token-Based Queue Optimization System  
**Version:** 2.0 (Sprint 2)  
**Audience:** Students, Kitchen Staff, and Administrators

---

## 🎓 Student Guide (Flutter Mobile App)

Students use the **Smart Cafeteria** Flutter app (Android/iOS) to pre-order meals, avoid queues, and track their token in real time.

---

### 1️⃣ Registration & Login

#### First-Time Registration
1. Open the **Smart Cafeteria** app on your phone.
2. Tap **Register**. 
3. Enter your **Amrita college email** (e.g., `cb.sc.u4cse23001@cb.students.amrita.edu`).
4. Tap **Send OTP** — a 6-digit code will be sent to your email.
5. Enter the OTP on the next screen and tap **Verify**.
6. Fill in your **name** and create a **password** (min 8 characters).
7. Tap **Complete Registration**. You are now registered!

#### Login
1. Enter your **email** and **password**.
2. Tap **Login**.
3. *(Optional)* Use **Scan ID Card QR** to login instantly by scanning your Amrita college ID card.

#### Forgot Password?
1. On the login screen, tap **Forgot Password**.
2. Enter your college email and tap **Send OTP**.
3. Enter the OTP and set a new password.

---

### 2️⃣ Home Screen Overview

After login, the **Home Screen** shows:
- Your **name and profile photo** at the top.  
- **Today's date** and cafeteria status.
- Shortcut buttons: **Order Now**, **My Orders**, **My Profile**.
- A **quick menu preview** of available items.

---

### 3️⃣ Placing an Order

#### Step 1: Select a Time Slot
1. Tap **Order Now** from the home screen.
2. The **Slot Selection** screen shows all available time slots for today (e.g., 12:00–12:30, 12:30–13:00).
3. Each slot shows remaining capacity (e.g., "23 seats left").
4. Tap the slot that suits you and tap **Continue**.

#### Step 2: Browse & Add Items to Cart
1. The **Menu Screen** automatically filters items for your selected meal period (Breakfast / Lunch / Dinner).
2. Browse items by category: **Snacks**, **Main Course**, **Beverages**.
3. Tap **+** to add an item to your cart and **–** to remove.
4. Your cart summary is shown at the bottom (item count + total price).

#### Step 3: Confirm Your Order & Pay
1. Tap the **Cart** icon or **Proceed to Cart** button.
2. Review your order — items, quantities, and total price.
3. Tap **Place Order** to confirm.
4. Complete payment via the integrated payment gateway (Razorpay).
5. Once payment is confirmed, your order status changes to **PAID**.

#### Step 4: Get Your Token
1. After payment, you are taken to the **Token Screen**.
2. Your unique token number is displayed (e.g., **T-204**).
3. A **QR Code** is generated for your token — this is your "pickup pass."
4. The screen also shows:
   - Your **queue position** (e.g., "You are #3 in queue")
   - **Estimated wait time** (e.g., "Approx. 6 minutes")

#### Step 5: Arrive at the Cafeteria
1. Arrive at the cafeteria within your selected slot time.
2. Show your **QR code** at the counter for scanning.
3. Staff will scan it with the Admin Panel's QR Scanner — this marks you as **ARRIVED**.
4. Your position in the active queue is updated in real time.

#### Step 6: Collect Your Food
1. When your number is called / your token status changes to **SERVED**, collect your order.
2. You will see the status update in the app instantly.

---

### 4️⃣ Order History
1. Tap **My Orders** from the home screen or profile.
2. View all past and current orders with status (PENDING / PAID / SERVED).
3. Tap any order to see the full details and token.

---

### 5️⃣ Profile Management
1. Tap the **Profile** icon (bottom navigation or home screen).
2. View your **name, registration number, email, phone, course, batch**.
3. Tap **Edit Profile** to update name, phone, course, batch, or profile photo.
4. Profile photo can be uploaded from your gallery.

---

### 6️⃣ Contact Support
1. Go to **Profile → Contact Us**.
2. Type your query or issue in the text box.
3. Tap **Submit** — the cafeteria admin will respond to your registered email.

---

## 👨‍🍳 Kitchen Staff Guide (Admin Web Panel)

Staff use the **Admin Web Panel** (React app) on a tablet or desktop at the cafeteria counter.

---

### Login
1. Open the Admin Panel in the browser.
2. Enter credentials:
   - **Email:** `staff@amrita.edu`
   - **Password:** `staff123`
3. Click **Login** — you will be directed to the **Kitchen View**.

---

### Kitchen View — Serving Orders
The main view for staff is the **Station Queue** or **Kitchen Summary**.

1. **View Active Queue:** See all ARRIVED tokens with their order details.
2. **Filter by Category:** Tap **Snacks**, **Main Course**, or **Beverages** to see only orders for your station.
3. **Serve an Item:** Tap **Serve** next to an order item to mark it as served.
4. When ALL items in an order are served, the token automatically moves to **SERVED** status.
5. The student's app updates in real time via WebSocket.

---

### Scanning QR Code (Token Arrival)
1. Go to **QR Scanner** section in the sidebar.
2. A camera view opens — point it at the student's token QR code.
3. Once scanned, the token is marked as **ARRIVED** and added to the active queue.
4. An alert confirms: *"Token T-204 marked as arrived."*

---

### Walk-In Orders
For students who arrive directly without pre-ordering:
1. Go to **Walk-In Order** in the sidebar.
2. Select menu items and quantities.
3. Click **Create Order** — a `W-xxx` token is generated immediately.
4. Show the token number to the customer (printed or displayed).

---

### Served History
1. Go to **Served History** in the sidebar.
2. View the last 50 served tokens with timestamps.
3. Useful for verification and tracking daily throughput.

---

## 🛠️ Admin Guide (Admin Web Panel)

Admins have full access to all staff features plus management and analytics.

---

### Login
1. Open the Admin Panel in the browser.
2. Enter credentials:
   - **Email:** `admin@amrita.edu`
   - **Password:** `admin123`
3. Click **Login** — you will see all sections in the sidebar.

---

### Menu Management
1. Go to **Menu Manager** in the sidebar.
2. **View** all current menu items with their price, category, meal type, and stock.
3. **Add Item:** Click **+ Add Item**, fill in name, description, price, category, meal types, and initial quantity. Click **Save**.
4. **Edit Item:** Click the edit icon next to any item, update fields, and click **Update**.
5. **Delete Item:** Click the delete icon. Note: items linked to existing orders cannot be deleted.
6. **Toggle Availability:** Changing quantity to 0 automatically marks the item unavailable.

---

### Slot Management
1. Go to **Slot Manager** in the sidebar.
2. View all existing time slots for any day.
3. **Add Slot:** Click **+ Add Slot**, set start time, end time, capacity, and date. Click **Create**.
4. **Edit Slot:** Update time or capacity as needed.
5. **Delete Slot:** Remove slots that are no longer needed.

---

### Analytics Dashboard
1. Go to **Analytics** in the sidebar.
2. The dashboard shows:
   - 📈 **Demand Forecast Charts** — ML-predicted demand for upcoming days.
   - 🍽️ **Top Items** — Most ordered food items this week/month.
   - ⏰ **Peak Hours** — Bar chart showing busiest ordering times.
   - 📦 **Order Volume** — Daily order count trends.
   - 🌤️ **Weather Correlation** — How weather affects cafeteria demand (ML feature).
3. Use filters (date range, category) to narrow down insights.
4. Use these analytics to proactively plan menu quantities and staffing.

---

### Queue Monitor
1. Go to **Queue Monitor** in the sidebar.
2. Real-time view of:
   - **Pending Queue** — Students with paid orders not yet arrived.
   - **Active Queue** — Students currently at the counter.
   - **Wait Time** — Estimated queue clearance time.
3. This view auto-refreshes via WebSocket — no need to manually reload.

---

### Contact Queries (Admin)
1. Go to **Admin Queries** section.
2. View all queries submitted by students via the app.
3. Respond via the student's email.

---

## 🔄 End-to-End Flow Summary

```
Student (App)                  Backend (API)              Staff/Admin (Web Panel)
─────────────────────────────────────────────────────────────────────────────────
Register → OTP Verify     →   Create Account              
Login                     →   Get JWT Token               
Select Slot + Build Cart  →   Check Availability          Admin: Create Slots
Place Order + Pay         →   Create Order + Token         
                          →   WebSocket: queue_update  →  Admin receives update
Arrive at Cafeteria       →                           ←   Staff: Scan QR Code
                          →   Mark ARRIVED + Queue         
                          →   WebSocket: token_arrived     
Wait for token number     →                           ←   Staff: Mark Served
                          →   Token status = SERVED        
                          →   WebSocket: token_served  →  Student: notified
Collect food  ✅           
```
