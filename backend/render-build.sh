#!/usr/bin/env bash
# exit on error
set -o errexit

echo "Starting Render build script..."

# Install dependencies
npm install

# Create uploads directory if it doesn't exist
mkdir -p uploads
chmod 777 uploads

echo "Build script completed successfully" 