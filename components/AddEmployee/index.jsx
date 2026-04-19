import React from "react";
import { Button, Form, Input } from "@heroui/react";
import { Select, SelectItem } from "@heroui/react";
import { Checkbox, CheckboxGroup } from "@heroui/react";
import bcrypt from "bcryptjs";
import axios from "axios";
import Toast from "@/components/Toast";

export const tablePermissions = [
  { key: "dashboard", label: "Dashboard", hasTableAccess: false },
  { key: "employee", label: "Employee Management", hasTableAccess: true },
  { key: "stocks", label: "Stocks Management", hasTableAccess: true },
  { key: "costing", label: "Costing & Quotations", hasTableAccess: true },
  { key: "visitors", label: "Visitors Management", hasTableAccess: true },
  { key: "job", label: "Job Management", hasTableAccess: true },
  { key: "config", label: "Configuration", hasTableAccess: true },
];

export const accessLevels = [
  { key: "view", label: "View", icon: "👁️" },
  { key: "edit", label: "Edit", icon: "✏️" },
  { key: "delete", label: "Delete", icon: "🗑️" },
];

export default function AddEmployee({ onEmployeeAdded }) {
  const [submitted, setSubmitted] = React.useState(null);
  const [password, setPassword] = React.useState("");
  const [permissions, setPermissions] = React.useState([]);
  const [tableAccess, setTableAccess] = React.useState({});
  const [useDefaultPassword, setUseDefaultPassword] = React.useState(false);
  const [requirePasswordReset, setRequirePasswordReset] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [employeeType, setEmployeeType] = React.useState("crm_user"); // crm_user, data_only, or temp_employee
  const errors = [];

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let data = Object.fromEntries(new FormData(e.currentTarget));

      // For temp employees
      if (employeeType === "temp_employee") {
        data = {
          name: data.name,
          email: data.email || "",
          phone: data.phone,
          address: data.address || "",
          dateOfBirth: data.dateOfBirth || "",
          dateOfJoining:
            data.dateOfJoining || new Date().toISOString().split("T")[0],
          emergencyContact: data.emergencyContact || "",
          emergencyContactName: data.emergencyContactName || "",
          emergencyContactRelation: data.emergencyContactRelation || "",
          bloodGroup: data.bloodGroup || "",
          employeeType: "temp_employee",
          role: "temp_employee",
        };
      }
      // For data-only employees, don't create credentials
      else if (employeeType === "data_only") {
        data = {
          name: data.name,
          email: data.email,
          phone: data.phone,
          employeeType: "data_only",
          role: "data_only",
        };
      } else {
        // Use default password if checkbox is checked
        const passwordToHash = useDefaultPassword ? "GKI@123" : data.password;
        const hashedPassword = await bcrypt.hash(passwordToHash, 10); // 10 = salt rounds

        data = {
          name: data.name,
          username: data.username,
          email: data.email,
          phone: data.phone,
          password: hashedPassword,
          role: "employee",
          employeeType: "crm_user",
          permissions: permissions,
          tableAccess: tableAccess,
          requirePasswordReset: requirePasswordReset,
        };
      }

      setSubmitted(data);

      const response = await axios.post("/api/addEmployee", data);
      if (response.status == 200) {
        const employeeId = response.data.employeeId;
        Toast(
          "Employee Added",
          `${response.data.message} Employee ID: ${employeeId}`,
          "success",
        );
        e.target.reset();
        setPermissions([]);
        setTableAccess({});
        setPassword("");
        setUseDefaultPassword(false);
        setRequirePasswordReset(false);
        setEmployeeType("crm_user");

        // Notify parent to refresh counts
        if (onEmployeeAdded) {
          onEmployeeAdded();
        }
      }
    } catch (err) {
      Toast(
        "Failed to Add Employee",
        err.response?.data?.error || "An error occurred",
        "danger",
      );
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (password.length < 4) {
    errors.push("Password must be 4 characters or more.");
  }
  if ((password.match(/[A-Z]/g) || []).length < 1) {
    errors.push("Password must include at least 1 upper case letter");
  }
  if ((password.match(/[^a-z0-9]/gi) || []).length < 1) {
    errors.push("Password must include at least 1 symbol.");
  }

  return (
    <div className="flex gap-12 items-start justify-center">
      {/* Left Side - Image */}
      <div className="w-[35rem] hidden xl:block">
        <div className="sticky top-8">
          <div className="bg-gradient-to-br from-secondary/10 to-primary/10 rounded-3xl p-8 border-2 border-dashed border-secondary/30">
            <img src="/AddUser.svg" alt="Add Employee" className="w-full" />
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3 text-gray-700">
                <div className="w-2 h-2 bg-secondary rounded-full"></div>
                <p className="text-sm">Complete employee profile setup</p>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <div className="w-2 h-2 bg-secondary rounded-full"></div>
                <p className="text-sm">Assign custom page permissions</p>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <div className="w-2 h-2 bg-secondary rounded-full"></div>
                <p className="text-sm">Set default or custom passwords</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full max-w-2xl">
        <div className="mb-5">
          <h2 className="text-xl font-bold text-gray-900 mb-1.5">
            Add New Employee
          </h2>
          <p className="text-gray-600 text-sm">
            Fill in the employee details and assign access permissions
          </p>
        </div>

        <Form className="w-full space-y-4" onSubmit={onSubmit}>
          {/* Employee Type Selection */}
          <div className="space-y-3 w-full">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-5 bg-gradient-to-b from-secondary to-primary rounded-full"></div>
              <h3 className="text-base font-semibold text-gray-800">
                Employee Type
              </h3>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div
                onClick={() => setEmployeeType("crm_user")}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  employeeType === "crm_user"
                    ? "border-secondary bg-secondary/10"
                    : "border-gray-200 hover:border-secondary/50"
                }`}
              >
                <div className="flex flex-col gap-2">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      employeeType === "crm_user"
                        ? "border-secondary"
                        : "border-gray-300"
                    }`}
                  >
                    {employeeType === "crm_user" && (
                      <div className="w-3 h-3 rounded-full bg-secondary"></div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">
                      CRM User
                    </h4>
                    <p className="text-xs text-gray-600">
                      Full CRM access with login
                    </p>
                  </div>
                </div>
              </div>

              <div
                onClick={() => setEmployeeType("data_only")}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  employeeType === "data_only"
                    ? "border-secondary bg-secondary/10"
                    : "border-gray-200 hover:border-secondary/50"
                }`}
              >
                <div className="flex flex-col gap-2">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      employeeType === "data_only"
                        ? "border-secondary"
                        : "border-gray-300"
                    }`}
                  >
                    {employeeType === "data_only" && (
                      <div className="w-3 h-3 rounded-full bg-secondary"></div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">
                      Employee
                    </h4>
                    <p className="text-xs text-gray-600">
                      Contact info only, no access
                    </p>
                  </div>
                </div>
              </div>

              <div
                onClick={() => setEmployeeType("temp_employee")}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  employeeType === "temp_employee"
                    ? "border-secondary bg-secondary/10"
                    : "border-gray-200 hover:border-secondary/50"
                }`}
              >
                <div className="flex flex-col gap-2">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      employeeType === "temp_employee"
                        ? "border-secondary"
                        : "border-gray-300"
                    }`}
                  >
                    {employeeType === "temp_employee" && (
                      <div className="w-3 h-3 rounded-full bg-secondary"></div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">
                      Temporary
                    </h4>
                    <p className="text-xs text-gray-600">
                      Short-term employee data
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Personal Information Section */}
          <div className="space-y-3 w-full">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-5 bg-gradient-to-b from-secondary to-primary rounded-full"></div>
              <h3 className="text-base font-semibold text-gray-800">
                Personal Information
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input
                isRequired
                label="Full Name"
                labelPlacement="inside"
                name="name"
                placeholder="Enter full name"
                type="text"
                color="secondary"
                size="md"
                classNames={{
                  label: "font-semibold text-gray-700 text-sm",
                }}
                validate={(value) => {
                  if (value.length < 3) {
                    return "Name must be at least 3 characters long";
                  }
                }}
              />
              {employeeType === "crm_user" && (
                <Input
                  isRequired
                  label="Username"
                  labelPlacement="inside"
                  name="username"
                  placeholder="Enter username"
                  type="text"
                  color="secondary"
                  size="md"
                  classNames={{
                    label: "font-semibold text-gray-700 text-sm",
                  }}
                  validate={(value) => {
                    if (value.length < 3) {
                      return "Username must be at least 3 characters long";
                    }
                    return value === "admin" ? "Nice try!" : null;
                  }}
                />
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Email Address"
                labelPlacement="inside"
                name="email"
                placeholder="employee@company.com"
                type="email"
                color="secondary"
                size="md"
                classNames={{
                  label: "font-semibold text-gray-700 text-sm",
                }}
              />
              <Input
                isRequired
                label="Phone Number"
                labelPlacement="inside"
                name="phone"
                placeholder="+91 XXXXX XXXXX"
                type="tel"
                color="secondary"
                size="md"
                classNames={{
                  label: "font-semibold text-gray-700 text-sm",
                }}
                validate={(value) => {
                  if (value.length < 10) {
                    return "Phone number must be at least 10 digits";
                  }
                }}
              />
            </div>
          </div>

          {/* Additional Fields for Temporary Employees */}
          {employeeType === "temp_employee" && (
            <div className="space-y-3 w-full">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1 h-5 bg-gradient-to-b from-secondary to-primary rounded-full"></div>
                <h3 className="text-base font-semibold text-gray-800">
                  Additional Details
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Date of Birth"
                  labelPlacement="inside"
                  name="dateOfBirth"
                  type="date"
                  color="secondary"
                  size="md"
                  classNames={{
                    label: "font-semibold text-gray-700 text-sm",
                  }}
                />
                <Input
                  label="Date of Joining"
                  labelPlacement="inside"
                  name="dateOfJoining"
                  type="date"
                  color="secondary"
                  size="md"
                  classNames={{
                    label: "font-semibold text-gray-700 text-sm",
                  }}
                />
              </div>

              <Input
                label="Address"
                labelPlacement="inside"
                name="address"
                placeholder="Enter full address"
                type="text"
                color="secondary"
                size="md"
                classNames={{
                  label: "font-semibold text-gray-700 text-sm",
                }}
              />

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Blood Group"
                  labelPlacement="inside"
                  name="bloodGroup"
                  placeholder="e.g., O+, A-, B+"
                  type="text"
                  color="secondary"
                  size="md"
                  classNames={{
                    label: "font-semibold text-gray-700 text-sm",
                  }}
                />
              </div>

              <div className="flex items-center gap-2 mb-3 mt-4">
                <div className="w-1 h-5 bg-gradient-to-b from-secondary to-primary rounded-full"></div>
                <h3 className="text-base font-semibold text-gray-800">
                  Emergency Contact
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Contact Name"
                  labelPlacement="inside"
                  name="emergencyContactName"
                  placeholder="Full name"
                  type="text"
                  color="secondary"
                  size="md"
                  classNames={{
                    label: "font-semibold text-gray-700 text-sm",
                  }}
                />
                <Input
                  label="Contact Phone"
                  labelPlacement="inside"
                  name="emergencyContact"
                  placeholder="+91 XXXXX XXXXX"
                  type="tel"
                  color="secondary"
                  size="md"
                  classNames={{
                    label: "font-semibold text-gray-700 text-sm",
                  }}
                />
              </div>

              <Input
                label="Relationship"
                labelPlacement="inside"
                name="emergencyContactRelation"
                placeholder="e.g., Father, Mother, Spouse"
                type="text"
                color="secondary"
                size="md"
                classNames={{
                  label: "font-semibold text-gray-700 text-sm",
                }}
              />
            </div>
          )}

          {/* Security Section - Only for CRM users */}
          {employeeType === "crm_user" && (
            <div className="space-y-3 pt-3 w-full">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1 h-5 bg-gradient-to-b from-secondary to-primary rounded-full"></div>
                <h3 className="text-base font-semibold text-gray-800">
                  Security Settings
                </h3>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                <Checkbox
                  isSelected={useDefaultPassword}
                  onValueChange={setUseDefaultPassword}
                  color="secondary"
                  size="md"
                >
                  <div>
                    <p className="font-semibold text-gray-800">
                      Use default password
                    </p>
                    <p className="text-sm text-gray-600">
                      Password will be set to:{" "}
                      <span className="font-mono bg-purple-100 px-2 py-0.5 rounded">
                        GKI@123
                      </span>
                    </p>
                  </div>
                </Checkbox>
              </div>

              {!useDefaultPassword && (
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    errorMessage={() => (
                      <ul className="text-xs space-y-1">
                        {errors.map((error, i) => (
                          <li key={i}>• {error}</li>
                        ))}
                      </ul>
                    )}
                    isRequired
                    isInvalid={errors.length > 0}
                    label="Password"
                    labelPlacement="inside"
                    name="password"
                    placeholder="Enter password"
                    type="password"
                    value={password}
                    onValueChange={setPassword}
                    color="secondary"
                    size="lg"
                    classNames={{
                      label: "font-semibold text-gray-700",
                    }}
                  />

                  <Input
                    isRequired
                    label="Confirm Password"
                    labelPlacement="inside"
                    placeholder="Confirm password"
                    type="password"
                    color="secondary"
                    size="lg"
                    classNames={{
                      label: "font-semibold text-gray-700",
                    }}
                    validate={(value) => {
                      if (value != password) {
                        return "Password doesn't match";
                      }
                    }}
                  />
                </div>
              )}

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <Checkbox
                  isSelected={requirePasswordReset}
                  onValueChange={setRequirePasswordReset}
                  color="secondary"
                  size="md"
                >
                  <div>
                    <p className="font-semibold text-gray-800">
                      Require password reset on first login
                    </p>
                    <p className="text-sm text-gray-600">
                      Employee will be prompted to change password
                    </p>
                  </div>
                </Checkbox>
              </div>
            </div>
          )}

          {/* Permissions Section - Only for CRM users */}
          {employeeType === "crm_user" && (
            <div className="space-y-4 pt-3 w-full">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1 h-5 bg-gradient-to-b from-secondary to-primary rounded-full"></div>
                <h3 className="text-base font-semibold text-gray-800">
                  Access Permissions & Table Access Control
                </h3>
              </div>

              <div className="bg-gradient-to-br from-secondary/5 to-primary/5 rounded-xl p-4 border-2 border-secondary/20">
                <p className="text-sm text-gray-700 mb-4 font-medium">
                  Select pages and define access levels (View, Edit, Delete) for
                  each table
                </p>

                <div className="space-y-3">
                  {tablePermissions.map((table) => {
                    const isSelected = permissions.includes(table.key);
                    const currentAccess = tableAccess[table.key] || [];

                    return (
                      <div
                        key={table.key}
                        className={`bg-white rounded-lg border-2 transition-all ${
                          isSelected
                            ? "border-secondary shadow-md"
                            : "border-gray-200"
                        }`}
                      >
                        <div className="p-3">
                          <div className="flex items-start gap-3">
                            <Checkbox
                              isSelected={isSelected}
                              onValueChange={(checked) => {
                                if (checked) {
                                  setPermissions([...permissions, table.key]);
                                  if (table.hasTableAccess) {
                                    setTableAccess({
                                      ...tableAccess,
                                      [table.key]: ["view"],
                                    });
                                  }
                                } else {
                                  setPermissions(
                                    permissions.filter((p) => p !== table.key),
                                  );
                                  const newAccess = { ...tableAccess };
                                  delete newAccess[table.key];
                                  setTableAccess(newAccess);
                                }
                              }}
                              color="secondary"
                              size="lg"
                            />
                            <div className="flex-1">
                              <p className="font-semibold text-gray-900">
                                {table.label}
                              </p>

                              {/* Access Level Controls - Only if table has access control */}
                              {isSelected && table.hasTableAccess && (
                                <div className="mt-3 flex flex-wrap gap-2">
                                  {accessLevels.map((level) => {
                                    const hasAccess = currentAccess.includes(
                                      level.key,
                                    );
                                    return (
                                      <button
                                        key={level.key}
                                        type="button"
                                        onClick={() => {
                                          if (hasAccess) {
                                            setTableAccess({
                                              ...tableAccess,
                                              [table.key]: currentAccess.filter(
                                                (a) => a !== level.key,
                                              ),
                                            });
                                          } else {
                                            setTableAccess({
                                              ...tableAccess,
                                              [table.key]: [
                                                ...currentAccess,
                                                level.key,
                                              ],
                                            });
                                          }
                                        }}
                                        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                                          hasAccess
                                            ? "bg-secondary text-white shadow-sm"
                                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                        }`}
                                      >
                                        <span className="mr-1">
                                          {level.icon}
                                        </span>
                                        {level.label}
                                      </button>
                                    );
                                  })}
                                </div>
                              )}

                              {isSelected && !table.hasTableAccess && (
                                <p className="text-xs text-gray-500 mt-2">
                                  ✓ Full access granted
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {permissions.length === 0 && (
                  <div className="mt-3 text-center py-2 text-sm text-red-600 bg-red-50 rounded-lg">
                    ⚠️ Please select at least one page access
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-4">
            <Button
              color="secondary"
              type="submit"
              className="w-full h-11 text-base font-semibold"
              size="md"
              isLoading={isLoading}
              isDisabled={isLoading}
            >
              {isLoading
                ? "Adding Employee..."
                : employeeType === "data_only"
                  ? "Add Employee Data"
                  : "Create Employee Account"}
            </Button>
          </div>
          {/* {submitted && (
                        <div className="text-small text-default-500">
                            You submitted: <code>{JSON.stringify(submitted)}</code>
                            </div>
                    )} */}
        </Form>
      </div>
    </div>
  );
}
