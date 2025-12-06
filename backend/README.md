# SkoolCampus - NestJS Backend

Complete REST API backend for SkoolCampus built with NestJS and Prisma ORM.

## 🚀 Features

- ✅ JWT Authentication with Passport
- ✅ Role-based Access Control (RBAC)
- ✅ Multi-tenant/Multi-branch Support
- ✅ Password Reset with Email
- ✅ Role-specific Dashboards
- ✅ Login Activity Tracking
- ✅ Prisma ORM with MySQL
- ✅ Swagger API Documentation
- ✅ Global Exception Handling
- ✅ Request Validation

## 📋 Prerequisites

- Node.js >= 18.x
- MySQL >= 8.0
- npm or yarn

## 🔧 Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Configure environment:**
```bash
cp .env.example .env
```

Edit `.env` file with your configuration:
```env
DATABASE_URL="mysql://username:password@localhost:3306/database_name"
JWT_SECRET="your-secret-key"
JWT_EXPIRATION="7d"
PORT=3000
```

3. **Generate Prisma Client:**
```bash
npm run prisma:generate
```

4. **Run migrations** (optional - use existing database):
```bash
npm run prisma:migrate
```

Or **pull schema from existing database:**
```bash
npx prisma db pull
npx prisma generate
```

## 🎯 Running the Application

**Development mode:**
```bash
npm run start:dev
```

**Production mode:**
```bash
npm run build
npm run start:prod
```

The API will be available at:
- API: `http://localhost:3000/api`
- Swagger Docs: `http://localhost:3000/api/docs`

## 📚 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token
- `GET /api/auth/me` - Get current user

### Dashboard
- `GET /api/dashboard` - Get role-specific dashboard
- `GET /api/dashboard/admin?branchId=1` - Admin dashboard
- `GET /api/dashboard/student?studentId=1` - Student dashboard
- `GET /api/dashboard/parent` - Parent dashboard

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `POST /api/users/change-password` - Change password

## 🔐 User Roles

1. **Superadmin** (role: 1) - Full system access
2. **Admin** (role: 2) - Branch admin
3. **Teacher** (role: 3) - Teaching staff
4. **Accountant** (role: 4) - Finance management
5. **Librarian** (role: 5) - Library management
6. **Parent** (role: 6) - Parent access
7. **Student** (role: 7) - Student access

## 🗄️ Database Schema

The Prisma schema retains your existing CodeIgniter database structure:
- `login_credential` - Authentication
- `branch` - Schools/Branches
- `staff` - Staff members
- `student` - Students
- `parent` - Parents
- `enroll` - Student enrollments
- `class` - Classes
- `section` - Sections
- And more...

## 📊 Prisma Commands

```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Open Prisma Studio
npm run prisma:studio

# Pull schema from existing DB
npx prisma db pull
```

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 📦 Project Structure

```
src/
├── common/
│   ├── decorators/       # Custom decorators
│   ├── filters/          # Exception filters
│   └── guards/           # Auth guards
├── modules/
│   ├── auth/            # Authentication module
│   ├── dashboard/       # Dashboard module
│   └── users/           # Users module
├── prisma/              # Prisma service
├── app.module.ts
└── main.ts
```

## 🔄 Migration from CodeIgniter

This backend maintains compatibility with your existing database structure while providing:
- Modern TypeScript codebase
- Type-safe database queries with Prisma
- RESTful API design
- Better error handling
- API documentation
- Enhanced security

## 📝 License

Reserved SkoolCampus Team
