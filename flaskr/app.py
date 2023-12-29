from flask import Flask, request
from werkzeug.utils import secure_filename
from face_detection import UPLOAD_PATH, detect_img, save_img, blur_faces_img
import os

app = Flask(__name__)

@app.route('/img', methods=['POST'])
def img_faces():
    """Endpoint for getting face locations in img"""
    response = {}

    try:
        file = request.files['img']
        name = secure_filename(file.filename)
        save_img(file, name)
        faces = detect_img(os.path.join(UPLOAD_PATH, name))
        response['faces'] = faces
        response['num_of_faces'] = len(faces)
        new_fname = os.path.join(UPLOAD_PATH, 'blurred_'+name)
        blur_faces_img(os.path.join(UPLOAD_PATH, name), faces, new_fname)
        response['fname'] = new_fname
    except Exception as e:
        response['error'] = e.args

    return response
    

if __name__ == "__main__":
    app.run()
