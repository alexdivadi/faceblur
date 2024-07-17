import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

function FileUploader({ onUpload, accept }) {
    const maxSize = 1048576;

    const onDrop = useCallback((acceptedFiles) => {
        if (acceptedFiles.length > 0) {
            const selectedFile = acceptedFiles[0];
            onUpload(selectedFile);
        }
    }, []);

    const {
        getRootProps,
        getInputProps,
        isDragActive,
        isDragReject,
        acceptedFiles,
        rejectedFiles
    } = useDropzone({
        onDrop: onDrop,
        accept: accept ?? {
            'image/jpeg': [],
            'image/tiff': [],
            'image/png': [],
            'image/webp': [],
        }
    });

    const isFileTooLarge = rejectedFiles
        && rejectedFiles.length > 0
        && rejectedFiles[0].size > maxSize;

    return <div className="text-center container">
        <div {...getRootProps({ className: 'dropzone' })}>
            <div className="max-w-full relative border-2 border-gray-300 border-dashed rounded-lg p-6" id="uploader">
                <input {...getInputProps()} />
                <img className="mx-auto h-12 w-12" src="https://www.svgrepo.com/show/357902/image-upload.svg" alt="" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                    {!isDragActive && (
                        <span>Drag and drop
                            <span className="text-indigo-600"> or browse </span>
                            to upload
                        </span>)
                    }
                    {isDragActive && !isDragReject && "Drop here"}
                    {isDragReject && "File type not accepted"}
                    {isFileTooLarge && (
                        <div className="text-danger mt-2">
                            File is too large.
                        </div>
                    )}
                </h3>
                <p className="mt-1 text-xs text-gray-500">
                    Any image file up to 10MB
                </p>
            </div>
        </div>

    </div>

}

export default FileUploader;