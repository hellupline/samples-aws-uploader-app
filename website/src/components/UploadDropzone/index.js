import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useDropzone } from 'react-dropzone';

import { Card } from 'reactstrap';

import actions from 'actions';


function UploadDropzone({ onDrop }) {
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
    return (
        <Card>
            <div {...getRootProps()}>
                <input {...getInputProps()} />
                {
                    isDragActive
                        ? <p>Drop the files here ...</p>
                        : <p>Drag &quot;n&quot; drop some files here, or click to select files</p>
                }
            </div>
        </Card>
    );
}


UploadDropzone.propTypes = {
    onDrop: PropTypes.func.isRequired,
};


const mapStateToPros = () => ({});


const mapDispatchToProps = (dispatch) => ({
    onDrop: (files) => dispatch(actions.uploadingFilesAddItems(files)),
});


export default connect(mapStateToPros, mapDispatchToProps)(UploadDropzone);
