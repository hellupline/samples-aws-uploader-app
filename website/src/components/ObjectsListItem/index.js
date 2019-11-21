import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
    ListGroupItem,
    Row,
    Col,
    Button,
} from 'reactstrap';

import thunks from 'thunks';


function ObjectsListItem({ item, downloadObject, deleteObject }) {
    const onClickDownload = async (event) => {
        event.preventDefault();
        downloadObject(item.object_id);
    };

    const onClickDelete = async (event) => {
        event.preventDefault();
        deleteObject(item.object_id);
    };

    return (
        <ListGroupItem action>
            <Row>
                <Col lg="9">
                    {item.filename}
                </Col>
                <Col className="text-right" lg="3">
                    <Button onClick={onClickDownload} size="sm" color="success">
                        Download
                    </Button>
                    <Button onClick={onClickDelete} size="sm" color="danger">
                        Delete
                    </Button>
                </Col>
            </Row>
        </ListGroupItem>
    );
}


ObjectsListItem.propTypes = {
    item: PropTypes.shape({
        filename: PropTypes.string,
    }).isRequired,
    downloadObject: PropTypes.func.isRequired,
    deleteObject: PropTypes.func.isRequired,
};


const mapStateToPros = () => ({});


const mapDispatchToProps = (dispatch) => ({
    downloadObject: thunks.downloadUserObjects(dispatch),
    deleteObject: thunks.deleteUserObjects(dispatch),
});


export default connect(mapStateToPros, mapDispatchToProps)(ObjectsListItem);
