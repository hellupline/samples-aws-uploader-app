import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import UploadDropzone from 'components/UploadDropzone';
import FileUploaderList from 'components/FileUploaderList';


function UploadDropzonePanel({ items }) {
    return (
        <>
            <UploadDropzone />
            {items.length > 0 && <FileUploaderList /> }
        </>
    );
}


UploadDropzonePanel.propTypes = {
    items: PropTypes.array.isRequired,
};


const mapStateToPros = ({ uploadingFiles: { items } }) => ({
    items,
});


export default connect(mapStateToPros)(UploadDropzonePanel);
