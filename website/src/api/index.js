import axios from 'axios';
import { API, Auth } from 'aws-amplify';


export async function listFiles() {
    try {
        const token = (await Auth.currentSession()).getIdToken().getJwtToken();
        const args = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const res = await API.get('uploader', '/objects', args);
        return res.items;
    } catch (ex) {
        throw ex;
    }
}


export async function uploadFile(file, requestCancel, setState, setProgress) {
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

        setState('in-progress');
        await axios.put(uploadUrl, file, {
            onUploadProgress: (e) => setProgress(e.loaded),
            cancelToken: requestCancel.token,
            headers: { 'Content-Type': file.type },
        });
        setState('completed');
    } catch (ex) {
        setState('error');
        throw ex;
    }
}


export async function downloadFile(object_id) {
    try {
        const token = (await Auth.currentSession()).getIdToken().getJwtToken();
        const args = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const res = await API.get('uploader', `/objects/${object_id}/download`, args);
        const { download_url } = res;

        console.log(download_url);
    } catch (ex) {
        throw ex;
    }
}


export async function deleteFile(object_id) {
    try {
        const token = (await Auth.currentSession()).getIdToken().getJwtToken();
        const args = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const res = await API.del('uploader', `/objects/${object_id}`, args);
        return res.items;
    } catch (ex) {
        throw ex;
    }
}
