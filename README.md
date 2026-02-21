<div align="center">

<h1>🛒 GreenCart</h1>
<h3>MERN Grocery E-commerce Application</h3>

<p>
A full-stack grocery e-commerce platform built with the MERN stack, featuring
customer shopping flows, seller dashboards, secure payments, and cloud-hosted media.
</p>

<img src="https://img.shields.io/badge/MongoDB-Database-green" />
<img src="https://img.shields.io/badge/Express-Backend-black" />
<img src="https://img.shields.io/badge/React-Frontend-blue" />
<img src="https://img.shields.io/badge/Node.js-Runtime-brightgreen" />
<img src="https://img.shields.io/badge/Stripe-Payments-purple" />
<img src="https://img.shields.io/badge/Cloudinary-Images-blueviolet" />

<br/><br/>

<a href="#-features">Features</a> •
<a href="#-tech-stack">Tech Stack</a> •
<a href="#-screenshots--ui-preview">Screenshots</a> •
<a href="#-local-development">Local Setup</a> •
<a href="#-aws-deployment-overview">Deployment</a>

</div>

---

## Screenshots & UI Preview

<p align="center">
  <!-- Replace this with a real combined UI preview export -->
  <img width="1906" height="970" alt="Screenshot 2026-01-21 161255" src="https://github.com/user-attachments/assets/e969f9e1-6b5d-48b6-95ec-34af7cbf7d2d" />

</p>

> Tip: Export a single wide image that showcases Home, Product Details, Cart, and Seller Dashboard for a strong first impression.

---

## Features

- **Customer features**
  - Browse **categories** and **best‑selling** products
  - View **product details** with images, pricing, and offers
  - Add products to **cart**, manage quantities, and place orders
  - Manage **delivery addresses**
  - View **order history**

- **Seller features**
  - **Seller authentication** and protected routes
  - Add / edit / delete products with **Cloudinary‑hosted images**
  - Manage **stock status** and product listing
  - View and manage **customer orders**

- **Backend / platform**
  - RESTful **Express** API
  - **MongoDB + Mongoose** for data persistence
  - **JWT‑based auth** for users and sellers
  - **Stripe** integration (webhook endpoint `/stripe`) for payment events
  - **Cloudinary** integration for product image storage
  - CORS configured for the React client

---

## Tech Stack

- **Frontend**
  - React (Vite)
  - React Router DOM
  - Tailwind CSS
  - Axios
  - React Hot Toast

- **Backend**
  - Node.js + Express
  - MongoDB + Mongoose
  - JWT, bcryptjs
  - Stripe
  - Cloudinary
  - Multer

---

## Project Structure

```text
greenCart/
  client/           # React + Vite frontend
  server/           # Express + MongoDB backend
```

Key backend modules:

- `configs/`
  - `db.js` – MongoDB connection (uses `MONGODB_URI`)
  - `cloudinary.js` – Cloudinary configuration
  - `multer.js` – Multer storage for file uploads
- `models/` – Mongoose schemas (`User`, `Product`, `Order`, `Address`, ...)
- `controllers/` – Business logic (users, sellers, products, cart, orders, addresses)
- `middlewares/` – Auth middleware for users and sellers
- `routes/` – API route definitions
- `server.js` – Express app entrypoint

Key frontend modules:

- `src/pages/` – Top‑level pages (Home, AllProducts, Cart, MyOrders, ProductDetails, etc.)
- `src/components/` – UI components (Navbar, ProductCard, BestSeller, seller components, etc.)
- `src/context/AppContext.jsx` – Global state, API calls, and shared logic

---

## Prerequisites

- Node.js (LTS recommended)
- npm or yarn
- MongoDB instance (Atlas or self‑hosted)
- Cloudinary account (for image uploads)
- Stripe account (for payments / webhooks)

---

## Environment Variables

Create a `.env` file in the `server` directory with at least:

