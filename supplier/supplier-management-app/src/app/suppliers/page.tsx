import React, { useState } from 'react';
import SupplierForm from './components/SupplierForm';
import SupplierList from './components/SupplierList';
import SupplierActions from './components/SupplierActions';
import { Supplier } from '../../types/supplier';

const SupplierManagementPage = () => {
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [totalSuppliers, setTotalSuppliers] = useState<number>(845);

    const addSupplier = (newSupplier: Supplier) => {
        setSuppliers([...suppliers, newSupplier]);
    };

    const saveSuppliers = () => {
        // Logic to save suppliers (e.g., API call)
        console.log('Suppliers saved:', suppliers);
    };

    return (
        <div className="supplier-management">
            <h1>Supplier Management</h1>
            <SupplierForm onAddSupplier={addSupplier} />
            <SupplierList suppliers={suppliers} />
            <SupplierActions onSave={saveSuppliers} />
            <p>Total Suppliers: {totalSuppliers}</p>
        </div>
    );
};

export default SupplierManagementPage;