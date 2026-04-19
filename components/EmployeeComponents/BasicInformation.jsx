import React from 'react'
import { Input, Select, SelectItem, Chip, DatePicker } from '@heroui/react'
import languagesData from '@/utils/languages.json'

export default function BasicInformation({
    isEditing,
    employee,
    editedEmployee,
    handleInputChange,
    handleDateChange,
    formatDateForInput
}) {
    return (
        <div className='mb-8'>
            <div className='flex items-center gap-3 mb-6'>
                <div className='w-1.5 h-8 bg-gradient-to-b from-secondary to-secondary/60 rounded-full'></div>
                <h3 className='text-xl font-bold text-gray-950'>Basic Information</h3>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div>
                    <label className='text-sm font-medium text-gray-600 mb-1.5 block'>Full Name</label>
                    {isEditing ? (
                        <Input
                            value={editedEmployee.name || ''}
                            onValueChange={(val) => handleInputChange('name', val)}
                            size='sm'
                            variant='bordered'
                            className='focus:ring-2 focus:ring-secondary/20'
                            classNames={{
                                input: 'bg-white',
                                inputWrapper: 'border-gray-200 hover:border-gray-300 focus-within:border-secondary'
                            }}
                        />
                    ) : (
                        <p className='text-gray-900 font-semibold'>{employee.name}</p>
                    )}
                </div>
                <div>
                    <label className='text-sm font-medium text-gray-600 mb-1.5 block'>Employee ID</label>
                    <p className='text-gray-900 font-semibold'>{employee.employeeId || 'N/A'}</p>
                </div>
                <div>
                    <label className='text-sm font-medium text-gray-600 mb-1.5 block'>Email Address</label>
                    {isEditing ? (
                        <Input
                            type='email'
                            value={editedEmployee.email || ''}
                            onValueChange={(val) => handleInputChange('email', val)}
                            size='sm'
                            variant='bordered'
                            placeholder='example@domain.com'
                        />
                    ) : (
                        <p className='text-gray-900 font-semibold'>{employee.email || 'N/A'}</p>
                    )}
                </div>
                <div>
                    <label className='text-sm font-medium text-gray-600 mb-1.5 block'>Phone Number</label>
                    {isEditing ? (
                        <Input
                            type='tel'
                            value={editedEmployee.phone || ''}
                            onValueChange={(val) => {
                                const phoneRegex = /^[0-9]*$/;
                                if (phoneRegex.test(val) || val === '') {
                                    handleInputChange('phone', val);
                                }
                            }}
                            size='sm'
                            variant='bordered'
                            placeholder='+91 XXXXX XXXXX'
                            maxLength={15}
                        />
                    ) : (
                        <p className='text-gray-900 font-semibold'>{employee.phone || 'N/A'}</p>
                    )}
                </div>
                <div>
                    <label className='text-sm font-medium text-gray-600 mb-1.5 block'>Date of Birth</label>
                    {isEditing ? (
                        <DatePicker
                            value={formatDateForInput(editedEmployee.dateOfBirth)}
                            onChange={(val) => handleDateChange('dateOfBirth', val)}
                            size='sm'
                            variant='bordered'
                            showMonthAndYearPickers
                            className='max-w-full'
                        />
                    ) : (
                        <p className='text-gray-900 font-semibold'>
                            {employee.dateOfBirth ? new Date(employee.dateOfBirth).toLocaleDateString() : 'N/A'}
                        </p>
                    )}
                </div>
                <div>
                    <label className='text-sm font-medium text-gray-600 mb-1.5 block'>Date of Joining</label>
                    {isEditing ? (
                        <DatePicker
                            value={formatDateForInput(editedEmployee.dateOfJoining)}
                            onChange={(val) => handleDateChange('dateOfJoining', val)}
                            size='sm'
                            variant='bordered'
                            showMonthAndYearPickers
                            className='max-w-full'
                        />
                    ) : (
                        <p className='text-gray-900 font-semibold'>
                            {employee.dateOfJoining ? new Date(employee.dateOfJoining).toLocaleDateString() : 'N/A'}
                        </p>
                    )}
                </div>
                <div>
                    <label className='text-sm font-medium text-gray-600 mb-1.5 block'>Blood Group</label>
                    {isEditing ? (
                        <Input
                            value={editedEmployee.bloodGroup || ''}
                            onValueChange={(val) => handleInputChange('bloodGroup', val)}
                            placeholder='e.g., O+, A-, B+'
                            size='sm'
                            variant='bordered'
                        />
                    ) : (
                        <p className='text-gray-900 font-semibold'>{employee.bloodGroup || 'N/A'}</p>
                    )}
                </div>
                <div>
                    <label className='text-sm font-medium text-gray-600 mb-1.5 block'>Employee Type</label>
                    <Chip 
                        color={employee.employeeType === 'crm_user' ? 'secondary' : employee.employeeType === 'temp_employee' ? 'warning' : 'default'}
                        variant='flat'
                    >
                        {employee.employeeType === 'crm_user' ? 'CRM User' : 
                         employee.employeeType === 'temp_employee' ? 'Temporary' : 'Employee'}
                    </Chip>
                </div>
                <div>
                    <label className='text-sm font-medium text-gray-600 mb-1.5 block'>Gender (optional)</label>
                    {isEditing ? (
                        <Select
                            value={editedEmployee.gender || ''}
                            onChange={(e) => handleInputChange('gender', e.target.value)}
                            size='sm'
                            variant='bordered'
                            placeholder='Select gender'
                        >
                            <SelectItem key='male' value='male'>Male</SelectItem>
                            <SelectItem key='female' value='female'>Female</SelectItem>
                            <SelectItem key='other' value='other'>Other</SelectItem>
                        </Select>
                    ) : (
                        <p className='text-gray-900 font-semibold'>
                            {editedEmployee.gender 
                                ? editedEmployee.gender.charAt(0).toUpperCase() + editedEmployee.gender.slice(1)
                                : 'N/A'
                            }
                        </p>
                    )}
                </div>
                <div className='md:col-span-2'>
                    <label className='text-sm font-medium text-gray-600 mb-1.5 block'>Languages Known (Multi-select)</label>
                    {isEditing ? (
                        <div className='space-y-2'>
                            <div className='flex flex-wrap gap-2 mb-3 p-3 border border-gray-200 rounded-lg bg-gray-50 min-h-12'>
                                {(editedEmployee.languagesKnown || []).map((lang) => (
                                    <Chip
                                        key={lang}
                                        onClose={() => {
                                            handleInputChange('languagesKnown', 
                                                (editedEmployee.languagesKnown || []).filter(l => l !== lang)
                                            )
                                        }}
                                        color='secondary'
                                        variant='flat'
                                    >
                                        {languagesData.find(l => l.key === lang)?.label || lang}
                                    </Chip>
                                ))}
                            </div>
                            <Select
                                size='sm'
                                variant='bordered'
                                placeholder='Select languages...'
                                onChange={(e) => {
                                    const selectedLang = e.target.value
                                    const currentLangs = editedEmployee.languagesKnown || []
                                    if (selectedLang && !currentLangs.includes(selectedLang)) {
                                        handleInputChange('languagesKnown', [...currentLangs, selectedLang])
                                    }
                                    e.target.value = ''
                                }}
                            >
                                {languagesData.map((lang) => (
                                    <SelectItem 
                                        key={lang.key} 
                                        value={lang.key}
                                        isDisabled={(editedEmployee.languagesKnown || []).includes(lang.key)}
                                    >
                                        {lang.label}
                                    </SelectItem>
                                ))}
                            </Select>
                        </div>
                    ) : (
                        <div className='flex flex-wrap gap-2'>
                            {(employee.languagesKnown || []).length > 0 ? (
                                (employee.languagesKnown || []).map((lang) => (
                                    <Chip
                                        key={lang}
                                        color='secondary'
                                        variant='flat'
                                    >
                                        {languagesData.find(l => l.key === lang)?.label || lang}
                                    </Chip>
                                ))
                            ) : (
                                <p className='text-gray-900 font-semibold'>N/A</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
