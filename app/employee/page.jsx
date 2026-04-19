"use client"
import React, { useState, useEffect } from 'react'
import AddEmployee from '@/components/AddEmployee'
import Employee from '@/components/Employee'
import TempEmployee from '@/components/TempEmployee'
import { Button, Tabs, Tab } from '@heroui/react'
import { UserPlusIcon, UsersIcon, ClockIcon } from '@heroicons/react/24/outline'
import api from '@/lib/axios'

export default function EmployeePage() {
    const [selected, setSelected] = useState("employees")
    const [regularCount, setRegularCount] = useState(0)
    const [tempCount, setTempCount] = useState(0)
    const [totalCount, setTotalCount] = useState(0)

    useEffect(() => {
        fetchEmployeeCounts()
    }, [])

    const fetchEmployeeCounts = async () => {
        try {
            // Fetch regular employees
            const regularResponse = await api.get('getEmployee?type=regular')
            const regularData = regularResponse.data || []
            setRegularCount(regularData.length)

            // Fetch temp employees
            const tempResponse = await api.get('getEmployee?type=temp')
            const tempData = tempResponse.data || []
            setTempCount(tempData.length)

            // Calculate total
            setTotalCount(regularData.length + tempData.length)
        } catch (error) {
            console.error('Error fetching employee counts:', error)
        }
    }

    const handleEmployeeAdded = () => {
        // Refresh counts when a new employee is added
        fetchEmployeeCounts()
    }

    return (
        <div className='w-full h-full overflow-auto'>
            <div className='p-5'>
                {/* Header Section */}
                <div className='mb-6'>
                    <div className='flex justify-between items-start'>
                        <div>
                            <h1 className='text-2xl font-bold bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent mb-2'>
                                Employee Management
                            </h1>
                            <p className='text-gray-600 text-sm'>Manage your team members and their access permissions</p>
                        </div>
                        <div className='flex gap-3'>
                            <div className='bg-white rounded-xl shadow-lg p-4 border border-purple-100'>
                                <div className='flex items-center gap-3'>
                                    <div className='w-10 h-10 bg-gradient-to-br from-secondary to-primary rounded-lg flex items-center justify-center'>
                                        <UsersIcon className='w-5 h-5 text-white' />
                                    </div>
                                    <div>
                                        <p className='text-xs text-gray-600'>Total Employees</p>
                                        <p className='text-xl font-bold text-gray-900'>{totalCount}</p>
                                    </div>
                                </div>
                            </div>
                            <div className='bg-white rounded-xl shadow-lg p-4 border border-orange-100'>
                                <div className='flex items-center gap-3'>
                                    <div className='w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center'>
                                        <ClockIcon className='w-5 h-5 text-white' />
                                    </div>
                                    <div>
                                        <p className='text-xs text-gray-600'>Temp Employees</p>
                                        <p className='text-xl font-bold text-gray-900'>{tempCount}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs Navigation */}
                <div className='mb-4'>
                    <Tabs 
                        selectedKey={selected}
                        onSelectionChange={setSelected}
                        color="secondary"
                        size="md"
                        classNames={{
                            tabList: "bg-white shadow-md rounded-lg p-1.5 border border-purple-100",
                            tab: "px-6 h-10 font-semibold",
                            cursor: "bg-gradient-to-r from-secondary to-primary",
                            tabContent: "group-data-[selected=true]:text-white"
                        }}
                    >
                        <Tab 
                            key="employees" 
                            title={
                                <div className="flex items-center gap-2">
                                    <UsersIcon className='w-5 h-5' />
                                    <span>All Employees</span>
                                </div>
                            }
                        />
                        <Tab 
                            key="temp" 
                            title={
                                <div className="flex items-center gap-2">
                                    <ClockIcon className='w-5 h-5' />
                                    <span>Temp Employees</span>
                                </div>
                            }
                        />
                        <Tab 
                            key="add" 
                            title={
                                <div className="flex items-center gap-2">
                                    <UserPlusIcon className='w-5 h-5' />
                                    <span>Add Employee</span>
                                </div>
                            }
                        />
                    </Tabs>
                </div>

                {/* Content Area */}
                <div className='bg-white rounded-xl shadow-xl border border-purple-100 overflow-hidden'>
                    <div className='p-5'>
                        {selected === "add" ? (
                            <AddEmployee onEmployeeAdded={handleEmployeeAdded} />
                        ) : selected === "temp" ? (
                            <TempEmployee onEmployeeUpdated={handleEmployeeAdded} />
                        ) : (
                            <Employee onEmployeeUpdated={handleEmployeeAdded} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
