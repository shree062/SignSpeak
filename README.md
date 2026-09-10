# SignSpeak: AI-Powered Sign Language Translation Application

[![Android](https://img.shields.io/badge/Platform-Android%20(API%2024%2B)-3DDC84.svg?style=flat&logo=android)](https://www.android.com)
[![Kotlin](https://img.shields.io/badge/Language-Kotlin%201.9-7F52FF.svg?style=flat&logo=kotlin)](https://kotlinlang.org)
[![ML](https://img.shields.io/badge/ML-TensorFlow%20Lite%20(CNN%20%2B%20LSTM)-FF6F00.svg?style=flat&logo=tensorflow)](https://www.tensorflow.org/lite)
[![Architecture](https://img.shields.io/badge/Architecture-MVVM%20%2B%20Room-6C5CE7.svg?style=flat)](https://developer.android.com/topic/architecture)

**SignSpeak** is a native Android and Web application engineered for the MCA Final-Year Project: **"Sign Language Translation Application for Deaf and Dumb"**.

The application recognizes sign language gestures via the device camera (CameraX / MediaPipe) and gallery media, converting dynamic signs into natural **text** and **spoken audio (Text-to-Speech)** in real time. It is architected for complete **offline-first reliability** using on-device TensorFlow Lite machine learning and Room local database persistence.

---

## 👥 Contributors

<a href="https://github.com/Pranicak">
  <img src="https://github.com/Pranicak.png?size=100" width="100px" alt="Prani" />
</a>

- **[Shree Nithiy Karthikeyan](https://github.com/shree062)** — Project Lead & Developer
- **[Prani](https://github.com/Pranicak)** — Contributor

---

## 🌟 Key Highlights

- **Real-Time CameraX & MediaPipe Vision**: Zero-latency frame streaming with 21-joint skeletal landmark overlays and facial emotion recognition.
- **CNN + LSTM/GRU ML Pipeline**: Spatial feature extraction (hand shape, position, contours) combined with temporal sequence modeling over video frames.
- **Offline & Online Modes**: Performs complete sign translation, text generation, speech synthesis, and history logging without an active internet connection.
- **Offline Text-to-Speech**: Native Android & Web TTS with configurable speech speed, pitch, and multi-language support.
- **Room Local Database**: Persistent storage for User accounts, translation History, and Favorites with search and date filters (Today, This Week, This Month).
- **Interactive Learn Signs Module**: Pre-loaded catalog of 25+ essential sign gestures with step-by-step visual instructions and audio pronunciation.
- **Material 3 Design**: Modern purple-accented user interface matching provided UI specifications.

---

## 📱 Screenshots & Screen Modules

1. **Authentication Screen**: Clean login with Email/Username & Password, password toggle, "Forgot Password?", Google/Facebook login, and Sign Up.
2. **Home / Main Translation Screen**:
   - Source: "FROM: SIGN LANGUAGE" (Camera & Gallery toggles, interactive live 21-joint skeleton canvas).
   - Destination: "TO: TEXT & SPEECH" with output box and action buttons: **[Copy]**, **[Play Speech]**, **[Share]**.
   - 4 Quick Access Cards: **History**, **Favorites**, **Learn Signs**, **Settings**.
   - Recent Translations dynamic list.
3. **Live Camera Translation Screen**: Real-time CameraX preview, live predicted sign label, confidence percentage bar, natural spoken translation, and quick audio playback.
4. **Gallery Translation Screen**: Image/video picker with an animated 4-stage machine learning progress pipeline.
5. **Translation History Screen**: Search bar and date/type filter chips (*All*, *Favorites*, *Today*, *This Week*, *This Month*).
6. **Favorites Screen**: Instant bookmarked gestures library.
7. **Learn Signs Dictionary**: Searchable 2-column sign grid with gesture details and interactive bottom sheet.
8. **User Profile**: User details, translation statistics (Total count, Favorites, Signs learned, Avg accuracy), and profile editing.
9. **Settings Screen**: Offline/Online toggle, TTS rate/pitch sliders, ML confidence threshold slider, and cache management.

---

## 🏗️ Project Architecture & Tech Stack

```
com.signspeak.app
├── data/
│   ├── local/
│   │   ├── AppDatabase.kt (Room Database)
│   │   ├── dao/ (UserDao, HistoryDao, SignDao)
│   │   └── entity/ (UserEntity, HistoryEntity, SignEntity)
│   ├── pref/
│   │   └── PreferenceManager.kt (SharedPreferences Session)
│   └── repository/ (UserRepository, HistoryRepository, SignRepository)
├── ml/
│   ├── SignLanguageClassifier.kt (TFLite CNN+LSTM Inference)
│   ├── PreprocessingUtils.kt (224x224 RGB Normalization & ImageProxy)
│   └── RecognitionResult.kt
├── tts/
│   └── TTSManager.kt (Lifecycle-Aware Android TextToSpeech)
├── utils/ (NetworkMonitor, DateUtils, Constants)
└── ui/
    ├── auth/ (LoginActivity, SignUpActivity, ForgotPasswordActivity, AuthViewModel)
    ├── main/ (MainActivity, MainViewModel, HomeFragment, HistoryFragment, LearnSignsFragment, ProfileFragment, SettingsFragment)
    ├── camera/ (CameraTranslationActivity, CameraViewModel)
    ├── gallery/ (GalleryTranslationActivity, GalleryViewModel)
    ├── history/ (HistoryAdapter, HistoryDetailDialog, HistoryViewModel)
    └── learn/ (LearnSignsAdapter, SignDetailBottomSheet, LearnViewModel)
```

---

## 🚀 Getting Started

### 1. Web Application (Instant Demo in Browser)
- Double click `run_web_app.bat` or navigate to `http://localhost:8000/`.
- Instant guest access with real-time MediaPipe webcam hand tracking.

### 2. Native Android Application (Android Studio)
- Open `c:\Users\ShreenithiyKarthikey\signlang\SignSpeak` in **Android Studio**.
- Gradle will sync and build automatically.
- Run on any device or emulator (API 24+).

### Demo Login Credentials
- **Email**: `shree@signspeak.ai`
- **Password**: `password123`
*(Or click "Sign Up" or "Continue with Google")*

---

## 🧠 Custom ML Model Training & Drop-In Replacement

To replace the included model with your custom trained TensorFlow Lite model:
1. Train your CNN + LSTM / GRU model on Indian / American Sign Language datasets.
2. Export your model as a 32-bit Float TensorFlow Lite file:
   - **Input Shape**: `[1, 224, 224, 3]`
   - **Output Shape**: `[1, 25]` (or number of classes)
3. Copy your `.tflite` file to:
   ```
   app/src/main/assets/sign_language_model.tflite
   ```
4. Update class names in `app/src/main/assets/labels.txt` if you modify the vocabulary.

See [`PROJECT_DOCUMENTATION.md`](file:///c:/Users/ShreenithiyKarthikey/signlang/SignSpeak/PROJECT_DOCUMENTATION.md) for full architecture specifications, DFD diagrams, and MCA project presentation materials.
