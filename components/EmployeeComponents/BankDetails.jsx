import React from "react";
import {
  Input,
  Select,
  SelectItem,
  Button,
  Card,
  CardBody,
} from "@heroui/react";
import {
  PlusIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

export default function BankDetails({
  isEditing,
  employee,
  editedEmployee,
  handleInputChange,
  bankPassbookFile,
  setBankPassbookFile,
  bankPassbookInputRef,
  onPassbookUpload,
  onPassbookDelete,
  onPassbookView,
}) {
  const accountTypes = [
    { value: "savings", label: "Savings Account" },
    { value: "current", label: "Current Account" },
    { value: "salary", label: "Salary Account" },
  ];

  const validateIFSC = (ifsc) => {
    const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    return ifscRegex.test(ifsc);
  };

  const validateAccountNumber = (accountNumber) => {
    // Basic validation: should be 9-18 digits
    const accountRegex = /^\d{9,18}$/;
    return accountRegex.test(accountNumber);
  };

  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1.5 h-8 bg-gradient-to-b from-secondary to-secondary/60 rounded-full"></div>
        <h3 className="text-xl font-bold text-gray-950">Bank Details</h3>
      </div>

      {/* Account Holder Information */}
      <div className="mb-8 p-5 rounded-xl border border-blue-100 shadow-sm hover:shadow-md transition-shadow">
        <h4 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <span className="text-lg">👤</span> Account Holder Information
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium text-gray-600 mb-1.5 block">
              Account Holder Name
            </label>
            {isEditing ? (
              <Input
                value={editedEmployee.bankDetails?.accountHolderName || ""}
                onValueChange={(val) =>
                  handleInputChange("bankDetails", {
                    ...(editedEmployee.bankDetails || {}),
                    accountHolderName: val,
                  })
                }
                placeholder="As per bank records"
                size="sm"
                variant="bordered"
              />
            ) : (
              <p className="text-gray-900 font-semibold">
                {employee.bankDetails?.accountHolderName || "N/A"}
              </p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 mb-1.5 block">
              Bank Name
            </label>
            {isEditing ? (
              <Input
                value={editedEmployee.bankDetails?.bankName || ""}
                onValueChange={(val) =>
                  handleInputChange("bankDetails", {
                    ...(editedEmployee.bankDetails || {}),
                    bankName: val,
                  })
                }
                placeholder="e.g., HDFC Bank, ICICI Bank"
                size="sm"
                variant="bordered"
              />
            ) : (
              <p className="text-gray-900 font-semibold">
                {employee.bankDetails?.bankName || "N/A"}
              </p>
            )}
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-gray-600 mb-1.5 block">
              Branch Name
            </label>
            {isEditing ? (
              <Input
                value={editedEmployee.bankDetails?.branchName || ""}
                onValueChange={(val) =>
                  handleInputChange("bankDetails", {
                    ...(editedEmployee.bankDetails || {}),
                    branchName: val,
                  })
                }
                placeholder="e.g., Mumbai Central, Delhi Main"
                size="sm"
                variant="bordered"
              />
            ) : (
              <p className="text-gray-900 font-semibold">
                {employee.bankDetails?.branchName || "N/A"}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Account Information */}
      <div className="mb-8 p-5 rounded-xl border border-purple-100 shadow-sm hover:shadow-md transition-shadow">
        <h4 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <span className="text-lg">💳</span> Account Information
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium text-gray-600 mb-1.5 block">
              Account Number
            </label>
            {isEditing ? (
              <Input
                value={editedEmployee.bankDetails?.accountNumber || ""}
                onValueChange={(val) => {
                  const accountRegex = /^[0-9]*$/;
                  if (accountRegex.test(val) || val === "") {
                    handleInputChange("bankDetails", {
                      ...(editedEmployee.bankDetails || {}),
                      accountNumber: val,
                    });
                  }
                }}
                placeholder="9-18 digits"
                size="sm"
                variant="bordered"
              />
            ) : (
              <p className="text-gray-900 font-semibold font-mono">
                {employee.bankDetails?.accountNumber
                  ? "*".repeat(employee.bankDetails.accountNumber.length - 4) +
                    employee.bankDetails.accountNumber.slice(-4)
                  : "N/A"}
              </p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 mb-1.5 block">
              Account Type
            </label>
            {isEditing ? (
              <Select
                value={editedEmployee.bankDetails?.accountType || ""}
                onChange={(e) =>
                  handleInputChange("bankDetails", {
                    ...(editedEmployee.bankDetails || {}),
                    accountType: e.target.value,
                  })
                }
                size="sm"
                variant="bordered"
                placeholder="Select account type"
              >
                {accountTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </Select>
            ) : (
              <p className="text-gray-900 font-semibold">
                {accountTypes.find(
                  (t) => t.value === employee.bankDetails?.accountType,
                )?.label || "N/A"}
              </p>
            )}
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-gray-600 mb-1.5 block">
              IFSC Code
            </label>
            {isEditing ? (
              <Input
                value={editedEmployee.bankDetails?.ifscCode || ""}
                onValueChange={(val) => {
                  handleInputChange("bankDetails", {
                    ...(editedEmployee.bankDetails || {}),
                    ifscCode: val.toUpperCase(),
                  });
                }}
                placeholder="11 characters (e.g., HDFC0000123)"
                size="sm"
                variant="bordered"
                maxLength={11}
              />
            ) : (
              <p className="text-gray-900 font-semibold font-mono">
                {employee.bankDetails?.ifscCode || "N/A"}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Bank Passbook Verification */}
      <div className="p-5 rounded-xl border border-green-100 shadow-sm hover:shadow-md transition-shadow">
        <h4 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <span className="text-lg">📄</span> Bank Passbook Copy (Optional)
        </h4>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Upload the first page of your bank passbook for verification
            purposes.
          </p>

          {isEditing && (
            <div className="flex items-center gap-3">
              <input
                ref={bankPassbookInputRef}
                type="file"
                accept="image/*,application/pdf"
                onChange={onPassbookUpload}
                className="hidden"
              />
              <Button
                size="sm"
                color="secondary"
                variant="flat"
                startContent={<PlusIcon className="w-4 h-4" />}
                onPress={() => bankPassbookInputRef.current?.click()}
              >
                Upload Passbook
              </Button>
              {bankPassbookFile && (
                <span className="text-sm text-green-600 font-medium">
                  ✓ {bankPassbookFile.name}
                </span>
              )}
            </div>
          )}

          {(employee.bankDetails?.passbook || bankPassbookFile) && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Uploaded Document:
              </p>
              <Card className="border">
                <CardBody className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="p-2 rounded-lg bg-secondary/10">
                        <span className="text-lg">📄</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">
                          Bank Passbook
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {employee.bankDetails?.passbook?.uploadedAt
                            ? new Date(
                                employee.bankDetails.passbook.uploadedAt,
                              ).toLocaleDateString()
                            : "Pending Upload"}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {employee.bankDetails?.passbook && (
                        <>
                          <Button
                            isIconOnly
                            size="sm"
                            variant="flat"
                            color="secondary"
                            onPress={() => onPassbookView()}
                          >
                            <EyeIcon className="w-4 h-4" />
                          </Button>
                          <Button
                            isIconOnly
                            size="sm"
                            variant="flat"
                            onPress={() => {
                              const link = document.createElement("a");
                              link.href = employee.bankDetails.passbook.file;
                              link.download = `${employee.employeeId}_passbook.pdf`;
                              link.click();
                            }}
                          >
                            <ArrowDownTrayIcon className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                      {isEditing && employee.bankDetails?.passbook && (
                        <Button
                          isIconOnly
                          size="sm"
                          variant="flat"
                          color="danger"
                          onPress={onPassbookDelete}
                        >
                          <TrashIcon className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>
          )}

          {!employee.bankDetails?.passbook && !bankPassbookFile && (
            <div className="text-center py-4 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <p className="text-sm text-gray-500">No passbook uploaded yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
