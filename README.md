# Expense Tracker (Splitwise Clone)

A simplified expense tracking application built with Expo Router that allows users to create groups, add expenses, and track balances between group members. This app is designed to help friends, roommates, or colleagues easily split expenses and keep track of who owes whom.

## Demo

[View App Demo Video](https://www.youtube.com/watch?v=sVtEbq94MfM)

## Features

### Core Features
- **Group Management**: Create and manage expense groups
- **Expense Tracking**: Add expenses with details like title, description, category, amount
- **Split Logic**: Split expenses equally or customize the split
- **Payer Selection**: Choose who paid for an expense
- **Balance Tracking**: See who owes what to whom with visual indicators
- **Persistent Storage**: All data is saved locally and persists between app restarts

### Bonus Features
- **Firebase Google Authentication**: Secure user accounts with Google Sign-In
- **Member Management**: View and manage all members in a group
- **Balance Summary**: See total amounts owed/received per group and overall
- **Categories with Icons**: Visual categorization of expenses
- **Dark Mode Support**: Toggle between light and dark themes based on system preferences
- **Rich Notifications**: Get notified when you're added to a group or when expenses are added
- **Camera Integration**: Take photos of receipts to attach to expenses
- **Haptic Feedback**: Tactile response for important actions
- **Expense Sharing**: Share expense details with others via native sharing

## Technology Stack

- **Framework**: React Native with Expo (SDK 52)
- **Routing & Navigation**: Expo Router 4.0
- **State Management**: Zustand 4.5
- **Persistent Storage**: AsyncStorage
- **Authentication**: Firebase + expo-auth-session
- **UI Components**: React Native Paper
- **Icons**: Lucide React Native + Expo Vector Icons
- **Animations**: React Native Reanimated
- **Gestures**: React Native Gesture Handler
- **Styling**: Expo Linear Gradient, Expo Blur
- **Date Handling**: date-fns
- **Charts & Visualizations**: Victory Native
- **Notifications**: Expo Notifications


## Installation and Setup

1. Clone the repository
   ```bash
   git clone https://github.com/your-username/expense-tracker.git
   cd expense-tracker
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up Firebase
   - Create a Firebase project at https://console.firebase.google.com/
   - Enable Authentication with Google Sign-In
   - Create a `firebaseConfig.js` file in the `/utils` directory
   ```javascript
   // utils/firebaseConfig.js
   export const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_AUTH_DOMAIN",
     projectId: "YOUR_PROJECT_ID",
     storageBucket: "YOUR_STORAGE_BUCKET",
     messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
     appId: "YOUR_APP_ID"
   };
   ```

4. Start the development server
   ```bash
   npm start
   # or
   yarn start
   ```

5. Run on a device or emulator
   - Scan the QR code with the Expo Go app on your phone
   - Press 'a' to run on an Android emulator (requires Android Studio)
   - Press 'i' to run on an iOS simulator (requires Xcode on macOS)

## Key Implementation Details

### Expo Router Architecture

The app is built using Expo Router, which provides a file-system based routing system. This architecture allows for:
- Cleaner navigation management
- Type-safe route params
- Deep linking support
- Shared layouts across routes

### State Management with Zustand

The app uses Zustand for state management, dividing the store into logical domains:




## Development Challenges and Solutions

1. **Complex State Management**: Managing the interrelated state of groups, expenses, and balances required careful design of the Zustand stores and persistence layer.
   
   *Solution*: Implemented modular store structure with cross-store communication patterns.

2. **Optimizing Balance Calculations**: Computing balances efficiently for large groups with many expenses was challenging.
   
   *Solution*: Implemented memoization and optimized the debt simplification algorithm.

3. **Offline Support**: Ensuring the app functions properly without internet connection while still supporting authentication.
   
   *Solution*: Implemented proper caching strategies and fallback UI states.

4. **Navigation Complexity**: Managing deep linking and complex navigation patterns.
   
   *Solution*: Leveraged Expo Router's file-based routing system for clean, maintainable navigation.

## Contribution

This project was developed as part of the Kapidron Internship Hiring Process. If you'd like to contribute in the future, please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by Splitwise
- Built with Expo and React Native
- Developed for Kapidron Internship Hiring Process
