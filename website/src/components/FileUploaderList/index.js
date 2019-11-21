import React from 'react';

import { ListGroup } from 'reactstrap'

import { FileUploader } from 'components/FileUploader';


export function FileUploaderList({ removeFileFunc, files }) {
    return (
        <ListGroup variant="flush">
            {files.map(row => (
                <FileUploader
                    key={row.key} 
                    removeFileFunc={removeFileFunc} 
                    key_={row.key} 
                    file={row.file} 
                />
            ))}
        </ListGroup>
    );
}
