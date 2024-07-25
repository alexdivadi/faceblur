import cv2
import numpy as np
import os

HOME = os.getcwd()
UPLOAD_PATH = os.path.join(HOME, 'uploads/')

def save(file, path) -> str:
    """Save an image by filepath"""
    new_path = os.path.join(UPLOAD_PATH, path)
    file.save(new_path)
    return new_path

def read_image_from_file(file) -> cv2.typing.MatLike:
    filestr = file.read()
    file_bytes = np.fromstring(filestr, np.uint8)
    return cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)

def read_image_from_path(path) -> cv2.typing.MatLike:
    return cv2.imread(path, cv2.IMREAD_COLOR)

def encode_image(ext, img) -> bytes:
    try:
        output = cv2.imencode(ext, img)[1].tobytes()
    except Exception as e:
        print(f'Error encoding string: {e} Encoding to PNG.')
        output = cv2.imencode('.png', img)[1].tobytes()
    finally:
        return output