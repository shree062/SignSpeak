# MCA Final-Year Project: SignSpeak
## "Sign Language Translation Application for Deaf and Dumb"

---

### Executive Abstract & Problem Statement

Communication between individuals who are Deaf or Hard of Hearing and the non-signing general population faces significant barriers due to a lack of widespread sign language literacy. Existing solutions often rely on cloud-connected APIs that fail in offline environments or lack real-time continuous sequence modeling.

**SignSpeak** is an AI-powered, offline-first native Android application developed in Kotlin. It captures real-time dynamic gestures using CameraX, extracts spatial hand morphology using Convolutional Neural Networks (CNN), processes temporal sequence patterns across frames using Long Short-Term Memory (LSTM) / Gated Recurrent Units (GRU), and converts recognized signs into clear **text** and audible **synthesized speech** via Android's Text-to-Speech API.

---

## 1. System Architecture & DFD

### High-Level Architectural Pipeline

```
 +-------------------------+
 | CameraX Video / Gallery |
 +------------+------------+
              | (RGB Frames / YUV420)
              v
 +-----------------------------------------------------------+
 | Preprocessing & Normalization Engine                      |
 | (224x224 Bilinear Resizing, Central Crop, [-1.0, 1.0] Norm)|
 +----------------------------+------------------------------+
                              |
                              v
 +-----------------------------------------------------------+
 | Spatial Feature Extractor (CNN)                           |
 | - Hand position & orientation                             |
 | - Finger bend angles & joint coordinates                  |
 | - Edge & texture representations                          |
 +----------------------------+------------------------------+
                              | (Spatial Feature Vector)
                              v
 +-----------------------------------------------------------+
 | Temporal Sequence Learning (LSTM + GRU)                   |
 | - Sliding-window frame sequence buffer (30 frames)        |
 | - Gesture velocity, trajectory & transition modeling      |
 +----------------------------+------------------------------+
                              |
                              v
 +-----------------------------------------------------------+
 | Softmax Classification Layer                              |
 | - Output Probability Distribution                         |
 | - Confidence Threshold Verification (e.g. > 70%)          |
 +----------------------------+------------------------------+
                              |
                              v
 +-----------------------------------------------------------+
 | Recognized Sign & Spoken Natural Translation              |
 | - Output Box Display (Copy, Share)                        |
 | - Android Native TextToSpeech Engine (Speed / Pitch)      |
 | - Jetpack Room Database (History, Favorites, Offline Sync)|
 +-----------------------------------------------------------+
```

### Data Flow Diagrams (DFD)

#### DFD Level 0 (Context Diagram)
```
  [ Deaf User / Signer ]
          |
          | 1. Gestures / Signs (Camera Stream)
          v
  +-------------------------------------------------------+
  |              SignSpeak Mobile Application             |
  +-------------------------------------------------------+
          |                                       |
          | 2. Spoken Speech & Text Output        | 3. Local Offline Storage
          v                                       v
  [ Hearing / Non-Signing User ]          [ Room Local DB ]
```

#### DFD Level 1 (Functional Decomposition)
```
[ Video Feed ] ---> ( 1.0 Frame Acquisition & Preprocessing ) ---> [ Normalized Tensor ]
                                                                             |
                                                                             v
                                                               ( 2.0 ML Inference Engine: CNN-LSTM )
                                                                             |
                                                                             v
[ Natural Language Map ] ---> ( 3.0 Natural Language Translation ) <--- [ Predicted Label ]
                                              |
                        +---------------------+---------------------+
                        |                                           |
                        v                                           v
             ( 4.0 Audio Speech Synth )                  ( 5.0 Room DB Storage )
                        |                                           |
                        v                                           v
                  [ Speaker Out ]                         [ History & Favorites ]
```

---

## 2. Machine Learning Architecture (CNN + LSTM/GRU)

1. **Spatial Feature Extraction (CNN)**:
   - Input: Preprocessed RGB frame $(224 \times 224 \times 3)$.
   - Convolutions extract edge gradients, palm landmarks, finger contours, and spatial position.
   - Output: Feature vector $\mathbf{f}_t \in \mathbb{R}^D$ for frame $t$.

2. **Temporal Pattern Recognition (LSTM + GRU)**:
   - Maintains temporal memory across a sliding sequence window $\mathbf{F} = [\mathbf{f}_{t-N}, \dots, \mathbf{f}_t]$.
   - Recurrent gates (Forget, Input, Output / Reset, Update) capture movement dynamics and sign transitions.

3. **Classification & Natural Language Formulation**:
   - Dense Softmax output layer yields probabilities $P(\text{class}_i | \mathbf{F})$.
   - The recognized label is enriched via the phrase dictionary into natural communicative sentences.

---

