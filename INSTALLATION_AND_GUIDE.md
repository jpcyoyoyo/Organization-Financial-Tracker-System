# Organization Management System (OMS) - Installation & User Guide

## Table of Contents

1. [System Overview](#system-overview)
2. [Architecture](#architecture)
3. [Key Features](#key-features)
4. [Prerequisites](#prerequisites)
5. [Installation Instructions](#installation-instructions)
6. [Running the Application](#running-the-application)
7. [Troubleshooting](#troubleshooting)
8. [User Roles & Permissions](#user-roles--permissions)
9. [Feature Overview](#feature-overview)

---

## System Overview

The **Organization Management System (OMS)** is a comprehensive web-based platform designed to digitalize and centralize all student organization operations. It addresses the fragmented management processes that plague organizations by providing a unified solution for:

- **Financial Tracking** - Deposits, expenses, budgets, and collections management
- **Membership Administration** - User accounts, roles, sections, and attendance tracking
- **Event Coordination** - Event planning, approvals, and management
- **Meeting Documentation** - Meeting notes, attendance records, and archival
- **Communication Workflows** - Announcements, notifications, and requests
- **Audit & Compliance** - Comprehensive activity logging and audit trails

### Problem Solved

Student organizations typically struggle with:

- ❌ Fragmented data across multiple tools
- ❌ Manual record-keeping and inefficiencies
- ❌ Accountability gaps and transparency issues
- ❌ Limited real-time visibility into operations
- ❌ Complex approval workflows without tracking

### Solution Provided

OMS delivers:

- ✅ **Centralized Platform** - All operations in one place
- ✅ **Role-Based Access** - Customized interfaces for each role
- ✅ **Real-Time Analytics** - Live dashboards and statistics
- ✅ **Audit Trails** - 2,760+ logged activities for compliance
- ✅ **Secure Workflows** - Multi-step approvals for critical operations

---

## Architecture

### Technology Stack

**Backend:**

- Node.js with Express.js framework
- MySQL database with 24-table relational schema
- Socket.IO for real-time bidirectional communication
- JWT authentication for secure sessions
- bcrypt for password hashing

**Frontend:**

- React 18.3.1 with Vite build tool
- Ionic Framework for mobile-responsive design
- Tailwind CSS for styling
- Framer Motion for animations
- Socket.IO Client for real-time updates

**Database:**

- 24 normalized tables with 60+ foreign key relationships
- ACID-compliant transactions for financial operations
- Stored procedures for automated reports
- Triggers for activity logging
- Views for role-based data access

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React + Ionic)                 │
│              ├─ Authentication Pages                        │
│              ├─ Admin Dashboard                             │
│              ├─ Financial Management                        │
│              ├─ User Management                             │
│              └─ Reports & Analytics                         │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTP/WebSocket
┌──────────────────────┴──────────────────────────────────────┐
│              Backend (Node.js + Express)                    │
│         ├─ REST API Endpoints (60+ routes)                 │
│         ├─ Socket.IO Real-Time Events                      │
│         ├─ Session Management                              │
│         └─ JWT Authentication                              │
└──────────────────────┬──────────────────────────────────────┘
                       │ MySQL Protocol
┌──────────────────────┴──────────────────────────────────────┐
│        Database (MySQL - 24 Tables, 60+ Relations)         │
│    ├─ Users & Authentication                               │
│    ├─ Financial Records (Deposits, Expenses, Budgets)      │
│    ├─ Events & Meetings                                    │
│    ├─ Announcements & Communications                       │
│    ├─ Audit Logs & Activity Tracking                       │
│    └─ Approvals & Workflows                                │
└─────────────────────────────────────────────────────────────┘
```

---

## Key Features

### 1. Financial Management

- 📊 **Budget Planning** - Create, approve, and track budgets
- 💰 **Deposit Tracking** - Record all income with proofs
- 💸 **Expense Management** - Monitor spending and receipts
- 📋 **Payment Collections** - Track member payments and dues
- 📈 **Financial Reports** - Generate real-time financial statements
- 🔍 **Balance Analytics** - Current organization balance and trends

### 2. User Management

- 👥 **Role-Based Access Control** - 6 distinct user roles
- 📝 **Account Management** - Create, update, delete user accounts
- 🔐 **Authentication** - Secure login with JWT tokens
- 👤 **Profile Management** - User photos and personal details
- 🔄 **Session Management** - Track user online status
- 📱 **Multi-Platform Support** - Web and mobile access

### 3. Event Management

- 📅 **Event Creation** - Plan and organize events
- ✅ **Approval Workflow** - Multi-step event approval process
- 📊 **Attendance Tracking** - QR code-based check-ins
- 📢 **Event Announcements** - Notify attendees
- 🗂️ **Event History** - Archive and reference past events

### 4. Meeting Management

- 📑 **Meeting Documentation** - Record meeting minutes
- 👥 **Attendance Records** - Track attendees and absentees
- 📝 **Searchable Archives** - Find past meeting notes
- 📊 **Meeting Statistics** - View meeting frequency and participation

### 5. Announcements & Communications

- 📣 **Announcement Management** - Create and disseminate announcements
- ✅ **Approval Process** - Review and approve announcements
- 🎯 **Targeted Distribution** - Send to specific roles or sections
- 📨 **Request System** - Submit requests for official announcements

### 6. Audit & Compliance

- 📋 **Activity Logging** - 2,760+ logged activities
- 🔍 **Audit Reports** - Generate compliance reports
- 🕐 **Timestamp Tracking** - Record exact times for all operations
- 👤 **User Attribution** - Know who performed each action
- 📊 **Audit Trails** - Complete history of organizational changes

### 7. Real-Time Features

- 🔄 **Live Data Updates** - Socket.IO powered real-time sync
- 👥 **Online User Tracking** - See who's currently online
- 📊 **Live Dashboard** - Real-time statistics and analytics
- 🔔 **Instant Notifications** - Immediate updates on actions
- ⚡ **WebSocket Communication** - Bidirectional real-time events

---

## Prerequisites

Before installing OMS, ensure your system has the following:

### Required Software

- **Node.js** (v14.0.0 or higher) - [Download](https://nodejs.org/)
- **XAMPP** (Apache + MySQL) - [Download](https://www.apachefriends.org/)
- **Git** (optional, for version control) - [Download](https://git-scm.com/)
- **Visual Studio Code** (recommended editor) - [Download](https://code.visualstudio.com/)

### System Requirements

- **OS**: Windows 10+, macOS, or Linux
- **RAM**: Minimum 4GB (8GB recommended)
- **Disk Space**: 2GB free space
- **Browser**: Chrome, Firefox, Safari, or Edge (latest versions)

### Ports Required

- **Backend**: Port 5000 (Express.js server)
- **Frontend**: Port 5173 (Vite development server)
- **MySQL**: Port 3306 (database)

---

## Installation Instructions

### Step 1: Install Node.js

1. Download Node.js from [nodejs.org](https://nodejs.org/)
2. Run the installer and follow the installation wizard
3. Accept default settings
4. Verify installation by opening PowerShell and running:
   ```powershell
   node --version
   npm --version
   ```

### Step 2: Install XAMPP

1. Download XAMPP from [apachefriends.org](https://www.apachefriends.org/)
2. Run the installer
3. Select components: Apache, MySQL, phpMyAdmin (at minimum)
4. Choose installation directory (default is fine)
5. Complete the installation

### Step 3: Configure PowerShell Execution Policy

1. Open PowerShell as Administrator
   - Right-click PowerShell → "Run as administrator"
2. Run the following command:
   ```powershell
   Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```
3. Type `Y` and press Enter to confirm

### Step 4: Start Database Services

1. Open XAMPP Control Panel
2. Start Apache and MySQL services by clicking "Start" buttons
3. Verify both services show green indicators
4. Open phpMyAdmin at `http://localhost/phpmyadmin`

### Step 5: Create Database

1. In phpMyAdmin, create a new database:

   - Click "New" on the left sidebar
   - Database name: `oms_db`
   - Collation: `utf8mb4_unicode_ci`
   - Click "Create"

2. Import the latest database schema:

   - Select the `oms_db` database
   - Go to "Import" tab
   - Click "Choose File" and select the latest SQL file from the `db/` folder
   - Click "Import"

   **Available versions** (use the latest):

   - `oms_db_v.0.0.1.sql`
   - `oms_db_v.0.0.2.sql`
   - `oms_db_v.0.0.3.sql`
   - ... (select the highest version number)

### Step 6: Clone/Download Project

1. Open Visual Studio Code
2. Open the project folder: `Organization Financial Tracker System`
3. Open integrated terminal: ` Ctrl + ``  `

### Step 7: Install Backend Dependencies

```powershell
cd backend
npm install
```

This will install all required packages from `package.json`

### Step 8: Configure Backend Environment (Optional)

Create a `.env` file in the `backend/` folder with these settings:

```env
PORT=5000
DATABASE_HOST=localhost
DATABASE_USER=root
DATABASE_PASSWORD=
DATABASE_NAME=oms_db
JWT_SECRET=your_secret_key_here
NODE_ENV=development
```

### Step 9: Install Frontend Dependencies

Open a new terminal in VS Code and run:

```powershell
cd frontend
npm install
```

### Step 10: Verify Installation

Check that all files are in place:

- ✅ `backend/node_modules/` folder exists
- ✅ `frontend/node_modules/` folder exists
- ✅ `backend/server.js` file exists
- ✅ `frontend/package.json` file exists

---

## Running the Application

### Starting the Backend Server

Open terminal in VS Code and run:

```powershell
cd backend
npm run start
```

**Expected output:**

```
[Session] Manager initialized. Loaded 0 sessions from backup.
MySQL connection successful
Server running on port 5000
Socket.IO initialized with CORS
```

### Starting the Frontend Development Server

Open a new terminal in VS Code and run:

```powershell
cd frontend
npm run dev
```

**Expected output:**

```
VITE v4.x.x ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Press h to show help
```

### Access the Application

Open your browser and navigate to:

- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5000](http://localhost:5000)

---

## Troubleshooting

### Issue 1: MySQL Connection Failed

**Error Message:**

```
Error: connect ECONNREFUSED 127.0.0.1:3306
```

**Solutions:**

1. Ensure XAMPP MySQL is running (check Control Panel)
2. Verify database name is `oms_db` (case-sensitive)
3. Confirm username is `root` with empty password
4. Check `backend/.env` file for correct database credentials
5. Restart XAMPP MySQL service

### Issue 2: Port Already in Use

**Error Message:**

```
Error: listen EADDRINUSE :::5000
```

**Solutions:**

1. Find process using the port:
   ```powershell
   netstat -ano | findstr :5000
   ```
2. Kill the process:
   ```powershell
   taskkill /PID [PID_NUMBER] /F
   ```
3. Or change the port in `backend/server.js` line 23

### Issue 3: Node Modules Issues

**Error Message:**

```
Cannot find module 'express'
```

**Solutions:**

1. Delete `node_modules` folder and `package-lock.json`
2. Run `npm install` again
3. Clear npm cache: `npm cache clean --force`
4. Try: `npm install --legacy-peer-deps`

### Issue 4: CORS Errors in Browser Console

**Error Message:**

```
Access to XMLHttpRequest blocked by CORS policy
```

**Solutions:**

1. Ensure backend is running on port 5000
2. Check `backend/server.js` CORS configuration
3. Restart both frontend and backend servers
4. Clear browser cache: `Ctrl + Shift + Delete`

### Issue 5: Socket.IO Connection Issues

**Error Message:**

```
[Socket] Connection error: connect_error
```

**Solutions:**

1. Verify backend is running
2. Check browser console for specific errors
3. Ensure both servers are on same network
4. Disable firewall temporarily to test
5. Check if port 5000 is accessible

### Issue 6: VS Code Terminal Issues

**If terminal commands don't work:**

```powershell
# Reset VS Code
1. Close VS Code completely
2. Close all PowerShell windows
3. Reopen VS Code
4. Create new terminal: Ctrl + `
5. Try commands again
```

### Issue 7: Database Import Failed

**Error Message:**

```
#1064 - You have an error in your SQL syntax
```

**Solutions:**

1. Ensure correct database selected in phpMyAdmin
2. Try importing a different version of the SQL file
3. Delete `oms_db` and recreate it
4. Check SQL file is not corrupted
5. Try importing line by line if needed

### Issue 8: Vite Build Errors

**Error Message:**

```
Failed to resolve '...'
```

**Solutions:**

1. Check file paths in imports (case-sensitive)
2. Clear Vite cache: delete `.vite/` folder
3. Reinstall dependencies: `npm install`
4. Restart dev server: `npm run dev`

### General Reset Procedure

If all else fails, perform a complete reset:

```powershell
# Backend
cd backend
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
npm run start

# Frontend (in new terminal)
cd frontend
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
npm run dev
```

---

## User Roles & Permissions

OMS supports six distinct user roles with customized interfaces and permissions:

### 1. **Admin** 👨‍💼

- Full system access and control
- User account management (create, delete, update)
- System settings and configuration
- Access to all organization records
- Can approve all requests and workflows
- **Dashboard**: Comprehensive statistics and analytics

### 2. **President** 👑

- Organization leadership authority
- Approve/reject budgets, events, announcements
- Access to all financial records
- User management capabilities
- Generate organizational reports
- Set organizational policies

### 3. **Treasurer** 💰

- Financial management responsibilities
- Create and manage deposits and expenses
- Track organization balance
- Manage payment collections
- Generate financial reports
- Approve budget allocations

### 4. **Auditor** 📋

- Compliance and audit responsibilities
- View all financial transactions
- Generate audit reports
- Access activity logs
- Validate financial records
- Generate compliance certificates

### 5. **Secretary** 📝

- Meeting documentation responsibilities
- Record and archive meeting minutes
- Track meeting attendance
- Manage organizational documents
- Publish announcements (after approval)
- Maintain organizational records

### 6. **PIO (Public Information Officer)** 📢

- Communication and announcement authority
- Create and submit announcements
- Manage event communications
- Handle organizational messaging
- Request announcement approvals
- Manage public relations

### 7. **Member** 👤

- Basic organizational access
- View approved announcements
- Track attendance records
- View organizational information
- Submit event attendance
- Access personal payment records

### Permission Matrix

| Feature               | Member | Secretary | Treasurer | Auditor | PIO | President | Admin |
| --------------------- | ------ | --------- | --------- | ------- | --- | --------- | ----- |
| View Announcements    | ✅     | ✅        | ✅        | ✅      | ✅  | ✅        | ✅    |
| Create Announcements  | ❌     | ✅        | ❌        | ❌      | ✅  | ✅        | ✅    |
| Approve Announcements | ❌     | ❌        | ❌        | ❌      | ❌  | ✅        | ✅    |
| View Finances         | ❌     | ❌        | ✅        | ✅      | ❌  | ✅        | ✅    |
| Create Budgets        | ❌     | ❌        | ✅        | ❌      | ❌  | ✅        | ✅    |
| Approve Budgets       | ❌     | ❌        | ❌        | ❌      | ❌  | ✅        | ✅    |
| Manage Users          | ❌     | ❌        | ❌        | ❌      | ❌  | ❌        | ✅    |
| View Audit Logs       | ❌     | ❌        | ❌        | ✅      | ❌  | ✅        | ✅    |
| Generate Reports      | ❌     | ❌        | ✅        | ✅      | ❌  | ✅        | ✅    |
| Manage Events         | ❌     | ✅        | ❌        | ❌      | ✅  | ✅        | ✅    |

---

## Feature Overview

### 1. Dashboard

- Real-time statistics and analytics
- Currently online users
- Recent activities
- Financial summaries
- Upcoming events

### 2. Financial Management

- **Deposits**: Track incoming funds with proof documents
- **Expenses**: Record spending with receipt documentation
- **Budgets**: Plan and approve organizational budgets
- **Payments**: Manage member payment collections
- **Reports**: Generate financial statements and analysis

### 3. User Management

- Create accounts with auto-generated passwords
- Bulk import users from CSV/Excel
- Manage user roles and permissions
- Track user activity
- Deactivate/delete accounts

### 4. Events

- Create and plan events
- Submit for approval
- Track attendance with QR codes
- Manage event documentation
- Archive event records

### 5. Meetings

- Document meeting minutes
- Track attendance
- Archive meetings
- Search meeting records
- Generate meeting reports

### 6. Announcements

- Create announcements
- Submit for approval
- Distribute to members
- Track announcement views
- Archive announcements

### 7. Approvals & Workflows

- **Budget Approval**: Multi-step budget approval process
- **Payment Approval**: Payment request validation
- **Announcement Approval**: Content review and approval
- **Event Approval**: Event planning validation
- Track all approval history

### 8. Reports & Analytics

- Financial reports
- Attendance analytics
- User statistics
- Activity summaries
- Audit reports

### 9. Profile Management

- User profile viewing
- Profile picture uploads
- Personal information updates
- Password management
- Security settings

### 10. Settings

- Organization settings
- User preferences
- Theme selection (light/dark mode)
- Notification preferences
- Security options

---

## Real-Time Features

### Live Dashboard Updates

- Auto-updating statistics via Socket.IO
- Live user online status
- Real-time account counts
- Live log tracking
- Instant balance updates

### Online User Tracking

- See currently online users
- Platform detection (web/mobile)
- Real-time status updates
- Inactive user detection (30-minute timeout)
- Activity timestamps

### Event Broadcasting

- Account creation/deletion notifications
- User login/logout broadcasts
- Inactivity notifications
- Statistics updates
- Approval workflow notifications

---

## Database Schema Overview

The OMS database consists of 24 normalized tables:

### User & Authentication Tables

- `user_account` - User profiles and credentials
- `section` - Organization sections
- `settings` - User preferences
- `security_q` - Security questions

### Financial Tables

- `deposit` - Income records
- `expense` - Spending records
- `budget` - Budget planning
- `payment` - Member payments
- `receipt` - Receipt documentation
- `financial_grouping` - Category management

### Event & Meeting Tables

- `event` - Event records
- `meeting` - Meeting documentation
- `attendance` - Attendance tracking
- `announcement` - Organization announcements

### Approval & Workflow Tables

- `budget_approval` - Budget approval workflow
- `payment_approval` - Payment approval workflow
- `announcement_approval` - Announcement approval workflow
- `event_approval` - Event approval workflow

### Logging & Audit Tables

- `log` - Activity logging (2,760+ entries tracked)
- `approval_history` - Approval tracking
- `session` - Session management

---

## Getting Help

### Common Resources

- Check the [Troubleshooting](#troubleshooting) section above
- Review error messages in browser console (F12)
- Check terminal output for backend errors
- Verify all services are running

### Technical Support

- Check backend logs in terminal
- Check browser console for frontend errors
- Verify database connection in phpMyAdmin
- Ensure all ports are available

### Tips for Success

- Always start MySQL and Apache before running the app
- Keep browser console open (F12) for debugging
- Ensure correct node and npm versions
- Use latest database version for import
- Restart services if experiencing connection issues

---

## Version Information

- **Application Version**: 0.0.7
- **Database Version**: 0.0.7 (latest)
- **Node.js**: v14.0.0+
- **React**: 18.3.1
- **Express**: Latest
- **MySQL**: 5.7+
- **Last Updated**: December 2025

---

## License & Credits

Organization Management System (OMS)
A comprehensive student organization management platform
Developed for academic institutions

---

**Thank you for using OMS! For questions or feedback, please contact your system administrator.**
