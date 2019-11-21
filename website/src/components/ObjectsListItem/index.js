import React from 'react';

import { Row, Col, Button, ListGroupItem } from 'reactstrap';

import { downloadFile, deleteFile } from 'api';


export function ObjectsListItem({ reloadFunc, item }) {
    const onClickDownload = async event => {
        event.preventDefault();
        downloadFile(item.object_id); 
    }

    const onClickDelete = async event => {
        event.preventDefault();
        await deleteFile(item.object_id); 
        reloadFunc();
    }

    return (
        <ListGroupItem action>
            <Row>
                <Col lg="9"> {item.filename} </Col>
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


