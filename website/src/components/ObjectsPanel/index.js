import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Button } from 'reactstrap';

import ObjectsList from 'components/ObjectsList';

import thunks from 'thunks';


function ObjectsPanel({ loading, reload }) {
    React.useEffect(() => { reload(); }, [reload]);

    const onClickReload = (event) => {
        event.preventDefault();
        reload();
    };

    return (
        <>
            <Button onClick={onClickReload} color="primary"> Refresh </Button>
            <ObjectsList />
        </>
    );
}


ObjectsPanel.propTypes = {
    loading: PropTypes.bool.isRequired,
    reload: PropTypes.func.isRequired,
};


const mapStateToPros = ({ userObjects: { loading } }) => ({
    loading,
});


const mapDispatchToProps = (dispatch) => ({
    reload: thunks.reloadUserObjects(dispatch),
});


export default connect(mapStateToPros, mapDispatchToProps)(ObjectsPanel);
