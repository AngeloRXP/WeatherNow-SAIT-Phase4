# WeatherNow - Weather Application

**SAIT Mobile Application Development - Phase 4**

## 👥 Team Members
- **Angelo Pires** - Student ID: 000920614
- **Jude Uyeno** - Student ID: 000793423

## 📱 About
WeatherNow is a comprehensive React Native weather application built for SAIT's Mobile Application Development course (ITSC320). The app provides real-time weather information and 7-day forecasts for cities worldwide.

## ✨ Features
- ✅ Real-time weather data via OpenWeather API
- ✅ 7-day weather forecast
- ✅ City search functionality
- ✅ Current location weather (Calgary default)
- ✅ Customizable settings (temperature units, wind speed units, time format)
- ✅ Weather alerts and daily forecast notifications
- ✅ Clean, modern UI with gradient backgrounds
- ✅ Bottom tab navigation (Home, Forecast, Search, Settings)

## 🛠️ Technologies
- React Native 0.76+
- React Navigation (Bottom Tabs & Native Stack)
- OpenWeather API
- AsyncStorage for local data persistence
- Axios for HTTP requests
- React Native Vector Icons
- React Native Screens & Safe Area Context

## 📦 Installation

### Prerequisites
- Node.js 18+
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

### Setup
```bash
# Clone repository
git clone https://github.com/AngeloRXP/WeatherNow-SAIT-Phase4.git

# Navigate to project
cd WeatherNow-SAIT-Phase4

# Install dependencies
npm install

# Run on Android
npm run android

# Run on iOS
npm run ios
```

## 🔑 Configuration

### OpenWeather API Key
1. Sign up at https://openweathermap.org/api
2. Get your free API key
3. Add it to `src/utils/constants.js`:
```javascript
export const OPENWEATHER_API_KEY = 'your_api_key_here';
```

## 📱 Screens

### 1. Home Screen
- Current weather conditions
- Temperature, feels like, and weather description
- Humidity, wind speed, UV index, and visibility
- Hourly forecast for next 24 hours

### 2. Forecast Screen
- 7-day weather forecast
- Daily high/low temperatures
- Weather conditions for each day
- Detailed forecast on tap

### 3. Search Screen
- Search cities worldwide
- Recent searches history
- Popular cities quick access
- Current location button

### 4. Settings Screen
- Temperature unit (Celsius/Fahrenheit)
- Wind speed unit (km/h, m/s, mph)
- Time format (12h/24h)
- Notification preferences
- Favorite locations management

## 📂 Project Structure
```
WeatherNowAppNew/
├── android/              # Android native code
├── ios/                  # iOS native code
├── src/
│   ├── components/       # Reusable components
│   ├── screens/          # Main app screens
│   ├── services/         # API and storage services
│   └── utils/            # Helper functions and constants
├── App.js               # Main app component
└── package.json         # Dependencies
```

## 🎓 Course Information
- **Course:** ITSC320 - Mobile Application Development
- **Institution:** Southern Alberta Institute of Technology (SAIT)
- **Semester:** Fall 2024
- **Phase:** 4 (Final Project)

## 📄 License
Educational project for SAIT - 2024

## 🙏 Acknowledgments
- OpenWeather API for weather data
- React Native community for excellent documentation
- SAIT instructors for guidance and support