```bash
PORT=4000                         # Optional, defaults to 4000
MONGODB_URI=your_mongodb_uri

JWT_SECRET=your_jwt_secret        # For user/seller auth
JWT_EXPIRES_IN=7d                 # Example, adjust as needed

STRIPE_SECRET_KEY=sk_live_or_test_key
STRIPE_WEBHOOK_SECRET=your_webhook_signing_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

> **Note**: These variable names are inferred from the codebase and typical setups.  
> Adjust or extend them to match your actual implementation (e.g. additional secrets for refresh tokens, cookie names, etc.).

If you are deploying the frontend separately and need runtime configuration, consider using Vite environment variables (e.g. `VITE_API_BASE_URL`) in a `client/.env` file:

```bash
VITE_API_BASE_URL=http://localhost:4000
```

and configure Axios / fetch to use this base URL.

---

## Local Development

Clone the repository and install dependencies for both client and server.

```bash
git clone <your-repo-url> greenCart
cd greenCart

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### Run the backend (server)

From the `server` directory:

```bash
npm run server    # uses nodemon for development
# or
npm start         # plain node server.js
```

The server will start on `http://localhost:4000` (or the port defined in `PORT`).

### Run the frontend (client)

From the `client` directory:

```bash
npm run dev
```

By default Vite runs on `http://localhost:5173`.

Make sure the backend CORS `allowedOrigins` in `server.js` contains your frontend URL:

```js
const allowedOrigins = ['http://localhost:5173'];
```

---

## Build & Production

### Build the frontend

From the `client` directory:

```bash
npm run build
```

This generates a production build in `client/dist`.

### Start the backend in production mode

From the `server` directory:

```bash
npm install --production
npm start
```

In a production deployment, you can either:

- Serve the React build (e.g. from an S3 + CloudFront distribution or a separate static host), and point it to the API URL, **or**
- Have a reverse proxy (e.g. Nginx) serving the static files and proxying API calls to the Node server.

---

## ☁️ AWS Deployment Overview

There are several ways to deploy GreenCart to AWS. A common approach:

- **Frontend**
  - Build the React client with `npm run build`
  - Upload `client/dist` to **Amazon S3**
  - Front it with **CloudFront** for global CDN caching and HTTPS

- **Backend**
  - Deploy the `server` app to:
    - **EC2** (Node app managed via PM2 / systemd), or
    - **Elastic Beanstalk** (Node platform), or
    - **AWS ECS / Fargate** using a Docker image
  - Configure environment variables in the respective AWS service (matching the `.env` values)
  - Ensure:
    - The backend can reach your **MongoDB** (e.g. Atlas or self‑hosted on EC2)
    - **Stripe webhook** endpoint is publicly accessible (`/stripe`) and HTTPS
    - **Cloudinary** credentials are set as environment variables

- **Networking / security**
  - Use **AWS Security Groups** to restrict access to your backend
  - Configure **HTTPS** via ACM certificates (typically on CloudFront or ALB)

---

## API Overview

The main Express routes (all prefixed by `/api` except `/stripe`):

- `GET /` – Health check (`"Api running"`)
- `/api/user` – User registration, login, profile, etc.
- `/api/seller` – Seller auth and profile
- `/api/product` – Product CRUD and listing
- `/api/order` – Order creation, listing, and Stripe integration
- `/api/address` – Address CRUD
- `/api/cart` – Cart operations
- `POST /stripe` – Stripe webhook handler

> For exact request/response formats, see the route and controller implementations in the `server` folder.

---

## Development Notes

- **Image uploads**
  - Handled via `multer` and uploaded to Cloudinary under the `greenCart/products` folder
  - Temporary files are removed from disk after upload

- **Error handling**
  - Controllers generally return JSON with `success` flag and `message`
  - API consumers (frontend) should always check the `success` property

- **Authentication**
  - Implemented via auth middlewares (`authUser`, `authSeller`)
  - Tokens are expected to be validated before accessing protected routes

---

## Scripts Reference

### Client (`client/package.json`)

