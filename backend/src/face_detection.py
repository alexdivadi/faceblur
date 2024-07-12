import cv2
import imutils
#import dlib
import os
import numpy as np
from retinaface import RetinaFace
from deepface import DeepFace

from face import Face

HOME = os.getcwd()
PROTO_PATH = os.path.join(HOME,'model/deploy.prototxt.txt')
MODEL_PATH = os.path.join(HOME,'model/res10_300x300_ssd_iter_140000.caffemodel')
UPLOAD_PATH = os.path.join(HOME, 'uploads/')

net = cv2.dnn.readNetFromCaffe(PROTO_PATH, MODEL_PATH)

def save_img(img, path) -> None:
    """Save an image by filepath"""
    try:
        img.save(os.path.join(UPLOAD_PATH, path))
    except Exception as e:
        print(e)

# def update_locations(prev, new):
#     """For finding the closest faces to the previous frame and reordering based on that
#     Computationally expensive, so probably not a viable solution
#     Ultimate goal is to keep track of which faces are which so we can blur/unblur them
#     """
#     n = len(prev)
#     m = len(new)
#
#     if n < m:
#         cost = dlib.matrix([[-sum(x - y) for y in new] + [0] * (m - n) for x in prev])
#         ordering = dlib.max_cost_assignment(cost)
#     elif n > m:
#         cost = [[-sum(x - y) for y in new] for x in prev]
#         for i in range(n - m):
#             cost.append([0] * m)
#         cost = dlib.matrix(cost)
#         ordering = dlib.max_cost_assignment(cost)
#     else:
#         cost = dlib.matrix([[-sum(x - y) for y in new] for x in prev])
#         ordering = dlib.max_cost_assignment(cost)
#
#     return [new[i] for i in ordering]

def detect_img(path, thresh=0.7):
    """Detect faces in an image"""
    faces = RetinaFace.detect_faces(path)
    return [face["facial_area"] for face in faces.values() if face["score"] > thresh]

def detect_video(path):
    video = cv2.VideoCapture(path)

    seen_faces = []

    frame_count = 0
    while video.isOpened():
        ret, frame = video.read()
        if not ret:
            break
        
        # Extract faces from the frame
        try:
            detected_faces = RetinaFace.detect_faces(frame)
            
            for face in detected_faces.values():
                face_already_seen = False
                
                for seen_face in seen_faces:
                    # Compare the current face with seen faces
                    result = DeepFace.verify(face, seen_face, model_name='VGG-Face', enforce_detection=False)
                    if result['verified']:
                        face_already_seen = True
                        seen_face.add_detection(result['facial_area'], frame_count, result['score'])
                        break
                
                if not face_already_seen:
                    new_face = Face(label=f"face_{len(seen_faces) + 1}")
                    new_face.add_bounding_box(face['facial_area'], frame_count)
                    seen_faces.append(new_face)
                    print(f"New face detected at frame {frame_count}")
                    
        except Exception as e:
            print(f"Error detecting face in frame {frame_count}: {e}")
        
        frame_count += 1

    video.release()
    return seen_faces

def blur_faces_img(bytes, locations: list, blur_amt: int = 16, filetype: str = 'png'):
    """Save image with blur effect applied"""
    img = cv2.imdecode(bytes, cv2.IMREAD_COLOR)
    w, h = img.shape[:2]
    blur_count = 0

    for face in locations:
        [y1, x1, y2, x2] = face 
        if x2 < w and y2 < h:
            blur_count += 1
            blur_segment = img[x1:x2, y1:y2]
            img[x1:x2, y1:y2] = cv2.GaussianBlur(blur_segment, (0, 0), sigmaX=blur_amt, borderType=cv2.BORDER_DEFAULT)
    
    if blur_count == 0:
        raise Exception('Detected faces out of range')

    cv2.imwrite(os.path.join(UPLOAD_PATH,f'out{filetype}'), img)
    return cv2.imencode(filetype, img)[1].tobytes()

# def blur_video(f, blur_faces=True):
#     """
#     Our endpoint for blurring videos
#     Unfinished
#     """
#     writer = None
#     frame_h = None
#     frame_w = None
#     vid = cv2.VideoCapture(f)
#     prev_locations = []

#     while True:
#         frame = vid.read()[1]
#         # rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

#         if frame_h is None or frame_w is None:
#             (frame_h, frame_w) = frame.shape[:2]

#         fourcc = cv2.VideoWriter_fourcc(*"MJPG")
#         writer = cv2.VideoWriter('', fourcc, 30,
#                                  (frame_w, frame_h), True)

#         if frame is None:
#             break

#         locations = detect_img(frame, frame_h, frame_w)
#         #update_locations(prev_locations, locations)
