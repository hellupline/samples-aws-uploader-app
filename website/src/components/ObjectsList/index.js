import React from 'react';

import { ListGroup } from 'reactstrap';

import { ObjectsListItem } from 'components/ObjectsListItem';


export function ObjectsList({ reloadFunc, items }) {
    return (
        <ListGroup>
            {items.map(item => (
                <ObjectsListItem 
                    key={item.storage_key} 
                    reloadFunc={reloadFunc} 
                    item={item} 
                />
            ))} 
        </ListGroup>
    );
}
