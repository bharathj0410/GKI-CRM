import React, { useState } from "react";
import {
  Input,
  Select,
  SelectItem,
  Card,
  CardBody,
  Checkbox,
} from "@heroui/react";
import { DatePicker } from "@heroui/react";

export default function WorkDetails({
  isEditing,
  employee,
  editedEmployee,
  handleInputChange,
  handleDateChange,
  formatDateForInput,
}) {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const employmentTypes = [
    { value: "fulltime", label: "Full-time" },
    { value: "parttime", label: "Part-time" },
    { value: "intern", label: "Intern" },
    { value: "contract", label: "Contract" },
  ];

  const workLocations = [
    { value: "office", label: "Office" },
    { value: "remote", label: "Remote" },
    { value: "hybrid", label: "Hybrid" },
  ];

  // Calendar helper functions
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getCurrentDate = () => {
    const today = new Date();
    return today.getDate();
  };

  const isToday = (day) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      selectedDate.getMonth() === today.getMonth() &&
      selectedDate.getFullYear() === today.getFullYear()
    );
  };

  const getDayName = (index) => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return days[index];
  };

  const getMonthName = (month) => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return months[month];
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(selectedDate);
    const firstDay = getFirstDayOfMonth(selectedDate);
    const days = [];

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-12"></div>);
    }

    // Days of month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(
        <div
          key={day}
          className={`h-12 flex items-center justify-center rounded-lg text-sm font-semibold cursor-pointer transition-all
                        ${
                          isToday(day)
                            ? "bg-secondary text-white shadow-md"
                            : "bg-gray-100 text-gray-900 hover:bg-secondary/10"
                        }
                    `}
        >
          {day}
        </div>,
      );
    }

    return days;
  };

  const handlePrevMonth = () => {
    setSelectedDate(
      new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1),
    );
  };

  const handleNextMonth = () => {
    setSelectedDate(
      new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1),
    );
  };

  const handleToday = () => {
    setSelectedDate(new Date());
  };

  return (
    <div className="space-y-8">
      {/* Work Details Information */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1.5 h-8 bg-gradient-to-b from-secondary to-secondary/60 rounded-full"></div>
          <h3 className="text-xl font-bold text-gray-950">Work Details</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium text-gray-600 mb-1.5 block">
              Job Title / Role
            </label>
            {isEditing ? (
              <Input
                value={editedEmployee.jobTitle || ""}
                onValueChange={(val) => handleInputChange("jobTitle", val)}
                placeholder="e.g., Software Engineer, Marketing Manager"
                size="sm"
                variant="bordered"
              />
            ) : (
              <p className="text-gray-900 font-semibold">
                {employee.jobTitle || "N/A"}
              </p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 mb-1.5 block">
              Department / Team
            </label>
            {isEditing ? (
              <Input
                value={editedEmployee.department || ""}
                onValueChange={(val) => handleInputChange("department", val)}
                placeholder="e.g., Engineering, Sales, HR"
                size="sm"
                variant="bordered"
              />
            ) : (
              <p className="text-gray-900 font-semibold">
                {employee.department || "N/A"}
              </p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 mb-1.5 block">
              Date of Joining
            </label>
            {isEditing ? (
              <DatePicker
                value={formatDateForInput(editedEmployee.dateOfJoining)}
                onChange={(val) => handleDateChange("dateOfJoining", val)}
                size="sm"
                variant="bordered"
                showMonthAndYearPickers
                className="max-w-full"
              />
            ) : (
              <p className="text-gray-900 font-semibold">
                {employee.dateOfJoining
                  ? new Date(employee.dateOfJoining).toLocaleDateString()
                  : "N/A"}
              </p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 mb-1.5 block">
              Employment Type
            </label>
            {isEditing ? (
              <Select
                value={editedEmployee.employmentType || ""}
                onChange={(e) =>
                  handleInputChange("employmentType", e.target.value)
                }
                size="sm"
                variant="bordered"
                placeholder="Select employment type"
              >
                {employmentTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </Select>
            ) : (
              <p className="text-gray-900 font-semibold">
                {employmentTypes.find(
                  (t) => t.value === employee.employmentType,
                )?.label || "N/A"}
              </p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 mb-1.5 block">
              Manager / Supervisor Name
            </label>
            {isEditing ? (
              <Input
                value={editedEmployee.managerName || ""}
                onValueChange={(val) => handleInputChange("managerName", val)}
                placeholder="Full name"
                size="sm"
                variant="bordered"
              />
            ) : (
              <p className="text-gray-900 font-semibold">
                {employee.managerName || "N/A"}
              </p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 mb-1.5 block">
              Work Location
            </label>
            {isEditing ? (
              <Select
                value={editedEmployee.workLocation || ""}
                onChange={(e) =>
                  handleInputChange("workLocation", e.target.value)
                }
                size="sm"
                variant="bordered"
                placeholder="Select work location"
              >
                {workLocations.map((location) => (
                  <SelectItem key={location.value} value={location.value}>
                    {location.label}
                  </SelectItem>
                ))}
              </Select>
            ) : (
              <p className="text-gray-900 font-semibold">
                {workLocations.find((l) => l.value === employee.workLocation)
                  ?.label || "N/A"}
              </p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 mb-1.5 block">
              Salary
            </label>
            {isEditing ? (
              <Input
                value={editedEmployee.salary || ""}
                onValueChange={(val) => {
                  const salaryRegex = /^[0-9]*$/;
                  if (salaryRegex.test(val) || val === "") {
                    handleInputChange("salary", val);
                  }
                }}
                placeholder="e.g., 50000"
                size="sm"
                variant="bordered"
                startContent={<span className="text-gray-500">₹</span>}
              />
            ) : (
              <p className="text-gray-900 font-semibold">
                {employee.salary
                  ? `₹ ${Number(employee.salary).toLocaleString("en-IN")}`
                  : "N/A"}
              </p>
            )}
          </div>
        </div>

        {/* Benefits & Employment Status Checkboxes */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h4 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="text-lg">✓</span> Benefits & Employment Status
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <p className="text-sm font-medium text-gray-700 mb-3">Benefits</p>
              <div className="flex flex-col gap-3">
                <Checkbox
                  isSelected={editedEmployee.hasESI || false}
                  onValueChange={(val) => handleInputChange("hasESI", val)}
                  isDisabled={!isEditing}
                  classNames={{
                    label: "text-sm text-gray-700",
                  }}
                >
                  ESI (Employee State Insurance)
                </Checkbox>
                <Checkbox
                  isSelected={editedEmployee.hasPF || false}
                  onValueChange={(val) => handleInputChange("hasPF", val)}
                  isDisabled={!isEditing}
                  classNames={{
                    label: "text-sm text-gray-700",
                  }}
                >
                  PF (Provident Fund)
                </Checkbox>
              </div>
            </div>
            <div className="space-y-3">
              <p className="text-sm font-medium text-gray-700 mb-3">
                Employment Status
              </p>
              <div className="flex flex-col gap-3">
                <Checkbox
                  isSelected={editedEmployee.isTempEmployee || false}
                  onValueChange={(val) =>
                    handleInputChange("isTempEmployee", val)
                  }
                  isDisabled={!isEditing}
                  classNames={{
                    label: "text-sm text-gray-700",
                  }}
                >
                  TEMP Employee
                </Checkbox>
                <Checkbox
                  isSelected={editedEmployee.isPermanentEmployee || false}
                  onValueChange={(val) =>
                    handleInputChange("isPermanentEmployee", val)
                  }
                  isDisabled={!isEditing}
                  classNames={{
                    label: "text-sm text-gray-700",
                  }}
                >
                  Permanent Employee
                </Checkbox>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar Section */}
      <Card className="shadow-lg">
        <CardBody className="p-8">
          <div className="space-y-6">
            {/* Calendar Header */}
            <div className="bg-gradient-to-r from-secondary to-secondary/80 text-white rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold">
                  {getMonthName(selectedDate.getMonth())}{" "}
                  {selectedDate.getFullYear()}
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={handlePrevMonth}
                    className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors font-medium"
                  >
                    ← Prev
                  </button>
                  <button
                    onClick={handleToday}
                    className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors font-medium"
                  >
                    Today
                  </button>
                  <button
                    onClick={handleNextMonth}
                    className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors font-medium"
                  >
                    Next →
                  </button>
                </div>
              </div>

              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                  (day) => (
                    <div
                      key={day}
                      className="text-center font-bold text-sm opacity-90"
                    >
                      {day}
                    </div>
                  ),
                )}
              </div>
            </div>

            {/* Calendar Days */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="grid grid-cols-7 gap-3">
                {renderCalendarDays()}
              </div>
            </div>

            {/* Calendar Legend */}
            <div className="flex items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-secondary rounded"></div>
                <span className="text-gray-600">Today</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-100 rounded border border-gray-300"></div>
                <span className="text-gray-600">Other Days</span>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
