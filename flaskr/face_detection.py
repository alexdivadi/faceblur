import cv2
import imutils
#import dlib
import os
import numpy as np

HOME = os.getcwd()
PROTO_PATH = os.path.join(HOME,'model/deploy.prototxt.txt')
MODEL_PATH = os.path.join(HOME,'model/res10_300x300_ssd_iter_140000.caffemodel')
UPLOAD_PATH = os.path.join(HOME, 'uploads/')

net = cv2.dnn.readNetFromCaffe(PROTO_PATH, MODEL_PATH)


def aabb(x1, y1, w1, h1, x2, y2, w2, h2):
    """Basic AABB collision"""
    return x1 < x2 + w2 and \
           x1 + w1 > x2 and \
           y1 < y2 + h2 and \
           y1 + h1 > y2


def save_img(img, path):
    """Save an image"""
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


def detect_img(filename, thresh=0.7):
    """Detect faces in an image"""
    img = cv2.imread(filename)
    (h, w) = img.shape[:2]
    img = imutils.resize(img, width=600)
    locations = []

    blob = cv2.dnn.blobFromImage(img, 1.0, (w, h), [104, 117, 123], False, False,)

    net.setInput(blob)
    faces = net.forward()

    for i in range(0, faces.shape[2]):
        confidence = faces[0, 0, i, 2]

        if confidence < thresh:
            continue

        face = faces[0, 0, i, 3:7] * np.array([w, h, w, h])
        locations.append(face.astype("int"))

    return [x.tolist() for x in locations]


def blur_faces_img(filename, locations: list, path: str):
    """Save image with blur effect applied"""
    img = cv2.imread(filename)

    for face in locations:
        [y1, x1, y2, x2] = face 
        blur_segment = img[x1:x2, y1:y2]
        img[x1:x2, y1:y2] = cv2.GaussianBlur(blur_segment, (21, 21), 0)

    cv2.imwrite(path, img)

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
