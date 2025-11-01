# ASL Gesture Recognition - A to Z

## Overview

A standalone Python application for real-time American Sign Language (ASL) gesture recognition. The system recognizes all letters A-Z plus special control gestures using MediaPipe hand tracking and geometric feature analysis. Designed to run on Windows with VS Code or any Python environment.

**Last Updated**: November 1, 2025

## User Preferences

- **Communication Style**: Simple, everyday language
- **Platform**: Windows/VS Code compatible standalone application
- **Structure**: Simple HTML + Python (no complex web frameworks)

## System Architecture

### Technology Stack
- **Backend**: Python 3.11+ with Flask and Flask-SocketIO
- **Frontend**: Pure HTML/CSS/JavaScript with Socket.IO client
- **Computer Vision**: MediaPipe Hands (Google)
- **Image Processing**: OpenCV (cv2)
- **Real-time Communication**: WebSocket via Socket.IO

### Architecture Pattern
- **Event-driven architecture** with WebSocket-based communication
- **Per-session state management** to support multiple concurrent users
- **Geometric feature-based classification** (no machine learning training required)

### File Structure
```
project/
├── app.py                    # Main Python Flask server with gesture recognition
├── templates/
│   └── index.html           # Web interface (HTML/CSS/JavaScript)
├── static/
│   └── images/
│       └── asl_alphabet_chart.jpg  # ASL alphabet reference guide (A-Z)
├── requirements.txt         # Python dependencies
├── README.md                # Comprehensive documentation
├── WINDOWS_SETUP.txt        # Step-by-step Windows setup guide
└── pyproject.toml           # Python project config (uv)
```

## Core Components

### Backend (app.py)

**Hand Detection**:
- MediaPipe Hands solution for real-time hand landmark tracking
- Configured for single hand detection (max_num_hands=1)
- Returns 21 3D landmarks per hand

**Gesture Classification**:
- Rule-based classifier using geometric features
- Evaluates control gestures first (priority order):
  1. Control gestures (HI_SPACE, THUMBS_UP, THUMBS_DOWN)
  2. Multi-finger gestures (B, W, F, R, K, V, U, H, N)
  3. Index-based gestures (D, L, G, Z, P, Q)
  4. Pinky-based gestures (Y, I, J)
  5. Closed-fist gestures (O, E, C, S, T, A, M, X)
- Mutually exclusive conditions prevent short-circuiting
- All A-Z letters fully implemented

**Session Management**:
- Per-client storage using Socket.IO session IDs
- Automatic cleanup on client disconnect
- Prevents cross-user interference

**WebSocket Handlers**:
- `connect`: Initialize session storage
- `disconnect`: Clean up session data
- `frame`: Process video frame, detect gestures, return results

### Frontend (templates/index.html)

**UI Components**:
- Video feed display (640x480)
- Current gesture indicator (large purple panel)
- Recognized text accumulator
- Control buttons (Start/Stop Camera, Clear Text, Speak Text, ASL Reference)
- Text-to-speech functionality using Web Speech API
- ASL alphabet reference modal with complete A-Z guide
- Correction controls (Correct, Wrong, Add Space)
- Status indicator with real-time feedback
- Instructions panel

**Real-time Processing**:
- Captures webcam frames at 10 FPS
- Encodes to base64 JPEG
- Sends to backend via WebSocket
- Receives processed frame with hand landmarks drawn
- Displays detected gesture

**Gesture Hold Detection**:
- Requires holding gesture for ~1.5 seconds (15 frames)
- Prevents accidental letter recognition
- Automatic space/correction on special gestures

## Gesture Recognition Details

### Complete A-Z Support

All 26 ASL letters are recognized:
- **A**: Closed fist, thumb on side
- **B**: Flat hand, four fingers together
- **C**: Curved hand (C shape)
- **D**: Index up, thumb touching middle
- **E**: All fingers tightly curled
- **F**: OK sign, other fingers up
- **G**: Index and thumb pointing sideways
- **H**: Index and middle together, horizontal
- **I**: Pinky up, others down
- **J**: Pinky extended (static approximation)
- **K**: Index and middle in V, thumb between
- **L**: L shape with index and thumb
- **M**: Three fingers over thumb
- **N**: Two fingers over thumb
- **O**: All fingers forming circle
- **P**: Index and middle pointing down
- **Q**: Index and thumb pointing down
- **R**: Index and middle crossed
- **S**: Fist with thumb across
- **T**: Thumb between index and middle
- **U**: Index and middle together up
- **V**: Peace sign (fingers apart)
- **W**: Three fingers up
- **X**: Index curled in hook
- **Y**: Thumb and pinky extended
- **Z**: Index drawing Z (static approximation)

