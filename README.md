# MIA DREAMS & CO — African Fashion House Platform

> Full-stack web platform for an ethical African fashion house based in Dakar: brand showcase, online shop with Mobile Money payments, training programmes with paid enrolment, and a complete back-office.

---

## Overview

MIA DREAMS & CO groups several brands — a clothing line, the *MPREW* wax-fashion app, a *Fashion Program* for designers and a *Personal Branding* coaching offer. The platform presents each brand with its own catalogues, sells products online, takes enrolments and payments for training programmes, and gives the team an admin dashboard to manage all content, orders and in-store sales.

## Tech Stack

| Layer | Technologies |
|-------|--------------|
| Frontend | React 18, Vite, React Router, Tailwind CSS, Axios, jsPDF |
| Backend | Node.js, Express, Mongoose |
| Database | MongoDB |
| Auth & security | JWT, bcrypt, Helmet, express-rate-limit, express-validator |
| Payments | CinetPay, KkiaPay (Mobile Money & card) |
| Media | Cloudinary, Multer, Sharp (image optimisation) |
| Notifications | Nodemailer, Web Push (VAPID) |
| Tests | Vitest + Testing Library (frontend), Node test runner + c8 (backend) |
| Hosting | Vercel (frontend), Render (API) |

## Features

**Public site**
- Brand pages, each with its own collections and downloadable catalogues
- Online shop: cart, checkout, order tracking, "my orders"
- Training programmes with online enrolment and payment
- Blog, podcasts, gallery, testimonials, impact & activity reports
- Appointment booking, contact form, newsletter, global search

**Payments**
- CinetPay and KkiaPay integration (Mobile Money and card)
- Payment return / webhook handling and order status updates
- PDF export of orders from the admin (jsPDF)

**Admin dashboard** (role-based access)
- CRUD for brands, collections, products, catalogues, programmes, posts, podcasts, gallery, team, partners, testimonials and page sections
- Order and enrolment management, reservations, contact messages
- Point of sale (POS) and cash register for in-store sales
- Newsletter campaigns, users and roles, site settings
- Download tracking for catalogues and reports

## Architecture

```
Browser ──► Vercel (React build)
              └── /api/*, /uploads/*  ──► Render (Express API) ──► MongoDB
                                                 ├── Cloudinary (media)
                                                 └── CinetPay / KkiaPay (payments)
```

```
.
├── frontend/          # React + Vite app
│   └── src/
│       ├── pages/     # Public pages, Brands/, Boutique/, Programmes/, Admin/
│       ├── components/
│       ├── context/   # Global state (app, cart, language)
│       └── hooks/
├── backend/
│   └── src/
│       ├── routes/    # REST API (28 route modules)
│       ├── models/    # Mongoose models
│       ├── middleware/# Auth, rate limiting
│       └── utils/     # Payments, email, push notifications
└── app.js             # Production entry point (Plesk)
```

## Getting Started

**Prerequisites:** Node.js 18+, a MongoDB database (local or Atlas).

```bash
git clone https://github.com/Mulho-MABIALA/MiaDreams.git
cd MiaDreams
```

**Backend**
```bash
cd backend
cp .env.example .env      # then fill in your own values
npm install
npm run dev               # API on http://localhost:5000
```

On first start, the API seeds the super admin (from `ADMIN_EMAIL` / `ADMIN_PASSWORD`), the brands, page sections and programmes.

**Frontend**
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

## Environment Variables

All secrets come from environment variables — see `backend/.env.example` and `frontend/.env.example`. Main keys:

| Variable | Purpose |
|----------|---------|
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Token signing |
| `ADMIN_NAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` | Initial super admin |
| `MAIL_*` | Transactional email (SMTP) |
| `CINETPAY_API_KEY`, `CINETPAY_API_PASSWORD` | CinetPay payments |
| `KKIAPAY_*` | KkiaPay payments |
| `VAPID_*` | Web push notifications |
| `FRONTEND_URL`, `BACKEND_URL` | CORS and payment callbacks |

## Tests

```bash
cd frontend && npm test
cd backend && npm test
```

## Author

**Ibrahim-Trésor MABIALA-MULHO** — Full Stack Developer, Zolaa Tech (Dakar, Senegal)
Portfolio: [mulho-folio.vercel.app](https://mulho-folio.vercel.app) · GitHub: [@Mulho-MABIALA](https://github.com/Mulho-MABIALA)
