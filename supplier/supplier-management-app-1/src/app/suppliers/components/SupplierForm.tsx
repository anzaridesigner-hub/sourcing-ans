import React, { useState } from 'react';

const SupplierForm = ({ onAddSupplier }) => {
    const [supplierName, setSupplierName] = useState('');
    const [contactInfo, setContactInfo] = useState('');

    const handleAddSupplier = (e) => {
        e.preventDefault();
        if (supplierName && contactInfo) {
            onAddSupplier({ name: supplierName, contact: contactInfo });
            setSupplierName('');
            setContactInfo('');
        }
    };

    return (
        <form onSubmit={handleAddSupplier}>
            <div>
                <label htmlFor="supplierName">Supplier Name:</label>
                <input
                    type="text"
                    id="supplierName"
                    value={supplierName}
                    onChange={(e) => setSupplierName(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor="contactInfo">Contact Information:</label>
                <input
                    type="text"
                    id="contactInfo"
                    value={contactInfo}
                    onChange={(e) => setContactInfo(e.target.value)}
                    required
                />
            </div>
            <button type="submit">Add</button>
        </form>
    );
};

export default SupplierForm;