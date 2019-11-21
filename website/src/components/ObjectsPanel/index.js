import React from 'react';

import { Button } from 'reactstrap';

import { ObjectsList } from 'components/ObjectsList';


export function ObjectsPanel({ reloadFunc, items }) {
    const onClickReload = event => {
        event.preventDefault();
        reloadFunc(); 
    }

    return (
        <React.Fragment>
            <Button onClick={onClickReload} color="primary"> Refresh </Button>
            <ObjectsList reloadFunc={reloadFunc} items={items} />
        </React.Fragment>
    );
}


