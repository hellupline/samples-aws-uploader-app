import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
    ListGroupItem,
    Row,
    Col,
    Button,
    Progress,
} from 'reactstrap';

import thunks from 'thunks';
import {
    UPLOAD_STATE_STANDBY,
    UPLOAD_STATE_IN_PROGRESS,
    UPLOAD_STATE_COMPLETED,
    UPLOAD_STATE_ERROR,
} from 'api';


const STATES = {
    [UPLOAD_STATE_STANDBY]: 'primary',
    [UPLOAD_STATE_IN_PROGRESS]: 'info',
    [UPLOAD_STATE_COMPLETED]: 'success',
    [UPLOAD_STATE_ERROR]: 'danger',
};


function FileUploaderListItem({
    name,
    size,
    cancelToken,
    state,
    progress,
    key_,
    file,
    uploadFile,
}) {
    const onClickCancel = (event) => {
        event.preventDefault();
        cancelToken.cancel('Operation canceled by the user.');
    };

    React.useEffect(
        () => { uploadFile(key_, cancelToken, file); },
        [key_, cancelToken, file, uploadFile],
    );

    const completed = Math.round((progress * 100) / size);
    const color = STATES[state] || 'primary';
    return (
        <ListGroupItem>
            <Row>
                <Col lg="9">
                    {name}
                </Col>
                <Col className="text-right" lg="3">
                    {
                        (state === 'standby' || state === 'in-progress')
                            && (
                                <Button onClick={onClickCancel} size="sm" color="danger">
                                Cancel
                                </Button>
                            )
                    }
                </Col>
            </Row>
            <Row>
                <Col>
                    <Progress value={completed} color={color}>
                        {`${progress} / ${size} bytes`}
                    </Progress>
                </Col>
            </Row>
        </ListGroupItem>
    );
}


FileUploaderListItem.propTypes = {
    name: PropTypes.string.isRequired,
    size: PropTypes.number.isRequired,
    cancelToken: PropTypes.shape({
        cancel: PropTypes.func.isRequired,
    }).isRequired,
    state: PropTypes.oneOf([
        'standby',
        'in-progress',
        'completed',
        'canceled',
    ]).isRequired,
    progress: PropTypes.number.isRequired,
    key_: PropTypes.string.isRequired,
    file: PropTypes.any.isRequired,

    uploadFile: PropTypes.func.isRequired,
};


const mapStateToPros = () => ({});


const mapDispatchToProps = (dispatch) => ({
    uploadFile: thunks.startUpload(dispatch),
});


export default connect(mapStateToPros, mapDispatchToProps)(FileUploaderListItem);
