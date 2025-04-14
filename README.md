# Expense Tracker

A full-stack expense tracking application built with React, Node.js, Express, and PostgreSQL.

## Features

- User authentication and authorization
- Expense tracking with categories
- Budget management
- Income tracking
- Financial reports and visualizations
- File uploads for receipts
- Mobile-responsive design

## Tech Stack

### Frontend
- React
- Material-UI
- Chart.js
- Axios
- React Router

### Backend
- Node.js
- Express
- PostgreSQL with Sequelize ORM
- JWT Authentication
- Multer for file uploads

## Project Structure

```
expense-tracker/
├── frontend/          # React frontend
│   ├── public/        # Static files
│   └── src/           # React components and logic
├── backend/           # Node.js backend
│   ├── config/        # Configuration files
│   ├── controllers/   # Route controllers
│   ├── db/            # Database setup and migrations
│   ├── middleware/    # Custom middleware
│   ├── models/        # Sequelize models
│   ├── routes/        # API routes
│   ├── services/      # Business logic
│   └── utils/         # Utility functions
└── DEPLOYMENT.md      # Deployment instructions
```

## Getting Started

### Prerequisites

- Node.js (v14+ recommended)
- PostgreSQL

### Installation

1. Clone the repository
```
git clone https://github.com/your-username/expense-tracker.git
cd expense-tracker
```

2. Install dependencies
```
npm run install-all
```

3. Setup environment variables
   - Copy the `.env.example` file in the backend folder to `.env` and update values

4. Setup the database
```
npm run setup-db
```

5. Start the development servers
```
npm run dev
```

- Backend will run on: http://localhost:5001
- Frontend will run on: http://localhost:3000

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions on how to deploy this application using:
- Neon.tech for PostgreSQL database
- Render.com for backend hosting
- Netlify for frontend hosting

## License

This project is licensed under the ISC License. 