"use client";
import React, { useState, useMemo } from "react";
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
} from "@heroui/react";
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  PlusIcon,
  EllipsisVerticalIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/solid";
import { useAuth } from "@/contexts/AuthContext";
import Toast from "@/components/Toast";
import axios from "@/lib/axios";
import VisitorDetailModal from "./VisitorDetailModal";
import ExitModal from "./ExitModal";

const columns = [
  { name: "VISITOR", uid: "fullName", sortable: true },
  { name: "TYPE", uid: "visitorType", sortable: true },
  { name: "PHONE", uid: "phone" },
  { name: "PURPOSE", uid: "purposeOfVisit" },
  { name: "CHECK IN", uid: "checkIn", sortable: true },
  { name: "STATUS", uid: "status", sortable: true },
  { name: "ACTIONS", uid: "actions" },
];

const statusColorMap = {
  inside: "success",
  exited: "default",
  unknown: "warning",
};
const typeColorMap = {
  vendor: "secondary",
  customer: "primary",
  logistics: "warning",
  jobApplicant: "default",
  government: "danger",
  serviceProvider: "secondary",
  consultant: "primary",
  family: "default",
  intern: "warning",
  media: "default",
  contractor: "warning",
  auditor: "danger",
  researcher: "primary",
  delivery: "warning",
  other: "default",
};
const purposeLabels = {
  materialDelivery: "Material Delivery",
  goodsPickup: "Goods Pickup",
  salesMeeting: "Sales Meeting",
  purchaseMeeting: "Purchase Meeting",
  qualityInspection: "Quality Inspection",
  regulatoryInspection: "Regulatory",
  technicalSupport: "Tech Support",
  machineInstallation: "Machine Install",
  training: "Training",
  jobInterview: "Job Interview",
  consultation: "Consultation",
  factoryTour: "Factory Tour",
  safetyAudit: "Safety Audit",
  internalMeeting: "Internal Meeting",
  documentation: "Documentation",
  eventMedia: "Event / Media",
  personalVisit: "Personal Visit",
  other: "Other",
};

const allTypes = [
  "vendor",
  "customer",
  "logistics",
  "jobApplicant",
  "government",
  "serviceProvider",
  "consultant",
  "family",
  "intern",
  "media",
  "contractor",
  "auditor",
  "researcher",
  "delivery",
  "other",
];

