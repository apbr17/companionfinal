# Companion 🎭
Experience events together — book tickets, find companions, pay securely, and leave reviews.

## Tech Stack
- **Frontend**: React + Vite + TypeScript + Tailwind CSS + shadcn/ui
- **Backend**: PHP + MySQL
- **Payments**: Razorpay (test mode)

---

## Quick Start

### 1. Frontend
```bash
npm install
npm run dev
```
Open http://localhost:8080

### 2. Database
- Start XAMPP (Apache + MySQL)
- Open http://localhost/phpmyadmin
- Run `backend/setup.sql` — creates all tables and seeds events

### 3. Backend
- Copy the `backend/` folder into `C:\xampp\htdocs\companion\backend\`
- Confirm `VITE_API_BASE=http://localhost/companion/backend` in `.env`

### 4. Razorpay (free test keys)
1. Sign up at https://dashboard.razorpay.com (free)
2. Go to Settings → API Keys → Generate Test Key
3. Open `backend/payment.php` and replace:
   ```php
   define('RAZORPAY_KEY_ID',     'rzp_test_YOUR_KEY_HERE');
   define('RAZORPAY_KEY_SECRET', 'YOUR_SECRET_HERE');
   ```
4. Use Razorpay's test card: `4111 1111 1111 1111`, any future date, any CVV

---

## Database Schema

### Users Database (people using the site)
| Table           | Purpose |
|----------------|---------|
| `users`         | Registered user accounts with Aadhaar verification |
| `user_sessions` | Login session tokens |
| `reviews`       | Reviews for events and the website (1–5 stars) |
| `payments`      | Razorpay payment records with order/payment IDs |

### Events Database (events on the site)
| Table         | Purpose |
|--------------|---------|
| `events`      | All event listings (title, venue, date, price, etc.) |
| `bookings`    | Confirmed ticket bookings with seat info |
| `event_seats` | Per-seat availability and booking status |

---

## API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `ping.php` | GET | Server health check |
| `register.php` | POST | Create user account |
| `login.php` | POST | Authenticate user |
| `reviews.php` | GET | Fetch reviews (event or website) |
| `reviews.php` | POST | Submit a review |
| `payment.php` | POST `action=create_order` | Create Razorpay order |
| `payment.php` | POST `action=verify_payment` | Verify & confirm booking |

---

## Project Structure
```
companion/
├── src/
│   ├── components/
│   │   ├── Reviews.tsx          ← Star ratings + review list + form
│   │   ├── booking/
│   │   │   └── BookingSummary.tsx  ← Razorpay payment button
│   │   └── ui/                  ← shadcn components
│   ├── context/
│   │   └── AuthContext.tsx      ← Login state, localStorage
│   ├── hooks/
│   │   └── use-razorpay.ts      ← Razorpay order + verify flow
│   ├── pages/
│   │   ├── Index.tsx            ← Home + site reviews section
│   │   ├── EventDetails.tsx     ← Event page + event reviews
│   │   ├── Booking.tsx          ← Multi-step booking flow
│   │   └── SignIn.tsx           ← Registration form
│   └── data/mockData.ts
├── backend/
│   ├── setup.sql                ← Full DB schema + seed data
│   ├── db.php                   ← Connection helper
│   ├── register.php
│   ├── login.php
│   ├── reviews.php              ← GET + POST reviews
│   ├── payment.php              ← Razorpay create + verify
│   └── ping.php
├── .env                         ← Set VITE_API_BASE here
└── validation.html              ← Standalone signup page
```
