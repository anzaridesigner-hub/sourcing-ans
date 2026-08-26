import React from 'react';

const SupplierActions = ({ onSave }) => {
    return (
        <div className="supplier-actions">
            <button onClick={onSave} className="save-button">
                Save
            </button>
        </div>
    );
};

export default SupplierActions;