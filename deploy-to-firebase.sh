#!/bin/bash

# Exit script if any command fails
set -e

echo "🔧 Building project for production..."
npm run build

echo "🚀 Deploying to Firebase..."
firebase deploy

echo "✅ Deployment complete!"
echo "Your app is now live on Firebase Hosting!"
echo "To view your app, run: firebase open hosting:site"


