"use client"
import React from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@heroui/react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import Toast from '@/components/Toast';
import api from '@/lib/axios';

export default function DeleteEmployeeModal({ isOpen, onClose, employee, onSuccess }) {
    const [loading, setLoading] = React.useState(false);

    const handleDelete = async () => {
        setLoading(true);
        try {
            const response = await api.delete(`/api/deleteEmployee?id=${employee._id}`);
            Toast("Success", response.data.message, "success");
            onSuccess();
            onClose();
        } catch (err) {
            Toast("Error", err.response?.data?.error || "Failed to delete employee", "danger");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="md">
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-danger-100 rounded-full">
                            <ExclamationTriangleIcon className="w-6 h-6 text-danger" />
                        </div>
                        <h3 className="text-xl font-bold">Delete Employee</h3>
                    </div>
                </ModalHeader>
                <ModalBody>
                    <div className="space-y-3">
                        <p className="text-gray-700">
                            Are you sure you want to delete <span className="font-semibold text-danger">{employee?.name}</span>?
                        </p>
                        <div className="bg-danger-50 border border-danger-200 rounded-lg p-4">
                            <p className="text-sm text-danger-700">
                                <strong>Warning:</strong> This action cannot be undone. All data associated with this employee will be permanently removed.
                            </p>
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button color="default" variant="light" onPress={onClose}>
                        Cancel
                    </Button>
                    <Button color="danger" onPress={handleDelete} isLoading={loading}>
                        Delete Employee
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
