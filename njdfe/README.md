# Nanjanad FC — Frontend (React + Vite)

## Quick Start

```
npm install
npm run dev
```

Open: http://localhost:3000
Make sure Django backend is running at: http://127.0.0.1:8000

## Pages
| URL | Page |
|-----|------|
| / | Home |
| /about | About Club |
| /players | Squad list |
| /matches | Fixtures & Results |
| /gallery | Photo Gallery |
| /news | Club News |
| /contact | Contact & Map |
| /login | Login |
| /register | Register |
| /dashboard | Player Dashboard (role=player) |
| /admin | Admin Dashboard (role=admin) |

## How to test the full flow

1. Run: npm run dev
2. Go to http://localhost:3000/register → register a user
3. Go to http://127.0.0.1:8000/admin/ → Users → set Role to "admin"
4. Go to http://localhost:3000/login → login
5. Navbar shows "Admin Panel" → click it
6. Add matches, upload gallery, publish news from the Admin Dashboard
7. Register another user, set role to "player", login → My Dashboard
