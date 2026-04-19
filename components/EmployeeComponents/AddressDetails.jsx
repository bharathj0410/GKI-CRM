import React from 'react'
import { Input, Textarea, Autocomplete, AutocompleteItem } from '@heroui/react'
import indianStatesData from '@/utils/indianStates.json'
import countriesData from '@/utils/countries.json'

export default function AddressDetails({
    isEditing,
    employee,
    editedEmployee,
    handleInputChange,
    addressType = 'temporary'
}) {
    const addressKey = addressType === 'permanent' ? 'permanentAddress' : 'temporaryAddress'
    const displayName = addressType === 'permanent' ? 'Permanent' : 'Temporary'
    const icon = '📍'

    return (
        <div className='mb-6 p-5 rounded-xl border border-blue-100 shadow-sm hover:shadow-md transition-shadow'>
            <h4 className='text-base font-semibold text-gray-900 mb-4 flex items-center gap-2'>
                <span className='text-lg'>{icon}</span> {displayName} Address
            </h4>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='md:col-span-2'>
                    <label className='text-sm font-medium text-gray-600 mb-1.5 block'>Address Line</label>
                    {isEditing ? (
                        <Textarea
                            value={editedEmployee[addressKey]?.addressLine || ''}
                            onValueChange={(val) => handleInputChange(addressKey, {
                                ...(editedEmployee[addressKey] || {}),
                                addressLine: val
                            })}
                            placeholder='Street, House No., Locality'
                            size='sm'
                            variant='bordered'
                            minRows={2}
                        />
                    ) : (
                        <p className='text-gray-900 font-semibold'>{employee[addressKey]?.addressLine || 'N/A'}</p>
                    )}
                </div>
                <div>
                    <label className='text-sm font-medium text-gray-600 mb-1.5 block'>City</label>
                    {isEditing ? (
                        <Input
                            value={editedEmployee[addressKey]?.city || ''}
                            onValueChange={(val) => handleInputChange(addressKey, {
                                ...(editedEmployee[addressKey] || {}),
                                city: val
                            })}
                            size='sm'
                            variant='bordered'
                        />
                    ) : (
                        <p className='text-gray-900 font-semibold'>{employee[addressKey]?.city || 'N/A'}</p>
                    )}
                </div>
                <div>
                    <label className='text-sm font-medium text-gray-600 mb-1.5 block'>State</label>
                    {isEditing ? (
                        <Autocomplete
                            value={editedEmployee[addressKey]?.state || ''}
                            onValueChange={(val) => handleInputChange(addressKey, {
                                ...(editedEmployee[addressKey] || {}),
                                state: val
                            })}
                            size='sm'
                            variant='bordered'
                            placeholder='Search state...'
                        >
                            {indianStatesData.map((state) => (
                                <AutocompleteItem key={state.key} value={state.label}>
                                    {state.label}
                                </AutocompleteItem>
                            ))}
                        </Autocomplete>
                    ) : (
                        <p className='text-gray-900 font-semibold'>{employee[addressKey]?.state || 'N/A'}</p>
                    )}
                </div>
                <div>
                    <label className='text-sm font-medium text-gray-600 mb-1.5 block'>Pincode</label>
                    {isEditing ? (
                        <Input
                            value={editedEmployee[addressKey]?.pincode || ''}
                            onValueChange={(val) => {
                                const pincodeRegex = /^[0-9]*$/;
                                if (pincodeRegex.test(val) || val === '') {
                                    handleInputChange(addressKey, {
                                        ...(editedEmployee[addressKey] || {}),
                                        pincode: val
                                    });
                                }
                            }}
                            size='sm'
                            variant='bordered'
                            maxLength={6}
                            placeholder='e.g., 400001'
                        />
                    ) : (
                        <p className='text-gray-900 font-semibold'>{employee[addressKey]?.pincode || 'N/A'}</p>
                    )}
                </div>
                <div>
                    <label className='text-sm font-medium text-gray-600 mb-1.5 block'>Country</label>
                    {isEditing ? (
                        <Autocomplete
                            value={editedEmployee[addressKey]?.country || ''}
                            onValueChange={(val) => handleInputChange(addressKey, {
                                ...(editedEmployee[addressKey] || {}),
                                country: val
                            })}
                            size='sm'
                            variant='bordered'
                            placeholder='Search country...'
                        >
                            {countriesData.map((country) => (
                                <AutocompleteItem key={country.key} value={country.label}>
                                    {country.label}
                                </AutocompleteItem>
                            ))}
                        </Autocomplete>
                    ) : (
                        <p className='text-gray-900 font-semibold'>{employee[addressKey]?.country || 'N/A'}</p>
                    )}
                </div>
            </div>
        </div>
    )
}