- `npm run dev` – Start Vite dev server
- `npm run build` – Build production assets
- `npm run preview` – Preview built app
- `npm run lint` – Run ESLint

### Server (`server/package.json`)

- `npm start` – Run Express server with Node
- `npm run server` – Run Express server with Nodemon (auto‑reload)

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m "Add your feature"`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

---

## License

This project is licensed under the ISC License (see `server/package.json`).  
You can re‑license or update this for your production needs.


---

## Visuals & UX Assets

> These example references live in `client/src/assets`. Update paths if you move assets or host externally.

<p align="center">
  <img src="client/src/assets/main_banner_bg.png" width="80%" alt="Main banner" />
</p>

<p align="center">
  <img src="client/src/assets/bottom_banner_image.png" width="80%" alt="Bottom banner" />
</p>

<p align="center">
  <img src="client/src/assets/product_list_icon.svg" width="80" alt="Product list icon" />
  <img src="client/src/assets/cart_icon.svg" width="80" alt="Cart icon" />
  <img src="client/src/assets/trust_icon.svg" width="80" alt="Trust icon" />
</p>

---

## Table of Contents

1. Overview
2. Features
3. Tech Stack
4. Project Structure
5. Prerequisites
6. Environment Variables
7. Local Development
8. Build & Production
9. AWS Deployment
10. API Overview
11. Development Notes
12. Scripts
13. Architecture & Design
14. Frontend Details
15. Backend Details
16. Data Models
17. API Examples
18. Security & Compliance
19. Observability & Ops
20. CI/CD Guidance
21. Performance & Caching
22. Testing Strategy
23. Troubleshooting
24. Maintenance Runbooks
25. Roadmap & Backlog
26. Changelog Template
27. License

---

## Architecture & Design

- **Client**: Vite + React SPA, Tailwind for styling, React Router for navigation, Axios for API, React Hot Toast for feedback.
- **API**: Express with modular routes/controllers, Mongoose ODM, JWT authentication, Stripe webhook endpoint, Cloudinary uploads via Multer.
- **Storage**: MongoDB for all entities (users, products, orders, addresses, carts). Cloudinary for product images.
- **Payments**: Stripe webhook at `/stripe` using `express.raw` middleware for signature verification (configure `STRIPE_WEBHOOK_SECRET`).
- **Auth flow**:
  - User/Seller login → JWT issued → auth middleware (`authUser` / `authSeller`) validates token per request.
  - Cookies supported via `cookie-parser`; ensure `SameSite`/`Secure` when deploying behind HTTPS.
- **CORS**: `allowedOrigins` currently `http://localhost:5173`; update for production domains.
- **File uploads**: Multer writes to disk then uploads to Cloudinary; temp files are removed post-upload.
- **Environments**: Dev (`localhost`), Staging (optional), Prod (AWS-hosted API + CDN-hosted frontend).

### High-level request lifecycle

1. React client calls API with JWT (or cookie) attached.
2. Express receives request → CORS → JSON parsing → cookie parsing → auth middleware.
3. Controller executes domain logic, Mongoose hits MongoDB.
4. Responses return `{ success, message?, data? }` JSON shape.
5. Stripe webhook bypasses JSON parser and uses `express.raw` to validate signatures.

---

## Frontend Details

- **Entry**: `client/src/main.jsx`
- **Routing**: `react-router-dom` v7, pages under `src/pages`
- **State**: `src/context/AppContext.jsx` centralizes API calls, cart state, auth state
- **Styling**: Tailwind v4 via `@tailwindcss/vite` plugin, global styles in `src/index.css`
- **Components**:
  - `Navbar`, `Footer`, `ProductCard`, `BestSeller`, `Categories`, `BottomBanner`, `MainBanner`, `NewsLetter`, `Loading`
  - Seller area components under `src/components/seller`
- **Seller pages**: `SellerLayout`, `SellerLogin`, `AddProduct`, `ProductList`, `Orders`
- **Customer pages**: `Home`, `AllProducts`, `ProductDetails`, `ProductCategory`, `Cart`, `AddAddress`, `MyOrders`
- **API access**: Axios; set base URL via `VITE_API_BASE_URL`
- **Toasts**: `react-hot-toast` for async feedback

