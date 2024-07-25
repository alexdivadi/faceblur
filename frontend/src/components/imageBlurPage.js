import FileUploader from './fileUploader';
import React, { useState, useCallback, useEffect, useRef } from 'react';
import AsyncButton from './asyncButton.js';
import useAsync from './useAsync.js';
import DropdownMenu from './dropdownMenu.js';
import { baseUrl } from '../config/const.js';

const fetchFaceDetections = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('type', 'image');
    const response = await fetch(`${baseUrl}/detect`, {
        method: 'POST',
        body: formData,
    });
    if (!response.ok) {
        throw new Error('Error fetching face detections: bad request.');
    }
    const data = await response.json();
    if (data.error) {
        console.log(data.error);
        throw new Error(`Error fetching face detections.`);
    }
    return data.faces;
};

const fetchBlurredImage = async (file, detections, style = 'Blur') => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('detections', JSON.stringify(detections));
    formData.append('type', 'image');
    formData.append('style', style.toLowerCase())
    const response = await fetch(`${baseUrl}/blur`, {
        method: 'POST',
        body: formData,
        responseType: 'blob',
    });
    if (!response.ok) {
        throw new Error('Error blurring face: bad request.');
    }
    const data = await response.json();

    if (data.error) {
        console.log(data.error);
        throw new Error(`Error blurring face.`);
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
    const imageRef = useRef(null);
    const [imageHeight, setImageHeight] = useState(null)
    const [selectedOption, setSelectedOption] = useState(null);

    const blurOptions = ['Blur', 'Smile'];

    const handleOptionSelect = (option) => {
        setSelectedOption(option);
    };

    useEffect(() => {
        function handleResize() {
            if (imageRef?.current) {
                setImageHeight(imageRef.current.height);
            }
        }

        // Initial size
        handleResize();

        // Listen to window resize events
        window.addEventListener('resize', handleResize);

        // Clean up the event listener
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [loading]);

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
        <div className="container content-center w-screen py-10 px-3 md:px-10 md:mb-10">
            <div className='container bg-white max-w-screen lg:h-[80vh] py-16 md:px-16 px-4 rounded-xl'>
                <div className="flex flex-col px-4 h-full w-full max-w-full items-center lg:flex-row md:text-left text-center justify-between">
                    <div className='flex-1 flex flex-col lg:mb-0 mb-10 max-w-lg justify-center'>
                        <h1 className="text-5xl font-bold mb-10">Blur an Image</h1>
                        <h1 className='text-2xl mb-5 text-wrap'>After uploading an image, tap on the 🟥 faces you want to keep unblurred.</h1>
                        <h1>Upload an image here.</h1>
                        <div className='text-center items-center block mr-6 w-full'>
                            <FileUploader onUpload={onUpload} />
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
                            {image && !error && (<div className='flex flex-col md:flex-row justify-between items-center  mt-4 gap-2'>
                                <div className='text-lg py-3'>{loading ? "Loading..." : (faces && faces.length > 0 ? faces.length : "No") + " face(s) detected"}</div>
                                {file && faces && (
                                    <>
                                        <DropdownMenu
                                            options={blurOptions}
                                            defaultOption={blurOptions[0]}
                                            onSelect={handleOptionSelect}
                                            className='bg-gray-500 m-auto text-white font-bold py-4 px-8 rounded text-lg hover:bg-gray-400 focus:outline-none focus:bg-gray-700' />
                                        <AsyncButton title="See Result!" onClick={async () => {
                                            const detections = faces.filter((_, index) => faceVisibility[index]);
                                            await fetchBlurredImage(file, detections, selectedOption)
                                        }}
                                            disabled={loading || (faces && faces.length === 0)}
                                            className='text-white font-bold py-4 px-8 rounded text-lg'
                                        />
                                    </>
                                )}
                            </div>
                            )}
                        </div>
                    </div>
                    <div id='preview' className='flex-1 md:ml-10 flex justify-center container h-full w-full'
                        style={imageRef.current && imageRef.current.naturalHeight <= imageRef.current.naturalWidth ? { alignItems: 'center' } : {}}>
                        {image && <div className='relative'>
                            {loading && <div
                                className={`absolute inset-0 bg-white opacity-50 flex items-center justify-center`}
                            ></div>}
                            <img
                                ref={imageRef}
                                id='uploaded-image'
                                src={image}
                                alt="Uploaded"
                                className="block w-full max-h-full object-contain justify-self-center" />
                            <div className='absolute inset-0 max-h-full ' style={{ maxHeight: imageHeight ? `${imageHeight}px` : "auto" }}>
                                {faces && !loading && !error && faces.map(([x, y, w, h], index) => (
                                    <div
                                        key={index}
                                        onClick={() => toggleFaceVisibility(index)}
                                        className={`absolute border-4 border-red-500 border-solid max-w-full`}
                                        style={{
                                            top: `${(y / imageRef.current.naturalHeight) * 100}%`,
                                            left: `${(x / imageRef.current.naturalWidth) * 100}%`,
                                            height: `${(h / imageRef.current.naturalHeight) * 100}%`,
                                            width: `${(w / imageRef.current.naturalWidth) * 100}%`,
                                            opacity: faceVisibility[index] ? 1 : 0.5,
                                            filter: faceVisibility[index] ? 'none' : 'grayscale(100%)',
                                            borderRadius: '2px',
                                        }}
                                    />
                                )
                                )}
                            </div>
                        </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ImageBlurPage;