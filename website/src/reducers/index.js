import { combineReducers } from 'redux';
import axios from 'axios';
import uuid from 'uuid/v4';


import { UPLOAD_STATE_STANDBY } from 'api';

const uploadingFilesInitialState = {
    items: [],
};


function uploadingFilesReducer(state = uploadingFilesInitialState, action) {
    switch (action.type) {
    case 'UPLOADING_FILES_ADD_ITEMS':
        return uploadingFilesAddItems(state, action);
    case 'UPLOADING_FILES_SET_ITEMS':
        return uploadingFilesSetItems(state, action);
    case 'UPLOADING_FILES_SET_ITEM_STATE':
        return uploadingFilesSetItemState(state, action);
    case 'UPLOADING_FILES_SET_ITEM_PROGRESS':
        return uploadingFilesSetItemProgress(state, action);
    case 'UPLOADING_FILES_REMOVE_ITEM':
        return uploadingFilesRemoveItem(state, action);
    default:
        return state;
    }
}


const uploadingFilesAddItems = (state, { value }) => {
    const newItems = value.map((row) => ({
        cancelToken: axios.CancelToken.source(),
        state: UPLOAD_STATE_STANDBY,
        progress: 0,
        key: uuid(),
        file: row,
    }));
    const items = [...state.items, ...newItems];
    return uploadingFilesSetItems(state, { value: items });
};


const uploadingFilesSetItems = (state, { value }) => ({ ...state, items: value });


const uploadingFilesSetItemState = (state, { key, value }) => {
    const items = state.items.map(
        (item) => (item.key === key ? { ...item, state: value } : item),
    );
    return uploadingFilesSetItems(state, { value: items });
};


const uploadingFilesSetItemProgress = (state, { key, value }) => {
    const items = state.items.map(
        (item) => (item.key === key ? { ...item, progress: value } : item),
    );
    return uploadingFilesSetItems(state, { value: items });
};


const uploadingFilesRemoveItem = (state, { key }) => {
    const items = state.items.filter(
        (item) => item.key !== key,
    );
    return uploadingFilesSetItems(state, { value: items });
};


const userObjectsInitialState = {
    loading: true,
    items: [],
};


function userObjectsReducer(state = userObjectsInitialState, action) {
    switch (action.type) {
    case 'USER_OBJECTS_SET_LOADING':
        return userObjectsSetLoading(state, action);
    case 'USER_OBJECTS_SET_ITEMS':
        return userObjectsSetItems(state, action);
    default:
        return state;
    }
}


const userObjectsSetLoading = (state, { value }) => (
    { ...state, loading: value }
);


const userObjectsSetItems = (state, { value }) => (
    { ...state, items: value }
);


const Reducers = combineReducers({
    uploadingFiles: uploadingFilesReducer,
    userObjects: userObjectsReducer,
});


export default Reducers;
