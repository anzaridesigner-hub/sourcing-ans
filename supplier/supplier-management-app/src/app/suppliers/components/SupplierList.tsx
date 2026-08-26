import React from 'react';
import SupplierActions from './SupplierActions';
import { Supplier } from '../../../types/supplier';

interface SupplierListProps {
    suppliers: Supplier[];
}

const SupplierList: React.FC<SupplierListProps> = ({ suppliers }) => {
    return (
        <div>
            <h2>Supplier List</h2>
            <ul>
                {suppliers.map((supplier) => (
                    <li key={supplier.id}>
                        {supplier.name} - {supplier.contactInfo}
                    </li>
                ))}
            </ul>
            <SupplierActions />
            <p>Total Suppliers: {suppliers.length}</p>
        </div>
    );
};

export default SupplierList;