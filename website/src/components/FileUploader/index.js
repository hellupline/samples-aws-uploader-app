import React from 'react';
import axios from 'axios';

import { uploadFile } from 'api';

import {
    Row,
    Col,
    Button,
    ListGroupItem,
    Progress,
} from 'reactstrap'


const STATES = {
    'standby': 'primary',
    'in-progress': 'info',
    'completed': 'success',
    'error': 'danger',
};


export function FileUploader({ removeFileFunc, key_, file }) {
    const [state, setState] = React.useState('standby');
    const [progress, setProgress] = React.useState(0);

    const cancelToken = React.useMemo(() => axios.CancelToken.source(), []);

    const onClickCancel = event => {
        event.preventDefault();
        cancelToken.cancel('Operation canceled by the user.');
        setTimeout(() => removeFileFunc(key_), 1000);
    };

    React.useEffect(() => {
        const run = async () => {
            await uploadFile(file, cancelToken, setState, setProgress);
            setTimeout(() => removeFileFunc(key_), 1000);
        };
        run();
    }, [removeFileFunc, key_, file, cancelToken]);

    const completed = Math.round((progress * 100) / file.size);
    const color = STATES[state] || 'primary';
    return (
        <ListGroupItem>
            <Row>
                <Col lg="9"> {file.name} </Col>
                <Col className="text-right" lg="3">
                    {
                        (state === 'standby' || state === 'in-progress') && 
                            <Button onClick={onClickCancel} size="sm" color="danger">
                                Cancel
                            </Button>
                    }
                </Col>
            </Row>
            <Row>
                <Col>
                    <Progress value={completed} color={color}>
                        {`${progress} / ${file.size} bytes`} 
                    </Progress> 
                </Col> 
            </Row>
        </ListGroupItem>
    );
}
