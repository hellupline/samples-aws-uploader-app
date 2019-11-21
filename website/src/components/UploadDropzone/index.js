import React from 'react';
import { useDropzone } from 'react-dropzone';

import { Card } from 'reactstrap'


export function UploadDropzone({ onDrop }) {
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
    return (
        <Card>
            <div {...getRootProps()}>
                <input {...getInputProps()} />
                {
                    isDragActive ?
                        <p>Drop the files here ...</p> :
                        <p>Drag 'n' drop some files here, or click to select files</p>
                }
            </div>
        </Card> 
    );
}
