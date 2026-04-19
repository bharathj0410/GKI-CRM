import React from 'react'
import { Input } from '@heroui/react'

export default function EmergencyContact({
    isEditing,
    employee,
    editedEmployee,
    handleInputChange
}) {
    return (
        <div>
            <div className='flex items-center gap-3 mb-6'>
                <div className='w-1.5 h-8 bg-gradient-to-b from-secondary to-secondary/60 rounded-full'></div>
                <h3 className='text-xl font-bold text-gray-950'>Emergency Contact</h3>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div>
                    <label className='text-sm font-medium text-gray-600 mb-1.5 block'>Contact Name</label>
                    {isEditing ? (
                        <Input
                            value={editedEmployee.emergencyContactName || ''}
                            onValueChange={(val) => handleInputChange('emergencyContactName', val)}
                            placeholder='Full name'
                            size='sm'
                            variant='bordered'
                        />
                    ) : (
                        <p className='text-gray-900 font-semibold'>{employee.emergencyContactName || 'N/A'}</p>
                    )}
                </div>
                <div>
                    <label className='text-sm font-medium text-gray-600 mb-1.5 block'>Relationship</label>
                    {isEditing ? (
                        <Input
                            value={editedEmployee.emergencyContactRelation || ''}
                            onValueChange={(val) => handleInputChange('emergencyContactRelation', val)}
                            placeholder='e.g., Father, Mother, Spouse'
                            size='sm'
                            variant='bordered'
                        />
                    ) : (
                        <p className='text-gray-900 font-semibold'>{employee.emergencyContactRelation || 'N/A'}</p>
                    )}
                </div>
                <div>
                    <label className='text-sm font-medium text-gray-600 mb-1.5 block'>Contact Number</label>
                    {isEditing ? (
                        <Input
                            type='tel'
                            value={editedEmployee.emergencyContact || ''}
                            onValueChange={(val) => {
                                const phoneRegex = /^[0-9]*$/;
                                if (phoneRegex.test(val) || val === '') {
                                    handleInputChange('emergencyContact', val);
                                }
                            }}
                            placeholder='+91 XXXXX XXXXX'
                            size='sm'
                            variant='bordered'
                            maxLength={15}
                        />
                    ) : (
                        <p className='text-gray-900 font-semibold'>{employee.emergencyContact || 'N/A'}</p>
                    )}
                </div>
            </div>
        </div>
    )
}
