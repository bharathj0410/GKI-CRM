import React from "react";
import { Input } from "@heroui/react";

export default function ReferralInformation({
  isEditing,
  employee,
  editedEmployee,
  handleInputChange,
}) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1.5 h-8 bg-gradient-to-b from-secondary to-secondary/60 rounded-full"></div>
        <h3 className="text-xl font-bold text-gray-950">
          Referral Information
        </h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="text-sm font-medium text-gray-600 mb-1.5 block">
            Referred By
          </label>
          {isEditing ? (
            <Input
              value={editedEmployee.referredBy || ""}
              onValueChange={(val) => handleInputChange("referredBy", val)}
              placeholder="Name of referrer"
              size="sm"
              variant="bordered"
            />
          ) : (
            <p className="text-gray-900 font-semibold">
              {employee.referredBy || "N/A"}
            </p>
          )}
        </div>
        <div>
          <label className="text-sm font-medium text-gray-600 mb-1.5 block">
            Referrer Employee ID
          </label>
          {isEditing ? (
            <Input
              value={editedEmployee.referrerEmployeeId || ""}
              onValueChange={(val) =>
                handleInputChange("referrerEmployeeId", val)
              }
              placeholder="Employee ID (if applicable)"
              size="sm"
              variant="bordered"
            />
          ) : (
            <p className="text-gray-900 font-semibold">
              {employee.referrerEmployeeId || "N/A"}
            </p>
          )}
        </div>
        <div>
          <label className="text-sm font-medium text-gray-600 mb-1.5 block">
            Referrer Contact
          </label>
          {isEditing ? (
            <Input
              type="tel"
              value={editedEmployee.referrerContact || ""}
              onValueChange={(val) => {
                const phoneRegex = /^[0-9]*$/;
                if (phoneRegex.test(val) || val === "") {
                  handleInputChange("referrerContact", val);
                }
              }}
              placeholder="Contact number"
              size="sm"
              variant="bordered"
              maxLength={15}
            />
          ) : (
            <p className="text-gray-900 font-semibold">
              {employee.referrerContact || "N/A"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