### Control Gestures

- **SPACE**: Open hand (all 5 fingers extended)
- **CORRECT (✓)**: Thumbs up
- **WRONG (✗)**: Thumbs down

### Feature Detection

**Helper Functions**:
- `is_finger_extended()`: Checks if finger tip is above PIP joint
- `calculate_distance()`: Euclidean distance between landmarks
- Geometric analysis: angles, distances, relative positions

## Dependencies

### Python Packages
- `opencv-python>=4.8.0`: Computer vision and image processing
- `mediapipe>=0.10.9`: Hand tracking and landmark detection
- `numpy>=1.24.0`: Numerical computing for array operations
- `flask>=3.0.0`: Web framework for serving interface
- `flask-socketio>=5.3.0`: WebSocket support for Flask
- `python-socketio>=5.10.0`: Socket.IO server implementation

All dependencies specified in `requirements.txt` for easy installation.

## Windows/VS Code Deployment

### Installation Steps
1. Install Python 3.11+ (check "Add Python to PATH")
2. Navigate to project folder
3. Run: `pip install -r requirements.txt`
4. Run: `python app.py`
5. Open browser to `http://localhost:5000`

### VS Code Integration
1. Open project folder in VS Code
2. Open terminal (Ctrl + `)
3. Run: `python app.py`
4. Ctrl + Click on localhost link

Detailed instructions in `WINDOWS_SETUP.txt`.

## Design Decisions

### Why Python + MediaPipe?
- **Portability**: Works on Windows, Mac, Linux
- **No Training Required**: Pre-trained MediaPipe models
- **Performance**: Real-time processing on CPU
- **Simplicity**: Single-file backend, easy to understand

### Why Geometric Classification?
- **Transparency**: Easy to debug and understand
- **No Training Data**: No need for labeled datasets
- **Customizable**: Easy to adjust thresholds
- **Fast**: Runs in real-time without GPU

### Why Flask + Socket.IO?
- **Simple Setup**: Minimal configuration
- **Real-time**: WebSocket for low-latency streaming
- **Familiar**: Standard web technologies
- **Cross-platform**: Works in any modern browser

### Why Per-Session Storage?
- **Multi-user Support**: Multiple users can use simultaneously
- **No Conflicts**: Each session isolated
- **Clean Cleanup**: Automatic memory management
- **Scalable**: Easy to add database later if needed

## Known Limitations

1. **Motion Gestures**: J and Z require motion in real ASL, but static approximations are used
2. **Single Hand**: Only one hand detected at a time
3. **Lighting Sensitive**: Requires good lighting for best accuracy
4. **CPU Only**: MediaPipe configured for CPU (no GPU required)
5. **Camera Required**: Needs webcam access

## Future Enhancements (User Requested)

- None currently planned - application meets all requirements

## Recent Changes

**November 1, 2025**:
- Added ASL alphabet reference guide modal with complete A-Z visual chart
- Implemented text-to-speech functionality using Web Speech API
- Added "Speak Text" button to read recognized text aloud
- Added "ASL Reference" button to display alphabet guide
- Created static/images/ directory for ASL reference assets
- Enhanced UI with new buttons and modal styling
- Improved accessibility with descriptive alt text

**October 31, 2025**:
- Complete restructure from React/TypeScript/Express to Python/HTML
- Removed server/, client/, shared/ folders and all Node.js dependencies
- Implemented complete A-Z gesture recognition (previously only ~15 letters)
- Added special control gestures (Space, Thumbs Up, Thumbs Down)
- Fixed gesture classification logic ordering to prevent short-circuiting
- Implemented per-session storage (was global before)
- Created requirements.txt for Windows compatibility
- Added comprehensive Windows setup documentation
- Simplified project structure for VS Code usage
