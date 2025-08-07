
# ZEST - Student Performance Tracker 📊

A comprehensive cross-platform mobile application for tracking early-grade student performance across various learning strands. Built with modern UI/UX principles, dark/light theming, and robust state management using Zustand.

![ZEST App Preview](/assets/images/logo.png)

---

## 🚀 Features

### Core Functionality
- 🔑 **Mastery Key Panel**: Color-coded performance levels — BE (Below), AE (Approaching), ME (Meeting), EE (Exceeding)
- 📈 **Performance Tracking**: Monitor student progress across strands like Letter Identification, Letter Naming, etc.
- 🔍 **Search and Filter**: Quickly find students or strands by name or performance level
- 📊 **Progress Analytics**: Visual indicators using percentage bars and student badges
- 🧠 **Strand Expansion**: Tap to view and drill into students for each strand
- 📦 **Compact/Expanded Modes**: Toggle between views for dense or visual layouts

### UI/UX Features
- 🌓 **Dark/Light Mode**: Seamless theme switching with persistent preferences
- 💫 **Animated Transitions**: Smooth interactions with subtle entrance effects
- ⚙️ **Settings Screen**: Profile, privacy, theme toggle, logout, and more
- ♿ **Accessibility Friendly**: Optimized contrast, touch targets, and dynamic font sizes
- 📱 **Responsive Design**: Tailored layout for both iOS and Android devices

---

## 🛠 Tech Stack

| Layer         | Technology                      |
|---------------|----------------------------------|
| Framework     | React Native + Expo              |
| Language      | TypeScript                       |
| State         | Zustand                          |
| Networking    | Axios                            |
| Mock Backend  | JSON Server                      |
| Navigation    | React Navigation                 |
| Theming       | Context API + System Detection   |
| Icons         | Expo Vector Icons                |

---

## 📱 Screenshots

| Light Mode | Dark Mode | Strand Progress |
|------------|-----------|-----------------|
| ![Light] (/assets/screenshot/Simulator Screenshot - iPhone 15 Pro - 2025-08-07 at 12.31.42) | ![Dark](./assets/screenshots/darkmode.png) | ![Student](./assets/screenshots/student.png) |

---

## 🧠 Design Decisions

### State Management
- **Zustand** for simplicity, global accessibility, and minimal boilerplate
- Centralized store for strands, students, and theme preference

### API Architecture
- **JSON Server** enables rapid testing and REST simulation
- Custom API layer via `axios` inside `src/services/` handles HTTP logic
- Easily swappable for real backend with same endpoints

### Theming System
- Context-based dynamic light/dark theme
- Auto-detects system preference on first load
- Smooth toggle and persistence via `useTheme` hook

### UI/UX Philosophy
- Mobile-first layout, fluid transitions, and clean surfaces
- Dynamic colors and shadows based on theme
- Clear information hierarchy and progressive disclosure

---

## 🏗 Project Structure

```
zest/
├── src/
│   ├── components/         # Reusable UI elements
│   ├── screens/            # App screens (Home, StudentDetail, Settings, etc.)
│   ├── navigation/         # Navigation stack and tabs
│   ├── store/              # Zustand global store
│   ├── services/           # Axios API utilities
│   ├── theme/              # Theme definitions + provider
│   ├── types/              # TypeScript interfaces and types
│   └── config/             # Global constants and endpoints
├── assets/                 # Icons, images, etc.
├── db.json                 # JSON Server mock database
└── README.md
```

---

## 🧪 Testing

### Manual Testing Checklist
- ✅ Login screen validation and flow
- ✅ Theme toggling across screens
- ✅ API fetch and error handling
- ✅ Filter and search functionality
- ✅ Student detail navigation and rendering
- ✅ Strand expansion/collapse logic
- ✅ Works on Expo Go (physical devices) and simulator

### Debug Mode

Enable console logging for API requests:

```javascript
console.log("API BASE URL:", getBaseURL());
```

## 🚧 Known Issues & Solutions

### Physical Device Connectivity

- **Issue**: API requests fail on physical devices
- **Solution**: Use actual IP address instead of localhost
- **Verification**: Test API endpoint in browser: `http://YOUR_IP:3000/class_profile`

---

## 🔧 Local Development

### 1. Clone the Repository

```bash
git clone https://github.com/Ben-Genius/zest.git
cd zest
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start JSON Server

```bash
npm install -g json-server

# Run this to allow physical devices to access backend
json-server --watch db.json --port 3000 --host 0.0.0.0
```

> Replace `localhost` with your local IP address in `src/config/index.ts`:
```ts
export const BASE_URL = "http://192.168.X.X:3000";
```

Find your IP:
- **Windows**: `ipconfig` → IPv4 address
- **macOS/Linux**: `ifconfig` or `hostname -I`

### 4. Start the Expo Project

```bash
npx expo start
```

- Press `i` to open iOS simulator
- Press `a` for Android
- Or scan QR code using Expo Go

---

## 🔗 API Endpoints

These are served via JSON Server:

- `GET /class_profile` → Fetches strands and student info
- `GET /students` → Retrieves student data
- Format:
```json
{
  "strandId": "1",
  "strand": "Letter Identification",
  "students": [{ "studentId": "x", "name": "Azay", "competence": "ME" }]
}
```

---

## 💡 Assumptions

- The app assumes:
  - One teacher manages one class
  - All data is static (no live updates)
  - Auth is local-only (no server auth)
  - All students belong to predefined strands
  - 4 fixed strands per class

---

## 📘 Figma Design

👉 [Figma Design Link](https://www.figma.com/file/xyz123/Zest-Design)  
(*Replace with your actual Figma URL*)

---
## 🎯 Future Enhancements

- [ ] Student detail profiles
- [ ] Performance trend analytics
- [ ] Export functionality for reports
- [ ] Push notifications for updates
- [ ] Offline data synchronization
- [ ] Parent/guardian portal integration

## ✅ Submission Checklist

- [x] GitHub Repo: https://github.com/Ben-Genius/zest
- [x] JSON Server running with mock data
- [x] Dark/Light theme toggle with persistence
- [x] Zustand for global state
- [x] Mobile-optimized UI with animations
- [x] Error handling for loading/failure states
- [x] Settings screen with toggles and logout
- [x] Clear README with setup instructions
- [x] Screenshots and Figma link included

---

## 🤝 Contributing

1. Fork this repo
2. Create a new branch
3. Commit and push
4. Submit a pull request!

---

## 👨‍💻 Developer

**Ben Genius**  
GitHub: [@Ben-Genius](https://github.com/Ben-Genius)  
Email: geniusben24@gmail.com

---



---

**Built with ❤️ for educators** — empowering teachers through intuitive performance tools.
