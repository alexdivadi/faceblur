import os
import time
import cv2
import numpy as np

from src.face import Face
from src.sface import SFace
from src.yunet import YuNet
from src.file import HOME


DETECTION_MODEL_PATH = os.path.join(HOME, "model/face_detection_yunet_2023mar.onnx")
#RECOGNITION_MODEL_PATH = os.path.join(HOME, "model/face_recognition_sface_2021dec.onnx")

(major_ver, minor_ver, subminor_ver) = (cv2.__version__).split('.')

face_detector: YuNet = YuNet(modelPath=DETECTION_MODEL_PATH,
              inputSize=[320, 320],
              confThreshold=0.7,
              nmsThreshold=0.3,
              topK=5000)
#face_detector_hi: YuNet = YuNet(modelPath=DETECTION_MODEL_PATH,
            #   inputSize=[320, 320],
            #   confThreshold=0.9,
            #   nmsThreshold=0.3,
            #   topK=5000)

#face_recognizor: SFace = SFace(modelPath=RECOGNITION_MODEL_PATH)

def detect_img(img: cv2.typing.MatLike):
    """Detect faces in an image"""
    height, width, _ = img.shape
    face_detector.setInputSize([width, height])

    faces = face_detector.infer(img)
    faces = faces if faces is not None else []
    return [list(map(int, face[:4])) for face in faces]

# def detect_video(path, min_seconds: float = 0.5):
#     """
#     Detect significant faces in a video
#     The intended purpose is to check which faces the user may want to avoid blurring out.
#     """
#     video = cv2.VideoCapture(path)

#     if int(major_ver)  < 3 :
#         fps = video.get(cv2.cv.CV_CAP_PROP_FPS)
#     else :
#         fps = video.get(cv2.CAP_PROP_FPS)

#     every_n_frames = int(fps * min_seconds)
#     seen_faces: list[Face] = []
#     num_faces: int = 0
#     frame_count: int = -1

#     print('Detecting significant faces in video')
#     start = time.time()

#     while video.isOpened():
#         ret, frame = video.read()
#         if not ret:
#             break

#         frame_count += 1
        
#         if (frame_count % every_n_frames) != 0:
#               continue

#         height, width, _ = frame.shape

#         # Extract faces from the frame
#         try:
#             face_detector_hi.setInputSize([width, height])
#             detected_faces = face_detector_hi.infer(frame)
#             detected_faces = detected_faces if detected_faces is not None else []

#             # Don't check each frame if faces aren't moving
#             if num_faces == len(detected_faces):
#                 continue

#             num_faces = len(detected_faces)
            
#             for face in detected_faces:
#                 face_already_seen = False
#                 bbox = face[:4]
#                 conf = face[-1]
                
#                 for seen_face in seen_faces:
#                     # Compare the current face with seen faces
#                     last_frame = seen_face.detections[-1]
#                     result = face_recognizor.match(frame, bbox, last_frame[0], last_frame[1])

#                     if result[1] == 1:
#                         face_already_seen = True
#                         seen_face.add_detection(frame, bbox, conf)
#                         break
                
#                 if not face_already_seen:
#                     new_face = Face(label=f"face_{len(seen_faces) + 1}")
#                     new_face.add_detection(frame, bbox, conf)
#                     seen_faces.append(new_face)
#                     print(f"New face detected at frame {frame_count}")
                    
#         except Exception as e:
#             print(f"Error detecting face in frame {frame_count}: {e}")
        
#     end = time.time()
#     video.release()
#     print(f'{round(end - start, 3)}s elapsed')

#     return seen_faces



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
