# Best4U — User Guide

This guide covers every user type and every feature, written as a real-world walkthrough rather than a feature list. Read the section for the role you want to test first.

---

## Getting started — before anything else

### First-time setup (one-time only)

1. Start the backend: `./mvnw spring-boot:run` from `best4u-backend/`
2. Start the frontend: `ng serve` from the Angular project root
3. Open `http://localhost:4200`
4. The backend seeds itself on first run:
   - **16 products** across Electronics, Home, Clothing, and Grocery (all approved, visible immediately)
   - **One admin account**: `admin@best4u.local` / `ChangeThisPassword123!`
   - If categories already exist in the database the seeder skips — so if you see no products, `DROP TABLE product, category CASCADE;` in Postgres and restart the backend

---

## User type 1 — Guest (not logged in)

### What a guest can do

- Browse all approved products at `/shop`
- Filter by category (Electronics, Home, Clothing, Grocery) using the pill tabs
- Search for products using the search bar in the header — try "earbuds" or "bedsheet"
- View a product detail page — see images, description, price, stock status, EMI breakdown, and reviews
- Use every Utilities tool (Tools, Money, Work, Docs, Code) without an account
- Plan trips in Travel without an account (though data won't persist between sessions without login)

### What a guest cannot do

- Add to cart (clicking "Add to cart" opens the sign-in modal)
- Check out or view orders
- Submit a review
- Apply to be a seller

---

## User type 2 — Normal user (registered, no seller access)

### Creating an account

1. Click **Sign in** in the top-right header
2. Click **Create account** inside the modal
3. Fill in: first name, last name, email, password (8+ characters), optional mobile
4. Click **Create account** — you're logged in immediately, no email verification step

### Shopping flow

**Browse → Cart → Checkout → Orders**

1. **Browse**: Go to `/shop` or click Products in the home page grid. Use category pills to filter. Use the search bar to find a specific product.
2. **Product detail**: Click any product card. You'll see the full image gallery (click thumbnails or use arrows), price, stock status, EMI breakdown, description, and reviews.
3. **Add to cart**: Choose a quantity, click **Add to cart**. A toast notification confirms it. The cart icon in the header updates immediately with the new count.
4. **Cart**: Click the cart icon or navigate to `/shop/cart`. You can change quantities (type in the field, press Tab/Enter), remove items (✕ button), or clear the whole cart.
5. **Checkout**: Click **Proceed to checkout**. The backend creates a Razorpay order. The Razorpay payment widget opens automatically.
   - **Test card**: `4111 1111 1111 1111`, any future expiry, any CVV, any name
   - **UPI test**: Use Razorpay's test UPI `success@razorpay`
   - After payment, you're redirected to Orders
6. **Orders**: Navigate to `/shop/orders` or use the account menu. Each order shows its status (`PENDING → PAID → SHIPPED → DELIVERED`), a visual progress tracker, the items you ordered with images, and the total.

### Reviewing a product

You can only review a product from an order that has been marked **DELIVERED** by an admin. Once that happens:

1. Go to the product detail page for an item from your delivered order
2. The review form appears below the product details
3. Click the stars to set your rating (1–5)
4. Add an optional comment
5. Click **Submit review**

The review appears immediately in the list below. Your name shows as "Firstname L." (first name + last initial).

### Utility tools (no login required, but works while logged in too)

- **Tools** (`/tools`): Basic calculator
- **Money** (`/money`): EMI, SIP, PPF, SWP, RD, FD calculators. The EMI calculator uses the same formula shown on product detail pages.
- **Work** (`/work`): Todos (add, tick off, clear completed), Notes (write/edit/delete), Habits (track daily streaks) — all synced to your account
- **Docs** (`/docs`): PDF merge, split, compress; image convert/resize — all processed in-browser, nothing stored
- **Code** (`/code`): JSON formatter, JWT decoder, Base64, UUID generator, Hash generator, Timestamp converter, Regex tester, URL encoder, Case converter, Color converter

### Travel planning

1. Go to `/travel`
2. Create a new trip — name it, add destination, dates, currency
3. Open the trip to access four tabs:
   - **Itinerary**: Add items by day and time ("Day 1, 9:00 AM — Check in")
   - **Packing**: Checklist items, toggle packed/unpacked
   - **Budget**: Track expenses by category (Flights, Hotel, Food...) with amounts
   - **Notes**: Free-form notes about the trip

All travel data is private to your account.

### Profile

Navigate to `/profile` (account menu → Profile):
- View your name, email, mobile number, roles, and seller status
- Click **Edit profile** to update your name or mobile number
- If `sellerStatus` is `NONE`, a link to apply as a seller is shown

### Notifications

The bell icon (🔔) in the header shows a red badge when you have unread notifications. Click it to see:
- Order status updates ("Your order #5 has been shipped!")
- Seller approval ("Your seller application has been approved!")
- Review confirmations

Notifications are marked as read automatically when you open the panel.

---

## User type 3 — Seller (approved by admin)

### Applying to become a seller

1. Click your name in the header → **Become a seller** → navigates to `/sell`
2. The page shows a hero and benefits section. Click **Apply to become a seller**
3. Fill in the multi-step form:
   - **Shop details**: Shop name (this is what shoppers see as "Sold by ___"), business type, primary category
   - **Contact**: Business phone (required), address, GST number
   - **Payout**: Bank account name, account number, IFSC code, UPI ID (all optional now, required before first payout)
   - **About you**: Why you want to sell on Best4U (required)
4. Click **Submit application**
5. The page shows "Application received!" and your account menu updates to show "Seller application pending"

### After admin approval

Once an admin approves your application:
- You receive a notification: "Your seller application has been approved!"
- Your account menu changes — "Become a seller" is replaced with **"Sell a product"** and **"My listings"**
- The `SELLER` role is added to your account

### Listing a product

1. Account menu → **Sell a product** (or `/shop/sell`)
2. Fill in:
   - Product name, description
   - Price (₹), stock quantity
   - Category (select from the dropdown)
   - Images: click the dropzone or drag files in. You can add as many images as needed. Each shows a preview thumbnail with a ✕ remove button. The first image becomes the thumbnail shown in the catalog.
3. Click **Submit for review**
4. You see a "Product submitted for review" confirmation

The product is now `PENDING_REVIEW` — it is **not** visible in the public catalog until an admin approves it.

### Viewing your listings

Account menu → **My listings** (or `/shop/my-listings`):
- Sees all your products with their current status:
  - `PENDING_REVIEW` — submitted, awaiting admin review
  - `APPROVED` — live in the catalog, shoppers can see and buy it
  - `REJECTED` — not approved, needs changes before resubmitting

### Editing a listing

Via `PATCH /products/{id}` (no dedicated UI page yet — this is on the roadmap):
- **Price and stock**: update freely, takes effect immediately without re-review
- **Name and description**: triggers re-review (the listing goes back to `PENDING_REVIEW`)

---

## User type 4 — Admin

### Logging in as admin

The admin uses the same sign-in modal as everyone else. After a successful login:
- If your account has `ROLE_ADMIN`, you're redirected to `/admin` automatically
- The account menu shows **Admin portal** as a link

Default admin credentials (set in `application.properties`):
- Email: `admin@best4u.local`
- Password: `ChangeThisPassword123!`

### Admin portal — three tabs

Navigate to `/admin` to access the portal.

---

#### Tab 1: Seller applications

Shows all users whose `sellerStatus` is `PENDING`. Each card shows:
- Shop name and business type
- Applicant name and email
- Primary category, business phone, GST number
- Why they want to sell

**Approve**: grants `ROLE_SELLER`, sets `sellerStatus = APPROVED`, fires a notification to the applicant.

**Reject**: sets `sellerStatus = REJECTED`. The applicant sees "Application rejected" in their account menu and on `/sell`.

---

#### Tab 2: Product listings

Shows all products with `status = PENDING_REVIEW`. Each card shows:
- Product image (first uploaded image)
- Product name, price, stock
- Description

**Approve**: sets `status = APPROVED`. The product immediately appears in the public catalog at `/shop`.

**Reject**: sets `status = REJECTED`. The seller sees this in My Listings.

---

#### Tab 3: Orders

Shows recent orders across all users (currently fetches the authenticated user's orders — a full admin order view is a noted roadmap item). For each order:

**Mark shipped**: only available when status is `PAID`. Moves order to `SHIPPED`. Fires a notification to the buyer: "Your order #X has been shipped!"

**Mark delivered**: only available when status is `SHIPPED`. Moves order to `DELIVERED`. Fires a notification to the buyer: "Your order #X has been delivered!" This also unlocks the buyer's ability to leave a review for any product in that order.

---

## Common flows across user types

### The abandoned order / failed payment

If a user opens the Razorpay widget and closes it without paying, the order stays `PENDING`. A background job runs every 10 minutes and cancels any order that has been `PENDING` for more than 30 minutes, restocking the items automatically. No user action required.

### Search

The search bar in the header is visible on all pages **except** Utilities sections (Tools, Money, Work, Docs, Code) — searching for products has no meaning on those pages, so the bar hides.

Type a product name and results appear after 300ms (debounced). Press Enter or click "See all results for..." to navigate to the full filtered catalog at `/shop?search=query`. Click any result directly to jump to that product's detail page. Click ✕ to clear.

### Cart badge

The cart icon in the header shows a count badge whenever the cart has items. It disappears entirely when the cart is empty — not "shows 0," literally not rendered. This keeps the header clean for users who are only using Utilities tools and never visit Shop.

### Notifications

The 🔔 bell in the header only appears when logged in. The red badge shows the unread count. Opening the panel loads and marks all notifications as read in one call.

---

## Known limitations (intentional, not bugs)

| Area | Limitation |
|---|---|
| Seller product editing | No UI page yet — editing requires a direct API call (`PATCH /products/{id}`) |
| Admin order view | Only shows the logged-in admin's own orders, not all users' orders |
| Razorpay live mode | The app is configured with **test** keys — real money cannot be charged without switching to live keys in `application.properties` |
| Email notifications | In-app notifications exist; email notifications (Sendgrid/SES) are not yet configured |
| Image storage | Uploaded images are stored on local disk — they will not survive a fresh deployment. Swap `LocalImageStorageService` for a Cloudinary/S3 implementation before going live |
| Password reset | No "forgot password" flow yet |
| Multiple admin accounts | Only the seeded `admin@best4u.local` exists by default. A new admin must be created directly in the database or via a future admin-creation endpoint |
| Universal search | Search only covers product name/description. Searching for a trip name, a work note, or a tool navigates to products — a universal search/command palette is a planned future feature |

---

## Quick reference — who can access what

| Route | Guest | User | Seller | Admin |
|---|---|---|---|---|
| `/` (Home) | ✓ | ✓ | ✓ | ✓ |
| `/shop` | ✓ | ✓ | ✓ | ✓ |
| `/shop/products/:id` | ✓ | ✓ | ✓ | ✓ |
| `/shop/cart` | ✗ | ✓ | ✓ | ✓ |
| `/shop/checkout` | ✗ | ✓ | ✗* | ✓ |
| `/shop/orders` | ✗ | ✓ | ✗* | ✓ |
| `/shop/sell` | ✗ | ✗ | ✓ | ✓ |
| `/shop/my-listings` | ✗ | ✗ | ✓ | ✓ |
| `/sell` | ✓ | ✓ | ✓† | ✓ |
| `/profile` | ✗ | ✓ | ✓ | ✓ |
| `/admin` | ✗ | ✗ | ✗ | ✓ |
| `/tools`, `/money`, `/work`, `/docs`, `/code` | ✓ | ✓ | ✓ | ✓ |
| `/travel` | ✓ | ✓ | ✓ | ✓ |

*A seller cannot checkout or view shopper orders from their seller account — seller and buyer are intentionally separate roles under the current model. If you need both (shop and sell with the same account), this is a data model trade-off discussed in the architecture doc.

†A seller who visits `/sell` sees "You're an approved seller!" with links to their dashboard, rather than the application form.
