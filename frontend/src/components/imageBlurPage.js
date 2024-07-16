import FileUploader from './fileUploader';
import React, { useState, useCallback, useEffect } from 'react';
import AsyncButton from './asyncButton.js';
import useAsync from './useAsync.js';

const fetchFaceDetections = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('type', 'image');
    const response = await fetch('http://localhost:5000/detect', {
        method: 'POST',
        body: formData,
    });
    if (!response.ok) {
        throw new Error('Error fetching face detections');
    }
    const data = await response.json();
    return data.faces;
};

const fetchBlurredImage = async (file, detections) => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('detections', JSON.stringify(detections));
    formData.append('type', 'image');
    const response = await fetch('http://localhost:5000/blur', {
        method: 'POST',
        body: formData,
        responseType: 'blob',
    });
    if (!response.ok) {
        throw new Error('Error blurring face: bad request.');
    }
    const data = await response.json();

    if (data.error) {
        throw new Error(`Error blurring face: ${data.error.args}`);
    }

    const byteCharacters = atob(data.img);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);

    var blob = new Blob([byteArray], { type: data.mimetype });
    var url = URL.createObjectURL(blob);
    window.open(url);
    return url;
}

function ImageBlurPage() {
    const [image, setImage] = useState(null);
    const [file, setFile] = useState(null);
    const [faceVisibility, setFaceVisibility] = useState([]);
    const { loading, error, result: faces, execute: uploadFile } = useAsync(fetchFaceDetections);

    const imageElement = document.getElementById('uploaded-image');
    const imageWidth = (image && imageElement) ? imageElement.naturalWidth : 0;
    const imageHeight = (image && imageElement) ? imageElement.naturalHeight : 0;

    const onUpload = useCallback(async (file) => {
        setFile(file);
        const reader = new FileReader();
        reader.onloadend = async () => {
            setImage(reader.result);
            uploadFile(file);
        };
        reader.readAsDataURL(file);
    }, [uploadFile]);

    useEffect(() => {
        if (faces && faces.length > 0) {
            setFaceVisibility(faces.map(() => true)); // Initialize visibility for each face
        }
    }, [faces]);

    const toggleFaceVisibility = useCallback((index) => {
        setFaceVisibility(prevVisibility => {
            const updatedVisibility = [...prevVisibility];
            updatedVisibility[index] = !updatedVisibility[index];
            return updatedVisibility;
        });
    }, []);

    return (
        <div className="container content-center w-screen ml-20">
            <div className='bg-white items-center max-w-full p-20 rounded-xl'>
                <div className="text-left">
                    <h1 className="text-6xl font-bold mb-10">Blur an Image</h1>
                    <h3 className="text-2xl mb-10">Upload image here</h3>
                    <div className='block'>
                        <FileUploader onUpload={onUpload} />
                        {loading && <div className="text-center mt-4">Loading...</div>}
                        {error && (
                            <div className="text-center mt-4 text-red-500">
                                {error}
                                <button
                                    onClick={() => uploadFile(file)}
                                    className="ml-4 p-2 bg-blue-500 text-white rounded"
                                >
                                    Retry
                                </button>
                            </div>
                        )}
                        {image && (
                            <div className='items-center text-center'>
                                <div className="container relative mt-4 max-w-fit">
                                    <img id='uploaded-image' src={image} alt="Uploaded" className="block mx-auto" />
                                    {faces && faces.map(([x, y, w, h], index) => (
                                        <div
                                            key={index}
                                            onClick={() => toggleFaceVisibility(index)}
                                            className={`absolute border-4 border-red-500 border-solid`}
                                            style={{
                                                top: `${(y / imageHeight) * 100}%`,
                                                left: `${(x / imageWidth) * 100}%`,
                                                width: `${(w / imageWidth) * 100}%`,
                                                height: `${(h / imageHeight) * 100}%`,
                                                opacity: faceVisibility[index] ? 1 : 0.5,
                                                filter: faceVisibility[index] ? 'none' : 'grayscale(100%)',
                                                borderRadius: '8px',
                                            }}
                                        />
                                    ))}
                                </div>
                                {file && faces && (<AsyncButton title="Blur Image!" onClick={async () => {
                                    const detections = faces.filter((_, index) => faceVisibility[index]);
                                    await fetchBlurredImage(file, detections)
                                }} />)}
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
}

export default ImageBlurPage;