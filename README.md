# Shed & Fed

A cross-platform mobile app for reptile owners to track care logs — feedings, shedding, temperatures, weight, and notes. Built with [Expo](https://expo.dev) and React Native for **iOS** and **Android**.

## Features

- **Reptile profiles** — name, species, and optional notes
- **Care logging** — record:
  - **Feeding** — food type and amount
  - **Shedding** — complete, partial, stuck shed, or blue phase
  - **Temperature** — hot side, cool side, and ambient (°F)
  - **Weight** — with g, kg, oz, or lb units
  - **Notes** — free-form observations
- **Activity feed** — recent logs across all reptiles
- **Local storage** — data stays on your device (SQLite)
- **Dark mode** — follows system appearance

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [Expo Go](https://expo.dev/go) on your phone (easiest way to try the app), or Android Studio / Xcode for emulators

### Install & Run

```bash
npm install
npm start
```

Then:

- Press **a** for Android emulator
- Press **i** for iOS simulator (macOS only)
- Scan the QR code with **Expo Go** on your phone

### Build for Production

For standalone app builds, use [EAS Build](https://docs.expo.dev/build/introduction/):

```bash
npx eas-cli build --platform android
npx eas-cli build --platform ios
```

## Project Structure

```
app/                  # Screens (Expo Router file-based routing)
  (tabs)/             # Main tabs: Reptiles & Activity
  reptile/            # Add reptile, detail, and log entry screens
components/           # Reusable UI components
contexts/             # React context for app data
lib/                  # Database, types, and formatting helpers
constants/            # Theme colors
```

## Tech Stack

- **Expo SDK 56** + **React Native**
- **Expo Router** for navigation
- **expo-sqlite** for on-device persistence
- **TypeScript**

## License

MIT
