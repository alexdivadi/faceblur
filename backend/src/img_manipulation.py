import os
import time
import cv2
import numpy as np

from src.styles import BlurStyle
from src.file import HOME, encode_image

def overlay_alpha(src, overlay):
    alpha_s = overlay[:, :, 3] / 255.0
    alpha_l = 1.0 - alpha_s

    for c in range(3):
        src[:, :, c] = (alpha_s * overlay[:, :, c] +
                            alpha_l * src[:, :, c])
        
def apply_mask(fg, bg, mask):
    inverse_mask = np.ones_like(mask) * 255 - mask

    # Apply the mask to the blurred face
    foreground = cv2.bitwise_and(mask, fg)
    background = cv2.bitwise_and(inverse_mask, bg)
    return cv2.add(foreground, background)

        
def blur_faces_img(img: cv2.typing.MatLike, detections: list, filetype: str = 'png') -> tuple[bytes, int, int]:
    """
    Save image with blur effect applied
    
    Returns: bytes, height, width
    """
    img_h, img_w = img.shape[:2]

    print('Blurring faces...')
    start = time.time()

    for face in detections:
        [x1, y1, w, h] = face 
        x2 = min(x1 + w, img_w)
        y2 = min(y1 + h, img_h)
        x1 = max(x1, 0)
        y1 = max(y1, 0)
        w = x2 - x1
        h = y2 - y1
        k = 2 * int(min(w, h) * 0.2) + 1

        blur_segment = img[y1:y2, x1:x2]
        blurred_face = cv2.GaussianBlur(blur_segment, (k, k), 0, borderType=cv2.BORDER_DEFAULT)

        # Create a mask for rounded corners
        mask = np.zeros_like(blurred_face)
        mask = cv2.ellipse(mask, (w // 2, h // 2), (w // 2, h // 2), 0, 0, 360, (255, 255, 255), -1)
       
        blurred_face = apply_mask(blurred_face, blur_segment, mask)
        img[y1:y2, x1:x2] = blurred_face
    
    end = time.time()
    print(f'{round(end - start, 3)}s elapsed')
    return encode_image(filetype, img), img_h, img_w

def smile_faces_img(img: cv2.typing.MatLike, detections: list, filetype: str = 'png') -> tuple[bytes, int, int]:
    """
    Save image with smiley face effect applied
    
    Returns: bytes, height, width
    """
    img_h, img_w = img.shape[:2]
    smiley_face: cv2.typing.MatLike = cv2.imread(os.path.join(HOME, "assets/smiling-emoji.png"), -1)

    for face in detections:
        [x1, y1, w, h] = face 
        x2 = min(x1 + w, img_w)
        y2 = min(y1 + h, img_h)
        x1 = max(x1, 0)
        y1 = max(y1, 0)
        resized_smile = cv2.resize(smiley_face, (x2-x1, y2-y1))
        overlay_alpha(img[y1:y2, x1:x2], resized_smile)

    return encode_image(filetype, img), img_h, img_w

def obscure_faces(style:BlurStyle, img: cv2.typing.MatLike, detections: list, filetype: str):
    """
    Save image with chosen blur effect applied
    
    Returns: bytes, height, width
    """
    match style:
        case BlurStyle.BLUR:
            return blur_faces_img(img, detections, filetype)
        case BlurStyle.SMILE:
            return smile_faces_img(img, detections, filetype)
        case _:
            raise ValueError(f'Function `obscure_faces` received an invalid style: {style}')