import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { ListGroup } from 'reactstrap';

import ObjectsListItem from 'components/ObjectsListItem';

import thunks from 'thunks';


function ObjectsList({ items }) {
    return (
        <ListGroup>
            {items.map((item) => (
                <ObjectsListItem key={item.storage_key} item={item} />
            ))}
        </ListGroup>
    );
}


ObjectsList.propTypes = {
    items: PropTypes.arrayOf(PropTypes.shape({
        filename: PropTypes.string.isRequired,
        storage_key: PropTypes.string.isRequired,
    })).isRequired,
};


const mapStateToPros = ({ userObjects: { items } }) => ({
    items,
});


const mapDispatchToProps = (dispatch) => ({
    reload: thunks.reloadUserObjects(dispatch),
});


export default connect(mapStateToPros, mapDispatchToProps)(ObjectsList);
