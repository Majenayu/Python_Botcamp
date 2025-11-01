import os
import logging

# Enable GPU acceleration BEFORE importing mediapipe
os.environ['MEDIAPIPE_DISABLE_GPU'] = '0'

import cv2
import mediapipe as mp
import numpy as np
from flask import Flask, render_template, request
from flask_socketio import SocketIO, emit
import base64
import math

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET")
socketio = SocketIO(app, cors_allowed_origins="*")

mp_hands = mp.solutions.hands
mp_drawing = mp.solutions.drawing_utils

hands = mp_hands.Hands(
    static_image_mode=False,
    max_num_hands=1,
    min_detection_confidence=0.45,  # Moderate threshold to reduce false positives
    min_tracking_confidence=0.45,   # Moderate threshold for reliable tracking
    model_complexity=1              # 1 = balanced accuracy and speed
)

# Per-session storage
session_data = {}

def calculate_distance(point1, point2):
    """Calculate Euclidean distance between two points"""
    return math.sqrt((point1.x - point2.x)**2 + (point1.y - point2.y)**2)

def is_finger_extended(landmarks, finger_tip_id, finger_pip_id, finger_mcp_id):
    """Check if a finger is extended based on tip, pip, and mcp positions"""
    tip = landmarks[finger_tip_id]
    pip = landmarks[finger_pip_id]
    mcp = landmarks[finger_mcp_id]
    
    # Check if tip is above pip (extended) - balanced threshold
    vertical_extended = tip.y < pip.y - 0.012
    
    # Also check if the finger is straight (tip should be further from mcp than pip)
    tip_mcp_dist = calculate_distance(tip, mcp)
    pip_mcp_dist = calculate_distance(pip, mcp)
    
    # Balanced extension check
    return vertical_extended and tip_mcp_dist > pip_mcp_dist * 0.78

