import React from 'react';
import { useDropzone } from 'react-dropzone';

function Dropzone({ onDrop }) {
    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    return (
        <div {...getRootProps()} className="dropzone">
            <div className='text-center'>
                <img src='/images/file.png' style={{ opacity: "0.5" }} className='w-25' /><br /><br />
                <p>Drag & drop files here, or click to select files</p>
            </div>
        </div>
    );
}

export default Dropzone;
