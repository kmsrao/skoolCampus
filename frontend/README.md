# SkoolCampus - Angular Frontend

Modern, responsive Angular frontend for SkoolCampus with PrimeNG UI components.

## 🚀 Features

- ✅ Angular 17+ with Standalone Components
- ✅ PrimeNG UI Component Library
- ✅ JWT Authentication with Auto-refresh
- ✅ Role-based Routing & Guards
- ✅ Reactive Forms with Validation
- ✅ HTTP Interceptors
- ✅ Signal-based State Management
- ✅ Responsive Dashboard with Charts
- ✅ TypeScript Strict Mode
- ✅ Lazy Loading Modules

## 📋 Prerequisites

- Node.js >= 18.x
- npm or yarn
- Backend API running (see nestjs-backend folder)

## 🔧 Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Configure environment:**

Edit `src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
};
```

## 🎯 Running the Application

**Development mode:**
```bash
npm start
```

The application will open at `http://localhost:4200`

**Production build:**
```bash
npm run build
```

Build artifacts will be in the `dist/` directory.

## 📱 Features by Module

### Authentication Module
- **Login** - Email/password authentication
- **Forgot Password** - Request password reset link
- **Reset Password** - Set new password with token
- **Auto Logout** - On 401 responses

### Dashboard Module
- **Admin Dashboard**
  - Total students, staff, admissions, vouchers
  - Students by class (pie chart)
  - Income vs expense (doughnut chart)
  - 7-day attendance trend (line chart)

- **Student Dashboard**
  - Enrollment information
  - Attendance summary (present/absent/late)
  - Fee summary

- **Parent Dashboard**
  - Children list with enrollment details

### User Profile
- View profile
- Update profile information
- Change password

## 🔐 User Roles

The system supports multiple user roles:

1. **Superadmin** (1) - Full system access
2. **Admin** (2) - Branch management
3. **Teacher** (3) - Teaching functions
4. **Accountant** (4) - Financial management
5. **Librarian** (5) - Library management
6. **Parent** (6) - View children information
7. **Student** (7) - View own information

## 📁 Project Structure

```
src/
├── app/
│   ├── core/
│   │   ├── guards/          # Route guards
│   │   ├── interceptors/    # HTTP interceptors
│   │   ├── models/          # TypeScript interfaces
│   │   └── services/        # Core services
│   ├── features/
│   │   ├── auth/           # Authentication module
│   │   └── dashboard/      # Dashboard module
│   ├── app.component.ts
│   ├── app.config.ts
│   └── app.routes.ts
├── environments/
└── styles.scss
```

## 🎨 UI Components

Using **PrimeNG** component library:
- Cards
- Buttons
- Forms (Input, Password, Select)
- Tables
- Charts (Chart.js integration)
- Messages & Toasts
- Skeletons (loading states)

## 🔄 State Management

Using Angular Signals for reactive state:
- `isAuthenticated` signal in AuthService
- Component-level signals for local state
- RxJS for async operations

## 🛡️ Security Features

- JWT token storage in localStorage
- HTTP interceptor adds Authorization header
- Auto logout on 401 responses
- Route guards prevent unauthorized access
- Role-based guards for specific routes

## 📊 Charts Integration

Dashboard charts using PrimeNG Chart component (Chart.js):
- Pie charts for distribution
- Doughnut charts for comparisons
- Line charts for trends
- Bar charts for statistics

## 🌐 API Integration

All API calls go through services:
- `AuthService` - Authentication endpoints
- `DashboardService` - Dashboard data
- `UsersService` - User profile management

Base URL configured in environment files.

## 🧪 Testing

```bash
# Unit tests
npm test

# E2E tests
npm run e2e

# Code coverage
npm run test:coverage
```

## 📝 License

Reserved SkoolCampus Team