### Frontend configuration checklist

- Set `VITE_API_BASE_URL` for each environment.
- Confirm CORS allows the deployed frontend origin.
- If using cookies for auth, ensure `withCredentials: true` on Axios and server CORS `credentials: true`.
- Preload fonts/icons if adding custom assets to improve LCP.

---

## Backend Details

- **Entry**: `server/server.js`
- **Routes**:
  - `userRoute.js`, `sellerRoute.js`, `productRoute.js`, `orderRoute.js`, `addressRoute.js`, `cartRoute.js`
- **Controllers**:
  - `userController.js`, `sellerController.js`, `productController.js`, `orderController.js`, `addressController.js`, `cartController.js`
- **Auth middleware**:
  - `authUser.js`, `authSeller.js` — verify JWT and attach user/seller to request
- **Config**:
  - `db.js` connects to MongoDB via `MONGODB_URI`
  - `cloudinary.js` configures Cloudinary credentials
  - `multer.js` sets up disk storage for uploads
- **Payments**:
  - Stripe webhook in `orderController.js` exported as `stripeWebhooks`; mounted at `/stripe` with `express.raw`
- **Server concerns**:
  - Add rate limiting (e.g., `express-rate-limit`) and helmet for production.
  - Add centralized error handler for consistent responses.

---

## Data Models (inferred)

> See `server/models/*.js` for actual definitions. The below is a quick reference.

- **User**
  - `name`, `email`, `passwordHash`, `addresses[]`, `orders[]`, `role`, `createdAt`, `updatedAt`
- **Seller**
  - `name`, `email`, `passwordHash`, `storeName`, `products[]`, `createdAt`, `updatedAt`
- **Product**
  - `name`, `description` (JSON), `category`, `price`, `offerPrice`, `image[]`, `inStock`, `createdAt`, `updatedAt`
- **Order**
  - `user`, `items[]` (product, qty, price), `amount`, `paymentStatus`, `fulfillmentStatus`, `address`, `stripeSessionId`, `createdAt`
- **Address**
  - `user`, `line1`, `line2`, `city`, `state`, `country`, `postalCode`, `phone`
- **Cart**
  - `user`, `items[]` (product, qty)

---

## API Examples (illustrative)

### Auth (User)

```bash
POST /api/user/login
Content-Type: application/json

{ "email": "user@example.com", "password": "secret" }
```

### Products

```bash
GET /api/product/all
```

```bash
POST /api/product/add
Authorization: Bearer <seller_jwt>
Content-Type: multipart/form-data

name=Apple
description={"text":"Fresh apples"}
category=fruits
price=2.99
offerPrice=2.49
image=@/path/to/image.jpg
```

### Cart

```bash
POST /api/cart/add
Authorization: Bearer <jwt>
Content-Type: application/json

{ "productId": "<id>", "quantity": 2 }
```

### Orders / Stripe

```bash
POST /api/order/checkout
Authorization: Bearer <jwt>
```

```bash
POST /stripe
Content-Type: application/json
Stripe-Signature: t=...,v1=...
```

---

## Security & Compliance

- **Secrets management**: Use AWS SSM Parameter Store or Secrets Manager; avoid committing `.env`.
- **Transport security**: Enforce HTTPS (CloudFront or ALB with ACM certs).
- **CORS**: Restrict to known origins; avoid wildcards in production.
- **Headers**: Add `helmet` middleware and `hsts` in your reverse proxy.
- **Rate limiting**: Apply `express-rate-limit` per IP for auth and write endpoints.
- **Logging**: Avoid logging PII; mask tokens and secrets.
- **Backups**: Use MongoDB Atlas backups or run your own backup job for self-hosted Mongo.
- **Stripe webhooks**: Require `STRIPE_WEBHOOK_SECRET`; ensure `express.raw` is used before JSON middleware.

