import {
  Avatar,
  Chip,
  Card,
  CardBody,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@heroui/react";
import Image from "next/image";
import React from "react";
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  ShieldCheckIcon,
  KeyIcon,
  EllipsisVerticalIcon,
  PencilIcon,
  TrashIcon,
  LockClosedIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "@/contexts/AuthContext";

export default function EmployeeCard({
  Employee,
  onEdit,
  onDelete,
  onChangePassword,
  onClick,
}) {
  const { hasTableAccess } = useAuth();

  const canView = hasTableAccess("employee", "view");
  const canEdit = hasTableAccess("employee", "edit");
  const canDelete = hasTableAccess("employee", "delete");
  return (
    <Card className="hover:shadow-xl hover:scale-[1.02] transition-all duration-300 bg-gradient-to-br from-white to-purple-50/30">
      <CardBody className="p-4">
        {/* Actions Menu */}
        <div
          className="absolute top-2 right-2 z-10"
          onClick={(e) => e.stopPropagation()}
        >
          <Dropdown>
            <DropdownTrigger>
              <Button
                isIconOnly
                size="sm"
                variant="light"
                className="hover:bg-secondary-100"
              >
                <EllipsisVerticalIcon className="w-5 h-5" />
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Employee Actions">
              {canView && (
                <DropdownItem
                  key="view"
                  startContent={<EyeIcon className="w-4 h-4" />}
                  onPress={onClick}
                >
                  View Details
                </DropdownItem>
              )}
              {canEdit && (
                <DropdownItem
                  key="edit"
                  startContent={<PencilIcon className="w-4 h-4" />}
                  onPress={() => onEdit(Employee)}
                >
                  Edit Employee
                </DropdownItem>
              )}
              {canEdit && Employee?.username && (
                <DropdownItem
                  key="password"
                  startContent={<LockClosedIcon className="w-4 h-4" />}
                  onPress={() => onChangePassword(Employee)}
                >
                  Change Password
                </DropdownItem>
              )}
              {canDelete && (
                <DropdownItem
                  key="delete"
                  className="text-danger"
                  color="danger"
                  startContent={<TrashIcon className="w-4 h-4" />}
                  onPress={() => onDelete(Employee)}
                >
                  Delete Employee
                </DropdownItem>
              )}
            </DropdownMenu>
          </Dropdown>
        </div>
        <div
          className="flex flex-col items-center cursor-pointer"
          onClick={onClick}
        >
          {/* Avatar Section */}
          <div className="relative mb-3">
            <div className="w-16 h-16 rounded-full overflow-hidden border-3 border-secondary-200 shadow-lg">
              <img
                src={`https://ui-avatars.com/api/?name=${Employee?.name || "User"}&background=8b5cf6&color=fff&size=128`}
                alt={Employee?.name}
                className="w-full h-full object-cover"
              />
            </div>
            {Employee?.role === "admin" && (
              <div className="absolute -bottom-0.5 -right-0.5 bg-secondary rounded-full p-1.5 shadow-lg">
                <ShieldCheckIcon className="w-3 h-3 text-white" />
              </div>
            )}
          </div>

          {/* Name and Username */}
          <h3 className="text-base font-bold text-gray-800 mb-0.5 text-center">
            {Employee?.name || "N/A"}
          </h3>
          <div className="flex items-center gap-1 mb-3">
            <UserIcon className="w-3.5 h-3.5 text-gray-500" />
            <p className="text-xs text-gray-600">
              @{Employee?.username || "N/A"}
            </p>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mb-3"></div>

          {/* Information Section */}
          <div className="w-full space-y-2">
            {/* Email */}
            {Employee?.email && (
              <div className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-purple-50 transition-colors">
                <EnvelopeIcon className="w-4 h-4 text-secondary flex-shrink-0" />
                <span className="text-xs text-gray-700 truncate">
                  {Employee.email}
                </span>
              </div>
            )}

            {/* Phone */}
            {Employee?.phone && (
              <div className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-purple-50 transition-colors">
                <PhoneIcon className="w-4 h-4 text-secondary flex-shrink-0" />
                <span className="text-xs text-gray-700">
                  +91 {Employee.phone}
                </span>
              </div>
            )}

            {/* Permissions */}
            {Employee?.permissions && Employee.permissions.length > 0 && (
              <div className="mt-2">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <KeyIcon className="w-3.5 h-3.5 text-gray-600" />
                  <span className="text-[10px] font-semibold text-gray-600 uppercase">
                    Access
                  </span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {Employee.permissions.map((perm) => (
                    <Chip
                      key={perm}
                      size="sm"
                      variant="dot"
                      color="secondary"
                      className="text-[10px]"
                    >
                      {perm}
                    </Chip>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
