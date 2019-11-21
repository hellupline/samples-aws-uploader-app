import actions from 'actions';

import api from 'api';


const startUpload = (dispatch) => async (key, cancelToken, file) => {
    const setState = (value) => dispatch(actions.uploadingFilesSetItemState(key, value));
    const setProgress = (value) => dispatch(actions.uploadingFilesSetItemProgress(key, value));

    dispatch(actions.uploadingFilesSetItemCancelToken(key, cancelToken));
    try {
        await api.uploadFile(file, cancelToken, setState, setProgress);
        reloadUserObjects(dispatch)();
    } finally {
        setTimeout(() => dispatch(actions.uploadingFilesRemoveItem(key)), 2000);
    }
};


const reloadUserObjects = (dispatch) => async () => {
    dispatch(actions.userObjectsSetLoading(true));
    dispatch(actions.userObjectsSetItems(await api.listFiles()));
    dispatch(actions.userObjectsSetLoading(false));
};


const downloadUserObjects = (dispatch) => async (objectId) => {
    await api.downloadFile(objectId);
    reloadUserObjects(dispatch)();
};


const deleteUserObjects = (dispatch) => async (objectId) => {
    await api.deleteFile(objectId);
    reloadUserObjects(dispatch)();
};


export default {
    startUpload,
    reloadUserObjects,
    downloadUserObjects,
    deleteUserObjects,
};
