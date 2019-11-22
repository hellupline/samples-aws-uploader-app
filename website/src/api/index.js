import axios from 'axios';
import { API, Auth } from 'aws-amplify';

export const UPLOAD_STATE_STANDBY = 'standby';
export const UPLOAD_STATE_IN_PROGRESS = 'in-progress';
export const UPLOAD_STATE_COMPLETED = 'completed';
export const UPLOAD_STATE_ERROR = 'error';


async function listFiles() {
    const token = (await Auth.currentSession()).getIdToken().getJwtToken();
    const args = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const res = await API.get('uploader', '/objects', args);
    return res.items;
}


async function uploadFile(file, requestCancel, setState, setProgress) {
    try {
        const token = (await Auth.currentSession()).getIdToken().getJwtToken();
        const args = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: {
                filename: file.name,
                content_type: file.type,
                size: file.size,
            },
        };
        const res = await API.post('uploader', '/objects', args);
        const { upload_url: uploadUrl } = res;

        setState(UPLOAD_STATE_IN_PROGRESS);
        await axios.put(uploadUrl, file, {
            onUploadProgress: (e) => setProgress(e.loaded),
            cancelToken: requestCancel.token,
            headers: { 'Content-Type': '' },
        });
        setState(UPLOAD_STATE_COMPLETED);
    } catch (ex) {
        setState(UPLOAD_STATE_ERROR);
        // XXX: send delete do backend
        throw ex;
    }
}


async function downloadFile(objectId) {
    const token = (await Auth.currentSession()).getIdToken().getJwtToken();
    const args = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const res = await API.get('uploader', `/objects/${objectId}/download`, args);
    return res.download_url;
}


async function deleteFile(objectId) {
    const token = (await Auth.currentSession()).getIdToken().getJwtToken();
    const args = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const res = await API.del('uploader', `/objects/${objectId}`, args);
    return res.success;
}


export default {
    listFiles,
    uploadFile,
    downloadFile,
    deleteFile,
};
