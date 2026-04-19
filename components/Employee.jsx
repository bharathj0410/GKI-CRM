import React, { useEffect, useState } from 'react'
import EmployeeCard from "./EmployeeCard"
import api from '@/lib/axios'
import { Spinner, Input, Button } from '@heroui/react'
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline'
import EditEmployeeModal from './EditEmployeeModal'
import ChangePasswordModal from './ChangePasswordModal'
import DeleteEmployeeModal from './DeleteEmployeeModal'
import { useRouter } from 'next/navigation'

export default function Employee({ onEmployeeUpdated }) {
    const [data, setData] = useState([])
    const [filteredData, setFilteredData] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedEmployee, setSelectedEmployee] = useState(null)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const router = useRouter()

    useEffect(() => {
        // Filter employees based on search query
        if (searchQuery) {
            const filtered = data.filter(emp => 
                emp.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                emp.employeeId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                emp.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                emp.phone?.includes(searchQuery) ||
                emp.email?.toLowerCase().includes(searchQuery.toLowerCase())
            )
            setFilteredData(filtered)
        } else {
            setFilteredData(data)
        }
    }, [searchQuery, data])

    const fetchEmployees = () => {
        setLoading(true)
        api.get("getEmployee?type=regular")
            .then((res) => {
                setData(res.data)
            })
            .catch((err) => {
                console.log(err)
            })
            .finally(() => {
                setLoading(false)
            })
    }
    
    useEffect(() => {
        fetchEmployees()
    }, [])

    const handleEdit = (employee) => {
        setSelectedEmployee(employee)
        setIsEditModalOpen(true)
    }

    const handleChangePassword = (employee) => {
        setSelectedEmployee(employee)
        setIsPasswordModalOpen(true)
    }

    const handleDelete = (employee) => {
        setSelectedEmployee(employee)
        setIsDeleteModalOpen(true)
    }

    const handleSuccess = () => {
        fetchEmployees()
    }
    
    const employee = filteredData.map((Employeesdata) => (
        <EmployeeCard 
            Employee={Employeesdata} 
            key={Employeesdata.username}
            onEdit={handleEdit}
            onChangePassword={handleChangePassword}
            onDelete={handleDelete}
            onClick={() => router.push(`/employee/details/${Employeesdata.employeeId || Employeesdata._id}`)}
        />
    ))
    
    if (loading) {
        return (
            <div className='flex justify-center items-center py-20'>
                <Spinner size="lg" color="secondary" label="Loading employees..." />
            </div>
        )
    }
    
    return (
        <>
            <div>
                {/* Search and Filter */}
                <div className='mb-6 flex gap-3'>
                    <Input
                        placeholder="Search by name, ID, username, phone, email..."
                        value={searchQuery}
                        onValueChange={setSearchQuery}
                        startContent={<MagnifyingGlassIcon className='w-5 h-5 text-gray-400' />}
                        classNames={{
                            input: "text-sm",
                            inputWrapper: "bg-gray-50"
                        }}
                        size="md"
                        className="flex-1"
                    />
                    <Button
                        color="secondary"
                        variant="flat"
                        startContent={<FunnelIcon className='w-5 h-5' />}
                    >
                        Filter
                    </Button>
                </div>

                {data.length ? (
                    <div>
                        <div className='mb-6 flex items-center justify-between h-full'>
                            <div>
                                <h3 className='text-2xl font-bold text-gray-800 mb-1'>Team Members</h3>
                                <p className='text-sm text-gray-600'>
                                    <span className='font-semibold text-secondary'>{filteredData.length}</span> of {data.length} employee{data.length !== 1 ? 's' : ''}
                                </p>
                            </div>
                        </div>
                        <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6'>
                            {employee}
                        </div>
                    </div>
                ) : (
                    <div className='text-center py-32'>
                        <div className='mb-6'>
                            <div className='w-32 h-32 mx-auto bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center'>
                                <svg className="w-16 h-16 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                        </div>
                        <h3 className='text-2xl font-bold text-gray-800 mb-2'>No Employees Yet</h3>
                        <p className='text-gray-600 mb-6 max-w-md mx-auto'>
                            Start building your team by adding your first employee. Click the "Add Employee" tab above to get started.
                        </p>
                    </div>
                )}
            </div>

            {/* Modals */}
            {selectedEmployee && (
                <>
                    <EditEmployeeModal
                        isOpen={isEditModalOpen}
                        onClose={() => setIsEditModalOpen(false)}
                        employee={selectedEmployee}
                        onSuccess={handleSuccess}
                    />
                    <ChangePasswordModal
                        isOpen={isPasswordModalOpen}
                        onClose={() => setIsPasswordModalOpen(false)}
                        employee={selectedEmployee}
                        onSuccess={handleSuccess}
                    />
                    <DeleteEmployeeModal
                        isOpen={isDeleteModalOpen}
                        onClose={() => setIsDeleteModalOpen(false)}
                        employee={selectedEmployee}
                        onSuccess={handleSuccess}
                    />
                </>
            )}
        </>
    )
}
