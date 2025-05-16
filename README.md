# Zayrah

Zayrah is a modern e-commerce platform built with Next.js, Prisma, and Tailwind CSS. It provides a seamless shopping experience for users and includes features for both customers and administrators.

## Features

### User Features
- **Authentication**: Secure login and registration using NextAuth.js.
- **Shopping Cart**: Add, update, and remove items from the cart.
- **Checkout Process**: Includes shipping address, payment method selection, and order placement.
- **Order Management**: View order details and track order status.
- **Profile Management**: Update user profile information.

### Admin Features
- **Dashboard**: Overview of sales, revenue, and user statistics.
- **Product Management**: Create, update, and delete products.
- **Order Management**: View and manage customer orders.
- **User Management**: Manage registered users.

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Next.js API routes, Prisma ORM
- **Database**: PostgreSQL (via Prisma)
- **Authentication**: NextAuth.js
- **Payment Integration**: PayPal

## Folder Structure

```
app/
  (auth)/
    layout.tsx
    sign-in/
      page.tsx
    sign-up/
      page.tsx
  (root)/
    layout.tsx
    page.tsx
    cart/
      cart-table.tsx
      page.tsx
    order/
      [id]/
    payment-method/
      page.tsx
      PaymentMethodForm.tsx
    place-order/
      page.tsx
      place-order-form.tsx
    product/
      [slug]/
    shipping-address/
      page.tsx
  admin/
    layout.tsx
    main-nav.tsx
    orders/
      page.tsx
    overview/
      charts.tsx
      page.tsx
    products/
      page.tsx
      [id]/
      create/
    users/
      page.tsx
api/
  auth/
    [...nextauth]/
    config/
components/
  shared/
    delete-dialogue.tsx
    pagination.tsx
  ui/
    alert-dialog.tsx
    button.tsx
    card.tsx
    table.tsx
    toast.tsx
    toaster.tsx
lib/
  auth-guard.ts
  paypal.ts
  utils.ts
  actions/
    auth.actions.ts
    cart.actions.ts
    order-actions.ts
    product.actions.ts
    user.actions.ts
prisma/
  schema.prisma
  migrations/
public/
  images/
    banner-1.jpg
    banner-2.jpg
    logo.svg
    promo.jpg
    sample-products/
```

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- PostgreSQL database

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd zayrah
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the following:
   ```env
   DATABASE_URL=your_database_url
   NEXTAUTH_SECRET=your_nextauth_secret
   PAYPAL_CLIENT_ID=your_paypal_client_id
   PAYPAL_CLIENT_SECRET=your_paypal_client_secret
   ```

4. Run database migrations:
   ```bash
   npx prisma migrate dev --name init
   ```

5. Seed the database (optional):
   ```bash
   node db/seed.ts
   ```

6. Start the development server:
   ```bash
   npm run dev
   ```

7. Open your browser and navigate to `http://localhost:3000`.

## Scripts

- `npm run dev`: Start the development server.
- `npm run build`: Build the application for production.
- `npm run start`: Start the production server.
- `npm run lint`: Run ESLint to check for code quality issues.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Prisma](https://www.prisma.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- [PayPal](https://developer.paypal.com/)