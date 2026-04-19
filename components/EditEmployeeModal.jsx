"use client"
import React, { useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Checkbox, CheckboxGroup } from '@heroui/react';
import Toast from '@/components/Toast';
import api from '@/lib/axios';

const pagePermissions = [
    { key: "dashboard", label: "Dashboard" },
    { key: "employee", label: "Employee" },
    { key: "stocks", label: "Stocks" },
    { key: "costing", label: "Costing" },
    { key: "visitors", label: "Visitors" },
    { key: "job", label: "Job" },
];

export default function EditEmployeeModal({ isOpen, onClose, employee, onSuccess }) {
    const [formData, setFormData] = useState({
        name: employee?.name || '',
        username: employee?.username || '',
        permissions: employee?.permissions || []
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const updateData = {
                _id: employee._id,
                name: formData.name,
                username: formData.username,
                role: 'employee',
                permissions: formData.permissions
            };

            const response = await api.put('/api/updateEmployee', updateData);
            Toast("Success", response.data.message, "success");
            onSuccess();
            onClose();
        } catch (err) {
            Toast("Error", err.response?.data?.error || "Failed to update employee", "danger");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="2xl" scrollBehavior="inside">
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">
                    <h3 className="text-xl font-bold">Edit Employee</h3>
                    <p className="text-sm text-gray-500 font-normal">Update employee information and permissions</p>
                </ModalHeader>
                <ModalBody>
                    <div className="space-y-4">
                        <Input
                            label="Name"
                            placeholder="Enter name"
                            value={formData.name}
                            onValueChange={(value) => setFormData({...formData, name: value})}
                            color="secondary"
                            isRequired
                        />
                        <Input
                            label="Username"
                            placeholder="Enter username"
                            value={formData.username}
                            onValueChange={(value) => setFormData({...formData, username: value})}
                            color="secondary"
                            isRequired
                        />

                        <CheckboxGroup
                            label="Page Access Permissions"
                            color="secondary"
                            value={formData.permissions}
                            onValueChange={(value) => setFormData({...formData, permissions: value})}
                            description="Choose which pages this employee can access"
                        >
                            <div className='grid grid-cols-2 gap-2 mt-2'>
                                {pagePermissions.map((page) => (
                                    <Checkbox key={page.key} value={page.key} size='sm'>
                                        {page.label}
                                    </Checkbox>
                                ))}
                            </div>
                        </CheckboxGroup>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button color="default" variant="light" onPress={onClose}>
                        Cancel
                    </Button>
                    <Button color="secondary" onPress={handleSubmit} isLoading={loading}>
                        Save Changes
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
