import React, {
    useState, useEffect, useCallback, useMemo,
} from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

import { withAuthenticator } from 'aws-amplify-react';
import Amplify, { API, Auth } from 'aws-amplify';

import ProgressBar from 'react-bootstrap/ProgressBar';
import Button from 'react-bootstrap/Button';

import 'bootstrap/dist/css/bootstrap.css';
import './App.css';

import settings from './settings.json';


Amplify.configure(settings.Amplify);


function App() {
    return (
        <div className="App">
            <UploadDropzone />
        </div>
    );
}

export default withAuthenticator(App);


function UploadDropzone() {
    const [files, setFiles] = useState([]);

    const onDrop = useCallback((acceptedFiles) => {
        setFiles([...files, ...acceptedFiles]);
    }, [files]);
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    return (
        <div {...getRootProps({ className: 'App-dropzone' })}>
            <input {...getInputProps()} />
            <p>{isDragActive ? 'Drop the files here ...' : "Drag 'n' drop some files here, or click to select files"}</p>
            <ul style={{ listStyleType: 'none' }}>
                {files.map((file) => (<FileUploader key={file.path} file={file} />))}
            </ul>
        </div>
    );
}

function FileUploader({ file }) {
    const [state, setState] = useState('standby');
    const [progress, setProgress] = useState(0);

    const requestCancel = useMemo(() => axios.CancelToken.source(), []);

    const handleCancelClick = () => requestCancel.cancel('Operation canceled by the user.');

    useEffect(() => {
        uploadFile(file, setState, setProgress, requestCancel);
    }, [file, requestCancel]);

    const total = Math.round((progress * 100) / file.size);
    return (
        <li>
            <div>
                <span>
                    {`${file.path} - ${progress} / ${file.size} bytes`}
                </span>
                <span>
                    {state === 'in-progress' && <Button onClick={handleCancelClick} variant="danger" size="sm">Cancel</Button>}
                </span>
            </div>
            <div>
                <ProgressBar
                    animated
                    variant={{ 'in-progress': 'info', completed: 'success', error: 'danger' }[state] || 'primary'}
                    now={total}
                    label={`${total}% - ${progress} / ${file.size}`}
                />
            </div>
        </li>
    );
}


async function uploadFile(file, setState, setProgress, requestCancel) {
    try {
        const idToken = (await Auth.currentSession()).getIdToken().getJwtToken();
        const args = {
            headers: {
                Authorization: `Bearer ${idToken}`,
            },
        };
        const res = await API.get('uploader', '/create-upload-url', args);
        const { upload_url: uploadUrl } = res;

        setState('in-progress');
        await axios.put(uploadUrl, file, {
            onUploadProgress: (e) => setProgress(e.loaded),
            cancelToken: requestCancel.token,
            headers: { 'Content-Type': '' },
        });
        setState('completed');
    } catch (ex) {
        setState('error');
        throw ex;
    }
}
