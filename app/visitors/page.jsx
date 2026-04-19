"use client"
import React, { useEffect, useState, useCallback } from "react"
import { Card, CardBody, Chip, Skeleton } from "@heroui/react"
import {
  UserGroupIcon, ArrowRightOnRectangleIcon, UsersIcon,
  BuildingOffice2Icon, WrenchScrewdriverIcon, ClockIcon,
} from "@heroicons/react/24/solid"
import VisitorsTable from "./components/VisitorsTable"
import Widget from "@/app/visitors/components/Widget"
import VisitorsForm from "./components/VisitorForm/VisitorsForm"
import axios from "@/lib/axios"
import Toast from "@/components/Toast"

export default function Visitors() {
  const [openVisitorsForm, setOpenVisitorsForm] = useState(false)
  const [editingVisitor, setEditingVisitor] = useState(null)
  const [visitors, setVisitors] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0, inside: 0, exitedToday: 0, vendors: 0, workers: 0, today: 0,
  })

  const fetchVisitors = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await axios.get("visitors")
      const data = res.data?.data || res.data || []
      setVisitors(data)

      const now = new Date()
      const todayStr = now.toISOString().split("T")[0]

      setStats({
        total: data.length,
        inside: data.filter(v => v.status === "inside").length,
        exitedToday: data.filter(v => {
          if (v.status !== "exited" || !v.checkOut) return false
          return new Date(v.checkOut).toISOString().split("T")[0] === todayStr
        }).length,
        vendors: data.filter(v => v.visitorType === "vendor").length,
        workers: data.filter(v => ["contractor", "serviceProvider", "logistics"].includes(v.visitorType)).length,
        today: data.filter(v => v.checkIn && new Date(v.checkIn).toISOString().split("T")[0] === todayStr).length,
      })
    } catch {
      Toast("Error", "Error fetching visitor data", "danger")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => { fetchVisitors() }, [fetchVisitors])

  const handleVisitorSuccess = () => {
    fetchVisitors()
    setOpenVisitorsForm(false)
    setEditingVisitor(null)
  }

  const handleEdit = (visitor) => {
    setEditingVisitor(visitor)
    setOpenVisitorsForm(true)
  }

  const handleAddNew = () => {
    setEditingVisitor(null)
    setOpenVisitorsForm(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/20 to-gray-100">
      {/* Sticky Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-20">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl shadow-lg">
                <UserGroupIcon className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Visitor Management</h1>
                <p className="text-xs text-gray-500">Track visitors, vendors &amp; contractors</p>
              </div>
            </div>
            <Chip
              size="sm"
              variant="flat"
              color="secondary"
              startContent={<ClockIcon className="w-4 h-4" />}
              className="font-bold"
            >
              {stats.today} Today
            </Chip>
          </div>
        </div>
      </div>

      <div className="px-6 py-5">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))
          ) : (
            <>
              <Widget icon={<UsersIcon className="w-6 text-white" />} count={stats.total} name="Total Visitors" gradient="from-blue-500 to-blue-600" />
              <Widget icon={<BuildingOffice2Icon className="w-6 text-white" />} count={stats.inside} name="Currently Inside" gradient="from-green-500 to-green-600" />
              <Widget icon={<ArrowRightOnRectangleIcon className="w-6 text-white" />} count={stats.exitedToday} name="Exited Today" gradient="from-gray-500 to-gray-600" />
              <Widget icon={<UserGroupIcon className="w-6 text-white" />} count={stats.vendors} name="Total Vendors" gradient="from-purple-500 to-purple-600" />
              <Widget icon={<WrenchScrewdriverIcon className="w-6 text-white" />} count={stats.workers} name="Service / Workers" gradient="from-orange-500 to-orange-600" />
            </>
          )}
        </div>

        {/* Main Content */}
        <Card className="shadow-md rounded-2xl border border-gray-100">
          <CardBody className="p-5 sm:p-6">
            {openVisitorsForm ? (
              <VisitorsForm
                setOpenVisitorsForm={(open) => {
                  setOpenVisitorsForm(open)
                  if (!open) setEditingVisitor(null)
                }}
                formData={editingVisitor || {}}
                onSuccess={handleVisitorSuccess}
              />
            ) : (
              <VisitorsTable
                setOpenVisitorsForm={handleAddNew}
                visitors={visitors}
                onRefresh={fetchVisitors}
                onEdit={handleEdit}
              />
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
