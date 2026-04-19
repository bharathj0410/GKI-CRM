import React from "react";
import { Input, Autocomplete, AutocompleteItem, Textarea } from "@heroui/react";
import countriesData from "@/utils/countries.json";

export default function ProfessionalInformation({
  isEditing,
  employee,
  editedEmployee,
  handleInputChange,
}) {
  return (
    <div className="mb-8 mt-4">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1.5 h-8 bg-gradient-to-b from-secondary to-secondary/60 rounded-full"></div>
        <h3 className="text-xl font-bold text-gray-950">
          Professional Information
        </h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="text-sm font-medium text-gray-600 mb-1.5 block">
            Nationality
          </label>
          {isEditing ? (
            <Autocomplete
              value={editedEmployee.nationality || ""}
              onValueChange={(val) => handleInputChange("nationality", val)}
              size="sm"
              variant="bordered"
              placeholder="Search nationality..."
            >
              {countriesData.map((country) => (
                <AutocompleteItem key={country.key} value={country.label}>
                  {country.label}
                </AutocompleteItem>
              ))}
            </Autocomplete>
          ) : (
            <p className="text-gray-900 font-semibold">
              {employee.nationality || "N/A"}
            </p>
          )}
        </div>
        <div>
          <label className="text-sm font-medium text-gray-600 mb-1.5 block">
            Years of Experience
          </label>
          {isEditing ? (
            <Input
              type="number"
              value={editedEmployee.yearsOfExperience || ""}
              onValueChange={(val) =>
                handleInputChange("yearsOfExperience", val)
              }
              placeholder="e.g., 5"
              size="sm"
              variant="bordered"
              min="0"
            />
          ) : (
            <p className="text-gray-900 font-semibold">
              {employee.yearsOfExperience
                ? `${employee.yearsOfExperience} years`
                : "N/A"}
            </p>
          )}
        </div>
        <div>
          <label className="text-sm font-medium text-gray-600 mb-1.5 block">
            Skills
          </label>
          {isEditing ? (
            <Textarea
              value={editedEmployee.skills || ""}
              onValueChange={(val) => handleInputChange("skills", val)}
              placeholder="e.g., JavaScript, React, Node.js (comma-separated)"
              size="sm"
              variant="bordered"
              minRows={2}
            />
          ) : (
            <p className="text-gray-900 font-semibold">
              {employee.skills || "N/A"}
            </p>
          )}
        </div>
        <div>
          <label className="text-sm font-medium text-gray-600 mb-1.5 block">
            Certifications
          </label>
          {isEditing ? (
            <Textarea
              value={editedEmployee.certifications || ""}
              onValueChange={(val) => handleInputChange("certifications", val)}
              placeholder="e.g., AWS Certified Solutions Architect (comma-separated)"
              size="sm"
              variant="bordered"
              minRows={2}
            />
          ) : (
            <p className="text-gray-900 font-semibold">
              {employee.certifications || "N/A"}
            </p>
          )}
        </div>
        <div className="md:col-span-2">
          <label className="text-sm font-medium text-gray-600 mb-1.5 block">
            Previous Companies (optional)
          </label>
          {isEditing ? (
            <Textarea
              value={editedEmployee.previousCompanies || ""}
              onValueChange={(val) =>
                handleInputChange("previousCompanies", val)
              }
              placeholder="e.g., Acme Corp, Tech Innovations (comma-separated)"
              size="sm"
              variant="bordered"
              minRows={2}
            />
          ) : (
            <p className="text-gray-900 font-semibold">
              {employee.previousCompanies || "N/A"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
