# 🗳️ Citizen On Top — Citizen Complaints and Engagement System

A full-stack **Next.js** MVP built for the **Citizen On Top Hackathon**, enabling citizens to report complaints about public services and track resolution transparently.

## 🚨 Problem

Public complaints are typically handled via fragmented or manual channels, leading to:
- 🐌 Slow responses
- 🤐 Lack of transparency
- 😤 Poor citizen satisfaction

## ✅ Our Solution

A digital platform for:
- 📩 Submitting complaints with optional attachments
- 🧠 Auto-categorizing and routing issues to the correct agency
- 📦 Real-time status tracking
- 🧑‍💼 Admin interface for agencies to manage, respond, and resolve cases

## ⚙️ Tech Stack

| Layer      | Stack                     |
|------------|---------------------------|
| Frontend   | Next.js (App Router)      |
| Backend    | API routes in Next.js     |
| Database   | PostgreSQL + Sequelize ORM|
| File Upload| Cloudinary                |
| Auth       | JWT-based authentication  |
| Styling    | Tailwind CSS              |

## 🔐 User Roles

| Role   | Purpose                        | Login Credentials                        |
|--------|--------------------------------|------------------------------------------|
| 🧑 Admin   | Manage all complaints           | `benjaminwell250@gmail.com` / `password123` |
| 🧑 Agent   | Handle complaints per agency    | `agenttuyisenge@gmail.com` / `password123` |
| 🙋 User    | Register, submit & track issues | Self-registration available               |

## ✨ Features

- 📝 **Complaint Submission**: Describe the issue, attach images
- 🧭 **Categorization**: Assigns issue to correct department
- 🚦 **Status Tracking**: See real-time complaint status (Pending, In Progress, Resolved)
- 🧑‍💼 **Admin Dashboard**: View, assign, and respond to complaints
- 🔐 **Secure Auth**: JWT-based login for all roles
- 📊 **Basic Analytics (Optional)**: Track number of complaints and status trends

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/tuyisenge250/citizen_on_top_hackthon.git
cd citizen_on_top_hackthon