---

## Observability & Ops

- **Logging**: Consider `morgan` (HTTP) + application logs to CloudWatch (if on AWS).
- **Metrics**: Add basic health (`/`) and, optionally, `/healthz` with DB check.
- **Tracing**: Optional OpenTelemetry instrumentation for Express + MongoDB.
- **Alerts**: Set CloudWatch alarms for 5xx rates, latency, CPU/memory if on EC2/ECS/Beanstalk.

---

## CI/CD Guidance

- **Lint/test**: Run `npm run lint` (client) and lightweight API smoke tests before deploy.
- **Build**: `npm run build` in `client`; produce `dist/`.
- **Artifacts**: Upload `dist/` to S3 for frontend. Package server as Docker image or zip (Beanstalk).
- **Pipelines**: GitHub Actions or AWS CodePipeline → build → test → deploy to S3/CloudFront and ECS/Beanstalk/EC2.
- **Blue/green**: Prefer blue/green or canary for backend when using ECS/Beanstalk to avoid downtime.

---

## Performance & Caching

- **Frontend**
  - Use production build (`npm run build`) with code-splitting (Vite handles by default).
  - Serve static assets via CloudFront with long TTL + cache-busting filenames.
- **Backend**
  - Add response caching for read-heavy endpoints (e.g., products) via CDN or in-process cache.
  - Prefer lean responses (avoid overfetching large descriptions).
- **Database**
  - Create indexes on frequently queried fields (e.g., `category`, `createdAt`).
  - Paginate product lists if dataset grows.

---

## Testing Strategy (suggested)

- **Unit**: Controllers/services logic (use Jest/Vitest).
- **Integration**: Express endpoints with supertest against a test MongoDB.
- **E2E**: Cypress/Playwright hitting deployed staging (optional).
- **Contracts**: Define response shapes and validate in tests to avoid regressions.

---

## Troubleshooting

- **CORS errors**: Ensure `allowedOrigins` includes the frontend domain and `credentials: true` matches client config.
- **Stripe webhook 400/401**: Confirm `express.raw` is registered **before** JSON parser for `/stripe`, and `STRIPE_WEBHOOK_SECRET` is set.
- **Mongo connection fails**: Check `MONGODB_URI`, network allowlist (Atlas IP access), and VPC routing if self-hosted.
- **Cloudinary upload fails**: Verify credentials and ensure temp file path exists for Multer.
- **JWT invalid**: Check token expiry and that client sends `Authorization: Bearer <token>` or cookies with proper domain/secure flags.
- **Images missing in prod**: Ensure Cloudinary URLs are stored and rendered; if using local file paths in dev, switch to Cloudinary for production.

---

## Maintenance Runbooks

- **Rotate secrets**: Update `.env` (local) and AWS Parameter Store/Secrets Manager, restart services.
- **DB migrations**: For schema changes, update Mongoose models and run one-time scripts if data backfill is needed.
- **Log inspection**: For EC2/PM2, check `pm2 logs`; for ECS, check CloudWatch logs; for Beanstalk, use log streaming.
- **Scaling**:
  - Frontend: CloudFront scales automatically.
  - Backend: Increase ECS tasks/Beanstalk instances/EC2 ASG size; ensure Mongo tier can handle load.
- **Backups**: Confirm MongoDB backup policy; periodically test restore.

---

## AWS Deployment Playbook (detailed)

### Option A: S3 + CloudFront (frontend) & EC2 (backend)

1. **Frontend**
   - Build: `cd client && npm run build`
   - Upload `client/dist` to an S3 bucket configured for static hosting (or origin-only).
   - Create CloudFront distribution pointing to the S3 origin; set default root object to `index.html`.
   - Add behaviors to serve SPA (custom error response 404 → `/index.html`).
2. **Backend**
   - Provision an EC2 instance (Amazon Linux 2023), install Node.js.
   - Pull code or deploy artifact; set environment variables.
   - Run with PM2 or systemd: `pm2 start server.js --name greencart-api`.
   - Open security group for HTTPS via ALB or directly (recommend ALB).
