# ☕ React Native Coffee Shop App# Welcome to your Expo app 👋



A full-featured coffee shop mobile application built with React Native and Expo, featuring Firebase authentication, Firestore database, and a beautiful coffee-themed UI.This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).



![React Native](https://img.shields.io/badge/React_Native-0.76.9-blue.svg)## Get started

![Expo](https://img.shields.io/badge/Expo-SDK_52-black.svg)

![Firebase](https://img.shields.io/badge/Firebase-10.14-orange.svg)1. Install dependencies

![License](https://img.shields.io/badge/License-MIT-green.svg)

   ```bash

## 📱 Features   npm install

   ```

### Customer Features

- **User Authentication**: Register, login, and manage profile2. Start the app

- **Browse Menu**: View food items by categories (Coffee, Tea, Waffles, Cakes, etc.)

- **Search & Filter**: Find items quickly with search and category filters   ```bash

- **Food Customization**: Customize orders with size, milk options, extras, and sides   npx expo start

- **Shopping Cart**: Add items, modify quantities, persistent cart storage   ```

- **Order Checkout**: Complete orders with delivery details

- **Order History**: View past orders and their statusIn the output, you'll find options to open the app in a



### Admin Features- [development build](https://docs.expo.dev/develop/development-builds/introduction/)

- **Dashboard**: Overview of sales, orders, and analytics- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)

- **Menu Management**: Add, edit, delete food items- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)

- **Order Management**: View and update order status- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

- **Analytics Charts**: Revenue, orders, and category breakdowns

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## 🛠️ Tech Stack

## Get a fresh project

- **Framework**: React Native with Expo SDK 52

- **Navigation**: React Navigation v7 (Stack & Bottom Tabs)When you're ready, run:

- **Backend**: Firebase (Auth, Firestore, Storage)

- **State Management**: React Context API```bash

- **Storage**: AsyncStorage for cart persistencenpm run reset-project

- **Animations**: Lottie React Native```

- **UI Components**: React Native Paper, Vector Icons

- **Charts**: React Native Chart KitThis command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

- **Forms**: Formik + Yup validation

## Learn more

## 📦 Project Structure

To learn more about developing your project with Expo, look at the following resources:

```

├── App.js                    # App entry point- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).

├── app.json                  # Expo configuration- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

├── package.json              # Dependencies

├── .env.example              # Environment variables template## Join the community

├── assets/                   # Images, icons, Lottie animations

│   ├── icon/                 # Lottie animation filesJoin our community of developers creating universal apps.

│   ├── images/               # Static images

│   └── [category folders]/   # Food item images- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.

└── src/- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

    ├── components/           # Reusable components
    │   ├── admin/            # Admin-specific components
    │   ├── cart/             # Cart components
    │   ├── common/           # Shared components (Loading, ErrorBoundary)
    │   └── food/             # Food-related components
    ├── context/              # React Context providers
    │   ├── AuthContext.js    # Authentication state
    │   ├── CartContext.js    # Shopping cart state
    │   └── ThemeContext.js   # Theme configuration
    ├── navigation/           # Navigation configuration
    │   └── AppNavigator.js   # Main navigation setup
    ├── screens/              # Screen components
    │   ├── admin/            # Admin screens
    │   ├── auth/             # Authentication screens
    │   ├── cart/             # Cart & checkout screens
    │   ├── common/           # Shared screens (404)
    │   ├── food/             # Menu & food detail screens
    │   └── order/            # Order history screens
    ├── services/             # External services
    │   ├── api/              # API services
    │   └── firebase/         # Firebase configuration & services
    ├── styles/               # Global styles
    └── utils/                # Utilities & constants
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Firebase account
- Expo Go app (for mobile testing)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/PLMatlhape/React-Native-Restaurant-App.git
   cd React-Native-Restaurant-App
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   
   a. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com)
   
   b. Enable the following services:
      - Authentication (Email/Password)
      - Cloud Firestore
      - Storage
   
   c. Copy your Firebase config from Project Settings > General > Your Apps
   
   d. Create a `.env` file from the template:
   ```bash
   cp .env.example .env
   ```
   
   e. Fill in your Firebase credentials in `.env`:
   ```env
   EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

4. **Set up Firestore indexes** (optional but recommended)
   
   Create composite indexes for optimal query performance in Firebase Console.

5. **Start the development server**
   ```bash
   npx expo start
   ```

6. **Run the app**
   - Press `a` for Android emulator
   - Press `i` for iOS simulator
   - Press `w` for web browser
   - Scan QR code with Expo Go app for physical device

## 📱 Running on Different Platforms

```bash
# Start development server
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios

# Run on web
npm run web

# Clear cache and start
npm run reset
```

## 🗄️ Database Structure

### Firestore Collections

```javascript
// users/{userId}
{
  uid: string,
  name: string,
  surname: string,
  email: string,
  contactNumber: string,
  address: string,
  cardDetails: { ... },
  role: 'customer' | 'admin',
  createdAt: timestamp,
  updatedAt: timestamp
}

// foodItems/{itemId}
{
  name: string,
  description: string,
  price: number,
  category: string,
  imageUrl: string,
  available: boolean,
  createdAt: timestamp,
  updatedAt: timestamp
}

// orders/{orderId}
{
  userId: string,
  userInfo: { ... },
  items: [...],
  total: number,
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered',
  deliveryAddress: string,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

## 🎨 Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Primary | `#6F4E37` | Coffee brown - buttons, headers |
| Secondary | `#D2B48C` | Tan - accents |
| Accent | `#8B4513` | Saddle brown - highlights |
| Background | `#F5E6D3` | Cream - screen backgrounds |
| Text | `#3E2723` | Dark brown - primary text |

## 🔐 Security Notes

- Never commit `.env` files with real credentials
- Use Firebase Security Rules to protect your data
- The `.env.example` file is safe to commit as a template
- Card details should be handled by a payment processor in production

## 📝 Sample Data

The `SAMPLE_DATA.json` file contains example food items you can import to Firestore to get started quickly.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**PLMatlhape**

- GitHub: [@PLMatlhape](https://github.com/PLMatlhape)

## 🙏 Acknowledgments

- [Expo](https://expo.dev) for the amazing development platform
- [Firebase](https://firebase.google.com) for backend services
- [React Navigation](https://reactnavigation.org) for navigation
- [LottieFiles](https://lottiefiles.com) for animations
