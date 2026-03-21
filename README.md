# LuxeCart

Custom ecommerce website built from scratch with Next.js, Prisma, PostgreSQL, Tailwind CSS, JWT auth, and a modular PayHere-first payment layer. This is a self-hostable application, not a Shopify, WooCommerce, or SaaS storefront.

## 1. Architecture

### Recommended stack

- Frontend: Next.js App Router with React 19 server/client components
- Backend: Next.js route handlers for auth, products, cart, checkout, payments, uploads, and admin APIs
- Database: PostgreSQL
- ORM: Prisma
- Authentication: JWT stored in secure HTTP-only cookies
- Styling: Tailwind CSS v4
- File storage: local uploads in `public/uploads` for development, with a clear migration path to S3, Cloudinary, or DigitalOcean Spaces
- Payments: modular provider interface with PayHere implemented first

### Why this stack

- One codebase handles storefront, admin dashboard, and APIs cleanly
- Prisma keeps the data model explicit and easy to evolve
- PostgreSQL is reliable for transactional ecommerce data
- JWT cookies make role-based auth easy to deploy on standard Node hosting
- The payment layer is abstracted so Stripe or PayPal can be added later without rewriting checkout

## 2. Folder structure

```text
custom-ecommerce-payhere/
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── public/
│   └── uploads/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   ├── cart/
│   │   │   ├── categories/
│   │   │   ├── checkout/
│   │   │   ├── customers/
│   │   │   ├── dashboard/
│   │   │   ├── orders/
│   │   │   ├── payments/payhere/
│   │   │   ├── products/
│   │   │   └── upload/
│   │   ├── admin/
│   │   ├── account/
│   │   ├── shop/
│   │   ├── cart/
│   │   ├── checkout/
│   │   ├── login/
│   │   ├── register/
│   │   ├── about/
│   │   ├── contact/
│   │   ├── globals.css
│   │   └── layout.tsx
│   ├── components/
│   │   ├── admin/
│   │   ├── forms/
│   │   ├── layout/
│   │   └── store/
│   ├── lib/
│   │   ├── auth/
│   │   ├── db/
│   │   ├── payments/
│   │   ├── services/
│   │   ├── validations/
│   │   ├── api.ts
│   │   └── utils.ts
│   └── types/
├── middleware.ts
├── .env.example
└── package.json
```

## 3. Database schema

### Core models

- `User`: shared users table with `role` enum for `CUSTOMER` and `ADMIN`
- `Category`: product grouping
- `Product`: product catalog with stock, SEO fields, pricing, publish flags
- `ProductImage`: gallery/image metadata
- `Address`: billing and shipping addresses
- `Cart`: one cart per user
- `CartItem`: items inside the cart
- `Order`: transactional order record with order and payment statuses
- `OrderItem`: immutable order line items
- `Payment`: gateway-specific payment record linked to an order

### Important fields

- Timestamps: `createdAt`, `updatedAt` on all important tables
- Roles: `User.role`
- Stock tracking: `Product.stock`
- Order status: `Order.status`
- Payment status: `Order.paymentStatus`, `Payment.status`
- Gateway data: `Payment.gatewayReference`, `Payment.providerPayload`

See [prisma/schema.prisma](/Users/agrajawijayawardane/Library/Mobile Documents/com~apple~CloudDocs/Codex/custom-ecommerce-payhere/prisma/schema.prisma).

## 4. Authentication and authorization

### Customer flow

1. Register through `/register`
2. Password is hashed with `bcryptjs`
3. JWT is signed and stored in an HTTP-only cookie
4. Customer can access `/account`, `/cart`, and `/checkout`

### Admin flow

1. Admin logs in through `/admin/login`
2. Middleware checks the JWT cookie
3. Admin-only pages under `/admin/*` are protected
4. Admin-only APIs validate `Role.ADMIN`

### Security features included

- Password hashing with bcrypt
- JWT auth with HTTP-only cookies
- Role-based route protection in middleware
- Zod validation on auth, catalog, and checkout payloads
- Basic in-memory rate limiting for login and registration
- PayHere callback validation with merchant-secret hash verification

## 5. Backend API routes

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

### Catalog

- `GET /api/products`
- `POST /api/products`
- `GET /api/products/[productId]`
- `PATCH /api/products/[productId]`
- `DELETE /api/products/[productId]`
- `GET /api/categories`
- `POST /api/categories`
- `PATCH /api/categories/[categoryId]`
- `DELETE /api/categories/[categoryId]`

### Cart and checkout

- `GET /api/cart`
- `POST /api/cart/items`
- `PATCH /api/cart/items/[itemId]`
- `DELETE /api/cart/items/[itemId]`
- `POST /api/checkout/place-order`

