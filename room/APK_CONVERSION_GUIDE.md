# Room Expense Admin - APK Conversion Guide

This guide will help you convert the React web app into an Android APK using **Capacitor**.

## Option 1: Using Capacitor (Recommended - Easiest)

Capacitor allows you to wrap your existing React web app as a native mobile app with minimal changes.

### Prerequisites
1. **Node.js** (v16+) - Already have this
2. **Java Development Kit (JDK)** - Download from https://www.oracle.com/java/technologies/downloads/
3. **Android Studio** - Download from https://developer.android.com/studio
4. **Android SDK** - Installed with Android Studio

### Step 1: Install Java & Android Studio

```bash
# Download and install JDK 11 or higher
# https://www.oracle.com/java/technologies/downloads/

# Download and install Android Studio
# https://developer.android.com/studio
```

After installation, set environment variables:
```bash
# Set ANDROID_HOME (Windows PowerShell as Admin)
[Environment]::SetEnvironmentVariable("ANDROID_HOME", "C:\Users\DELL\AppData\Local\Android\Sdk", "User")
[Environment]::SetEnvironmentVariable("JAVA_HOME", "C:\Program Files\Java\jdk-17", "User")

# Add to PATH
[Environment]::SetEnvironmentVariable("PATH", $env:PATH + ";C:\Users\DELL\AppData\Local\Android\Sdk\tools;C:\Users\DELL\AppData\Local\Android\Sdk\platform-tools", "User")
```

### Step 2: Build the React App for Production

```bash
cd c:\Users\DELL\room\frontend
npm run build
```

This creates an optimized build in the `frontend/build` folder.

### Step 3: Install Capacitor

```bash
cd c:\Users\DELL\room\frontend

# Install Capacitor CLI and Core
npm install @capacitor/core @capacitor/cli --save

# Install Android platform
npm install @capacitor/android
```

### Step 4: Initialize Capacitor

```bash
npx cap init

# When prompted, enter:
# App name: Room Expense Admin
# App Package ID: com.roomexpense.admin
# Directory: ionic (default)
```

### Step 5: Add Android Platform

```bash
npx cap add android
```

This creates an `android` folder in your project.

### Step 6: Build and Deploy to APK

```bash
# Copy built React app to Android
npx cap copy

# Sync all changes
npx cap sync

# Open Android Studio project
npx cap open android
```

### Step 7: Generate APK in Android Studio

1. **In Android Studio**, go to **Build → Generate Signed Bundle / APK**
2. Select **APK** option
3. Create a new keystore (Save it safely!)
   - Key store path: `room-app-key.jks`
   - Password: Create a strong password
   - Alias: `room_app`
   - Validity: 10000+ days
4. Click **Next → Finish**
5. Wait for build to complete
6. APK will be generated at:
   ```
   android/app/release/app-release.apk
   ```

### Step 8: Install APK on Device/Emulator

```bash
# Using ADB (Android Debug Bridge)
adb install android/app/release/app-release.apk

# Or manually transfer the APK to your device and tap to install
```

---

## Option 2: Using React Native (Complete Rewrite)

If you want a native app experience but requires rewriting the entire app in React Native:

```bash
npx create-expo-app room-expense-admin
cd room-expense-admin
npm install
```

This is more work but gives better performance.

---

## Option 3: Using Cordova (Legacy)

Similar to Capacitor but older technology. Not recommended.

---

## Important Considerations for APK

### 1. API Backend URL
Your app currently uses `localhost:5000`. For mobile APK:

**Update the axios instance in `frontend/src/api/axios.js`:**

```javascript
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://your-server-ip:5000'
});
```

Then set in `.env`:
```
REACT_APP_API_URL=http://192.168.x.x:5000  # Your server IP
```

### 2. Manifest Permissions
Add to `android/app/src/main/AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
```

### 3. Network Security Configuration
Create `android/app/src/main/res/xml/network_security_config.xml`:

```xml
<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <domain-config cleartextTrafficPermitted="true">
        <domain includeSubdomains="true">192.168.1.0</domain>
        <domain includeSubdomains="true">10.0.0.0</domain>
        <domain includeSubdomains="true">localhost</domain>
    </domain-config>
</network-security-config>
```

Reference in `AndroidManifest.xml`:
```xml
<application android:networkSecurityConfig="@xml/network_security_config">
```

### 4. Backend Deployment (for Production APK)
For a production-ready APK, deploy your backend to a cloud server:

**Recommended Platforms:**
- **Heroku** (Free tier available) - `npm install -g heroku-cli`
- **AWS** - EC2 instances
- **Google Cloud** - App Engine
- **DigitalOcean** - VPS

### 5. HTTPS Setup
For Google Play Store, HTTPS is required:

```bash
# Get free SSL certificate with Let's Encrypt
# Deploy on a cloud server with SSL
```

---

## Quick Command Cheat Sheet

```bash
# Build for release
npm run build

# Install Capacitor
npm install @capacitor/core @capacitor/cli

# Add Android
npm install @capacitor/android
npx cap add android

# Prepare for build
npx cap copy
npx cap sync

# Open in Android Studio
npx cap open android

# Manual build (if Android Studio is difficult)
cd android
./gradlew assembleRelease
# APK at: app/release/app-release.apk
```

---

## Troubleshooting

### Issue: "ANDROID_HOME not set"
```bash
# Windows PowerShell (Admin)
[Environment]::SetEnvironmentVariable("ANDROID_HOME", "C:\Users\DELL\AppData\Local\Android\Sdk", "User")
```

### Issue: "Java not found"
```bash
# Set JAVA_HOME
[Environment]::SetEnvironmentVariable("JAVA_HOME", "C:\Program Files\Java\jdk-17", "User")
```

### Issue: "Port already in use"
Change backend port in `.env`:
```
PORT=5001
```

### Issue: "API not responding on mobile"
Use device IP instead of localhost:
```bash
# Get your PC IP
ipconfig

# Update API URL to: http://192.168.x.x:5000
```

---

## Next Steps

1. ✅ Install Java & Android Studio
2. ✅ Set environment variables
3. ✅ Run `npm run build` in frontend
4. ✅ Install Capacitor and add Android
5. ✅ Update API URLs for mobile
6. ✅ Generate signed APK in Android Studio
7. ✅ Test on Android emulator or device
8. ✅ (Optional) Upload to Google Play Store

---

## Support & Resources

- **Capacitor Docs**: https://capacitorjs.com/docs
- **Android Studio Guide**: https://developer.android.com/studio/intro
- **React + Capacitor**: https://capacitorjs.com/docs/guides/react
- **Gradle Build Guide**: https://gradle.org/

