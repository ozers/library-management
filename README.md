# 📚 Library Management System

<div align="center">

<img src="https://img.shields.io/badge/Project-Library%20Management-blue?style=for-the-badge&logo=typescript" alt="Library Management System" />

<div style="display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap; margin: 1rem 0;">

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![Jest](https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white)](https://jestjs.io/)
[![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Sequelize](https://img.shields.io/badge/Sequelize-52B0E7?style=for-the-badge&logo=sequelize&logoColor=white)](https://sequelize.org/)

</div>

<div style="display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap; margin: 1rem 0;">

[![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=for-the-badge)](CONTRIBUTING.md)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg?style=for-the-badge)](https://github.com/ozers/library-management/graphs/commit-activity)
[![Stars](https://img.shields.io/github/stars/ozers/library-management?style=for-the-badge)](https://github.com/ozers/library-management/stargazers)

</div>

---

<h3 style="color: #0366d6; margin: 1rem 0;">🌟 A modern and robust Library Management System built with Node.js and PostgreSQL.</h3>
<h4 style="color: #586069; margin: 1rem 0;">📖 Efficiently manage books, users, and borrowing transactions with ease.</h4>

<div style="display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap; margin: 1rem 0;">

[Quick Start](#-quick-start) •
[Features](#-features) •
[Installation](#-installation) •
[API](#-api) •
[Contributing](#-contributing)

</div>

---

</div>

## 🚀 Quick Start

```bash
# Clone & Install
git clone https://github.com/ozers/library-management.git
cd library-management
cp .env.example .env
npm install

# Start with Docker (Development)
docker-compose -f docker-compose.dev.yml up --build

# Or start without Docker
npm run dev

# Visit: http://localhost:3000
```

## 📊 System Architecture

```mermaid
graph TD
    Client[Client] -->|HTTP Request| Express[Express.js]
    Express -->|Route| Controller[Controllers]
    Controller -->|Validate| Validator[Validators]
    Controller -->|Process| Service[Services]
    Service -->|Query| Model[Models]
    Model -->|Store| DB[(PostgreSQL)]
    Controller -->|Response| Client

    style Client fill:#f9f,stroke:#333,stroke-width:2px
    style Express fill:#ff9900,stroke:#333,stroke-width:2px
    style Controller fill:#ff9900,stroke:#333,stroke-width:2px
    style Service fill:#ff9900,stroke:#333,stroke-width:2px
    style Model fill:#ff9900,stroke:#333,stroke-width:2px
    style DB fill:#ff9900,stroke:#333,stroke-width:2px
```

## ✨ Features

<div style="display: flex; justify-content: flex-start; gap: 2rem; flex-wrap: wrap;">

<div style="flex: 1; min-width: 300px; padding: 1.5rem; border-radius: 8px; border: 1px solid #e1e4e8;">

### 📚 Book Management
- Smart cataloging system
- Real-time availability tracking
- Advanced search capabilities
- Category organization

</div>

<div style="flex: 1; min-width: 300px; padding: 1.5rem; border-radius: 8px; border: 1px solid #e1e4e8;">

### 👥 User Management
- Seamless registration
- Detailed profiles
- Activity monitoring
- Preference settings

</div>

<div style="flex: 1; min-width: 300px; padding: 1.5rem; border-radius: 8px; border: 1px solid #e1e4e8;">

### 🔄 Borrowing System
- One-click borrowing
- Rating-enabled returns
- Overdue notifications
- Reservation system

</div>

</div>

## 🛠 Installation

<div style="display: flex; justify-content: flex-start; gap: 2rem; flex-wrap: wrap;">

<div style="flex: 1; min-width: 300px; padding: 1.5rem; border-radius: 8px; border: 1px solid #e1e4e8;">

### Prerequisites
- Node.js (v14+)
- Docker & Docker Compose
- PostgreSQL
- Git

</div>

<div style="flex: 1; min-width: 300px; padding: 1.5rem; border-radius: 8px; border: 1px solid #e1e4e8;">

### Environment Setup
```env
DB_HOST=db
DB_PORT=5432
DB_NAME=library_db
DB_USER=postgres
DB_PASSWORD=postgres
NODE_ENV=development
PORT=3000
```

</div>

</div>

## 📚 API Endpoints

<div style="display: flex; justify-content: flex-start; gap: 2rem; flex-wrap: wrap;">

<div style="flex: 1; min-width: 300px; padding: 1.5rem; border-radius: 8px; border: 1px solid #e1e4e8;">

### Books
- `GET /api/books` - List all books
- `GET /api/books/:id` - Get book details
- `POST /api/books` - Create new book

</div>

<div style="flex: 1; min-width: 300px; padding: 1.5rem; border-radius: 8px; border: 1px solid #e1e4e8;">

### Users
- `GET /api/users` - List all users
- `GET /api/users/:id` - Get user details
- `POST /api/users` - Create new user

</div>

<div style="flex: 1; min-width: 300px; padding: 1.5rem; border-radius: 8px; border: 1px solid #e1e4e8;">

### Borrowing & Transactions
- `POST /api/borrow/:userId/borrow/:bookId` - Borrow a book
- `POST /api/borrow/:userId/return/:bookId` - Return a book
- `GET /api/transactions/user/:userId` - Get user's transactions
- `GET /api/transactions/:id` - Get transaction details

</div>

</div>

## 📝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📧 Contact & Support

<div align="center">

<div style="display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap; margin: 1rem 0;">

[![Email](https://img.shields.io/badge/Email-ozersubasi.dev@gmail.com-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:ozersubasi.dev@gmail.com)
[![GitHub](https://img.shields.io/badge/GitHub-ozers-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/ozers)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Ozer%20SUBASI-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/ozer)
[![Website](https://img.shields.io/badge/Website-yayinliyor.com-FF6B6B?style=for-the-badge&logo=firefox&logoColor=white)](https://yayinliyor.com)

</div>

</div>

## 📝 License

<div align="center">

<div style="padding: 1.5rem; border-radius: 8px; border: 1px solid #e1e4e8; max-width: 600px;">

### 📜 MIT License
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

</div>

</div>

---

<div align="center">

<div style="padding: 1.5rem; border-radius: 8px; border: 1px solid #e1e4e8; max-width: 600px;">

### 🌟 Made with ❤️ by [Ozer SUBASI](https://github.com/ozers)

<div style="display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap; margin: 1rem 0;">

[![Stars](https://img.shields.io/github/stars/ozers/library-management?style=social)](https://github.com/ozers/library-management/stargazers)
[![Forks](https://img.shields.io/github/forks/ozers/library-management?style=social)](https://github.com/ozers/library-management/network/members)
[![Issues](https://img.shields.io/github/issues/ozers/library-management?style=social)](https://github.com/ozers/library-management/issues)

</div>

</div>

</div>

