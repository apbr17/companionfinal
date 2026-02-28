# Companion 🎭
Experience events together — book tickets, find companions, pay securely, leave reviews.

## Stack
- **Frontend**: React 18 + Vite + TypeScript + Tailwind CSS + shadcn/ui
- **Backend**: PHP + MySQL
- **Payments**: Razorpay (test keys, free)

---

## Quick Start

### Frontend
```bash
npm install
npm run dev
# → http://localhost:8080
```

### Database
1. Start XAMPP (Apache + MySQL)
2. Open http://localhost/phpmyadmin
3. Run `backend/setup.sql` — creates both databases and seeds all 8 events

### Backend
- Copy `backend/` to `C:\xampp\htdocs\companion\backend\`
- `.env` should have: `VITE_API_BASE=http://localhost/companion/backend`

### Razorpay (free test keys)
1. Sign up free at https://dashboard.razorpay.com
2. Settings → API Keys → Generate Test Key
3. Paste both keys into `backend/payment.php`:
   ```php
   define('RAZORPAY_KEY_ID',     'rzp_test_xxxx');
   define('RAZORPAY_KEY_SECRET', 'your_secret');
   ```
4. Test card: `4111 1111 1111 1111`, any future date, any CVV

---

## Database Design

### Database 1 — USERS (people using the site)
Stores everything about the people using the platform.

| Table      | What it stores |
|------------|----------------|
| `users`    | Name, email, Aadhaar, hashed password |
| `reviews`  | Star ratings + text written by users (for events or site) |
| `bookings` | Booking history: event, seats, ticket count, total price |
| `payments` | Razorpay order/payment IDs, amounts, status |

### Database 2 — EVENTS (events on the site)
Stores everything about the events listed on the platform.

| Table    | What it stores |
|----------|----------------|
| `events` | Title, category, venue, city, date, time, price, language, genre, rating, duration, description |

---

## Features

### ⭐ Reviews — Two places
- **Event Details page** — reviews for that specific event, visible when you click any event card
- **`/reviews` page** — tab-based: "Site Reviews" (overall experience) and "Event Reviews" (pick any event from a grid)
- Signed-in users can submit a 1–5 star rating + optional title + body
- Shows aggregate rating bar chart, average score, and total count
- One review per user per target enforced in DB

### 💳 Razorpay Payment
- Replaces the old fake "Confirm Booking" button
- Shows price breakdown: ticket total + 5% convenience fee
- Opens Razorpay modal (UPI, debit/credit cards, netbanking, wallets)
- Backend verifies HMAC signature before writing to DB
- On success: saves booking + payment to users DB, shows booking ref + payment ID

### 🔐 Auth
- Register with name, email, Aadhaar, password
- "Remember me" persists to localStorage; without it uses sessionStorage
- Header shows user initials + name when logged in, Sign Out button

---

## Routes
| Path | Page |
|------|------|
| `/` | Home (event listings + site reviews section) |
| `/signin` | Registration form |
| `/reviews` | Dedicated reviews page (site + per-event) |

## API Endpoints
| File | Method | Action |
|------|--------|--------|
| `ping.php` | GET | Health check |
| `register.php` | POST | Create account |
| `login.php` | POST | Login |
| `reviews.php` | GET | Fetch reviews |
| `reviews.php` | POST | Submit review |
| `payment.php` | POST `create_order` | Create Razorpay order |
| `payment.php` | POST `verify_payment` | Verify + save booking |
