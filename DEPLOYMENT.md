# Expense Tracker Deployment Guide

This guide provides instructions for deploying the Expense Tracker application using:
- Neon.tech for PostgreSQL database
- Render.com for backend hosting
- Netlify for frontend hosting

## Prerequisites

1. GitHub account
2. Neon.tech account
3. Render.com account
4. Netlify account

## Step 1: Create a New GitHub Repository

1. Create a new GitHub repository
2. Clone your local project (if needed)
3. Push your code to the new repository with these commands:
   ```
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```

## Step 2: Set Up Neon.tech Database

1. Log in to your Neon.tech account
2. Create a new project
3. Create a new database named "neondb" (or use the existing one from the connection string)
4. Note your database connection details (already in backend/.env.production)

## Step 3: Deploy Backend to Render

1. Log in to Render.com
2. Click "New Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - Name: your-backend-name
   - Runtime: Node
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Select the appropriate region/plan
5. Add the following environment variables (copy from backend/.env.production):
   - DB_NAME
   - DB_USER
   - DB_PASSWORD
   - DB_HOST
   - DB_PORT
   - DB_SSL
   - JWT_SECRET
   - JWT_EXPIRES_IN
   - NODE_ENV
   - PORT
   - MAX_FILE_SIZE
   - CORS_ORIGIN (update this after deploying the frontend)

6. Click "Create Web Service"
7. After deployment completes, note your backend URL (something like https://your-backend-name.onrender.com)

## Step 4: Initialize the Database

1. Update the CORS_ORIGIN in your Render environment variables with your actual Netlify URL (once you have it)
2. After backend deployment completes, you need to initialize the database. You can either:
   - Run the database initialization script locally: `npm run setup-neon-db`
   - SSH into your Render instance (if available) and run: `node neon-db-init.js`

## Step 5: Deploy Frontend to Netlify

1. Log in to Netlify
2. Click "New site from Git"
3. Connect your GitHub repository
4. Configure the build settings:
   - Base directory: frontend
   - Build command: `npm run build`
   - Publish directory: frontend/build
5. Add the following environment variable:
   - REACT_APP_API_URL: Your backend URL from Step 3 with "/api" appended (e.g., https://your-backend-name.onrender.com/api)
6. Click "Deploy site"
7. After deployment completes, note your frontend URL

## Step 6: Update Environment Variables

1. Update the frontend URL in your Render service environment variables:
   - CORS_ORIGIN: Your Netlify frontend URL

2. Update the backend URL in your Netlify environment variables:
   - REACT_APP_API_URL: Your backend URL with "/api" appended

## Step 7: Finalize

1. Test the application to ensure everything is working properly
2. If needed, make adjustments to environment variables or code

## Troubleshooting

- If you encounter CORS issues, ensure CORS_ORIGIN is set correctly on the backend
- If database connection fails, verify your Neon.tech credentials and SSL settings
- For file upload issues, check the uploads directory permissions in Render
- For frontend connection issues, verify the REACT_APP_API_URL is correct 