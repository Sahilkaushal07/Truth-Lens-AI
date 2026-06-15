# TruthLens AI - Deepfake Detection Platform

TruthLens AI is a modern, production-grade cybersecurity application designed to detect whether uploaded media (images, audio, video, or webcam streams) is real or AI-generated / manipulated.

---

## Architecture Overview

```
                        +----------------------------+
                        |     NGINX Reverse Proxy     |
                        +----------------------------+
                                      |
             +------------------------+------------------------+
             |                                                 |
             v                                                 v
+------------------------+                        +------------------------+
|      Vite React        |                        |      Node Express      |
|     (Frontend Web)     |                        |      (Backend API)     |
+------------------------+                        +------------------------+
                                                               |
                                            +------------------+------------------+
                                            |                  |                  |
                                            v                  v                  v
                                    +--------------+   +---------------+  +---------------+
                                    | Python FastAPI|   |    MongoDB    |  |  Redis Cache  |
                                    | (AI-Service) |   | (Data Store)  |  | (Rate/Session)|
                                    +--------------+   +---------------+  +---------------+
```

---

## Tech Stack

*   **Frontend**: React (Vite), Tailwind CSS, Framer Motion, Axios, React Router, Zustand, Recharts, Lucide Icons.
*   **Backend**: Node.js, Express, Socket.IO, Multer, Helmet, CORS, ioredis, mongoose, PDFKit.
*   **AI Service**: Python FastAPI, OpenCV, Librosa, NumPy, scikit-image, YAML.
*   **Infrastructure**: Docker, Docker Compose, NGINX.

---

## Getting Started

### Local Script Installation

For automated environment setup, directory node building, package installations, and service startups, run our custom script:

#### Windows PowerShell
```powershell
./scripts/setup.ps1
```

#### Linux/macOS
```bash
chmod +x ./scripts/setup.sh
./scripts/setup.sh
```

### Manual Service Startups

1.  **FastAPI AI Microservice**:
    ```bash
    cd ai-service
    python -m venv venv
    source venv/bin/activate  # Or venv\Scripts\activate on Windows
    pip install -r requirements.txt
    python scripts/run_service.py
    ```

2.  **Node.js Backend API**:
    ```bash
    cd backend
    npm install
    npm start
    ```

3.  **Vite React Frontend**:
    ```bash
    cd frontend
    npm install
    npm run dev
    ```

### Docker Compose Startup

```bash
docker-compose up --build
```
The NGINX reverse proxy exposes the unified application endpoints at `http://localhost`.

---

## Public Cloud Deployment (Render Blueprint)

TruthLens AI is fully pre-configured for one-click public cloud deployment using Render Blueprints:

1. **Push to GitHub**: Initialize a Git repository, commit all project files, and push them to a private or public repository on your GitHub account.
2. **Setup MongoDB Atlas**: Create a free Shared Cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas), white-list network access IP `0.0.0.0/0`, and copy your cluster connection string.
3. **Deploy to Render**:
   - Go to your [Render Dashboard](https://dashboard.render.com/) and click **New +** -> **Blueprint**.
   - Connect your GitHub repository.
   - Render will read the `render.yaml` file and prepare the layout automatically.
   - Under the Environment Variables prompt, paste your MongoDB Atlas connection string into the `MONGODB_URL` placeholder.
   - Click **Apply** to deploy the services. Once completed, your unified portal will be live on a public URL!

---

## Core Features & Endpoints

*   **Image Detection**: Local RGB noise extraction and face structure anomaly checking.
*   **Audio Analysis**: High-frequency spectral analysis using Librosa to check for synthesized voice signatures.
*   **Video Facemaps**: Extracted temporal framing, facial coordinates alignment, and metadata consistency.
*   **Real-time Webcam**: Seamless canvas capturing with immediate analysis loop notifications via WebSockets.
*   **Detailed PDF Reports**: Downloadable reports compiling detection stats, frame captures, heatmaps, and explanation logs.
