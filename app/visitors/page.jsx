'use client'
import React, { useEffect, useState } from 'react'
import { Card, CardBody, Chip } from '@heroui/react'
import VisitorsTable from "./components/VisitorsTable"
import Widget from "@/app/visitors/components/Widget"
import VisitorsForm from "./components/VisitorForm/VisitorsForm"
import axios from "@/lib/axios"
import Toast from "@/components/Toast"
import { UserGroupIcon, ArrowRightOnRectangleIcon, UsersIcon, BuildingOfficeIcon, UserCircleIcon, WrenchScrewdriverIcon, ClockIcon } from '@heroicons/react/24/solid'

export default function Visitors() {
  const [openVisitorsForm, setOpenVisitorsForm] = useState(false)
  const [visitor, setVisitor] = useState()
  const [visitors, setVisitors] = useState([])
  const [stats, setStats] = useState({
    total: 0,
    inHouse: 0,
    exited: 0,
    vendors: 0,
    workers: 0,
    today: 0
  })

  const fetchVisitors = () => {
    axios.get("getVisitors").then((data) => {
      let visitorsData = data.data || []
      setVisitors(visitorsData)
      
      // Calculate stats
      const now = new Date()
      const today = now.toISOString().split('T')[0]
      
      const inHouse = visitorsData.filter(v => v.status === 'in_house' || v.status === 'checked_in').length
      const exited = visitorsData.filter(v => v.status === 'checked_out' || v.status === 'exited').length
      const vendors = visitorsData.filter(v => v.visitorType === 'vendor').length
      const workers = visitorsData.filter(v => v.visitorType === 'worker').length
      const todayVisitors = visitorsData.filter(v => v.checkInDate?.startsWith(today)).length
      
      setStats({
        total: visitorsData.length,
        inHouse: inHouse,
        exited: exited,
        vendors: vendors,
        workers: workers,
        today: todayVisitors
      })
      
      if (visitorsData.length > 0) {
        setVisitor(visitorsData[0])
      }
    }).catch(() => Toast("Error", "Error Fetching Visitors Data", "danger"))
  }

  useEffect(() => {
    fetchVisitors()
  }, [])

  const handleVisitorAdded = () => {
    fetchVisitors()
    setOpenVisitorsForm(false)
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100'>
      {/* Header */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className='p-3 bg-gradient-to-br from-secondary to-purple-600 rounded-xl shadow-lg'>
                <UserGroupIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Visitor Management</h1>
                <p className="text-sm text-gray-600">Track and manage all visitors, vendors, and workers</p>
              </div>
            </div>
            <Chip 
              size='lg' 
              variant='flat' 
              color='secondary'
              startContent={<ClockIcon className='w-5 h-5' />}
              className='font-semibold'
            >
              {stats.today} Today
            </Chip>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-8 py-6">
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6'>
          <Widget 
            icon={<UsersIcon className='w-6 text-white' />} 
            count={stats.total} 
            name={"Total Visitors"}
            gradient="from-blue-500 to-blue-600"
          />
          <Widget 
            icon={<BuildingOfficeIcon className='w-6 text-white' />} 
            count={stats.inHouse} 
            name={"Currently In House"}
            gradient="from-green-500 to-green-600"
          />
          <Widget 
            icon={<ArrowRightOnRectangleIcon className='w-6 text-white' />} 
            count={stats.exited} 
            name={"Exited Visitors"}
            gradient="from-gray-500 to-gray-600"
          />
          <Widget 
            icon={<UserCircleIcon className='w-6 text-white' />} 
            count={stats.vendors} 
            name={"Total Vendors"}
            gradient="from-purple-500 to-purple-600"
          />
          <Widget 
            icon={<WrenchScrewdriverIcon className='w-6 text-white' />} 
            count={stats.workers} 
            name={"Total Workers"}
            gradient="from-orange-500 to-orange-600"
          />
        </div>

        {/* Table/Form Section */}
        <Card className='shadow-lg'>
          <CardBody className='p-6'>
            {openVisitorsForm ? (
              <VisitorsForm 
                setOpenVisitorsForm={setOpenVisitorsForm} 
                formData={visitor}
                onSuccess={handleVisitorAdded}
              />
            ) : (
              <VisitorsTable 
                setOpenVisitorsForm={setOpenVisitorsForm}
                visitors={visitors}
                onRefresh={fetchVisitors}
              />
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
