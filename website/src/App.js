import React from 'react';

import { withAuthenticator } from 'aws-amplify-react';
import Amplify  from 'aws-amplify';
import { Container, Row, Col } from 'reactstrap';

import { listFiles } from './api'; 
import { UploadDropzonePanel } from 'components/UploadDropzonePanel';
import { ObjectsPanel } from 'components/ObjectsPanel';

import 'bootstrap/dist/css/bootstrap.min.css';

import settings from './settings.json';
Amplify.configure(settings.Amplify);


function App() {
    const [userFiles, setUserFiles] = React.useState([]);
    const reloadUserFiles = async () => setUserFiles(await listFiles());

    React.useEffect(() => { reloadUserFiles(); }, [])

    return (
        <Container fluid>
            <Row>
                <Col lg="8">
                    <ObjectsPanel reloadFunc={reloadUserFiles} items={userFiles} />
                </Col>
                <Col lg="4">
                    <UploadDropzonePanel reloadFunc={reloadUserFiles} />
                </Col>
            </Row>
        </Container>
    );
}

export default withAuthenticator(App, { includeGreetings: true });
