"use client"
import React, { useState, useMemo } from "react"
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Chip,
  Pagination,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react"
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  PlusIcon,
  EllipsisVerticalIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline'
import { useAuth } from '@/contexts/AuthContext'
import Toast from '@/components/Toast'
import axios from '@/lib/axios'

const columns = [
  { name: "VISITOR", uid: "name", sortable: true },
  { name: "TYPE", uid: "visitorType", sortable: true },
  { name: "PHONE", uid: "phone" },
  { name: "PURPOSE", uid: "purpose" },
  { name: "CHECK IN", uid: "checkInDate", sortable: true },
  { name: "STATUS", uid: "status", sortable: true },
  { name: "ACTIONS", uid: "actions" },
]

const statusColorMap = {
  in_house: "success",
  checked_in: "success",
  checked_out: "default",
  exited: "default",
}

const visitorTypeColors = {
  visitor: "primary",
  vendor: "secondary",
  worker: "warning",
  guest: "default"
}

export default function VisitorsTable({ setOpenVisitorsForm, visitors = [], onRefresh }) {
  const { hasTableAccess } = useAuth()
  const [filterValue, setFilterValue] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [sortDescriptor, setSortDescriptor] = useState({
    column: "checkInDate",
    direction: "descending",
  })
  const [page, setPage] = useState(1)
  const [selectedVisitor, setSelectedVisitor] = useState(null)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Access control
  const canView = hasTableAccess('visitors', 'view')
  const canEdit = hasTableAccess('visitors', 'edit')
  const canDelete = hasTableAccess('visitors', 'delete')

  // Filter visitors
  const filteredItems = useMemo(() => {
    let filtered = [...visitors]

    if (filterValue) {
      filtered = filtered.filter((visitor) =>
        visitor.name?.toLowerCase().includes(filterValue.toLowerCase()) ||
        visitor.phone?.includes(filterValue) ||
        visitor.purpose?.toLowerCase().includes(filterValue.toLowerCase())
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((visitor) => visitor.status === statusFilter)
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter((visitor) => visitor.visitorType === typeFilter)
    }

    return filtered
  }, [visitors, filterValue, statusFilter, typeFilter])

  // Pagination
  const pages = Math.ceil(filteredItems.length / rowsPerPage) || 1
  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage
    const end = start + rowsPerPage
    return filteredItems.slice(start, end)
  }, [page, filteredItems, rowsPerPage])

  // Sorting
  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      const first = a[sortDescriptor.column]
      const second = b[sortDescriptor.column]
      const cmp = first < second ? -1 : first > second ? 1 : 0
      return sortDescriptor.direction === "descending" ? -cmp : cmp
    })
  }, [sortDescriptor, items])

  const handleView = (visitor) => {
    setSelectedVisitor(visitor)
    setShowViewModal(true)
  }

  const handleEdit = (visitor) => {
    // TODO: Implement edit functionality
    Toast("Edit", `Editing ${visitor.name}`, "primary")
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await axios.delete(`deleteVisitor?id=${selectedVisitor._id}`)
      Toast("Success", "Visitor deleted successfully", "success")
      setShowDeleteModal(false)
      if (onRefresh) onRefresh()
    } catch (error) {
      Toast("Error", "Failed to delete visitor", "danger")
    } finally {
      setIsDeleting(false)
    }
  }

  const renderCell = (visitor, columnKey) => {
    const cellValue = visitor[columnKey]

    switch (columnKey) {
      case "name":
        return (
          <div className="flex items-center gap-3 py-1">
            <div className="relative">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-purple-500 via-purple-600 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                {visitor.name?.charAt(0)?.toUpperCase() || 'V'}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            <div className="flex flex-col">
              <p className="font-semibold text-gray-900 text-[15px] leading-tight">{visitor.name || '-'}</p>
              <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                <span className="inline-block w-1 h-1 bg-gray-400 rounded-full"></span>
                {visitor.company || 'Individual'}
              </p>
            </div>
          </div>
        )
      case "visitorType":
        const typeIcons = {
          visitor: "👤",
          vendor: "🏢",
          worker: "👷",
          guest: "🎯"
        }
        return (
          <Chip
            size="sm"
            variant="flat"
            color={visitorTypeColors[cellValue] || "default"}
            className="capitalize font-semibold px-3 py-3"
            startContent={<span className="text-sm">{typeIcons[cellValue] || "👤"}</span>}
          >
            {cellValue || 'visitor'}
          </Chip>
        )
      case "phone":
        return (
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <span className="text-purple-500">📱</span>
            <span className="font-medium">{cellValue || '-'}</span>
          </div>
        )
      case "purpose":
        return (
          <div className="flex items-start gap-2 max-w-[200px]">
            <span className="text-purple-500 mt-0.5 flex-shrink-0">💼</span>
            <span className="text-sm text-gray-700 line-clamp-2 leading-tight">
              {cellValue || '-'}
            </span>
          </div>
        )
      case "checkInDate":
        return (
          <div className="flex flex-col gap-1">
            {cellValue ? (
              <>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <span className="text-purple-500">📅</span>
                  {new Date(cellValue).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span className="text-purple-400">🕐</span>
                  {new Date(cellValue).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </>
            ) : (
              <span className="text-sm text-gray-500">-</span>
            )}
          </div>
        )
      case "status":
        const isActive = cellValue === 'in_house' || cellValue === 'checked_in'
        return (
          <div className="flex items-center gap-2">
            {isActive && (
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
              </span>
            )}
            <Chip
              size="sm"
              variant="dot"
              color={statusColorMap[cellValue] || "default"}
              className="capitalize font-semibold px-3"
            >
              {cellValue?.replace('_', ' ') || 'unknown'}
            </Chip>
          </div>
        )
      case "actions":
        return (
          <div className="flex justify-end">
            <Dropdown>
              <DropdownTrigger>
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  className="hover:bg-purple-50 data-[hover=true]:bg-purple-50"
                >
                  <EllipsisVerticalIcon className="w-5 h-5 text-gray-700" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Visitor Actions">
                {canView && (
                  <DropdownItem
                    key="view"
                    startContent={<EyeIcon className="w-4 h-4" />}
                    onPress={() => handleView(visitor)}
                  >
                    View Details
                  </DropdownItem>
                )}
                {canEdit && (
                  <DropdownItem
                    key="edit"
                    startContent={<PencilIcon className="w-4 h-4" />}
                    onPress={() => handleEdit(visitor)}
                  >
                    Edit Visitor
                  </DropdownItem>
                )}
                {canDelete && (
                  <DropdownItem
                    key="delete"
                    className="text-danger"
                    color="danger"
                    startContent={<TrashIcon className="w-4 h-4" />}
                    onPress={() => {
                      setSelectedVisitor(visitor)
                      setShowDeleteModal(true)
                    }}
                  >
                    Delete Visitor
                  </DropdownItem>
                )}
              </DropdownMenu>
            </Dropdown>
          </div>
        )
      default:
        return cellValue
    }
  }

  const topContent = (
    <div className="flex flex-col gap-4 p-1">
      <div className="flex justify-between gap-3 items-center">
        <div className="flex gap-3 flex-1">
          <Input
            isClearable
            className="flex-1 max-w-md"
            placeholder="Search visitors..."
            startContent={<MagnifyingGlassIcon className="w-5 h-5 text-purple-500" />}
            value={filterValue}
            onClear={() => setFilterValue("")}
            onValueChange={setFilterValue}
            variant="flat"
            classNames={{
              input: "text-sm",
              inputWrapper: "bg-gray-50 border border-gray-200 hover:bg-gray-100 group-data-[focus=true]:bg-white shadow-sm"
            }}
          />
          <Dropdown>
            <DropdownTrigger>
              <Button
                variant="flat"
                className="bg-white border border-gray-200 hover:bg-gray-50 shadow-sm"
                startContent={<FunnelIcon className="w-4 h-4 text-purple-600" />}
              >
                <span className="font-medium">Status</span>
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              selectedKeys={[statusFilter]}
              selectionMode="single"
              onSelectionChange={(keys) => setStatusFilter(Array.from(keys)[0] || "all")}
            >
              <DropdownItem key="all">All Status</DropdownItem>
              <DropdownItem key="in_house">In House</DropdownItem>
              <DropdownItem key="checked_in">Checked In</DropdownItem>
              <DropdownItem key="checked_out">Checked Out</DropdownItem>
              <DropdownItem key="exited">Exited</DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <Dropdown>
            <DropdownTrigger>
              <Button
                variant="flat"
                className="bg-white border border-gray-200 hover:bg-gray-50 shadow-sm"
                startContent={<FunnelIcon className="w-4 h-4 text-purple-600" />}
              >
                <span className="font-medium">Type</span>
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              selectedKeys={[typeFilter]}
              selectionMode="single"
              onSelectionChange={(keys) => setTypeFilter(Array.from(keys)[0] || "all")}
            >
              <DropdownItem key="all">All Types</DropdownItem>
              <DropdownItem key="visitor">Visitor</DropdownItem>
              <DropdownItem key="vendor">Vendor</DropdownItem>
              <DropdownItem key="worker">Worker</DropdownItem>
              <DropdownItem key="guest">Guest</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
        {canEdit && (
          <Button
            color="secondary"
            variant="shadow"
            className="font-semibold px-6"
            startContent={<PlusIcon className="w-5 h-5" />}
            onPress={() => setOpenVisitorsForm(true)}
          >
            Add Visitor
          </Button>
        )}
      </div>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 bg-purple-50 rounded-lg border border-purple-200">
            <span className="text-sm font-bold text-purple-700">{filteredItems.length}</span>
          </div>
          <span className="text-sm text-gray-600 font-medium">
            visitor{filteredItems.length !== 1 ? 's' : ''} found
          </span>
        </div>
        <label className="flex items-center text-sm text-gray-600 gap-2 font-medium">
          Rows per page:
          <select
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm font-medium"
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value))
              setPage(1)
            }}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="20">20</option>
          </select>
        </label>
      </div>
    </div>
  )

  const bottomContent = (
    <div className="flex justify-between items-center py-2">
      <span className="text-sm text-gray-600">
        Page {page} of {pages}
      </span>
      <Pagination
        isCompact
        showControls
        showShadow
        color="secondary"
        page={page}
        total={pages}
        onChange={setPage}
      />
    </div>
  )

  if (!canView) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">You don't have permission to view visitors</p>
      </div>
    )
  }

  return (
    <>
      <Table
        aria-label="Visitors table with actions"
        isHeaderSticky
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        classNames={{
          wrapper: "max-h-[500px] shadow-sm",
          th: "bg-gray-50 text-gray-700 font-semibold text-xs uppercase tracking-wider",
          td: "py-4",
        }}
        sortDescriptor={sortDescriptor}
        topContent={topContent}
        topContentPlacement="outside"
        onSortChange={setSortDescriptor}
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "end" : "start"}
              allowsSorting={column.sortable}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          emptyContent={
            <div className="text-center py-12">
              <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <MagnifyingGlassIcon className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-gray-500">No visitors found</p>
            </div>
          }
          items={sortedItems}
        >
          {(item) => (
            <TableRow key={item._id || item.id}>
              {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* View Modal */}
      <Modal isOpen={showViewModal} onClose={() => setShowViewModal(false)} size="2xl">
        <ModalContent>
          <ModalHeader className="flex items-center gap-3 border-b pb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
              {selectedVisitor?.name?.charAt(0)?.toUpperCase() || 'V'}
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Visitor Details</h3>
              <p className="text-sm text-gray-500">Complete information</p>
            </div>
          </ModalHeader>
          <ModalBody className="py-6">
            {selectedVisitor && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Name</p>
                    <p className="font-bold text-gray-900 text-lg">{selectedVisitor.name}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Type</p>
                    <Chip size="md" color={visitorTypeColors[selectedVisitor.visitorType]} variant="flat" className="capitalize font-semibold">
                      {selectedVisitor.visitorType}
                    </Chip>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Phone</p>
                    <p className="font-bold text-gray-900">{selectedVisitor.phone || '-'}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Status</p>
                    <Chip size="md" color={statusColorMap[selectedVisitor.status]} variant="flat" className="capitalize font-semibold">
                      {selectedVisitor.status?.replace('_', ' ')}
                    </Chip>
                  </div>
                  <div className="col-span-2 bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Company</p>
                    <p className="font-bold text-gray-900">{selectedVisitor.company || '-'}</p>
                  </div>
                  <div className="col-span-2 bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Purpose</p>
                    <p className="font-bold text-gray-900">{selectedVisitor.purpose || '-'}</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
                    <p className="text-xs font-semibold text-purple-700 uppercase tracking-wider mb-1">Check In</p>
                    <p className="font-bold text-gray-900">
                      {selectedVisitor.checkInDate ? new Date(selectedVisitor.checkInDate).toLocaleString() : '-'}
                    </p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
                    <p className="text-xs font-semibold text-purple-700 uppercase tracking-wider mb-1">Check Out</p>
                    <p className="font-bold text-gray-900">
                      {selectedVisitor.checkOutDate ? new Date(selectedVisitor.checkOutDate).toLocaleString() : 'Not yet'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </ModalBody>
          <ModalFooter className="border-t pt-4">
            <Button variant="flat" onPress={() => setShowViewModal(false)}>Close</Button>
            {canEdit && (
              <Button
                color="secondary"
                variant="shadow"
                className="font-semibold"
                startContent={<PencilIcon className="w-4 h-4" />}
                onPress={() => {
                  setShowViewModal(false)
                  handleEdit(selectedVisitor)
                }}
              >
                Edit Visitor
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <ModalContent>
          <ModalHeader className="flex items-center gap-3 border-b pb-4">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <TrashIcon className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Confirm Delete</h3>
              <p className="text-sm text-gray-500">This action cannot be undone</p>
            </div>
          </ModalHeader>
          <ModalBody className="py-6">
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-gray-800">Are you sure you want to delete visitor:</p>
              <p className="font-bold text-gray-900 text-lg mt-2">{selectedVisitor?.name}</p>
            </div>
            <p className="text-sm text-gray-600 mt-3 flex items-center gap-2">
              <span className="text-yellow-600">⚠️</span>
              All visitor data will be permanently removed from the system.
            </p>
          </ModalBody>
          <ModalFooter className="border-t pt-4">
            <Button variant="flat" onPress={() => setShowDeleteModal(false)} isDisabled={isDeleting}>
              Cancel
            </Button>
            <Button
              color="danger"
              variant="shadow"
              className="font-semibold"
              startContent={<TrashIcon className="w-4 h-4" />}
              onPress={handleDelete}
              isLoading={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete Permanently'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
