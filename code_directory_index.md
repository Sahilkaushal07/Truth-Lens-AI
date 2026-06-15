# TruthLens AI - Code Directory Index
This index maps every critical code file in the TruthLens AI project to its specific functionality, helping you navigate the codebase.

---

## 1. Root Configurations & Infrastructure
*   **[docker-compose.yml](file:///C:/Users/sahil/OneDrive/Desktop/TRUTHLENSAI/docker-compose.yml)**: Orchestrator that provisions MongoDB, Redis, Python FastAPI, Express Node, and NGINX containers in unified network environments.
*   **[nginx/default.conf](file:///C:/Users/sahil/OneDrive/Desktop/TRUTHLENSAI/nginx/default.conf)**: Configures NGINX reverse-proxy routing: forwards `/api/*` to Express backend, `/detect/*` to Python AI service, `/socket.io/*` to WebSocket gateway, and `/` to Vite React build.
*   **[.env.example](file:///C:/Users/sahil/OneDrive/Desktop/TRUTHLENSAI/.env.example)**: Reference template for environment variables (ports, MONGODB_URL, JWT secrets).

---

## 2. Python FastAPI AI Service (`ai-service/`)
Exposes REST endpoints for media auditing on port `8500`.

*   **[src/ai_service/main.py](file:///C:/Users/sahil/OneDrive/Desktop/TRUTHLENSAI/ai-service/src/ai_service/main.py)**: Entrypoint script declaring FastAPI endpoints (`/detect/image`, `/detect/audio`, `/detect/video`, `/detect/live`, `/health`). Handles request uploads and wraps exceptions.
*   **[src/ai_service/models/detectors.py](file:///C:/Users/sahil/OneDrive/Desktop/TRUTHLENSAI/ai-service/src/ai_service/models/detectors.py)**: The core classifier file:
    *   `detect_faces`: Detects face boxes using Haar cascades.
    *   `extract_image_features`: Extracts 7-dimensional metrics from face/overall regions.
    *   `analyze_image_texture`: Runs fallback heuristics (blur checks, skin tone checking, face boundary blending ratio, filename override) or loads the trained model weights.
    *   `analyze_audio_frequencies`: Scans audio Mel-spectrograms for flat vocoder silent bands.
    *   `analyze_video_temporal_coherence`: Calculates temporal drift and face dropout flickering.
*   **[src/ai_service/training/inference.py](file:///C:/Users/sahil/OneDrive/Desktop/TRUTHLENSAI/ai-service/src/ai_service/training/inference.py)**: Integrates decoding blocks, calculates JET heatmaps, and formats the JSON payload returned to the caller.
*   **[src/ai_service/data/processors.py](file:///C:/Users/sahil/OneDrive/Desktop/TRUTHLENSAI/ai-service/src/ai_service/data/processors.py)**: Decodes raw image bytes via OpenCV, extracts frames from video uploads, and computes Mel-spectrogram DB matrices using Librosa.
*   **[src/ai_service/utils/config.py](file:///C:/Users/sahil/OneDrive/Desktop/TRUTHLENSAI/ai-service/src/ai_service/utils/config.py)**: Config datastructures, YAML loader settings, and random seeds initialization.
*   **[scripts/train.py](file:///C:/Users/sahil/OneDrive/Desktop/TRUTHLENSAI/ai-service/scripts/train.py)**: Training script that extracts image features, scales them, trains a Logistic Regression model via NumPy gradient descent, and exports parameters to `trained_model.json`.
*   **[scripts/evaluate.py](file:///C:/Users/sahil/OneDrive/Desktop/TRUTHLENSAI/ai-service/scripts/evaluate.py)**: Offline pipeline evaluator.
*   **[tests/test_heuristics.py](file:///C:/Users/sahil/OneDrive/Desktop/TRUTHLENSAI/ai-service/tests/test_heuristics.py)**: Verification suite for textures, boundary blending, skin tones, and filename keyword triggers.
*   **[tests/test_detection.py](file:///C:/Users/sahil/OneDrive/Desktop/TRUTHLENSAI/ai-service/tests/test_detection.py)**: Basic AI service core tests.
*   **[configs/default.yaml](file:///C:/Users/sahil/OneDrive/Desktop/TRUTHLENSAI/ai-service/configs/default.yaml)**: YAML file setting default detection thresholds.

---

## 3. Node.js Express Backend (`backend/`)
Serves API routes, Websockets, and PDF reports on port `5000`.

*   **[server.js](file:///C:/Users/sahil/OneDrive/Desktop/TRUTHLENSAI/backend/server.js)**: Starts Node HTTP server, Mongoose connection loop, and Socket.io client bindings.
*   **[src/app.js](file:///C:/Users/sahil/OneDrive/Desktop/TRUTHLENSAI/backend/src/app.js)**: Configures global Middlewares (CORS, Rate Limiting, Helmet headers, morgan parser) and mounts API routes.
*   **[src/config/db.js](file:///C:/Users/sahil/OneDrive/Desktop/TRUTHLENSAI/backend/src/config/db.js)** & **[redis.js](file:///C:/Users/sahil/OneDrive/Desktop/TRUTHLENSAI/backend/src/config/redis.js)**: Connection files for MongoDB Mongoose and ioredis client.
*   **[src/models/](file:///C:/Users/sahil/OneDrive/Desktop/TRUTHLENSAI/backend/src/models/)**: Persistent Mongoose Schema definitions:
    *   `User.js`: Schema for users (username, hashed passwords, roles).
    *   `DetectionHistory.js`: Stores upload details, raw scores, classifications, indicators, and JET heatmaps.
    *   `AuditLog.js` & `Notification.js`: System events and real-time alerts.
*   **[src/controllers/detectionController.js](file:///C:/Users/sahil/OneDrive/Desktop/TRUTHLENSAI/backend/src/controllers/detectionController.js)**: File upload coordinator. Emits Socket.io progress bars, saves files via Multer, forwards them to Python, and stores final reports.
*   **[src/routes/](file:///C:/Users/sahil/OneDrive/Desktop/TRUTHLENSAI/backend/src/routes/)**: Declares route endpoints linking controllers (e.g. `POST /api/detect/upload`, `POST /api/auth/login`).
*   **[src/utils/pdfGenerator.js](file:///C:/Users/sahil/OneDrive/Desktop/TRUTHLENSAI/backend/src/utils/pdfGenerator.js)**: Uses PDFKit to draw, layout, and compile the download report PDF.
*   **[src/seed.js](file:///C:/Users/sahil/OneDrive/Desktop/TRUTHLENSAI/backend/src/seed.js)**: Wipes database and inserts mock logins.

---

## 4. React Frontend (`frontend/`)
Visual visualizer and interface layer on port `3000`.

*   **[src/App.jsx](file:///C:/Users/sahil/OneDrive/Desktop/TRUTHLENSAI/frontend/src/App.jsx)**: Global layout template configuring page routing and global alerts.
*   **[src/index.css](file:///C:/Users/sahil/OneDrive/Desktop/TRUTHLENSAI/frontend/src/index.css)**: Central styling sheet loaded with Tailwind, custom fonts, and glassmorphism animation styles.
*   **[src/store/authStore.js](file:///C:/Users/sahil/OneDrive/Desktop/TRUTHLENSAI/frontend/src/store/authStore.js)**: Zustand store that handles authentication cookies, profiles state, and redirects.
*   **[src/components/AIChatbot.jsx](file:///C:/Users/sahil/OneDrive/Desktop/TRUTHLENSAI/frontend/src/components/AIChatbot.jsx)**: Explains deepfake signatures and guides users interactively.
*   **[src/pages/](file:///C:/Users/sahil/OneDrive/Desktop/TRUTHLENSAI/frontend/src/pages/)**: Visual user panels:
    *   `LandingPage.jsx`: Dynamic homepage featuring feature lists and live stats.
    *   `Dashboard.jsx`: Overall security overview, history items table, and system health monitors.
    *   `UploadCenter.jsx`: Drag-and-drop center for file uploads, featuring webcam inputs and real-time Socket.io progress.
    *   `DetectionResult.jsx`: Visualizes raw scores, Sobel colormaps, triggers lists, frame analysis curves, and PDF download keys.
