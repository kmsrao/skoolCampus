# 🚀 START HERE - SkoolCampus Quick Launch

Choose your operating system and run the appropriate command:

---

## 🖥️ **Windows Users**

### Option 1: Double-click (Easiest)
1. Double-click `start-skoolcampus.bat`
2. Wait for both servers to start
3. Browser will open automatically

### Option 2: Command Line
```cmd
start-skoolcampus.bat
```

### To Stop:
- Double-click `stop-skoolcampus.bat`
- Or close the backend and frontend windows

---

## 🍎 **Mac Users**

### Option 1: Double-click (Easiest)
1. Right-click `start-skoolcampus.sh`
2. Choose "Open With" → "Terminal"
3. Wait for both servers to start
4. Browser will open automatically

### Option 2: Terminal
```bash
./start-skoolcampus.sh
```

### To Stop:
```bash
./stop-skoolcampus.sh
```

---

## 🐧 **Linux Users**

### Terminal
```bash
./start-skoolcampus.sh
```

### To Stop:
```bash
./stop-skoolcampus.sh
```

---

## 🌐 **Cross-Platform (Node.js)**

Works on all operating systems!

### First Time Setup:
```bash
npm install
```

### Start:
```bash
npm start
```

### Stop:
Press `Ctrl+C` in the terminal

---

## 📊 **What Happens?**

The script will:
1. ✅ Check if Node.js is installed
2. ✅ Install dependencies if needed
3. ✅ Create `.env` file if missing
4. ✅ Generate Prisma Client
5. ✅ Start backend on port 3000
6. ✅ Start frontend on port 4200
7. ✅ Open browser automatically

---

## 🌍 **Access Your Application**

After starting:
- **Frontend (Login):** http://localhost:4200
- **Backend API:** http://localhost:3000/api
- **API Documentation:** http://localhost:3000/api/docs

---

## ⚙️ **First Time Setup Required**

### 1. Configure Database

Edit `nestjs-backend/.env`:
```env
DATABASE_URL="mysql://username:password@localhost:3306/ramom"
JWT_SECRET="change-this-to-random-secret"
```

### 2. Ensure MySQL is Running
```bash
# Check if MySQL is running
mysql -u ramom -p
```

---

## 🆘 **Troubleshooting**

### "Node.js not found"
Install from: https://nodejs.org (version 18+)

### "Database connection failed"
1. Check MySQL is running
2. Verify credentials in `.env`
3. Ensure database exists

### "Port already in use"
Stop the script and run the stop script first:
- Windows: `stop-skoolcampus.bat`
- Mac/Linux: `./stop-skoolcampus.sh`

### Permission denied (Mac/Linux)
```bash
chmod +x start-skoolcampus.sh
chmod +x stop-skoolcampus.sh
```

---

## 📝 **Alternative Commands**

### Individual Services:

**Backend only:**
```bash
cd nestjs-backend
npm install
npm run start:dev
```

**Frontend only:**
```bash
cd angular-frontend
npm install
npm start
```

### Using npm scripts:
```bash
# Install all dependencies
npm run install:all

# Start backend only
npm run start:backend

# Start frontend only
npm run start:frontend

# Build for production
npm run build:all
```

---

## 🎯 **Quick Reference**

| Command | Windows | Mac/Linux | Cross-platform |
|---------|---------|-----------|----------------|
| **Start** | `start-skoolcampus.bat` | `./start-skoolcampus.sh` | `npm start` |
| **Stop** | `stop-skoolcampus.bat` | `./stop-skoolcampus.sh` | `Ctrl+C` |
| **Install** | Double-click | `chmod +x *.sh` | `npm install` |

---

## 📚 **Next Steps**

After starting successfully:
1. ✅ Login with your existing credentials
2. ✅ Explore the dashboard
3. ✅ Check API docs at http://localhost:3000/api/docs
4. ✅ Read [QUICK_START_SKOOLCAMPUS.md](./QUICK_START_SKOOLCAMPUS.md) for details

---

## 🎉 **You're Ready!**

SkoolCampus will be running at:
**http://localhost:4200**

Happy coding! 🚀

---

**© 2024 SkoolCampus. All rights reserved.**