def classify_asl_gesture(hand_landmarks):
    """
    Classify ASL gesture from hand landmarks.
    Order is critical - more specific gestures first to prevent short-circuiting.
    """
    landmarks = hand_landmarks.landmark
    
    # Key landmarks
    thumb_tip = landmarks[4]
    thumb_ip = landmarks[3]
    thumb_mcp = landmarks[2]
    index_tip = landmarks[8]
    index_pip = landmarks[6]
    index_mcp = landmarks[5]
    middle_tip = landmarks[12]
    middle_pip = landmarks[10]
    middle_mcp = landmarks[9]
    ring_tip = landmarks[16]
    ring_pip = landmarks[14]
    ring_mcp = landmarks[13]
    pinky_tip = landmarks[20]
    pinky_pip = landmarks[18]
    pinky_mcp = landmarks[17]
    wrist = landmarks[0]
    
    # Finger extension states
    thumb_extended = is_finger_extended(landmarks, 4, 3, 2)
    index_extended = is_finger_extended(landmarks, 8, 6, 5)
    middle_extended = is_finger_extended(landmarks, 12, 10, 9)
    ring_extended = is_finger_extended(landmarks, 16, 14, 13)
    pinky_extended = is_finger_extended(landmarks, 20, 18, 17)
    
    # === SPECIAL CONTROL GESTURES (check first) ===
    
    # HI gesture (all fingers extended) - SPACE
    if thumb_extended and index_extended and middle_extended and ring_extended and pinky_extended:
        return 'HI_SPACE'
    
    # THUMBS_UP - Correct (thumb up, all others down)
    if thumb_extended and not index_extended and not middle_extended and not ring_extended and not pinky_extended:
        if thumb_tip.y < wrist.y - 0.1:
            return 'THUMBS_UP'
    
    # THUMBS_DOWN - Wrong (thumb down, all others down)
    if thumb_extended and not index_extended and not middle_extended and not ring_extended and not pinky_extended:
        if thumb_tip.y > wrist.y + 0.1:
            return 'THUMBS_DOWN'
    
    # === LETTERS WITH MULTIPLE FINGERS EXTENDED ===
    
    # B - All four fingers up, close together, thumb tucked
    if index_extended and middle_extended and ring_extended and pinky_extended and not thumb_extended:
        fingers_close = (calculate_distance(index_tip, middle_tip) < 0.055 and
                        calculate_distance(middle_tip, ring_tip) < 0.055)
        if fingers_close:
            return 'B'
    
    # W - Three fingers up (index, middle, ring), pinky down
    if index_extended and middle_extended and ring_extended and not pinky_extended:
        if not thumb_extended or thumb_tip.y > thumb_mcp.y:
            return 'W'
    
    # F - Index curled to thumb, middle/ring/pinky up
    if not index_extended and middle_extended and ring_extended and pinky_extended:
        thumb_index_dist = calculate_distance(thumb_tip, index_tip)
        if thumb_index_dist < 0.07:
            return 'F'
    
    # R - Index and middle crossed
    if index_extended and middle_extended and not ring_extended and not pinky_extended:
        fingers_crossed = abs(index_tip.x - middle_tip.x) < 0.035
        if fingers_crossed and not thumb_extended:
            return 'R'
    
    # K - Index and middle in V, thumb extended between them
    if index_extended and middle_extended and not ring_extended and not pinky_extended:
        if thumb_extended and thumb_tip.y < index_mcp.y:
            return 'K'
    
    # V - Index and middle apart (peace sign)
    if index_extended and middle_extended and not ring_extended and not pinky_extended:
        fingers_apart = calculate_distance(index_tip, middle_tip) > 0.07
        if fingers_apart and not thumb_extended:
            return 'V'
    
    # U - Index and middle together pointing up
    if index_extended and middle_extended and not ring_extended and not pinky_extended:
        fingers_together = calculate_distance(index_tip, middle_tip) < 0.035
        if fingers_together and not thumb_extended:
            return 'U'
    
    # H - Index and middle together, horizontal
    if index_extended and middle_extended and not ring_extended and not pinky_extended:
        fingers_together = calculate_distance(index_tip, middle_tip) < 0.04
        horizontal = abs(index_tip.y - middle_tip.y) < 0.05
        if fingers_together and horizontal:
            return 'H'
    
    # N - Two fingers (index, middle) curled over thumb, ring and pinky curled
    if not index_extended and not middle_extended and not ring_extended and not pinky_extended:
        # Check if index and middle are curled over thumb
        thumb_covered = (index_tip.y > thumb_tip.y and middle_tip.y > thumb_tip.y and
                        index_tip.x < thumb_mcp.x + 0.05 and middle_tip.x < thumb_mcp.x + 0.05)
        if thumb_covered:
            return 'N'
    
    # === LETTERS WITH INDEX FINGER EXTENDED ===
    
    # D - Index up, thumb touching middle finger
    if index_extended and not middle_extended and not ring_extended and not pinky_extended:
        thumb_middle_dist = calculate_distance(thumb_tip, middle_tip)
        if thumb_middle_dist < 0.07 and thumb_extended:
            return 'D'
    
    # L - Index and thumb forming L shape
    if index_extended and thumb_extended and not middle_extended and not ring_extended and not pinky_extended:
        l_shape = abs(index_tip.x - thumb_tip.x) > 0.07
        perpendicular = abs(index_tip.y - thumb_tip.y) > 0.07
        if l_shape and perpendicular:
            return 'L'
    
    # G - Index and thumb pointing sideways
    if index_extended and thumb_extended and not middle_extended and not ring_extended and not pinky_extended:
        parallel = abs(index_tip.y - thumb_tip.y) < 0.06
        if parallel:
            return 'G'
    
    # Z - Index extended alone, pointing (static approximation)
    if index_extended and not middle_extended and not ring_extended and not pinky_extended:
        if not thumb_extended and index_tip.y < index_mcp.y - 0.1:
            return 'Z'
    
    # P - Index and middle pointing down
    if index_extended and middle_extended and not ring_extended and not pinky_extended:
        pointing_down = index_tip.y > index_mcp.y and middle_tip.y > middle_mcp.y
        if pointing_down:
            return 'P'
    
    # Q - Index and thumb pointing down
    if index_extended and thumb_extended and not middle_extended and not ring_extended and not pinky_extended:
        pointing_down = index_tip.y > wrist.y and thumb_tip.y > wrist.y
        if pointing_down:
            return 'Q'
    
    # === LETTERS WITH PINKY EXTENDED ===
    
    # Y - Thumb and pinky extended (shaka)
    if thumb_extended and not index_extended and not middle_extended and not ring_extended and pinky_extended:
        return 'Y'
    
    # I - Pinky up alone, thumb tucked
    if not index_extended and not middle_extended and not ring_extended and pinky_extended:
        if not thumb_extended or thumb_tip.y > thumb_mcp.y:
            return 'I'
    
    # J - Pinky extended with thumb (static approximation - J requires motion)
    if not index_extended and not middle_extended and not ring_extended and pinky_extended:
        if thumb_extended:
            return 'J'
    
    # === LETTERS WITH ALL FINGERS CLOSED ===
    
    # O - Thumb and index forming circle
    thumb_index_dist = calculate_distance(thumb_tip, index_tip)
    if thumb_index_dist < 0.055 and not middle_extended and not ring_extended and not pinky_extended:
        return 'O'
    
    # E - All fingers tightly curled
    if not thumb_extended and not index_extended and not middle_extended and not ring_extended and not pinky_extended:
        all_curled_tight = (index_tip.y > index_mcp.y and 
                           middle_tip.y > middle_mcp.y and
                           ring_tip.y > ring_mcp.y)
        if all_curled_tight:
            return 'E'
    
    # C - Curved hand forming C
    if not index_extended and not middle_extended and not ring_extended and not pinky_extended:
        curved = (index_tip.x < index_mcp.x and 
                 middle_tip.x < middle_mcp.x and
                 thumb_extended)
        if curved:
            return 'C'
    
    # S - Fist with thumb across fingers
    if not index_extended and not middle_extended and not ring_extended and not pinky_extended:
        thumb_across = thumb_tip.x < index_mcp.x and thumb_tip.y < index_mcp.y
        if thumb_across and not thumb_extended:
            return 'S'
    
    # T - Thumb between index and middle fist
    if not index_extended and not middle_extended and not ring_extended and not pinky_extended:
        thumb_between = (thumb_tip.y < index_tip.y and 
                        thumb_tip.x > index_tip.x and
                        thumb_tip.x < middle_tip.x)
        if thumb_between:
            return 'T'
    
    # A - Closed fist with thumb on side
    if not index_extended and not middle_extended and not ring_extended and not pinky_extended:
        thumb_on_side = thumb_tip.x > thumb_mcp.x - 0.05 and thumb_tip.y > thumb_mcp.y
        if thumb_on_side:
            return 'A'
    
    # M - Three fingers curled over thumb
    if not index_extended and not middle_extended and not ring_extended and not pinky_extended:
        three_over_thumb = (thumb_tip.y > index_tip.y and 
                           thumb_tip.y > middle_tip.y and
                           thumb_tip.y > ring_tip.y)
        if three_over_thumb:
            return 'M'
    
    # X - Index curled in hook shape
    if not index_extended and not middle_extended and not ring_extended and not pinky_extended:
        hook_shape = (index_tip.y < index_mcp.y and 
                     index_tip.y > index_pip.y and
                     not thumb_extended)
        if hook_shape:
            return 'X'
    
    return None

