# 🚀 SkoolCampus - Quick Start Guide

Get SkoolCampus up and running in 5 minutes!

---

## 📋 Prerequisites

Ensure you have:
- ✅ Node.js 18+ installed
- ✅ MySQL 8+ running
- ✅ npm or yarn installed

---

## ⚡ Quick Setup

### 1️⃣ Backend Setup (2 minutes)

```bash
# Navigate to backend
cd nestjs-backend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
```

**Edit `.env` file:**
```env
DATABASE_URL="mysql://ramom:123456@localhost:3306/ramom"
JWT_SECRET="change-this-to-a-random-secret-key"
JWT_EXPIRATION="7d"
PORT=3000
```

```bash
# Generate Prisma Client
npm run prisma:generate

# Start backend server
npm run start:dev
```

✅ **Backend running:** http://localhost:3000/api
✅ **API Docs:** http://localhost:3000/api/docs

---

### 2️⃣ Frontend Setup (2 minutes)

**Open a new terminal:**

```bash
# Navigate to frontend
cd angular-frontend

# Install dependencies
npm install

# Start frontend server
npm start
```

✅ **Frontend running:** http://localhost:4200

---

### 3️⃣ Login (1 minute)

1. Open browser: **http://localhost:4200**
2. You'll see the SkoolCampus login page
3. Enter credentials from your existing `login_credential` table
4. Click "Sign In"

**Example credentials (if using default data):**
- Email: Your existing admin email
- Password: Your existing admin password

---

## 🎉 You're Ready!

### What You'll See:

**Login Page:**
- Clean, modern design with gradient background
- "SkoolCampus" branding
- Email and password fields
- "Forgot Password?" link

**Dashboard (after login):**
- Welcome message with your name
- Role-specific dashboard
- Stats cards (students, staff, admissions, vouchers)
- Interactive charts
- Responsive mobile design

---

## 🔧 Common Commands

### Backend

```bash
# Development mode (with hot reload)
npm run start:dev

# Production build
npm run build
npm run start:prod

# Open Prisma Studio (database GUI)
npm run prisma:studio

# View API documentation
# Visit: http://localhost:3000/api/docs
```

### Frontend

```bash
# Development mode
npm start

# Production build
npm run build

# Run tests
npm test
```

---

## 🧪 Test the Features

### 1. Authentication
- ✅ Login with email/password
- ✅ Click "Forgot Password?" and enter email
- ✅ Check console for reset link
- ✅ Use link to reset password
- ✅ Login with new password

### 2. Dashboard
- ✅ View stats cards
- ✅ Check charts load correctly
- ✅ Resize browser (test responsive design)

### 3. Profile
- ✅ View your profile details
- ✅ Update profile information
- ✅ Change password

### 4. Logout
- ✅ Click "Logout" button
- ✅ Redirected to login page

---

## 📊 API Endpoints

### Test with curl:

**Login:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123"
  }'
```

**Get Dashboard:**
```bash
curl -X GET http://localhost:3000/api/dashboard \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Full API Docs:**
Visit http://localhost:3000/api/docs

---

## 🐛 Troubleshooting

### Backend won't start

**Error: "Cannot connect to database"**
```bash
# Check MySQL is running
mysql -u ramom -p

# Verify DATABASE_URL in .env
# Make sure database exists
```

**Error: "Prisma Client not generated"**
```bash
npm run prisma:generate
```

### Frontend won't start

**Error: "Port 4200 already in use"**
```bash
# Kill existing process or use different port
ng serve --port 4300
```

**Error: "Cannot GET /"**
```bash
# Make sure you're on http://localhost:4200 (not 3000)
```

### Login fails

**"Invalid credentials"**
- Verify email exists in `login_credential` table
- Check password is correct
- Ensure backend is running
- Check browser console for errors

**"Cannot connect to API"**
- Verify backend is running on port 3000
- Check `environment.ts` has correct apiUrl
- Check browser Network tab for failed requests

---

## 🎨 What's Different from CodeIgniter?

| Feature | CodeIgniter (Old) | SkoolCampus (New) |
|---------|-------------------|-------------------|
| **Login** | Page reload | Smooth transition |
| **Dashboard** | Static page | Dynamic with charts |
| **Auth** | Session-based | JWT token |
| **UI** | Bootstrap + jQuery | PrimeNG + Angular |
| **Speed** | Slower page loads | Instant navigation |
| **Mobile** | Basic responsive | Fully optimized |

---

## 📚 Next Steps

1. **Explore Dashboard:**
   - Check different user roles (admin, student, parent)
   - View charts and statistics
   - Test responsive design on mobile

2. **Check API Docs:**
   - Visit http://localhost:3000/api/docs
   - Try API endpoints with Swagger UI
   - Review request/response schemas

3. **Read Documentation:**
   - [README.md](./README.md) - Full overview
   - [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) - Migration details
   - [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) - Project stats

4. **Plan Next Phase:**
   - Review remaining 79 modules
   - Decide which module to migrate next
   - Set up development workflow

---

## 🎯 Quick Reference

### URLs
- **Frontend:** http://localhost:4200
- **Backend API:** http://localhost:3000/api
- **API Docs:** http://localhost:3000/api/docs
- **Prisma Studio:** Run `npm run prisma:studio`

### Ports
- **Frontend:** 4200
- **Backend:** 3000
- **MySQL:** 3306

### Default Credentials
Use your existing CodeIgniter database credentials.

---

## 💡 Pro Tips

1. **Keep Both Terminals Open:**
   - Terminal 1: Backend (nestjs-backend)
   - Terminal 2: Frontend (angular-frontend)

2. **Use Hot Reload:**
   - Changes auto-refresh - no restart needed
   - Backend: Watch mode enabled
   - Frontend: Angular dev server

3. **Check Logs:**
   - Backend: Terminal running `npm run start:dev`
   - Frontend: Browser console (F12)

4. **Database GUI:**
   - Use `npm run prisma:studio` for visual database editor
   - Or use MySQL Workbench / phpMyAdmin

5. **API Testing:**
   - Use Swagger UI at /api/docs
   - Or use Postman / Insomnia

---

## ✅ Success Checklist

- [ ] Backend running on port 3000
- [ ] Frontend running on port 4200
- [ ] Can access login page
- [ ] Can login with credentials
- [ ] Dashboard loads with data
- [ ] Charts display correctly
- [ ] Logout works
- [ ] Password reset works
- [ ] API docs accessible
- [ ] No console errors

---

## 🎉 Congratulations!

You've successfully set up **SkoolCampus**!

Your modern school management system is now running with:
- ✅ NestJS backend with Prisma ORM
- ✅ Angular frontend with PrimeNG
- ✅ JWT authentication
- ✅ Beautiful, responsive UI
- ✅ Interactive dashboards with charts
- ✅ Your existing database (no migration!)

**Ready to migrate more modules?** Let's continue! 🚀

---

**Need Help?**
- Check [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) for detailed docs
- Review [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) for statistics
- Open an issue if you encounter problems

---

**© 2024 SkoolCampus. All rights reserved.**