## 3. Database Design (Jetpack Room)

### Entity: `user`
| Field | Type | Constraint | Description |
| :--- | :--- | :--- | :--- |
| `user_id` | `INTEGER` / `Long` | Primary Key, Auto-Gen | Unique User ID |
| `name` | `TEXT` | Not Null | User's full name |
| `email` | `TEXT` | Not Null, Unique | Registered email |
| `password` | `TEXT` | Not Null | User password / credentials |
| `created_at` | `INTEGER` | Not Null | Account creation timestamp |
| `profile_image` | `TEXT` | Nullable | Local Avatar URI / Path |

### Entity: `history`
| Field | Type | Constraint | Description |
| :--- | :--- | :--- | :--- |
| `history_id` | `INTEGER` / `Long` | Primary Key, Auto-Gen | Unique record ID |
| `user_id` | `INTEGER` / `Long` | Foreign Key (user) | Associated User ID |
| `input` | `TEXT` | Not Null | Input mode ("Camera" / "Gallery") |
| `sign_name` | `TEXT` | Not Null | Predicted sign label |
| `translated_text` | `TEXT` | Not Null | Natural translated sentence |
| `confidence` | `REAL` / `Float` | Not Null | Confidence score (0.0 to 1.0) |
| `timestamp` | `INTEGER` | Not Null | Record epoch time |
| `is_favorite` | `INTEGER` / `Boolean` | Default 0 | Bookmarked favorite flag |
| `thumbnail_path` | `TEXT` | Nullable | Cached frame thumbnail |

### Entity: `sign`
| Field | Type | Constraint | Description |
| :--- | :--- | :--- | :--- |
| `sign_id` | `INTEGER` | Primary Key | Sign vocabulary ID |
| `sign_name` | `TEXT` | Not Null | Sign title (e.g. "Thank You") |
| `category` | `TEXT` | Not Null | Category (Greetings, Emergency, etc.)|
| `description` | `TEXT` | Not Null | Visual gesture description |
| `instructions` | `TEXT` | Not Null | Step-by-step performance guide |
| `example_usage` | `TEXT` | Not Null | Context of application |

---

## 4. Key Application Modules & Features

1. **Authentication Module (`ui.auth`)**:
   - Recreated from reference login UI.
   - Material 3 input fields with visibility toggles, auto-session persistence, Google/Facebook login handlers, Sign Up & Forgot Password.

2. **Dashboard & Main Translation (`ui.main`)**:
   - Header with Live Online/Offline network monitor pill badge and notifications.
   - Main Translation Card with Camera/Gallery toggle, gesture frame placeholder, and output box with Copy, Play TTS, and Share.
   - 4 Quick Access Feature Cards (History, Favorites, Learn Signs, Settings).
   - Recent Translations dynamic list.

3. **CameraX Real-Time Vision (`ui.camera`)**:
   - Full-screen CameraX stream with target gesture framing overlay.
   - Non-blocking background inference executor running at 5-10 Hz.
   - Real-time confidence score, live text translation, speech playback, front/back camera switch, and torch control.

4. **Gallery Translation (`ui.gallery`)**:
   - Image & video picker from device storage.
   - Visual 4-step ML pipeline status indicator (Preprocessing -> CNN Features -> LSTM Sequence -> Output).

5. **History & Favorites (`ui.history`, `ui.main.fragments`)**:
   - Filter chips ("All", "Favorites", "Today", "This Week", "This Month").
   - Live search bar, favorite toggle star, audio TTS speak, and full detail bottom sheet dialog.

6. **Learn Signs Dictionary (`ui.learn`)**:
   - 25+ pre-populated standard signs categorized by Greetings, Common Phrases, Emergency, and Daily Life.
   - Interactive detail bottom sheet with step instructions and audio pronunciation.

7. **User Profile & Settings (`ui.profile`, `ui.settings`)**:
   - Translation analytics (Total Translations, Favorites Saved, Signs Learned, Avg Accuracy).
   - Text-to-Speech speed and pitch adjustment sliders.
   - ML confidence threshold control.
   - Offline / Online mode toggle.

---

## 5. How to Run in Android Studio

1. **Open Android Studio** (Hedgehog, Iguana, Jellyfish, Koala, or newer).
2. Click **File -> Open...** and select `c:\Users\ShreenithiyKarthikey\signlang\SignSpeak`.
3. Allow Gradle to sync dependencies automatically.
4. Connect an Android device (via USB with USB Debugging enabled) or start an Android Emulator with Camera support (API 24 or above).
5. Click **Run 'app'** (`Shift + F10`).
6. **Demo Credentials**:
   - **Email/Username**: `shree@signspeak.ai`
   - **Password**: `password123`
   *(Or click "Sign Up" / "Continue with Google")*
