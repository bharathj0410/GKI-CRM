"use client";
import React, { useState, useEffect } from "react";
import {
  Input,
  Button,
  Card,
  CardBody,
  Avatar,
  Chip,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Spinner,
} from "@heroui/react";
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  EllipsisVerticalIcon,
  PencilIcon,
  TrashIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/axios";

export default function TempEmployee({ onEmployeeUpdated }) {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { hasTableAccess } = useAuth();

  // Check access permissions
  const canView = hasTableAccess("employee", "view");
  const canEdit = hasTableAccess("employee", "edit");
  const canDelete = hasTableAccess("employee", "delete");

  useEffect(() => {
    // Fetch temp employees
    fetchTempEmployees();
  }, []);

  useEffect(() => {
    // Filter employees based on search query
    if (searchQuery) {
      const filtered = employees.filter(
        (emp) =>
          emp.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          emp.employeeId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          emp.phone?.includes(searchQuery) ||
          emp.email?.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setFilteredEmployees(filtered);
    } else {
      setFilteredEmployees(employees);
    }
  }, [searchQuery, employees]);

  const fetchTempEmployees = async () => {
    setLoading(true);
    try {
      const response = await api.get("/getEmployee?type=temp");
      setEmployees(response.data || []);
    } catch (error) {
      console.error("Error fetching temp employees:", error);
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEmployeeClick = (employeeId) => {
    router.push(`/employee/details/${employeeId}`);
  };

  const handleEdit = (employee) => {
    // TODO: Implement edit functionality
    console.log("Edit employee:", employee);
  };

  const handleDelete = (employee) => {
    // TODO: Implement delete functionality
    console.log("Delete employee:", employee);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Spinner
          size="lg"
          color="secondary"
          label="Loading temp employees..."
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with count */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            {searchQuery
              ? `${filteredEmployees.length} of ${employees.length} temp employees`
              : `${employees.length} temp employees`}
          </h3>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-3">
        <Input
          placeholder="Search by name, ID, phone, email..."
          value={searchQuery}
          onValueChange={setSearchQuery}
          startContent={
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
          }
          classNames={{
            input: "text-sm",
            inputWrapper: "bg-gray-50",
          }}
          size="md"
          className="flex-1"
        />
        <Button
          color="secondary"
          variant="flat"
          startContent={<FunnelIcon className="w-5 h-5" />}
        >
          Filter
        </Button>
      </div>

      {/* Employee List */}
      {filteredEmployees.length === 0 ? (
        <div className="text-center py-20">
          <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
            <UserIcon className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            {searchQuery
              ? "No matching employees found"
              : "No temp employees yet"}
          </h3>
          <p className="text-gray-600 text-sm">
            {searchQuery
              ? "Try adjusting your search terms"
              : "Start by adding your first temporary employee"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEmployees.map((employee) => (
            <Card
              key={employee._id}
              className="hover:shadow-xl hover:scale-[1.02] transition-all duration-300 bg-gradient-to-br from-white to-purple-50/30"
            >
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
                          onPress={() =>
                            handleEmployeeClick(
                              employee.employeeId || employee._id,
                            )
                          }
                        >
                          View Details
                        </DropdownItem>
                      )}
                      {canEdit && (
                        <DropdownItem
                          key="edit"
                          startContent={<PencilIcon className="w-4 h-4" />}
                          onPress={() => handleEdit(employee)}
                        >
                          Edit Employee
                        </DropdownItem>
                      )}
                      {canDelete && (
                        <DropdownItem
                          key="delete"
                          className="text-danger"
                          color="danger"
                          startContent={<TrashIcon className="w-4 h-4" />}
                          onPress={() => handleDelete(employee)}
                        >
                          Delete Employee
                        </DropdownItem>
                      )}
                    </DropdownMenu>
                  </Dropdown>
                </div>

                <div
                  onClick={() =>
                    handleEmployeeClick(employee.employeeId || employee._id)
                  }
                  className="flex flex-col items-center text-center cursor-pointer"
                >
                  <div className="relative mb-3">
                    <Avatar
                      src={
                        employee.photo ||
                        `https://ui-avatars.com/api/?name=${employee.name}&background=8b5cf6&color=fff&size=200`
                      }
                      className="w-20 h-20"
                      isBordered
                      color="secondary"
                    />
                    <Chip
                      size="sm"
                      color="warning"
                      variant="solid"
                      className="absolute -bottom-1 -right-1"
                    >
                      TEMP
                    </Chip>
                  </div>

                  <h3 className="font-bold text-gray-900 text-lg mb-1">
                    {employee.name}
                  </h3>
                  <p className="text-xs text-gray-500 mb-3">
                    ID: {employee.employeeId || "N/A"}
                  </p>

                  <div className="w-full space-y-2 mt-2">
                    {employee.email && (
                      <div className="flex items-center gap-2 text-xs text-gray-600 justify-center">
                        <EnvelopeIcon className="w-4 h-4 text-gray-400" />
                        <span className="truncate">{employee.email}</span>
                      </div>
                    )}
                    {employee.phone && (
                      <div className="flex items-center gap-2 text-xs text-gray-600 justify-center">
                        <PhoneIcon className="w-4 h-4 text-gray-400" />
                        <span>{employee.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
