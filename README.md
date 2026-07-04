<div align="center">

<table border="0" cellspacing="0" cellpadding="0">
  <tr>
    <td align="center" valign="middle">
      <img src="" alt="WorkAlign Hackathon" height="100"/>
    </td>
    <td align="center" valign="middle" style="padding: 0 24px;">
      <h2>✕</h2>
    </td>
    <td align="center" valign="middle">
      <img src="logo.png" alt="WorkAlign" height="100"/>
    </td>
  </tr>
</table>

<br/>

# WorkAlign × WorkAlign

### 🏢 Human Resource Management System

> *Every workday, perfectly aligned.*

<br/>

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Status](https://img.shields.io/badge/status-Hackathon%20Build-brightgreen.svg)
![WorkAlign](https://img.shields.io/badge/WorkAlign-17-purple.svg)
![Stack](https://img.shields.io/badge/stack-WorkAlign%20%7C%20Python%20%7C%20PostgreSQL-orange.svg)
![Team](https://img.shields.io/badge/team-Fantastic%204-red.svg)
![PRs](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)

</div>

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Why We'll Win](#-why-well-win--our-usps)
- [System Architecture](#-system-architecture)
- [User Roles](#-user-roles--access-control)
- [Functional Modules](#-functional-modules)
- [Non-Functional Requirements](#-non-functional-requirements)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Team](#-team)
- [License](#-license)

---

## 🌟 Overview

**WorkAlign × WorkAlign** is a production-grade **Human Resource Management System** built natively on the WorkAlign platform. Designed for real-world enterprise use, it digitizes and streamlines every critical HR operation — from the moment an employee is onboarded, to daily attendance, leave approvals, and payroll visibility — all through a clean, role-aware interface.

> 💡 **Tagline:** *"Every workday, perfectly aligned."* — Because HR should empower people, not slow them down.

---

## 🏆 Why We'll Win — Our USPs

What sets WorkAlign × WorkAlign apart from every other HRMS at this hackathon:

| # | USP | Why It Matters |
|---|-----|----------------|
| 🎯 | **Role-Intelligent UX** | Admins and employees see entirely different, context-aware dashboards. No clutter, zero confusion. |
| 📅 | **Calendar-Driven Leave UI** | Employees apply for leave by directly clicking on a calendar — attendance markers (Present/Absent) shown inline. Intuitive like never before. |
| ⚡ | **Real-Time Approval Workflows** | Leave and attendance changes reflect instantly across all stakeholders — no page refreshes, no delays. |
| 🔐 | **Secure, Verified Onboarding** | Email verification + role-based registration eliminates unauthorized access from day one. |
| 🧾 | **Transparent Payroll Visibility** | Employees can view their salary breakdown clearly. Admins manage and update structures — full payroll lifecycle in one place. |
| 🏗️ | **Built on WorkAlign's Proven Core** | We don't reinvent the wheel — we extend WorkAlign's rock-solid infrastructure with a custom layer that makes it faster, smarter, and more user-friendly. |
| 📊 | **Unified Attendance Intelligence** | Daily, weekly, and monthly views with Present / Absent / Half-day / Leave status — all at a glance. |

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    WorkAlign × WorkAlign                   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│   ┌──────────────┐        ┌──────────────────────────┐  │
│   │   Frontend   │◄──────►│      WorkAlign Backend        │  │
│   │  (Custom UI) │        │  (Python + PostgreSQL)   │  │
│   └──────────────┘        └──────────────────────────┘  │
│          │                          │                    │
│   ┌──────▼──────┐          ┌────────▼───────┐           │
│   │  Auth Layer │          │   HR Modules   │           │
│   │  Session    │          │  Attendance    │           │
│   └─────────────┘          │  Leave Mgmt    │           │
│                             │  Payroll       │           │
│                             │  Profiles      │           │
│                             └────────────────┘           │
└─────────────────────────────────────────────────────────┘
```

---

## 👥 User Roles & Access Control

| Role | Capabilities |
|------|-------------|
| 🛡️ **Admin / HR Officer** | Manage all employees · Approve/reject leave · View & update payroll · Full attendance visibility · Edit all profiles |
| 👤 **Employee** | View own profile · Track own attendance · Apply for leave · View salary (read-only) · Edit limited profile fields |

> Access is enforced at both UI and API levels — employees **cannot** access admin routes under any circumstances.

---

## ⚙️ Functional Modules

### 🔐 3.1 Authentication & Authorization

<details>
<summary><b>Sign Up</b></summary>

- Register with **Employee ID**, **Email**, **Password**, and **Role** (Employee / HR)
- Passwords follow strict security rules (min length, complexity)
- **Email verification** is mandatory before account activation
- Role selection determines dashboard and permission scope post-login

</details>

<details>
<summary><b>Sign In</b></summary>

- Login via **email + password**
- Incorrect credentials show descriptive, secure error messages
- Successful login redirects to the **role-appropriate dashboard**
- Session management via WorkAlign's built-in auth system

</details>

---

### 📊 3.2 Dashboard

#### 🧑 Employee Dashboard
- Quick-access cards: **Profile · Attendance · Leave Requests · Logout**
- Recent activity feed & pending alerts
- Attendance summary widget (current week)

#### 🛡️ Admin / HR Dashboard
- Full employee directory at a glance
- Pending **leave approval** queue with urgency indicators
- Attendance overview across all staff
- Switch between employee views seamlessly

---

### 👤 3.3 Employee Profile Management

| Feature | Employee | Admin |
|---------|----------|-------|
| View personal details | ✅ | ✅ |
| View job details & role | ✅ | ✅ |
| View salary structure | ✅ | ✅ |
| View / download documents | ✅ | ✅ |
| Edit address, phone, photo | ✅ | ✅ |
| Edit all profile fields | ❌ | ✅ |

---

### 🕐 3.4 Attendance Management

#### Attendance Status Types
```
✅ Present   |   ❌ Absent   |   🔶 Half-Day   |   🌴 On Leave
```

#### Views Available
- **Daily View** — Single day check-in / check-out log
- **Weekly View** — 5-day summary with status badges
- **Monthly Calendar View** — Color-coded grid with leave markers

| Access Level | Scope |
|---|---|
| Employee | Own attendance only |
| Admin / HR | All employees across all dates |

> Check-in / Check-out functionality with timestamp recording.

---

### 🌴 3.5 Leave & Time-Off Management

#### Employee — Apply for Leave
- Select leave type: `Paid` · `Sick` · `Unpaid`
- **Calendar-based date picker** — click directly on dates to select range
- Monthly calendar shows **Present / Absent markers** alongside request
- Add remarks / notes to the request
- Track status: `🟡 Pending` · `✅ Approved` · `❌ Rejected`

#### Admin / HR — Leave Approval
- View all incoming leave requests (paginated, filterable)
- **One-click Approve / Reject** with optional comment
- Changes reflect **immediately** in employee records and calendar
- Full audit trail of decisions

---

### 💰 3.6 Payroll & Salary Management

| Feature | Employee | Admin |
|---------|----------|-------|
| View own salary breakdown | ✅ Read-only | ✅ |
| View all employee payrolls | ❌ | ✅ |
| Update salary structures | ❌ | ✅ |
| Payroll accuracy verification | ❌ | ✅ |

> Payroll data is **strictly read-only for employees** — no accidental or unauthorized modifications.

---

## 🛡️ Non-Functional Requirements

| Category | Requirement |
|----------|------------|
| 🔒 **Security** | Role-based access control at API + UI level · Email verification · Secure password hashing |
| ⚡ **Performance** | Dashboard loads in < 2s · Real-time approval reflection |
| 📱 **Usability** | Intuitive, role-aware UI · Calendar-first leave experience |
| 🔧 **Maintainability** | Modular WorkAlign custom module structure · Clean separation of concerns |
| 📈 **Scalability** | Built on WorkAlign's enterprise-grade PostgreSQL backend |
| 🌐 **Compatibility** | Works on all modern browsers · Responsive design |

---

## 🛠️ Tech Stack

<div align="center">

| Layer | Technology |
|-------|-----------|
| **Backend** | WorkAlign 17 (Python) |
| **Database** | PostgreSQL |
| **Frontend** | WorkAlign Views + Custom UI |
| **Auth** | WorkAlign Session-Based Authentication |
| **API** | WorkAlign JSON-RPC / REST |
| **Version Control** | Git + GitHub |

</div>

---

## 🚀 Getting Started

```bash
# Clone the repository
git clone https://github.com/pradhan-not-found/WorkAlign-x-WorkAlign.git
cd WorkAlign-x-WorkAlign
```

> 📦 Detailed setup instructions, WorkAlign module installation guide, and environment configuration will be added as development progresses.

---

## 1. Introduction

### 1.1 Purpose
This document defines the functional and non-functional requirements of the **Human Resource Management System (HRMS)**. The system aims to digitize and streamline core HR operations including employee onboarding, profile management, attendance tracking, leave management, payroll visibility, and approval workflows for Admins and HR Officers.

### 1.2 Scope
The HRMS will provide:
- ✅ Secure authentication (Sign Up / Sign In)
- ✅ Role-based access (Admin vs Employee)
- ✅ Employee profile management
- ✅ Attendance tracking (daily / weekly / monthly view)
- ✅ Leave and time-off management
- ✅ Approval workflows for HR / Admin
- ✅ Payroll visibility and management

### 1.3 Definitions & Abbreviations

| Term | Definition |
|------|-----------|
| **Admin / HR Officer** | User with management and approval privileges |
| **Employee** | Regular user with limited, personal-scope access |
| **Time-Off** | Paid leave, sick leave, unpaid leave, etc. |
| **HRMS** | Human Resource Management System |
| **SRS** | Software Requirements Specification |

---

## 👥 Team

<div align="center">

**Team WorkAlign** — Built with ❤️, powered by ☕, and running on WorkAlign 🟣

*Proudly participating in the WorkAlign Hackathon 2026*

</div>

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

<div align="center">

Copyright © 2026 **Souradeep Pradhan** & Team WorkAlign

</div>


