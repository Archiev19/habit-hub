# HabitHub - Habit Tracking Application

HabitHub is a modern habit tracking application built with React, TypeScript, and Firebase. Track your daily habits, visualize streaks, and achieve your goals with a beautiful, responsive interface.

## 🌐 Live Application

Visit the live application: [https://habit-hub-39915.web.app](https://habit-hub-39915.web.app)

**Demo Account:**
- Email: test@example.com
- Password: TestPassword123

## 📋 Project Structure

```
├── docs/                    # Documentation files
│   ├── firebase-setup.md    # Firebase setup guide
├── public/                  # Static assets
├── scripts/                 # Utility scripts
│   ├── init-firebase-data.js # Firebase data initialization
├── src/                     # Source code
│   ├── assets/              # Images, icons, and other static assets
│   ├── components/          # React components
│   │   ├── AddHabitForm/    # Habit creation components
│   │   ├── AuthForm/        # Authentication components
│   │   ├── Calendar/        # Calendar visualization components
│   │   ├── HabitItem/       # Habit display components
│   │   └── ui/              # Reusable UI components
│   ├── config/              # Configuration files
│   │   ├── firebase.ts      # Firebase configuration
│   ├── context/             # React context providers
│   │   ├── AuthContext.tsx  # Authentication state management
│   │   └── NotificationContext.tsx # Notification state management
│   ├── hooks/               # Custom React hooks
│   ├── integration-tests/   # Integration tests
│   ├── pages/               # Page components
│   │   ├── DashboardPage.tsx # Main dashboard
│   │   ├── LandingPage.tsx  # Home/marketing page
│   │   ├── LoginPage.tsx    # Authentication pages
│   │   └── SettingsPage.tsx # User settings
│   ├── services/            # Services for API/Firebase interaction
│   │   ├── api.ts           # API service
│   │   └── firebase/        # Firebase service modules
│   ├── types/               # TypeScript type definitions
│   └── utils/               # Utility functions
│       ├── date-utils.ts    # Date manipulation utilities
├── .env.local               # Local environment variables
├── .env.production          # Production environment variables
├── firestore.rules          # Firestore security rules
├── firebase.json            # Firebase configuration
└── vite.config.ts           # Vite configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Firebase account

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/habithub.git
   cd habithub
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up Firebase:
   Follow the instructions in `docs/firebase-setup.md` to create a Firebase project and obtain your configuration values.

4. Set up environment variables:
   Create a `.env.local` file in the root directory with your Firebase configuration:
   ```
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

5. Initialize sample data (optional):
   ```
   npm run firebase:init-data
   ```

6. Start the development server:
   ```
   npm start
   ```

## 🔧 Available Scripts

- `npm start` - Start the development server
- `npm run build` - Build the app for production
- `npm run test` - Run tests
- `npm run firebase:deploy` - Deploy to Firebase
- `npm run firebase:init-data` - Initialize sample data in Firebase
- `npm run firebase:emulators` - Start Firebase emulators

## 🏗️ Core Features

- **Authentication**: User sign-up, login, and password recovery using Firebase Authentication
- **Habit Tracking**: Create, update, and delete habits
- **Calendar View**: Visualize habit completion patterns with an interactive calendar
- **Streak Tracking**: Monitor habit streaks to stay motivated
- **Templates**: Choose from pre-defined habit templates or create custom habits
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

## 🔥 Firebase Integration

This app uses Firebase for:
- **Authentication**: User management with email/password
- **Firestore**: Real-time database for storing habits and user data
- **Hosting**: Web application deployment
- **Security Rules**: Custom security rules for protecting user data

## 🧪 Testing

The project includes:
- Unit tests for components and utilities
- Integration tests for key user flows (authentication, habit management)
- Test utilities for mocking Firebase services

## 🛠️ Deployment

The application is deployed to Firebase Hosting. To deploy your own instance:

1. Update `.env.production` with your Firebase configuration.

2. Build the project:
   ```
   npm run build
   ```

3. Deploy to Firebase:
   ```
   firebase deploy
   ```

## 📚 Documentation

- `docs/firebase-setup.md` - Detailed instructions for setting up Firebase
- Component documentation is available in the codebase

## 📝 License

This project is licensed under the MIT License.