@app.route('/')
def index():
    return render_template('index.html')

@socketio.on('connect')
def handle_connect():
    """Initialize session storage for new client"""
    session_id = request.sid
    session_data[session_id] = {
        'recognized_text': ''
    }
    logger.info(f'Client connected: {session_id}')

@socketio.on('disconnect')
def handle_disconnect():
    """Clean up session storage"""
    session_id = request.sid
    if session_id in session_data:
        del session_data[session_id]
    logger.info(f'Client disconnected: {session_id}')

@socketio.on('frame')
def handle_frame(data):
    """Process video frame and detect gestures"""
    session_id = request.sid
    
    try:
        # Validate data
        if not data or not isinstance(data, str) or ',' not in data:
            logger.warning("Invalid frame data received")
            return
        
        # Decode image with error handling
        try:
            img_data = base64.b64decode(data.split(',')[1])
        except Exception as decode_error:
            logger.error(f"Base64 decode error: {decode_error}")
            return
            
        np_arr = np.frombuffer(img_data, np.uint8)
        
        # Check if buffer is valid
        if np_arr.size == 0:
            logger.warning("Empty numpy array from buffer")
            return
        
        frame = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
        
        # Check if frame decoded successfully
        if frame is None or frame.size == 0:
            logger.error("Failed to decode frame with cv2")
            return
        
        # Process with MediaPipe
        try:
            rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            results = hands.process(rgb_frame)
        except Exception as mp_error:
            logger.error(f"MediaPipe processing error: {mp_error}")
            return
        
        gesture = None
        if results.multi_hand_landmarks:
            for hand_landmarks in results.multi_hand_landmarks:
                try:
                    gesture = classify_asl_gesture(hand_landmarks)
                except Exception as classify_error:
                    logger.error(f"Gesture classification error: {classify_error}", exc_info=True)
                    gesture = None
                
                # Draw hand landmarks
                try:
                    mp_drawing.draw_landmarks(
                        frame, 
                        hand_landmarks, 
                        mp_hands.HAND_CONNECTIONS,
                        mp_drawing.DrawingSpec(color=(0, 255, 0), thickness=2, circle_radius=2),
                        mp_drawing.DrawingSpec(color=(0, 255, 0), thickness=2)
                    )
                except Exception as draw_error:
                    logger.error(f"Drawing error: {draw_error}")
        
        # Encode processed frame
        try:
            success, buffer = cv2.imencode('.jpg', frame, [cv2.IMWRITE_JPEG_QUALITY, 85])
            if not success:
                logger.error("Failed to encode frame")
                return
            
            frame_data = base64.b64encode(buffer).decode('utf-8')
        except Exception as encode_error:
            logger.error(f"Frame encoding error: {encode_error}")
            return
        
        # Send response
        try:
            emit('response', {
                'frame': f'data:image/jpeg;base64,{frame_data}',
                'gesture': gesture
            })
        except Exception as emit_error:
            logger.error(f"Socket emit error: {emit_error}")
        
    except Exception as e:
        logger.error(f"Unexpected error processing frame: {e}", exc_info=True)

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000, debug=True, use_reloader=True, log_output=True)
