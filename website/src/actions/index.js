const uploadingFilesAddItems = (value) => (
    { type: 'UPLOADING_FILES_ADD_ITEMS', value }
);


const uploadingFilesSetItems = (value) => (
    { type: 'UPLOADING_FILES_SET_ITEMS', value }
);


const uploadingFilesSetItemCancelToken = (key, value) => (
    { type: 'UPLOADING_FILES_SET_ITEM_CANCEL_TOKEN', key, value }
);


const uploadingFilesSetItemState = (key, value) => (
    { type: 'UPLOADING_FILES_SET_ITEM_STATE', key, value }
);


const uploadingFilesSetItemProgress = (key, value) => (
    { type: 'UPLOADING_FILES_SET_ITEM_PROGRESS', key, value }
);


const uploadingFilesRemoveItem = (key) => (
    { type: 'UPLOADING_FILES_REMOVE_ITEM', key }
);


const userObjectsSetLoading = (value) => (
    { type: 'USER_OBJECTS_SET_LOADING', value }
);


const userObjectsSetItems = (value) => (
    { type: 'USER_OBJECTS_SET_ITEMS', value }
);


export default {
    uploadingFilesSetItems,
    uploadingFilesAddItems,
    uploadingFilesSetItemCancelToken,
    uploadingFilesSetItemState,
    uploadingFilesSetItemProgress,
    uploadingFilesRemoveItem,
    userObjectsSetLoading,
    userObjectsSetItems,
};
