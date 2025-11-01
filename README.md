# ASL Gesture Recognition - A to Z

A real-time American Sign Language (ASL) gesture recognition application that recognizes all letters A-Z using computer vision and machine learning.

## Features

- ✅ Recognizes all A-Z ASL gestures
- 👋 Special gesture for SPACE (open hand/wave)
- 👍 Thumbs up to confirm correct letter
- 👎 Thumbs down to remove last letter (wrong)
- 🎥 Real-time webcam hand tracking with MediaPipe
- 💻 Simple HTML interface - works on any platform

## Requirements

- Python 3.8 or higher
- Webcam
- Windows, Mac, or Linux

## Installation (Windows/VS Code)

### 1. Install Python

Download and install Python from [python.org](https://www.python.org/downloads/)

Make sure to check "Add Python to PATH" during installation.

### 2. Clone or Download this Repository

```bash
# Clone with git
git clone <your-repo-url>
cd <repository-folder>

# Or download and extract the ZIP file
```

### 3. Install Required Packages

Open Command Prompt or PowerShell in the project folder and run:

```bash
pip install opencv-python mediapipe numpy flask flask-socketio python-socketio
```

Or use the requirements file (if you create one):

```bash
pip install -r requirements.txt
```

### 4. Run the Application

```bash
python app.py
```

### 5. Open in Browser

Once the server starts, open your web browser and go to:

```
http://localhost:5000
```

or

```
http://127.0.0.1:5000
```

## How to Use

1. **Start Camera**: Click the "Start Camera" button to enable your webcam
2. **Show Gestures**: Position your hand in front of the camera and show ASL gestures
3. **Hold Steady**: Hold each gesture for about 1.5 seconds for recognition
4. **Build Text**: Letters will be automatically added to the recognized text
5. **Add Space**: Show an open hand (all fingers extended) or click "Add Space"
6. **Confirm**: Show thumbs up 👍 or click "✓ Correct" to confirm
7. **Delete**: Show thumbs down 👎 or click "✗ Wrong" to remove last letter
8. **Clear**: Click "Clear Text" to start over

## ASL Gestures Supported

### Letters A-Z
- **A**: Closed fist with thumb on the side
- **B**: Flat hand with all fingers up (except thumb)
- **C**: Curved hand forming C shape
- **D**: Index finger up, thumb touching middle finger
- **E**: All fingers curled down tight
- **F**: Index and middle finger forming circle with thumb, others up
- **G**: Index and thumb pointing sideways
- **H**: Index and middle fingers together horizontally
- **I**: Pinky extended, others curled
- **J**: Pinky extended in J motion
- **K**: Index and middle up in V with thumb between
- **L**: Index and thumb forming L shape
- **M**: Three fingers down over thumb
- **N**: Two fingers down over thumb
- **O**: All fingers forming circle
- **P**: Index and middle pointing down
- **Q**: Index and thumb pointing down
- **R**: Index and middle crossed
- **S**: Fist with thumb across fingers
- **T**: Thumb between index and middle
- **U**: Index and middle together pointing up
- **V**: Index and middle apart (peace sign)
- **W**: Three fingers up (index, middle, ring)
- **X**: Index curled in hook shape
- **Y**: Thumb and pinky extended (shaka/hang loose)
- **Z**: Index finger drawing Z shape

### Special Gestures
- **SPACE**: Open hand with all fingers extended (wave)
- **CORRECT (✓)**: Thumbs up
- **WRONG (✗)**: Thumbs down

## File Structure

```
project/
│
├── app.py                 # Main Python Flask server with gesture recognition
├── templates/
│   └── index.html        # Web interface
└── README.md             # This file
```

## Troubleshooting

### Camera not working
- Make sure your webcam is connected and not being used by another application
- Check browser permissions to allow camera access
- Try a different browser (Chrome and Firefox work best)

### Gestures not recognized
- Ensure good lighting
- Position hand clearly in camera view
- Hold gesture steady for 1-2 seconds
- Try adjusting distance from camera (arm's length works well)

### Import errors
- Make sure all packages are installed: `pip install opencv-python mediapipe numpy flask flask-socketio python-socketio`
- Try updating pip: `python -m pip install --upgrade pip`

### Port already in use
- Close any other applications using port 5000
- Or modify the port in app.py (last line): `socketio.run(app, host='0.0.0.0', port=5001, debug=True)`

## Running in VS Code

1. Open the project folder in VS Code
2. Open a terminal in VS Code (Terminal → New Terminal)
3. Run: `python app.py`
4. Click the localhost link in the terminal, or manually open http://localhost:5000 in your browser

## Technologies Used

- **Python**: Backend server
- **Flask**: Web framework
- **Flask-SocketIO**: Real-time communication
- **MediaPipe**: Hand tracking and landmark detection (Google)
- **OpenCV**: Computer vision and image processing
- **HTML/CSS/JavaScript**: Frontend interface

## Performance Notes

- **GPU Acceleration**: The app is configured to use GPU acceleration when available. However, in hosted environments without GPU hardware (like some cloud platforms), it will automatically fall back to optimized CPU processing using TensorFlow Lite XNNPACK delegate.
- **CPU Performance**: Even on CPU, the app runs smoothly at 10 FPS for real-time gesture recognition.
- **Optimizations**: Lower detection thresholds (0.5) and improved finger detection logic ensure better recognition accuracy for all A-Z letters.

## Notes

- J and Z gestures require motion in actual ASL, but this app uses static approximations
- Best results with good lighting and plain background
- Single hand detection (one hand at a time)
- Recognition accuracy improves with practice and consistent hand positioning

## License

MIT License - Feel free to use and modify!

## Support

For issues or questions, please create an issue in the repository.

---

Made with ❤️ for the deaf and hard-of-hearing community