3. **Networking / TLS**
   - Create an ALB with target group pointing to EC2 on port `PORT` (4000 default).
   - Attach ACM certificate to ALB listener (443).
   - Point your domain (Route 53) `api.example.com` → ALB.
4. **MongoDB**
   - Use MongoDB Atlas (recommended) or self-hosted on a managed instance; allow inbound from your VPC/EC2 IPs.
5. **Stripe webhook**
   - Expose `https://api.example.com/stripe`; set webhook endpoint in Stripe dashboard with signing secret.

### Option B: S3 + CloudFront (frontend) & Elastic Beanstalk (backend)

1. Package `server` directory (or Docker) and deploy to Beanstalk Node.js platform.
2. Set env vars in EB console (MONGODB_URI, JWT_SECRET, Stripe, Cloudinary).
3. EB auto-manages load balancer and scaling; attach ACM cert via EB/ALB.
4. Update CORS allowed origins to your CloudFront domain.

### Option C: S3 + CloudFront (frontend) & ECS Fargate (backend)

1. Containerize server with a `Dockerfile`.
2. Push image to ECR.
3. Create ECS service (Fargate) with ALB; set env vars via task definition + Secrets Manager.
4. Configure autoscaling policies and logs to CloudWatch.

---

## Docker (optional)

Example `Dockerfile` (server):

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY server/package*.json ./
RUN npm ci --omit=dev
COPY server/. .
EXPOSE 4000
CMD ["node", "server.js"]
```

Example build & run:

```bash
docker build -t greencart-api -f Dockerfile .
docker run -p 4000:4000 --env-file server/.env greencart-api
```

---

## Environment Matrix (suggested)

| Var | Dev | Staging | Prod |
| --- | --- | --- | --- |
| PORT | 4000 | 4000 | 4000/80/443 (behind LB) |
| MONGODB_URI | local/Atlas dev | Atlas staging | Atlas prod |
| JWT_SECRET | local secret | staging secret | prod secret |
| STRIPE_SECRET_KEY | test key | test key | live key |
| STRIPE_WEBHOOK_SECRET | test webhook | staging webhook | live webhook |
| CLOUDINARY_* | dev creds | staging creds | prod creds |
| VITE_API_BASE_URL | http://localhost:4000 | https://api-stg.example.com | https://api.example.com |

---

## Content & Asset Notes

- All product imagery currently lives under `client/src/assets/`.
- When adding new marketing images, prefer optimized PNG/SVG/WebP and keep sizes small to improve LCP/CLS.
- If you host assets on Cloudinary or S3, update component imports/URLs accordingly.

---

## Roadmap & Backlog (example)

- [ ] Add refresh tokens and rolling JWT strategy
- [ ] Add password reset (email OTP)
- [ ] Add SSR/SEO variant or prerender for product pages
- [ ] Add pagination and search for product catalog
- [ ] Add wishlist/favorites
- [ ] Add inventory alerts (low-stock notifications)
- [ ] Add role-based admin dashboard
- [ ] Add unit/integration test coverage
- [ ] Add observability (OpenTelemetry traces, metrics)
- [ ] Add rate limiting and WAF rules

---

## Changelog Template

```
## [1.0.0] - 2025-01-21
### Added
- Initial release

### Changed
- n/a

### Fixed
- n/a
```

---

## FAQ

- **Why Vite?** Fast HMR and optimal production bundles.
- **Why Cloudinary?** Offloads image storage/transforms/CDN.
- **Can I self-host Mongo?** Yes, but Atlas is simpler for backups and scaling.
- **Can I deploy backend on Lambda?** Possible with API Gateway + Mongo Atlas, but consider cold starts and connection pooling (use MongoDB Data API or connection managers).

---

## Credits

- UI assets in `client/src/assets`
- Built with React, Express, MongoDB, Stripe, Cloudinary

---

*End of README.*

