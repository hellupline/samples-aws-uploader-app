import React from 'react';
import uuid from 'uuid/v4';

import { UploadDropzone } from 'components/UploadDropzone';
import { FileUploaderList } from 'components/FileUploaderList';


export function UploadDropzonePanel({ reloadFunc }) {
    const [files, setFiles] = React.useState([]);

    const addFiles = React.useCallback(newFiles => {
        const rows = newFiles.map(row => ({ key: uuid(), file: row }));
        setFiles([...files, ...rows]) ;
    }, [files]);

    const removeFile = React.useCallback(key => {
        setFiles(files.filter(row => row.key !== key));
    }, [files]);

    return (
        <React.Fragment>
            <UploadDropzone onDrop={addFiles} />
            {files.length > 0 && <FileUploaderList removeFileFunc={removeFile} files={files} /> }
        </React.Fragment>
    );
}