export default function VisitorsTable({
  setOpenVisitorsForm,
  visitors = [],
  onRefresh,
  onEdit,
}) {
  const { hasTableAccess } = useAuth();
  const [filterValue, setFilterValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortDescriptor, setSortDescriptor] = useState({
    column: "checkIn",
    direction: "descending",
  });
  const [page, setPage] = useState(1);

  // Modal states
  const [selectedVisitor, setSelectedVisitor] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const canView = hasTableAccess("visitors", "view");
  const canEdit = hasTableAccess("visitors", "edit");
  const canDelete = hasTableAccess("visitors", "delete");

  const filteredItems = useMemo(() => {
    let filtered = [...visitors];
    if (filterValue) {
      const q = filterValue.toLowerCase();
      filtered = filtered.filter(
        (v) =>
          v.fullName?.toLowerCase().includes(q) ||
          v.phone?.includes(q) ||
          v.company?.toLowerCase().includes(q) ||
          v.purposeOfVisit?.toLowerCase().includes(q),
      );
    }
    if (statusFilter !== "all")
      filtered = filtered.filter((v) => v.status === statusFilter);
    if (typeFilter !== "all")
      filtered = filtered.filter((v) => v.visitorType === typeFilter);
    return filtered;
  }, [visitors, filterValue, statusFilter, typeFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage) || 1;
  const paginatedItems = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredItems.slice(start, start + rowsPerPage);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = useMemo(() => {
    return [...paginatedItems].sort((a, b) => {
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];
      const cmp = first < second ? -1 : first > second ? 1 : 0;
      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, paginatedItems]);

  const handleView = (visitor) => {
    setSelectedVisitor(visitor);
    setShowDetailModal(true);
  };
  const handleEditVisitor = (visitor) => {
    onEdit?.(visitor);
  };
  const handleExitClick = (visitor) => {
    setSelectedVisitor(visitor);
    setShowExitModal(true);
  };
  const handleDeleteClick = (visitor) => {
    setSelectedVisitor(visitor);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await axios.delete(`visitors/${selectedVisitor._id}`);
      Toast("Deleted", "Visitor deleted successfully", "success");
      setShowDeleteModal(false);
      onRefresh?.();
    } catch {
      Toast("Error", "Failed to delete visitor", "danger");
    } finally {
      setIsDeleting(false);
    }
  };

  const renderCell = (visitor, columnKey) => {
    const val = visitor[columnKey];
    switch (columnKey) {
      case "fullName":
        return (
          <div className="flex items-center gap-3 py-1">
            <div className="relative flex-shrink-0">
              {visitor.photo ? (
                <img
                  src={visitor.photo}
                  alt={visitor.fullName}
                  className="w-10 h-10 rounded-full object-cover border-2 border-purple-100"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 via-purple-600 to-blue-600 flex items-center justify-center text-white font-bold text-base shadow">
                  {visitor.fullName?.charAt(0)?.toUpperCase() || "V"}
                </div>
              )}
              <div
                className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${visitor.status === "inside" ? "bg-green-500" : "bg-gray-400"}`}
              />
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm leading-tight">
                {visitor.fullName || "—"}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                {visitor.company || "Individual"}
              </p>
            </div>
          </div>
        );
      case "visitorType":
        return (
          <Chip
            size="sm"
            variant="flat"
            color={typeColorMap[val] || "default"}
            className="capitalize font-semibold"
          >
            {val || "—"}
          </Chip>
        );
      case "phone":
        return (
          <span className="text-sm font-medium text-gray-700">
            {val || "—"}
          </span>
        );
      case "purposeOfVisit":
        return (
          <span className="text-sm text-gray-600 line-clamp-1">
            {purposeLabels[val] || val || "—"}
          </span>
        );
      case "checkIn":
        return val ? (
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-medium text-gray-800">
              {new Date(val).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </span>
            <span className="text-xs text-gray-400">
              {new Date(val).toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        ) : (
          <span className="text-sm text-gray-400">—</span>
        );
      case "status":
        return (
          <div className="flex items-center gap-2">
            {/* {visitor.status === "inside" && (
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
            )} */}
            <Chip
              size="sm"
              variant="dot"
              color={statusColorMap[val] || "default"}
              className="capitalize font-semibold"
            >
              {val || "unknown"}
            </Chip>
          </div>
        );
      case "actions":
        return (
          <div className="flex justify-end">
            <Dropdown>
              <DropdownTrigger>
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  className="hover:bg-purple-50"
                >
                  <EllipsisVerticalIcon className="w-5 h-5 text-gray-600" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Visitor actions">
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
                    onPress={() => handleEditVisitor(visitor)}
                  >
                    Edit Visitor
                  </DropdownItem>
                )}
                {canEdit && visitor.status === "inside" && (
                  <DropdownItem
                    key="exit"
                    startContent={
                      <ArrowRightOnRectangleIcon className="w-4 h-4" />
                    }
                    color="warning"
                    className="text-warning"
                    onPress={() => handleExitClick(visitor)}
                  >
                    Mark Exit
                  </DropdownItem>
                )}
                {canDelete && (
                  <DropdownItem
                    key="delete"
                    startContent={<TrashIcon className="w-4 h-4" />}
                    color="danger"
                    className="text-danger"
                    onPress={() => handleDeleteClick(visitor)}
                  >
                    Delete
                  </DropdownItem>
                )}
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        return val;
    }
  };

  const topContent = (
    <div className="flex flex-col gap-3 pb-1">
      <div className="flex flex-wrap justify-between gap-3 items-center">
        <div className="flex gap-2 flex-1 flex-wrap">
          <Input
            isClearable
            className="flex-1 min-w-[200px] max-w-md"
            placeholder="Search name, phone, company..."
            startContent={
              <MagnifyingGlassIcon className="w-4 h-4 text-purple-500" />
            }
            value={filterValue}
            onClear={() => setFilterValue("")}
            onValueChange={setFilterValue}
            variant="flat"
            classNames={{
              inputWrapper:
                "bg-gray-50 border border-gray-200 hover:bg-gray-100 group-data-[focus=true]:bg-white",
            }}
          />
          {/* Status Filter */}
          <Dropdown>
            <DropdownTrigger>
              <Button
                variant="flat"
                className="bg-white border border-gray-200"
                startContent={
                  <FunnelIcon className="w-4 h-4 text-purple-600" />
                }
              >
                {statusFilter === "all" ? (
                  "Status"
                ) : (
                  <span className="capitalize">{statusFilter}</span>
                )}
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              selectedKeys={new Set([statusFilter])}
              selectionMode="single"
              onSelectionChange={(keys) => {
                setStatusFilter(Array.from(keys)[0] || "all");
                setPage(1);
              }}
            >
              <DropdownItem key="all">All Status</DropdownItem>
              <DropdownItem key="inside">Inside</DropdownItem>
              <DropdownItem key="exited">Exited</DropdownItem>
              <DropdownItem key="unknown">Unknown</DropdownItem>
            </DropdownMenu>
          </Dropdown>
          {/* Type Filter */}
          <Dropdown>
            <DropdownTrigger>
              <Button
                variant="flat"
                className="bg-white border border-gray-200"
                startContent={
                  <FunnelIcon className="w-4 h-4 text-purple-600" />
                }
              >
                {typeFilter === "all" ? (
                  "Type"
                ) : (
                  <span className="capitalize">{typeFilter}</span>
                )}
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              selectedKeys={new Set([typeFilter])}
              selectionMode="single"
              onSelectionChange={(keys) => {
                setTypeFilter(Array.from(keys)[0] || "all");
                setPage(1);
              }}
            >
              <DropdownItem key="all">All Types</DropdownItem>
              {allTypes.map((t) => (
                <DropdownItem key={t} className="capitalize">
                  {t}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        </div>
        {canEdit && (
          <Button
            color="secondary"
            variant="shadow"
            className="font-semibold px-5"
            startContent={<PlusIcon className="w-4 h-4" />}
            onPress={() => setOpenVisitorsForm(true)}
          >
            Add Visitor
          </Button>
        )}
      </div>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 bg-purple-50 border border-purple-100 rounded-lg text-sm font-bold text-purple-700">
            {filteredItems.length}
          </span>
          <span className="text-sm text-gray-500">
            visitor{filteredItems.length !== 1 ? "s" : ""} found
          </span>
        </div>
        <label className="flex items-center text-sm text-gray-500 gap-2">
          Rows:
          <select
            className="border border-gray-200 rounded-lg px-2 py-1 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-400"
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setPage(1);
            }}
          >
            {[5, 10, 15, 20, 50].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );

  if (!canView) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-400 text-sm">
          You don't have permission to view visitors.
        </p>
      </div>
    );
  }

  return (
    <>
      <Table
        aria-label="Visitors table"
        isHeaderSticky
        topContent={topContent}
        topContentPlacement="outside"
        bottomContent={
          <div className="flex justify-between items-center py-2">
            <span className="text-sm text-gray-500">
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
        }
        bottomContentPlacement="outside"
        classNames={{
          wrapper: "max-h-[520px] shadow-sm rounded-xl",
          th: "bg-gray-50 text-gray-600 font-bold text-xs uppercase tracking-wider",
          td: "py-3",
          tr: "hover:bg-purple-50/40 transition-colors",
        }}
        sortDescriptor={sortDescriptor}
        onSortChange={setSortDescriptor}
      >
        <TableHeader columns={columns}>
          {(col) => (
            <TableColumn
              key={col.uid}
              align={col.uid === "actions" ? "end" : "start"}
              allowsSorting={col.sortable}
            >
              {col.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          emptyContent={
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <MagnifyingGlassIcon className="w-8 h-8 text-gray-300" />
              </div>
              <p className="text-gray-400 text-sm">No visitors found</p>
            </div>
          }
          items={sortedItems}
        >
          {(item) => (
            <TableRow key={item._id || item.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Detail Modal */}
      <VisitorDetailModal
        visitor={selectedVisitor}
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        onEdit={(v) => {
          setShowDetailModal(false);
          handleEditVisitor(v);
        }}
        onExit={(v) => {
          setShowDetailModal(false);
          handleExitClick(v);
        }}
        onDelete={(v) => {
          setShowDetailModal(false);
          handleDeleteClick(v);
        }}
      />

      {/* Exit Modal */}
      <ExitModal
        visitor={selectedVisitor}
        isOpen={showExitModal}
        onClose={() => setShowExitModal(false)}
        onSuccess={() => {
          setShowExitModal(false);
          onRefresh?.();
        }}
      />

      {/* Delete Confirm Modal */}
      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <ModalContent>
          <ModalHeader className="flex items-center gap-3 border-b pb-4">
            <div className="w-11 h-11 rounded-full bg-red-100 flex items-center justify-center">
              <TrashIcon className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Delete Visitor?
              </h3>
              <p className="text-sm text-gray-500">This cannot be undone</p>
            </div>
          </ModalHeader>
          <ModalBody className="py-5">
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-sm text-gray-700">
                You are about to permanently delete:
              </p>
              <p className="font-bold text-gray-900 text-lg mt-1">
                {selectedVisitor?.fullName}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {selectedVisitor?.company || ""}
              </p>
            </div>
            <p className="text-sm text-gray-500 mt-2 flex items-center gap-1.5">
              ⚠️ All visitor data will be permanently removed.
            </p>
          </ModalBody>
          <ModalFooter className="border-t pt-4">
            <Button
              variant="flat"
              onPress={() => setShowDeleteModal(false)}
              isDisabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              color="danger"
              variant="shadow"
              startContent={<TrashIcon className="w-4 h-4" />}
              onPress={handleDelete}
              isLoading={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Permanently"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
