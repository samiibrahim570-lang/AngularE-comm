# E-Commerce Website - Angular 16

A complete professional e-commerce website built with Angular 16, featuring a modern and responsive design using Tailwind CSS, Bootstrap, and NG-ZORRO (Ant Design for Angular).

## Features

### 1. **Authentication System**
- User registration (Signup) with email, phone, WhatsApp, and address
- User login with JWT token authentication
- Secure password hashing (configured on backend)
- Persistent session management using localStorage
- Auto-redirect based on authentication status

### 2. **Product Management**
- Product listing with filtering and sorting
- Product details page with image gallery
- Search functionality
- Category filtering
- Price sorting (low to high, high to low)
- Responsive product grid layout

### 3. **Shopping Cart**
- Add products to cart
- Update product quantities
- Remove items from cart
- Clear entire cart
- Real-time cart total calculation
- Tax calculation (10%)
- Free shipping on orders over $50
- Order summary

### 4. **User Profile**
- View user information
- Edit profile details
- Update contact information
- Change address
- Preference settings

### 5. **Responsive Design**
- Mobile-first responsive design
- Works perfectly on mobile, tablet, and desktop
- Adaptive navigation menu
- Optimized for all screen sizes

## Installation & Setup

### 1. **Prerequisites**
- Node.js 16 or higher
- npm 8 or higher
- Angular CLI 16

### 2. **Install Dependencies**
```bash
npm install
npm install ng-zorro-antd@16 bootstrap axios --save --legacy-peer-deps
npm install -D tailwindcss postcss autoprefixer
```

### 3. **Environment Configuration**
Update `src/environments/environment.ts` with your backend API base URL:

```typescript
export const environment = {
  production: false,
  apiBaseUrl: ''https://online-store147.runasp.net/api''
};
```

### 4. **Run Development Server**
```bash
npm start
```
Navigate to `http://localhost:4200/`

### 5. **Build for Production**
```bash
npm run build
```

## Technologies Used

### Frontend Framework
- **Angular 16**: Modern web framework
- **TypeScript 5.1**: Typed JavaScript

### UI Frameworks
- **Tailwind CSS**: Utility-first CSS framework
- **Bootstrap 5**: Responsive CSS framework
- **NG-ZORRO**: Enterprise Angular components

### HTTP Client
- **Axios**: Promise-based HTTP client

## API Endpoints

Base URL: `https://online-store147.runasp.net/api`

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `PATCH /auth/update-profile/{id}` - Update profile

### Products
- `GET /products` - Get all products
- `GET /products/{id}` - Get product details
- `POST /products` - Create product
- `PUT /products/{id}` - Update product
- `DELETE /products/{id}` - Delete product

### Cart
- `GET /cart/{userId}` - Get cart
- `POST /cart` - Add to cart
- `PUT /cart/{id}` - Update cart item
- `DELETE /cart/{id}` - Remove from cart

## Project Structure

```
src/app/
├── core/
│   ├── services/ (auth.service, product.service, cart.service)
│   └── interceptors/ (auth.interceptor, auth.guard)
├── layouts/
│   ├── auth-layout/
│   └── main-layout/
├── features/
│   ├── auth/ (login, signup)
│   ├── home/
│   ├── products/ (listing, details)
│   ├── cart/
│   └── profile/
└── app-routing.module.ts
```

## Features Implemented

✅ User Authentication (Login/Signup)
✅ Product Listing with Filters & Sorting
✅ Product Details with Add to Cart
✅ Shopping Cart Management
✅ User Profile Management
✅ Responsive Mobile Design
✅ Lazy Loading Modules
✅ JWT Token Authentication
✅ Protected Routes with AuthGuard
✅ Tax & Shipping Calculations

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Version

1.0.0 - April 2026

---

**Built with ❤️ using Angular 16, Tailwind CSS, and Bootstrap 5**
