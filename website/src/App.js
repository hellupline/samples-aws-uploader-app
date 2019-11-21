import React from 'react';
import Amplify from 'aws-amplify';

import { withAuthenticator } from 'aws-amplify-react';
import { Container, Row, Col } from 'reactstrap';

import UploadDropzonePanel from 'components/UploadDropzonePanel';
import ObjectsPanel from 'components/ObjectsPanel';

import settings from './settings.json';

Amplify.configure(settings.Amplify);


function App() {
    return (
        <Container fluid>
            <Row>
                <Col lg="8">
                    <ObjectsPanel />
                </Col>
                <Col lg="4">
                    <UploadDropzonePanel />
                </Col>
            </Row>
        </Container>
    );
}

export default withAuthenticator(App, { includeGreetings: true });
