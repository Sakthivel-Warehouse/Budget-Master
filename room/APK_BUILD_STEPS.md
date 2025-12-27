# APK Build - Step-by-Step Setup

## ⚡ Quick Start (Windows)

### Prerequisites Checklist
- [ ] Java Development Kit (JDK 11+)
- [ ] Android Studio
- [ ] Environment variables set
- [ ] React app built

---

## 📋 Step 1: Install Java & Android Studio

### 1.1 Install JDK (Java Development Kit)

```bash
# Download from: https://www.oracle.com/java/technologies/downloads/
# Select: JDK 17 (or 11, 21)

# After installation, verify:
java -version
javac -version
```

### 1.2 Install Android Studio

```bash
# Download from: https://developer.android.com/studio
# Run installer and follow defaults
# IMPORTANT: During setup, ensure Android SDK is installed
```

---

## 🔧 Step 2: Set Environment Variables

**Windows PowerShell (Run as Administrator):**

```powershell
# Set JAVA_HOME (adjust path if different)
[Environment]::SetEnvironmentVariable("JAVA_HOME", "C:\Program Files\Java\jdk-17", "User")

# Set ANDROID_HOME (default installation)
[Environment]::SetEnvironmentVariable("ANDROID_HOME", "C:\Users\DELL\AppData\Local\Android\Sdk", "User")

# Add to PATH
$currentPath = [Environment]::GetEnvironmentVariable("PATH", "User")
$newPath = $currentPath + ";C:\Users\DELL\AppData\Local\Android\Sdk\tools;C:\Users\DELL\AppData\Local\Android\Sdk\platform-tools"
[Environment]::SetEnvironmentVariable("PATH", $newPath, "User")

# Restart terminal for changes to take effect
```

**Verify setup:**

```bash
# Open new PowerShell window
echo $env:JAVA_HOME
echo $env:ANDROID_HOME
adb --version
```

---

## 🏗️ Step 3: Build React App

```bash
cd c:\Users\DELL\room\frontend

# Install dependencies (if needed)
npm install

# Build for production
npm run build

# Verify build folder exists
ls build/
```

---

## 📱 Step 4: Install Capacitor

```bash
cd c:\Users\DELL\room\frontend

# Install Capacitor packages
npm install @capacitor/core @capacitor/cli @capacitor/android --save

# Verify installation
npx cap --version
```

---

## 🤖 Step 5: Add Android Platform

```bash
cd c:\Users\DELL\room\frontend

# Add Android platform (creates 'android' folder)
npx cap add android

# Verify android folder was created
ls android/
```

---

## 🔄 Step 6: Sync and Copy Files

```bash
cd c:\Users\DELL\room\frontend

# Copy React build to Android
npx cap copy

# Sync all native changes
npx cap sync
```

---

## 🎯 Step 7: Update API Configuration

**Important: Update backend URL for mobile**

Edit `c:\Users\DELL\room\frontend\src\api\axios.js`:

```javascript
const apiUrl = process.env.REACT_APP_API_URL || 'http://your-ip:5000';

const axiosInstance = axios.create({
  baseURL: apiUrl,
  timeout: 10000
});

// ... rest of code
```

Create `.env` file in `frontend/`:

```env
REACT_APP_API_URL=http://192.168.x.x:5000
```

**Replace `192.168.x.x` with your computer's IP address:**

```bash
# Get your IP on Windows
ipconfig

# Look for "IPv4 Address" under your network
```

---

## 🏢 Step 8: Open in Android Studio

```bash
cd c:\Users\DELL\room\frontend

# Open Android Studio project
npx cap open android
```

This launches Android Studio with your project ready to build.

---

## 📦 Step 9: Generate APK

### In Android Studio:

1. **Wait for Gradle sync to complete** (bottom right progress indicator)

2. Go to menu: **Build → Generate Signed Bundle / APK**

3. Select **APK** (not Bundle)

4. Click **Next**

5. **Create new Keystore** (First time only):
   - **Key store path**: `C:\Users\DELL\room-app-key.jks`
   - **Password**: Create a strong password (save it!)
   - **Confirm password**: Repeat
   - **Alias**: `room_app`
   - **Password**: Same as keystore
   - **Validity (years)**: `10000`
   - Click **OK**

6. **Select Build Type**: Choose `release`

7. Click **Finish**

8. **Wait for build** (5-10 minutes)

9. **Build complete!** Message appears at bottom right

---

## 📂 Step 10: Locate Generated APK

```bash
# APK file location:
c:\Users\DELL\room\frontend\android\app\release\app-release.apk

# APK size: ~20-30 MB
```

---

## 📱 Step 11: Install on Device

### Option A: Android Emulator (in Android Studio)

```bash
# In Android Studio: Tools → AVD Manager → Create Virtual Device
# Then: Run → Run 'app'
```

### Option B: Physical Device

```bash
# 1. Enable Developer Mode on phone
#    Settings → About Phone → Tap Build Number 7 times
#    Settings → Developer Options → USB Debugging ON

# 2. Connect phone via USB

# 3. Copy APK to phone:
adb install c:\Users\DELL\room\frontend\android\app\release\app-release.apk

# Or manually:
# - Copy APK to phone storage
# - Open file manager on phone
# - Tap APK to install
```

### Option C: Using ADB Command

```bash
# With phone connected via USB
adb devices  # Verify phone is listed

adb install -r c:\Users\DELL\room\frontend\android\app\release\app-release.apk
```

---

## ✅ Testing the APK

1. **Open app on device**
2. **Test login** with member credentials
3. **Check dashboard loads** correctly
4. **Test all features:**
   - View expenses
   - Post new expense
   - See payment status
   - Admin features

---

## 🐛 Troubleshooting

### Issue: "ANDROID_HOME not found"
```bash
# Verify path
echo $env:ANDROID_HOME

# If empty, set again:
[Environment]::SetEnvironmentVariable("ANDROID_HOME", "C:\Users\DELL\AppData\Local\Android\Sdk", "User")

# Close and reopen PowerShell
```

### Issue: "Java not found"
```bash
java -version

# If error, JDK not installed or JAVA_HOME not set
# Download from: https://www.oracle.com/java/technologies/downloads/
```

### Issue: "Gradle sync failed"
```bash
# In Android Studio:
# File → Invalidate Caches → Invalidate and Restart
```

### Issue: "API not responding on mobile"
```bash
# Device must be on same network as backend
# Update axios.js with device IP instead of localhost

# If on mobile hotspot:
# Get PC IP: ipconfig
# Update: REACT_APP_API_URL=http://192.168.x.x:5000
# Rebuild: npm run build
```

### Issue: "Port 5000 in use"
```bash
# Change backend port in backend/.env
PORT=5001

# Restart backend
cd c:\Users\DELL\room\backend
npm run dev
```

---

## 🚀 Publishing to Google Play Store

Once APK is tested and working:

1. **Create Google Play Developer account** ($25 one-time)
2. **Create app on Google Play Console**
3. **Upload APK**
4. **Add screenshots & description**
5. **Submit for review** (1-3 days)
6. **Published!**

---

## 📝 Notes

- APK is now ready to share or publish
- Keep `room-app-key.jks` safe (needed for updates)
- APK valid for all Android 5.0+ devices
- File size: ~25-30 MB
- Download size on device: ~60-80 MB

