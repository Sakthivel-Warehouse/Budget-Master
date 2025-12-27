@echo off
REM Room Expense Admin - APK Build Script
REM This script automates the Capacitor setup and APK generation

echo.
echo ========================================
echo  Room Expense Admin - APK Builder
echo ========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed. Please install from https://nodejs.org/
    pause
    exit /b 1
)
echo [OK] Node.js is installed

REM Check if Java is installed
java -version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Java is not installed. Please install JDK from https://www.oracle.com/java/technologies/downloads/
    pause
    exit /b 1
)
echo [OK] Java is installed

REM Check if Android SDK is installed
if not defined ANDROID_HOME (
    echo ERROR: ANDROID_HOME environment variable is not set
    echo Please install Android Studio and set ANDROID_HOME
    pause
    exit /b 1
)
echo [OK] Android SDK found at %ANDROID_HOME%

cd /d c:\Users\DELL\room\frontend

echo.
echo [Step 1/6] Installing Capacitor...
call npm install @capacitor/core @capacitor/cli @capacitor/android --save
if errorlevel 1 (
    echo ERROR: Failed to install Capacitor
    pause
    exit /b 1
)
echo [OK] Capacitor installed

echo.
echo [Step 2/6] Building React app for production...
call npm run build
if errorlevel 1 (
    echo ERROR: Failed to build React app
    pause
    exit /b 1
)
echo [OK] Build complete

echo.
echo [Step 3/6] Initializing Capacitor project...
if exist capacitor.config.json (
    echo Capacitor already initialized
) else (
    REM Create config file
    (
        echo {
        echo   "appId": "com.roomexpense.admin",
        echo   "appName": "Room Expense Admin",
        echo   "webDir": "build",
        echo   "server": {
        echo     "androidScheme": "https"
        echo   },
        echo   "plugins": {
        echo     "SplashScreen": {
        echo       "launchAutoHide": true
        echo     }
        echo   }
        echo }
    ) > capacitor.config.json
    echo [OK] Capacitor config created
)

echo.
echo [Step 4/6] Adding Android platform...
if exist android (
    echo Android platform already exists
) else (
    call npx cap add android
    if errorlevel 1 (
        echo ERROR: Failed to add Android platform
        pause
        exit /b 1
    )
)
echo [OK] Android platform ready

echo.
echo [Step 5/6] Copying files to Android...
call npx cap copy
call npx cap sync
echo [OK] Files synced

echo.
echo [Step 6/6] Opening Android Studio...
echo Please wait, Android Studio is launching...
call npx cap open android

echo.
echo ========================================
echo  Next Steps:
echo  1. In Android Studio, go to: Build menu
echo  2. Select: Generate Signed Bundle / APK
echo  3. Choose: APK
echo  4. Create new keystore (save password!)
echo  5. Select: release build type
echo  6. Click: Finish
echo.
echo  APK will be saved to:
echo  android/app/release/app-release.apk
echo ========================================
echo.
pause