### Orders, customers, analytics

- `GET /api/orders`
- `GET /api/orders/[orderId]`
- `PATCH /api/orders/[orderId]`
- `GET /api/customers`
- `GET /api/customers/[customerId]`
- `GET /api/dashboard/summary`

### Payments and uploads

- `POST /api/payments/payhere/initiate`
- `POST /api/payments/payhere/notify`
- `GET /api/payments/payhere/return`
- `GET /api/payments/payhere/cancel`
- `POST /api/upload/image`

## 6. Frontend pages

### Storefront

- `/`
- `/shop`
- `/shop/[slug]`
- `/cart`
- `/checkout`
- `/account`
- `/account/orders`
- `/account/profile`
- `/about`
- `/contact`
- `/login`
- `/register`

### Admin dashboard

- `/admin`
- `/admin/login`
- `/admin/products`
- `/admin/products/new`
- `/admin/products/[productId]`
- `/admin/orders`
- `/admin/orders/[orderId]`
- `/admin/customers`
- `/admin/categories`
- `/admin/analytics`

## 7. PayHere integration structure

### Current implementation

- Provider contract: [src/lib/payments/provider.ts](/Users/agrajawijayawardane/Library/Mobile Documents/com~apple~CloudDocs/Codex/custom-ecommerce-payhere/src/lib/payments/provider.ts)
- PayHere provider: [src/lib/payments/payhere.ts](/Users/agrajawijayawardane/Library/Mobile Documents/com~apple~CloudDocs/Codex/custom-ecommerce-payhere/src/lib/payments/payhere.ts)
- Checkout initiation route creates a PayHere-ready POST payload
- Notify route validates the callback signature and updates `Order` and `Payment`

### How to add Stripe or PayPal later

1. Create a new provider implementing the same `PaymentProvider` interface
2. Update `getPaymentProvider()` in `src/lib/payments/index.ts`
3. Add provider-specific initiation and webhook routes
4. Keep order creation logic unchanged

## 8. Local development setup

### Requirements

- Node.js 20+ recommended
- PostgreSQL running locally or remotely

### Install

```bash
npm install
cp .env.example .env
```

### Configure database and generate Prisma client

```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

### Start the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## 9. Environment variables

Required values are listed in [.env.example](/Users/agrajawijayawardane/Library/Mobile Documents/com~apple~CloudDocs/Codex/custom-ecommerce-payhere/.env.example):

- `DATABASE_URL`
- `JWT_SECRET`
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_CURRENCY`
- `NEXT_PUBLIC_STORE_NAME`
- `PAYHERE_MERCHANT_ID`
- `PAYHERE_MERCHANT_SECRET`
- `PAYHERE_SANDBOX`
- `PAYHERE_RETURN_URL`
- `PAYHERE_CANCEL_URL`
- `PAYHERE_NOTIFY_URL`

## 10. Development admin credentials

After running `npm run prisma:seed`:

- Email: `admin@luxecart.local`
- Password: `Admin@12345`

Change this immediately outside development.

## 11. Deployment strategy

### Recommended

- App server: Vercel, Railway, Render, or DigitalOcean App Platform
- Database: Railway Postgres, Neon, Supabase Postgres, or managed DigitalOcean Postgres
- Assets: start with local uploads, move to S3/Cloudinary/Spaces for production-scale durability

### Simple production path

1. Provision PostgreSQL
2. Set all environment variables in the host
3. Run Prisma migrations in the deployment pipeline
4. Deploy the Next.js app
5. Point PayHere return/cancel/notify URLs to your production domain

## 12. Connecting live PayHere credentials

When moving from sandbox to live:

1. Replace `PAYHERE_MERCHANT_ID` with your live merchant ID
2. Replace `PAYHERE_MERCHANT_SECRET` with your live secret
3. Set `PAYHERE_SANDBOX="false"`
4. Update `PAYHERE_RETURN_URL`, `PAYHERE_CANCEL_URL`, and `PAYHERE_NOTIFY_URL` to your live domain
5. Confirm PayHere is configured to send server notifications to `/api/payments/payhere/notify`

## 13. Notes and expansion path

- Local uploads are production-shaped but should move to object storage before heavy traffic
- Guest checkout is not included in this starter; current flow expects customer login before cart and checkout
- CSRF mitigation can be strengthened further with same-site strategy plus dedicated anti-CSRF tokens for high-risk mutations
- Shipping, taxes, coupons, variants, and email notifications are good next additions

## 14. Verification completed

- `npm run lint`
- `npm run build`
