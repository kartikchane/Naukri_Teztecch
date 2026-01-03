# Admin Panel - Naukri Platform

This is a **separate, standalone admin application** for managing the Naukri Platform.

## 🚀 Installation

```bash
cd admin-panel
npm install
```

## ⚡ Running the Admin Panel

The admin panel runs on a **different port (3001)** than the main website:

```bash
npm start
```

This will start the admin panel at: **http://localhost:3001**

## 🔐 Default Admin Credentials

Create an admin user using the root-level script:

```bash
cd ..
node create-admin.js
```

Default credentials:
- **Email**: admin@naukri.com
- **Password**: admin123456

## 📂 Project Structure

```
admin-panel/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Layout.js
│   │   ├── Sidebar.js
│   │   └── PrivateRoute.js
│   ├── context/
│   │   └── AuthContext.js
│   ├── pages/
│   │   ├── Login.js
│   │   └── Dashboard.js
│   ├── utils/
│   │   └── api.js
│   ├── App.js
│   ├── index.js
│   └── index.css
├── .env
├── package.json
└── README.md
```

## 🌐 URLs

- **Admin Panel**: http://localhost:3001
- **Main Website**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 🔧 Environment Variables

```env
PORT=3001
REACT_APP_API_URL=http://localhost:5000/api
```

## ✨ Features

- ✅ Completely separate from main website
- ✅ Independent authentication system
- ✅ Secure admin-only access
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Real-time stats dashboard
- ✅ Jobs, Users, Applications management

## 🛡️ Security

- Admin credentials stored separately (adminToken, adminUser)
- Role verification on backend
- Protected routes with PrivateRoute component
- Automatic redirect on unauthorized access

## 🚦 Running Both Applications

### Terminal 1 - Backend:
```bash
cd backend
npm start
```

### Terminal 2 - Main Website:
```bash
cd frontend
npm run dev
```

### Terminal 3 - Admin Panel:
```bash
cd admin-panel
npm start
```

## 📦 Build for Production

```bash
npm run build
```

The build folder can be deployed separately from the main website.

---

**Note**: This admin panel is completely independent and should be deployed on a separate subdomain or server for better security.

Example:
- Main Website: www.naukri.com
- Admin Panel: admin.naukri.com
