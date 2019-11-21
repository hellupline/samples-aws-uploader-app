import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { ListGroup } from 'reactstrap';

import FileUploaderListItem from 'components/FileUploaderListItem';


function FileUploaderList({ items }) {
    return (
        <ListGroup variant="flush">
            {items.map((item) => (
                <FileUploaderListItem
                    key={item.key}
                    name={item.file.name}
                    size={item.file.size}
                    cancelToken={item.cancelToken}
                    state={item.state}
                    progress={item.progress}
                    key_={item.key}
                    file={item.file}
                />
            ))}
        </ListGroup>
    );
}


FileUploaderList.propTypes = {
    items: PropTypes.arrayOf(PropTypes.shape({
        key: PropTypes.string.isRequired,
        file: PropTypes.any.isRequired,
    })).isRequired,
};


const mapStateToPros = ({ uploadingFiles: { items } }) => ({
    items,
});


export default connect(mapStateToPros)(FileUploaderList);
