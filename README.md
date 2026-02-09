# WooCommerce Headless E-Commerce Store

[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-blue?logo=github)](https://github.com/asadchaudhary79/nextjs-woocommerce-headless-store)

A modern, high-performance headless e-commerce storefront built with **Next.js 16**, **React 19**, and **Tailwind CSS v4**. Connects to WooCommerce via REST API for a complete shopping experience.

## Features

### Core E-commerce Features
- **Headless Architecture** - Decoupled frontend with WooCommerce backend
- **Server-Side Rendering** - Fast initial page loads with Next.js App Router
- **Product Catalog** - Browse products with categories, filters, search, and pagination
- **Shopping Cart** - Persistent cart with localStorage and Zustand state management
- **Checkout Flow** - Complete order processing through WooCommerce REST API

### User Management
- **User Authentication** - JWT-based login, registration, and password reset
- **Account Management** - Profile updates, address management, and order history
- **Order Tracking** - View order details and status updates

### UI/UX Features
- **Responsive Design** - Mobile-first design that works on all devices
- **Image Optimization** - Automatic image optimization with Next.js Image
- **Smooth Animations** - Framer Motion animations for enhanced user experience
- **Accessible Components** - WCAG compliant UI components

### Technical Features
- **Type Safety** - Full TypeScript implementation with strict type checking
- **Form Validation** - React Hook Form with Zod schema validation
- **State Management** - Zustand for predictable state updates
- **API Error Handling** - Robust error handling with retry logic
- **SEO Optimized** - Server-side rendering and meta tag management

### Pages Included
- **Homepage** - Hero section, featured products, latest arrivals
- **Product Catalog** - Shop page with filtering and search
- **Product Details** - Individual product pages with image galleries
- **Category Pages** - Browse products by category
- **Shopping Cart** - Cart management and checkout
- **User Account** - Login, register, profile, orders, addresses
- **Order Confirmation** - Post-purchase order details

## Tech Stack

| Category         | Technology                  |
| ---------------- | --------------------------- |
| Framework        | Next.js 16.1.6 (App Router) |
| UI Library       | React 19.2.3                |
| Styling          | Tailwind CSS v4             |
| State Management | Zustand 5.0.11              |
| Forms            | React Hook Form + Zod       |
| Animation        | Framer Motion               |
| Icons            | Lucide React                |
| Language         | TypeScript 5 (strict mode)  |

## Prerequisites

Before you begin, ensure you have:

- **Node.js 18+** (recommended: Node.js 20)
- **npm**, **yarn**, **pnpm**, or **bun**
- **WordPress site** with WooCommerce installed and the following plugins:
  - [WooCommerce](https://woocommerce.com/) - Core e-commerce functionality
  - [JWT Authentication for WP REST API](https://wordpress.org/plugins/jwt-authentication-for-wp-rest-api/) - User authentication
  - [WPGraphQL](https://www.wpgraphql.com/) - GraphQL API for content (optional)

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/asadchaudhary79/nextjs-woocommerce-headless-store.git
cd nextjs-woocommerce-headless-store
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Copy the environment file and update with your WooCommerce configuration:

```bash
cp .env .env.local
```

Edit `.env.local` with your WordPress/WooCommerce configuration:

```env
# =================================
# WordPress Configuration
# =================================

# Your WordPress site URL (no trailing slash)
NEXT_PUBLIC_WORDPRESS_URL=https://your-wordpress-site.com

# GraphQL endpoint for content (optional)
NEXT_PUBLIC_GRAPHQL_URL=https://your-wordpress-site.com/graphql

# =================================
# WooCommerce REST API
# =================================

# Consumer Key (starts with ck_) - from WooCommerce > Settings > Advanced > REST API
WC_CONSUMER_KEY=ck_your_consumer_key_here

# Consumer Secret (starts with cs_) - KEEP SECRET, server-side only!
WC_CONSUMER_SECRET=cs_your_consumer_secret_here

# =================================
# JWT Authentication
# =================================

# Must match JWT_AUTH_SECRET_KEY in wp-config.php
JWT_SECRET=your-jwt-secret-key-here

# =================================
# Frontend URLs
# =================================

NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## WooCommerce Setup

### Required Plugins

1. **[WooCommerce](https://woocommerce.com/)** - Core e-commerce functionality
2. **[JWT Authentication for WP REST API](https://wordpress.org/plugins/jwt-authentication-for-wp-rest-api/)** - User authentication
3. **[WPGraphQL](https://www.wpgraphql.com/)** - GraphQL API for content (optional)

### WooCommerce REST API Configuration

1. Go to **WooCommerce > Settings > Advanced > REST API**
2. Click **Add Key**
3. Set **Description** (e.g., "Headless Frontend")
4. Set **User** to an admin user
5. Set **Permissions** to **Read/Write**
6. Click **Generate API Key**
7. Copy the **Consumer Key** and **Consumer Secret** to your `.env.local`

### JWT Authentication Setup

1. Install and activate the [JWT Authentication plugin](https://wordpress.org/plugins/jwt-authentication-for-wp-rest-api/)
2. Add to your `wp-config.php`:

```php
define('JWT_AUTH_SECRET_KEY', 'your-unique-secret-key-here');
define('JWT_AUTH_CORS_ENABLE', true);
```

3. Add to your `.htaccess` (Apache) or nginx config:

```apache
RewriteEngine on
RewriteCond %{HTTP:Authorization} ^(.*)
RewriteRule ^(.*) - [E=HTTP_AUTHORIZATION:%1]
```

### Optional: GraphQL Setup

1. Install and activate [WPGraphQL](https://www.wpgraphql.com/)
2. Install [WPGraphQL WooCommerce](https://wordpress.org/plugins/wp-graphql-woocommerce/) for enhanced product queries
3. Test your GraphQL endpoint at `https://your-site.com/graphql`

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── account/           # User account pages (login, register, profile)
│   ├── api/               # API routes for authentication and orders
│   ├── cart/              # Shopping cart page
│   ├── checkout/          # Checkout process
│   ├── product/           # Individual product pages
│   ├── shop/              # Product catalog and category pages
│   └── order-confirmation/ # Order confirmation pages
├── components/            # Reusable UI components
│   ├── cart/             # Cart-related components
│   ├── home/             # Homepage sections
│   ├── layout/           # Layout components (header, footer)
│   ├── product/          # Product display components
│   ├── shop/             # Shop/filtering components
│   └── ui/               # Basic UI components
├── lib/                  # Utility functions and API clients
│   ├── auth.ts           # Authentication utilities
│   ├── graphql.ts        # GraphQL client (optional)
│   ├── utils.ts          # General utilities
│   └── woocommerce.ts    # WooCommerce REST API client
├── stores/               # Zustand state management
│   ├── auth-store.ts     # Authentication state
│   ├── cart-store.ts     # Shopping cart state
│   └── ui-store.ts       # UI state management
└── types/                # TypeScript type definitions
    └── woocommerce.ts    # WooCommerce API types
```

## Available Scripts

| Command         | Description              |
| --------------- | ------------------------ |
| `npm run dev`   | Start development server |
| `npm run build` | Build for production     |
| `npm run start` | Start production server  |
| `npm run lint`  | Run ESLint               |

## Deployment

### Deploy to Netlify (Recommended)

The easiest way to deploy this Next.js app:

1. Push your code to GitHub
2. Go to [netlify.com](https://netlify.com) and sign in
3. Click **"Add new site"** > **"Import an existing project"**
4. Connect your GitHub repository
5. Configure build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `.next`
6. Add environment variables in **Site settings > Environment variables**
7. Install the **Next.js plugin**:
   - Go to **Plugins** > Search "Next.js" > Install **@netlify/plugin-nextjs**
8. Click **Deploy site**

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/asadchaudhary79/nextjs-woocommerce-headless-store)

**Netlify Environment Variables:**

Add these in **Site settings > Environment variables**:

```
NEXT_PUBLIC_WORDPRESS_URL=https://your-wordpress-site.com
NEXT_PUBLIC_GRAPHQL_URL=https://your-wordpress-site.com/graphql
WC_CONSUMER_KEY=ck_your_consumer_key
WC_CONSUMER_SECRET=cs_your_consumer_secret
JWT_SECRET=your-jwt-secret-key
NEXT_PUBLIC_SITE_URL=https://your-app.netlify.app
```

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and sign in
3. Click **"Add New Project"**
4. Import your repository
5. Configure environment variables (same as above)
6. Click **Deploy**

### Deploy with Docker

Build and run with Docker:

```bash
# Build the image
docker build -t woocommerce-headless .

# Run the container
docker run -p 3000:3000 --env-file .env.local woocommerce-headless
```

Or use Docker Compose:

```bash
docker-compose up
```

### Deploy to Other Platforms

This project outputs a standalone build, making it compatible with:

- **Railway** - Connect repo, add env vars, deploy
- **Render** - Use Docker or Node.js environment
- **DigitalOcean App Platform** - Connect repo, configure env vars
- **AWS Amplify** - Import from Git, add env vars
- **Google Cloud Run** - Use the included Dockerfile

## Configuration

### Image Domains

The `next.config.ts` is already configured to allow images from your WordPress domain. Update the hostname if you're using a different domain:

```typescript
// next.config.ts
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'your-wordpress-site.com',
      port: '',
      pathname: '/wp-content/uploads/**',
    },
  ],
},
```

### CORS Configuration

Ensure your WordPress site allows requests from your frontend domain. Add to `wp-config.php`:

```php
header("Access-Control-Allow-Origin: https://your-frontend-domain.com");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");
```

Or use a CORS plugin like [WP CORS](https://wordpress.org/plugins/wp-cors/).

## Troubleshooting

### Common Issues

**CORS Errors**

- Ensure WordPress allows your frontend origin in `wp-config.php`
- Check JWT plugin CORS settings
- Verify `.htaccess` configuration for Authorization headers
- Add your frontend domain to allowed origins

**401 Unauthorized Errors**

- Verify WooCommerce API credentials are correct
- Check that API keys have Read/Write permissions
- Ensure the user associated with API keys is an admin
- Confirm the API keys are not expired or revoked

**Connection/Network Errors**

- Check that your WordPress site is accessible
- Verify WooCommerce REST API is enabled
- Ensure proper SSL/HTTPS configuration
- Check for firewall or hosting restrictions

**Images Not Loading**

- Add your WordPress domain to `next.config.ts` remote patterns
- Ensure images are publicly accessible in WordPress uploads
- Check that the domain in `next.config.ts` matches your WordPress site

**Authentication Issues**

- Verify JWT secret matches between frontend and WordPress
- Check that JWT plugin is properly configured
- Ensure cookies are enabled in the browser

**Cart Not Working**

- Check browser localStorage is enabled
- Clear localStorage and try again
- Verify Zustand store is properly initialized

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository: https://github.com/asadchaudhary79/nextjs-woocommerce-headless-store
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [GPL 3.0](LICENSE).

## Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework for Production
- [React](https://reactjs.org/) - A JavaScript library for building user interfaces
- [WooCommerce](https://woocommerce.com/) - Open-source e-commerce platform
- [WordPress](https://wordpress.org/) - Content management system
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Zustand](https://github.com/pmndrs/zustand) - Small, fast and scalable state management
- [React Hook Form](https://react-hook-form.com/) - Performant forms with easy validation
- [Lucide React](https://lucide.dev/) - Beautiful & consistent icon toolkit
- [Framer Motion](https://www.framer.com/motion/) - Production-ready motion library
