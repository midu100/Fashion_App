# KAZIR NATION — Server (Express + MongoDB)

Backend for the KAZIR NATION storefront, written to match the **E-commece-FullStack** repo style.

**Conventions**
- Responses: `res.status(code).send({ message, <payload> })` — no `success` wrapper
  (a `utils/responseHandler` with `{ success, message, data }` exists and is used in a few spots).
- Images: **Cloudinary Variant B** — `multer()` memory storage → base64 → store the
  `secure_url` **string**. `uploadToCloudinary(file, folder)` / `deleteToCloudinary(url, folder)`.
- Auth: JWT in cookies **`X_AS-TOKEN`** (access, 1h) + **`R_FS-TOKEN`** (refresh, 15d);
  payload `{ _id, email, role }`. `authMiddleware` reads `X_AS-TOKEN`, sets `req.user = decoded`.
- `roleCheckMiddleware('admin', 'editor')`. Product = **category ref + variants[]**.

## Setup
```bash
cd server
npm install
cp .env.example .env      # fill DB_STRING, JWT_SEC, CLOUDINARY_NAME/API_KEY/API_SEC
npm run seed              # categories + products (needs MongoDB running)
npm start                 # node --watch index.js  →  http://localhost:8000
```

## API — base `http://localhost:8000`

### Auth `/auth`
`POST /signup` · `POST /verify-otp` · `POST /resend-otp` · `POST /signin` (sets cookies, returns `{ message, role }`) ·
`POST /forgot-password` · `PUT /reset-password/:token` · `GET /refresh` ·
`GET /me` (auth) · `PUT /profile` (auth, `avatar`) · `POST /logout` (auth)

### Products `/product`
| Method | Path | Access |
|---|---|---|
| POST | `/product/create` | admin/editor · multipart `thumbnail`(1) + `images`(≤4) |
| GET | `/product/allproducts` | public · `?page&limit&category&search` (aggregation + `$lookup`) |
| GET | `/product/:slug` | public · populates category |
| PUT | `/product/updateproduct/:slug` | admin/editor · multipart |
| DELETE | `/product/deleteproduct/:slug` | admin |

Body for create: `title, slug, description, category(_id), price, discountPercentage, variants(JSON string of [{sku,size,color,stock}]), tags, isActive` + files.

### Categories `/category`
`POST /create` (admin, `thumbnail`) · `GET /allcategories` · `PUT /update/:id` (admin) · `DELETE /delete/:id` (admin)

### Orders `/order`
`POST /place` (guest ok) · `GET /track/:orderNumber` · `GET /my` (auth) · `GET /all` (admin) · `PUT /:id/status` (admin)

### Dashboard `/dashboard`
`GET /overview` (admin) — KPIs, inventory (summed from variant stock), orders-by-status, recent orders, top selling.

### AI Agent `/agent` (scaffold)
`POST /query` (admin) → stub · `GET /suggestions` (admin) → rule-based low-stock alerts.
Wire `utils/agentService.js` `runAgent()` to Claude (`@anthropic-ai/sdk`, `ANTHROPIC_API_KEY`, model `claude-opus-4-8`) to go live.

### Newsletter `/newsletter`
`POST /subscribe`

## Notes
- OTP + reset-password emails use **nodemailer over Gmail** (`utils/emailServices.js` + HTML in
  `utils/templates.js`, `emailTemp` / `resetPassTemp`). Set `EMAIL_USER` and `APP_PASSWORD`
  (a Google **App Password**, 2FA required) in `.env` — otherwise `sendEmail` will throw on send.
- `isVerified` defaults `false`; users must verify OTP before signin (matches the repo).
- Admin routes need a user with `role: 'admin'` — set it in the DB, then sign in.
