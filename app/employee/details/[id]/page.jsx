"use client";
import React, { useState, useEffect, useRef, use } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Card,
  CardBody,
  Input,
  Textarea,
  Select,
  SelectItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Chip,
  Avatar,
  Tabs,
  Tab,
  Autocomplete,
  AutocompleteItem,
} from "@heroui/react";
import { DatePicker } from "@heroui/react";
import {
  ArrowLeftIcon,
  CameraIcon,
  DocumentIcon,
  CheckBadgeIcon,
  PencilIcon,
  TrashIcon,
  ArrowDownTrayIcon,
  PlusIcon,
  EyeIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import CameraCapture from "@/components/CameraCapture";
import { parseDate } from "@internationalized/date";
import { useAuth } from "@/contexts/AuthContext";
import govIdTypesData from "@/utils/govIdTypes.json";
import indianStatesData from "@/utils/indianStates.json";
import countriesData from "@/utils/countries.json";
import BasicInformation from "@/components/EmployeeComponents/BasicInformation";
import AddressDetails from "@/components/EmployeeComponents/AddressDetails";
import ProfessionalInformation from "@/components/EmployeeComponents/ProfessionalInformation";
import EmergencyContact from "@/components/EmployeeComponents/EmergencyContact";
import ReferralInformation from "@/components/EmployeeComponents/ReferralInformation";
import BankDetails from "@/components/EmployeeComponents/BankDetails";
import WorkDetails from "@/components/EmployeeComponents/WorkDetails";

const documentTypes = [
  { value: "aadhar", label: "Aadhar Card" },
  { value: "pan", label: "PAN Card" },
  { value: "driving_license", label: "Driving License" },
  { value: "voter_id", label: "Voter ID" },
  { value: "passport", label: "Passport" },
  { value: "bank_passbook", label: "Bank Passbook" },
  { value: "address_proof", label: "Address Proof" },
  { value: "photo", label: "Photo ID" },
  { value: "educational", label: "Educational Certificate" },
  { value: "experience", label: "Experience Letter" },
  { value: "police_verification", label: "Police Verification" },
  { value: "medical", label: "Medical Certificate" },
  { value: "other", label: "Other" },
];

export default function EmployeeDetailsPage({ params }) {
  const unwrappedParams = use(params);
  const router = useRouter();
  const { hasTableAccess } = useAuth();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedEmployee, setEditedEmployee] = useState({});
  const [selectedTab, setSelectedTab] = useState("details");

  // Access control checks
  const canView = hasTableAccess("employee", "view");
  const canEdit = hasTableAccess("employee", "edit");
  const canDelete = hasTableAccess("employee", "delete");

  // Photo related states
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [photoMode, setPhotoMode] = useState("upload"); // 'upload' or 'camera'
  const fileInputRef = useRef(null);

  // Document related states
  const [documents, setDocuments] = useState([]);
  const [showDocModal, setShowDocModal] = useState(false);
  const [newDocType, setNewDocType] = useState("");
  const [newDocFile, setNewDocFile] = useState(null);
  const [viewingDoc, setViewingDoc] = useState(null);
  const [showDocViewer, setShowDocViewer] = useState(false);
  const docFileInputRef = useRef(null);

  // Verification states
  const [isVerified, setIsVerified] = useState(false);
  const [verificationNotes, setVerificationNotes] = useState("");
  const [showVerifyModal, setShowVerifyModal] = useState(false);

  // Government ID states
  const [governmentIds, setGovernmentIds] = useState([]);
  const [showGovIdModal, setShowGovIdModal] = useState(false);
  const [newGovIdType, setNewGovIdType] = useState("");
  const [newGovIdNumber, setNewGovIdNumber] = useState("");
  const [newGovIdState, setNewGovIdState] = useState("");
  const [newGovIdCountry, setNewGovIdCountry] = useState("India");
  const [govIdValidationError, setGovIdValidationError] = useState("");

  // Family details states
  const [familyMembers, setFamilyMembers] = useState([]);
  const [showFamilyModal, setShowFamilyModal] = useState(false);
  const [newFamilyMember, setNewFamilyMember] = useState({
    name: "",
    relationship: "",
    contact: "",
    photo: "",
  });
  const familyPhotoInputRef = useRef(null);

  // Family address states
  const [sameAsPersonal, setSameAsPersonal] = useState(false);

  // Bank Passbook states
  const [bankPassbookFile, setBankPassbookFile] = useState(null);
  const bankPassbookInputRef = useRef(null);

  useEffect(() => {
    // Fetch employee details
    fetchEmployeeDetails();
  }, [unwrappedParams]);

  const fetchEmployeeDetails = async () => {
    try {
      const employeeId = unwrappedParams.id;
      const response = await fetch(
        `/api/getEmployeeById?employeeId=${employeeId}`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch employee");
      }

      const data = await response.json();
      setEmployee(data.employee);
      setEditedEmployee(data.employee);
      setIsVerified(data.employee.isVerified || false);
      setDocuments(data.employee.documents || []);
      setGovernmentIds(data.employee.governmentIds || []);
      setFamilyMembers(data.employee.familyMembers || []);
      setSameAsPersonal(data.employee.sameAsPersonal || false);
    } catch (error) {
      console.error("Error fetching employee:", error);
      setEmployee(null);
    } finally {
      setLoading(false);
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Save changes
      updateEmployee(editedEmployee);
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (field, value) => {
    setEditedEmployee({ ...editedEmployee, [field]: value });
  };

  const updateEmployee = async (updates) => {
    try {
      const response = await fetch("/api/updateEmployee", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employeeId: employee.employeeId,
          ...updates,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update employee");
      }

      // Refresh employee data
      await fetchEmployeeDetails();
    } catch (error) {
      console.error("Error updating employee:", error);
      alert("Failed to update employee");
    }
  };

  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        await updateEmployee({ photo: reader.result });
        setShowPhotoModal(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraCapture = async (imageData) => {
    await updateEmployee({ photo: imageData });
    setShowPhotoModal(false);
  };

  const handleDocumentUpload = async () => {
    if (newDocFile && newDocType) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const newDoc = {
          id: Date.now(),
          type: newDocType,
          typeName: documentTypes.find((d) => d.value === newDocType)?.label,
          file: reader.result,
          fileName: newDocFile.name,
          uploadedAt: new Date().toISOString(),
        };
        const updatedDocs = [...documents, newDoc];
        await updateEmployee({ documents: updatedDocs });
        setDocuments(updatedDocs);
        setShowDocModal(false);
        setNewDocType("");
        setNewDocFile(null);
      };
      reader.readAsDataURL(newDocFile);
    }
  };

  const viewDocument = (doc) => {
    setViewingDoc(doc);
    setShowDocViewer(true);
  };

  const formatDateForInput = (dateString) => {
    if (!dateString) return null;
    try {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return parseDate(`${year}-${month}-${day}`);
    } catch (error) {
      return null;
    }
  };

  const handleDateChange = (field, value) => {
    if (value) {
      const date = new Date(value.year, value.month - 1, value.day);
      handleInputChange(field, date.toISOString());
    }
  };

  const downloadDocument = (doc) => {
    const link = document.createElement("a");
    link.href = doc.file;
    link.download = `${employee.employeeId}_${doc.typeName}_${new Date().toLocaleDateString()}.pdf`;
    link.click();
  };

  const deleteDocument = async (docId) => {
    const updatedDocs = documents.filter((doc) => doc.id !== docId);
    await updateEmployee({ documents: updatedDocs });
  };

  const handlePassbookUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setBankPassbookFile(file);
      const reader = new FileReader();
      reader.onloadend = async () => {
        const bankDetails = {
          ...(editedEmployee.bankDetails || {}),
          passbook: {
            id: Date.now(),
            fileName: file.name,
            file: reader.result,
            uploadedAt: new Date().toISOString(),
          },
        };
        await updateEmployee({ bankDetails });
        setBankPassbookFile(null);
        event.target.value = "";
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePassbookDelete = async () => {
    const bankDetails = {
      ...(editedEmployee.bankDetails || {}),
      passbook: null,
    };
    await updateEmployee({ bankDetails });
    setBankPassbookFile(null);
  };

  const handlePassbookView = () => {
    if (employee.bankDetails?.passbook?.file) {
      const link = document.createElement("a");
      link.href = employee.bankDetails.passbook.file;
      link.target = "_blank";
      link.click();
    }
  };

  const validateGovId = (type, number) => {
    const idType = govIdTypesData.find((id) => id.key === type);
    if (!idType || !idType.regex) return { isValid: true, message: "" };

    const regex = new RegExp(idType.regex);
    const isValid = regex.test(number);

    return {
      isValid,
      message: isValid ? "" : idType.validationMessage,
    };
  };

  const handleGovIdNumberChange = (value) => {
    setNewGovIdNumber(value.toUpperCase());
    setGovIdValidationError("");

    if (value && newGovIdType) {
      const validation = validateGovId(newGovIdType, value.toUpperCase());
      if (!validation.isValid) {
        setGovIdValidationError(validation.message);
      }
    }
  };

  const handleGovIdTypeChange = (value) => {
    setNewGovIdType(value);
    setGovIdValidationError("");

    if (newGovIdNumber && value) {
      const validation = validateGovId(value, newGovIdNumber);
      if (!validation.isValid) {
        setGovIdValidationError(validation.message);
      }
    }
  };

  const handleVerify = async () => {
    await updateEmployee({
      isVerified: true,
      verifiedAt: new Date().toISOString(),
      verifiedBy: "Current User", // TODO: Get from auth context
      verificationNotes,
    });
    setShowVerifyModal(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-xl text-gray-600">Employee not found</p>
          <Button
            color="secondary"
            onPress={() => router.back()}
            className="mt-4"
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                isIconOnly
                variant="light"
                onPress={() => router.back()}
                className="hover:bg-gray-100"
              >
                <ArrowLeftIcon className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Employee Details
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-sm text-gray-600">
                    ID: {employee.employeeId}
                  </p>
                  {isVerified && (
                    <Chip
                      size="sm"
                      color="success"
                      variant="flat"
                      startContent={<CheckBadgeIcon className="w-4 h-4" />}
                    >
                      Verified
                    </Chip>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {!isVerified && canEdit && (
                <Button
                  color="success"
                  variant="flat"
                  startContent={<CheckBadgeIcon className="w-5 h-5" />}
                  onPress={() => setShowVerifyModal(true)}
                >
                  Verify Employee
                </Button>
              )}
              {canEdit && (
                <Button
                  color="secondary"
                  variant={isEditing ? "solid" : "flat"}
                  startContent={<PencilIcon className="w-5 h-5" />}
                  onPress={handleEditToggle}
                >
                  {isEditing ? "Save Changes" : "Edit Details"}
                </Button>
              )}
              {canDelete && (
                <Button
                  color="danger"
                  variant="flat"
                  startContent={<TrashIcon className="w-5 h-5" />}
                  onPress={() => {
                    /* TODO: Add delete handler */
                  }}
                >
                  Delete
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Sidebar - Photo & Basic Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Photo Card */}
            <Card className="shadow-md hover:shadow-lg transition-shadow">
              <CardBody className="p-6">
                <div className="text-center">
                  <div className="relative inline-block mb-4">
                    <Avatar
                      src={
                        employee.photo ||
                        `https://ui-avatars.com/api/?name=${employee.name}&background=8b5cf6&color=fff&size=200`
                      }
                      className="w-36 h-36 text-large border-4 border-white shadow-lg"
                    />
                    <Button
                      isIconOnly
                      size="sm"
                      color="secondary"
                      className="absolute bottom-2 right-2 shadow-lg"
                      onPress={() => setShowPhotoModal(true)}
                    >
                      <CameraIcon className="w-4 h-4" />
                    </Button>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">
                    {employee.name}
                  </h2>
                  <p className="text-sm text-gray-600 mb-3">
                    {employee.role || "Employee"}
                  </p>
                  <div className="mt-4 flex justify-center gap-2">
                    <Chip
                      size="md"
                      color="secondary"
                      variant="flat"
                      className="font-medium"
                    >
                      {employee.employeeType === "crm_user"
                        ? "CRM User"
                        : employee.employeeType === "temp_employee"
                          ? "Temporary"
                          : "Employee"}
                    </Chip>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Quick Info Card */}
            <Card className="shadow-md">
              <CardBody className="p-6 space-y-4">
                <div>
                  <p className="text-xs text-gray-500">Employee ID</p>
                  <p className="font-semibold text-gray-900">
                    {employee.employeeId || "N/A"}
                  </p>
                </div>
                {employee.dateOfJoining && (
                  <div>
                    <p className="text-xs text-gray-500">Date of Joining</p>
                    <p className="font-semibold text-gray-900">
                      {new Date(employee.dateOfJoining).toLocaleDateString()}
                    </p>
                  </div>
                )}
                {employee.bloodGroup && (
                  <div>
                    <p className="text-xs text-gray-500">Blood Group</p>
                    <p className="font-semibold text-gray-900">
                      {employee.bloodGroup}
                    </p>
                  </div>
                )}
              </CardBody>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs
              selectedKey={selectedTab}
              onSelectionChange={setSelectedTab}
              color="secondary"
              size="lg"
              variant="solid"
              className=""
            >
              <Tab key="details" title="Personal Details">
                <Card className="shadow-md">
                  <CardBody className="p-8">
                    <BasicInformation
                      isEditing={isEditing}
                      employee={employee}
                      editedEmployee={editedEmployee}
                      handleInputChange={handleInputChange}
                      handleDateChange={handleDateChange}
                      formatDateForInput={formatDateForInput}
                    />

                    {/* Address Details */}
                    <div className="mb-8">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-1.5 h-8 bg-gradient-to-b from-secondary to-secondary/60 rounded-full"></div>
                        <h3 className="text-xl font-bold text-gray-950">
                          Address Details
                        </h3>
                      </div>

                      <AddressDetails
                        isEditing={isEditing}
                        employee={employee}
                        editedEmployee={editedEmployee}
                        handleInputChange={handleInputChange}
                        addressType="temporary"
                      />

                      <AddressDetails
                        isEditing={isEditing}
                        employee={employee}
                        editedEmployee={editedEmployee}
                        handleInputChange={handleInputChange}
                        addressType="permanent"
                      />
                    </div>

                    {/* Government ID Information */}
                    <div className="mb-8">
                      <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="w-1.5 h-8 bg-gradient-to-b from-secondary to-secondary/60 rounded-full"></div>
                          <h3 className="text-xl font-bold text-gray-950">
                            Government ID Information
                          </h3>
                        </div>
                        {isEditing && (
                          <Button
                            size="sm"
                            color="secondary"
                            variant="flat"
                            startContent={<PlusIcon className="w-4 h-4" />}
                            onPress={() => setShowGovIdModal(true)}
                          >
                            Add ID
                          </Button>
                        )}
                      </div>

                      {governmentIds.length === 0 ? (
                        <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                          <p className="text-gray-500">
                            No government IDs added yet
                          </p>
                          {isEditing && (
                            <Button
                              size="sm"
                              color="secondary"
                              variant="flat"
                              startContent={<PlusIcon className="w-4 h-4" />}
                              onPress={() => setShowGovIdModal(true)}
                              className="mt-3"
                            >
                              Add Government ID
                            </Button>
                          )}
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {governmentIds.map((govId, index) => (
                            <Card
                              key={index}
                              className="border hover:shadow-md transition-shadow"
                            >
                              <CardBody className="p-4">
                                <div className="flex justify-between items-start">
                                  <div className="flex items-start gap-3 flex-1">
                                    <div className="p-2 rounded-lg bg-secondary/10">
                                      <DocumentIcon className="w-5 h-5 text-secondary" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="font-semibold text-gray-900">
                                        {govId.type}
                                      </p>
                                      <p className="text-sm text-gray-600 font-mono mt-1">
                                        {govId.number}
                                      </p>
                                      {(govId.state || govId.country) && (
                                        <div className="mt-2 flex flex-wrap gap-1">
                                          {govId.state && (
                                            <Chip
                                              size="sm"
                                              variant="flat"
                                              color="primary"
                                            >
                                              {govId.state}
                                            </Chip>
                                          )}
                                          {govId.country && (
                                            <Chip
                                              size="sm"
                                              variant="flat"
                                              color="secondary"
                                            >
                                              {govId.country}
                                            </Chip>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  {isEditing && (
                                    <Button
                                      isIconOnly
                                      size="sm"
                                      variant="light"
                                      color="danger"
                                      onPress={async () => {
                                        const updated = governmentIds.filter(
                                          (_, i) => i !== index,
                                        );
                                        setGovernmentIds(updated);
                                        await updateEmployee({
                                          governmentIds: updated,
                                        });
                                      }}
                                    >
                                      <TrashIcon className="w-4 h-4" />
                                    </Button>
                                  )}
                                </div>
                              </CardBody>
                            </Card>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Emergency Contact */}
                    <EmergencyContact
                      isEditing={isEditing}
                      employee={employee}
                      editedEmployee={editedEmployee}
                      handleInputChange={handleInputChange}
                    />

                    {/* Family Details */}
                    <div className="mb-8 mt-4">
                      <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="w-1.5 h-8 bg-gradient-to-b from-secondary to-secondary/60 rounded-full"></div>
                          <h3 className="text-xl font-bold text-gray-950">
                            Family Details
                          </h3>
                        </div>
                        {isEditing && (
                          <Button
                            size="sm"
                            color="secondary"
                            variant="flat"
                            startContent={<PlusIcon className="w-4 h-4" />}
                            onPress={() => setShowFamilyModal(true)}
                          >
                            Add Member
                          </Button>
                        )}
                      </div>

                      {familyMembers.length === 0 ? (
                        <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                          <p className="text-gray-500">
                            No family members added yet
                          </p>
                          {isEditing && (
                            <Button
                              size="sm"
                              color="secondary"
                              variant="flat"
                              startContent={<PlusIcon className="w-4 h-4" />}
                              onPress={() => setShowFamilyModal(true)}
                              className="mt-3"
                            >
                              Add Family Member
                            </Button>
                          )}
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {familyMembers.map((member, index) => (
                            <Card
                              key={index}
                              className="border hover:shadow-md transition-shadow"
                            >
                              <CardBody className="p-4">
                                <div className="flex gap-3">
                                  <Avatar
                                    src={
                                      member.photo ||
                                      `https://ui-avatars.com/api/?name=${member.name}&background=8b5cf6&color=fff`
                                    }
                                    className="w-16 h-16"
                                  />
                                  <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                      <div>
                                        <p className="font-semibold text-gray-900">
                                          {member.name}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                          {member.relationship}
                                        </p>
                                        <p className="text-sm text-gray-500 mt-1">
                                          {member.contact}
                                        </p>
                                      </div>
                                      {isEditing && (
                                        <Button
                                          isIconOnly
                                          size="sm"
                                          variant="light"
                                          color="danger"
                                          onPress={async () => {
                                            const updated =
                                              familyMembers.filter(
                                                (_, i) => i !== index,
                                              );
                                            setFamilyMembers(updated);
                                            await updateEmployee({
                                              familyMembers: updated,
                                            });
                                          }}
                                        >
                                          <TrashIcon className="w-4 h-4" />
                                        </Button>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </CardBody>
                            </Card>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Family Address */}
                    <div className="mb-8">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-1.5 h-8 bg-gradient-to-b from-secondary to-secondary/60 rounded-full"></div>
                        <h3 className="text-xl font-bold text-gray-950">
                          Family Address
                        </h3>
                      </div>

                      {isEditing && (
                        <div className="mb-4">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={sameAsPersonal}
                              onChange={(e) => {
                                const checked = e.target.checked;
                                setSameAsPersonal(checked);
                                if (checked) {
                                  handleInputChange(
                                    "familyAddress",
                                    editedEmployee.permanentAddress || {},
                                  );
                                }
                                handleInputChange("sameAsPersonal", checked);
                              }}
                              className="w-4 h-4 text-secondary"
                            />
                            <span className="text-sm font-medium text-gray-700">
                              Same as Permanent Address
                            </span>
                          </label>
                        </div>
                      )}

                      <div className="p-5 bg-gradient-to-br from-purple-50 to-purple-50/50 rounded-xl border border-purple-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="md:col-span-2">
                            <label className="text-sm font-medium text-gray-600 mb-1.5 block">
                              Address Line
                            </label>
                            {isEditing ? (
                              <Textarea
                                value={
                                  editedEmployee.familyAddress?.addressLine ||
                                  ""
                                }
                                onValueChange={(val) =>
                                  handleInputChange("familyAddress", {
                                    ...(editedEmployee.familyAddress || {}),
                                    addressLine: val,
                                  })
                                }
                                placeholder="Street, House No., Locality"
                                size="sm"
                                variant="bordered"
                                minRows={2}
                                isDisabled={sameAsPersonal}
                              />
                            ) : (
                              <p className="text-gray-900 font-semibold">
                                {employee.familyAddress?.addressLine || "N/A"}
                              </p>
                            )}
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-600 mb-1.5 block">
                              City
                            </label>
                            {isEditing ? (
                              <Input
                                value={editedEmployee.familyAddress?.city || ""}
                                onValueChange={(val) =>
                                  handleInputChange("familyAddress", {
                                    ...(editedEmployee.familyAddress || {}),
                                    city: val,
                                  })
                                }
                                size="sm"
                                variant="bordered"
                                isDisabled={sameAsPersonal}
                              />
                            ) : (
                              <p className="text-gray-900 font-semibold">
                                {employee.familyAddress?.city || "N/A"}
                              </p>
                            )}
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-600 mb-1.5 block">
                              State
                            </label>
                            {isEditing ? (
                              <Autocomplete
                                value={
                                  editedEmployee.familyAddress?.state || ""
                                }
                                onValueChange={(val) =>
                                  handleInputChange("familyAddress", {
                                    ...(editedEmployee.familyAddress || {}),
                                    state: val,
                                  })
                                }
                                size="sm"
                                variant="bordered"
                                placeholder="Search state..."
                                isDisabled={sameAsPersonal}
                              >
                                {indianStatesData.map((state) => (
                                  <AutocompleteItem
                                    key={state.key}
                                    value={state.label}
                                  >
                                    {state.label}
                                  </AutocompleteItem>
                                ))}
                              </Autocomplete>
                            ) : (
                              <p className="text-gray-900 font-semibold">
                                {employee.familyAddress?.state || "N/A"}
                              </p>
                            )}
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-600 mb-1.5 block">
                              Pincode
                            </label>
                            {isEditing ? (
                              <Input
                                value={
                                  editedEmployee.familyAddress?.pincode || ""
                                }
                                onValueChange={(val) => {
                                  const pincodeRegex = /^[0-9]*$/;
                                  if (pincodeRegex.test(val) || val === "") {
                                    handleInputChange("familyAddress", {
                                      ...(editedEmployee.familyAddress || {}),
                                      pincode: val,
                                    });
                                  }
                                }}
                                size="sm"
                                variant="bordered"
                                maxLength={6}
                                isDisabled={sameAsPersonal}
                                placeholder="e.g., 400001"
                              />
                            ) : (
                              <p className="text-gray-900 font-semibold">
                                {employee.familyAddress?.pincode || "N/A"}
                              </p>
                            )}
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-600 mb-1.5 block">
                              Country
                            </label>
                            {isEditing ? (
                              <Autocomplete
                                value={
                                  editedEmployee.familyAddress?.country || ""
                                }
                                onValueChange={(val) =>
                                  handleInputChange("familyAddress", {
                                    ...(editedEmployee.familyAddress || {}),
                                    country: val,
                                  })
                                }
                                size="sm"
                                variant="bordered"
                                placeholder="Search country..."
                                isDisabled={sameAsPersonal}
                              >
                                {countriesData.map((country) => (
                                  <AutocompleteItem
                                    key={country.key}
                                    value={country.label}
                                  >
                                    {country.label}
                                  </AutocompleteItem>
                                ))}
                              </Autocomplete>
                            ) : (
                              <p className="text-gray-900 font-semibold">
                                {employee.familyAddress?.country || "N/A"}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Referral Information */}
                    <ReferralInformation
                      isEditing={isEditing}
                      employee={employee}
                      editedEmployee={editedEmployee}
                      handleInputChange={handleInputChange}
                    />

                    {/* Professional Information */}
                    <ProfessionalInformation
                      isEditing={isEditing}
                      employee={employee}
                      editedEmployee={editedEmployee}
                      handleInputChange={handleInputChange}
                    />
                  </CardBody>
                </Card>
              </Tab>

              <Tab key="bankdetails" title="Bank Details">
                <Card className="shadow-md mt-4">
                  <CardBody className="p-8">
                    {/* Bank Details */}
                    <BankDetails
                      isEditing={isEditing}
                      employee={employee}
                      editedEmployee={editedEmployee}
                      handleInputChange={handleInputChange}
                      bankPassbookFile={bankPassbookFile}
                      setBankPassbookFile={setBankPassbookFile}
                      bankPassbookInputRef={bankPassbookInputRef}
                      onPassbookUpload={handlePassbookUpload}
                      onPassbookDelete={handlePassbookDelete}
                      onPassbookView={handlePassbookView}
                    />
                  </CardBody>
                </Card>
              </Tab>

              <Tab key="workdetails" title="Work Details">
                <Card className="shadow-md mt-4">
                  <CardBody className="p-8">
                    <WorkDetails
                      isEditing={isEditing}
                      employee={employee}
                      editedEmployee={editedEmployee}
                      handleInputChange={handleInputChange}
                      handleDateChange={handleDateChange}
                      formatDateForInput={formatDateForInput}
                    />
                  </CardBody>
                </Card>
              </Tab>

              <Tab key="documents" title="Documents">
                <Card className="shadow-md mt-4">
                  <CardBody className="p-8">
                    <div className="flex justify-between items-center mb-8">
                      <div className="flex items-center gap-3">
                        <div className="w-1.5 h-8 bg-gradient-to-b from-secondary to-secondary/60 rounded-full"></div>
                        <h3 className="text-xl font-bold text-gray-950">
                          Uploaded Documents
                        </h3>
                      </div>
                      {canEdit && (
                        <Button
                          color="secondary"
                          variant="flat"
                          startContent={<PlusIcon className="w-5 h-5" />}
                          onPress={() => setShowDocModal(true)}
                        >
                          Add Document
                        </Button>
                      )}
                    </div>

                    {documents.length === 0 ? (
                      <div className="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                        <DocumentIcon className="w-20 h-20 mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-500 text-lg mb-2">
                          No documents uploaded yet
                        </p>
                        <p className="text-gray-400 text-sm mb-4">
                          Upload employee documents to get started
                        </p>
                        {canEdit && (
                          <Button
                            color="secondary"
                            variant="flat"
                            startContent={<PlusIcon className="w-5 h-5" />}
                            onPress={() => setShowDocModal(true)}
                          >
                            Upload First Document
                          </Button>
                        )}
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {documents.map((doc) => (
                          <Card
                            key={doc.id}
                            className="border hover:shadow-lg transition-shadow"
                          >
                            <CardBody className="p-4">
                              <div className="flex items-start gap-3">
                                <div className="p-3 rounded-lg bg-secondary/10">
                                  <DocumentIcon className="w-6 h-6 text-secondary" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-semibold text-gray-900 truncate">
                                    {doc.typeName}
                                  </p>
                                  <p className="text-xs text-gray-500 mt-1 truncate">
                                    {doc.fileName}
                                  </p>
                                  <p className="text-xs text-gray-400 mt-1">
                                    {new Date(
                                      doc.uploadedAt,
                                    ).toLocaleDateString()}
                                  </p>
                                  <div className="flex gap-2 mt-3">
                                    {canView && (
                                      <Button
                                        size="sm"
                                        color="secondary"
                                        variant="flat"
                                        startContent={
                                          <EyeIcon className="w-4 h-4" />
                                        }
                                        onPress={() => viewDocument(doc)}
                                        className="flex-1"
                                      >
                                        View
                                      </Button>
                                    )}
                                    {canView && (
                                      <Button
                                        isIconOnly
                                        size="sm"
                                        variant="flat"
                                        onPress={() => downloadDocument(doc)}
                                      >
                                        <ArrowDownTrayIcon className="w-4 h-4" />
                                      </Button>
                                    )}
                                    {canDelete && (
                                      <Button
                                        isIconOnly
                                        size="sm"
                                        variant="flat"
                                        color="danger"
                                        onPress={() => deleteDocument(doc.id)}
                                      >
                                        <TrashIcon className="w-4 h-4" />
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </CardBody>
                          </Card>
                        ))}
                      </div>
                    )}
                  </CardBody>
                </Card>
              </Tab>

              <Tab key="idcard" title="ID Card">
                <Card>
                  <CardBody className="p-6">
                    {isVerified ? (
                      <div className="max-w-md mx-auto space-y-8">
                        {/* Front Side of ID Card */}
                        <div>
                          <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                            <div className="w-2 h-2 bg-secondary rounded-full"></div>
                            Front Side
                          </h4>
                          <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-8 rounded-2xl shadow-2xl text-white relative overflow-hidden">
                            {/* Background Pattern */}
                            <div className="absolute inset-0 opacity-10">
                              <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -mr-32 -mt-32"></div>
                              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full -ml-24 -mb-24"></div>
                            </div>

                            {/* Content */}
                            <div className="relative z-10">
                              {/* Header */}
                              <div className="flex items-start justify-between mb-6">
                                <div>
                                  <h3 className="text-lg font-bold">
                                    GKI COMPANY
                                  </h3>
                                  <p className="text-xs opacity-90">
                                    Employee Identification Card
                                  </p>
                                </div>
                                <Chip
                                  size="sm"
                                  className="bg-white/20 backdrop-blur-sm text-white font-bold"
                                  variant="flat"
                                >
                                  {employee.employeeType === "temp_employee"
                                    ? "TEMP"
                                    : employee.employeeType === "crm_user"
                                      ? "PERM"
                                      : "EMP"}
                                </Chip>
                              </div>

                              {/* Photo and Name Section */}
                              <div className="flex items-center gap-5 mb-6">
                                <div className="relative">
                                  <Avatar
                                    src={
                                      employee.photo ||
                                      `https://ui-avatars.com/api/?name=${employee.name}&background=fff&color=6366f1&size=200`
                                    }
                                    className="w-24 h-24 border-4 border-white/30 shadow-xl"
                                  />
                                  {isVerified && (
                                    <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                                      <CheckBadgeIcon className="w-4 h-4 text-white" />
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1">
                                  <h2 className="text-2xl font-bold mb-1">
                                    {employee.name}
                                  </h2>
                                  <p className="text-sm opacity-90 mb-2">
                                    {employee.role || "Employee"}
                                  </p>
                                  <div className="bg-white/20 backdrop-blur-sm rounded px-2 py-1 inline-block">
                                    <p className="text-xs font-mono font-bold">
                                      {employee.employeeId || "N/A"}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              {/* Details Grid */}
                              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="opacity-80">
                                    Department:
                                  </span>
                                  <span className="font-semibold">
                                    {employee.department || "General"}
                                  </span>
                                </div>
                                {employee.bloodGroup && (
                                  <div className="flex justify-between">
                                    <span className="opacity-80">
                                      Blood Group:
                                    </span>
                                    <span className="font-bold text-red-300">
                                      {employee.bloodGroup}
                                    </span>
                                  </div>
                                )}
                                <div className="flex justify-between">
                                  <span className="opacity-80">
                                    Valid Until:
                                  </span>
                                  <span className="font-semibold">
                                    {new Date(
                                      new Date().setFullYear(
                                        new Date().getFullYear() + 1,
                                      ),
                                    ).toLocaleDateString("en-US", {
                                      month: "short",
                                      year: "numeric",
                                    })}
                                  </span>
                                </div>
                              </div>

                              {/* Signature Line */}
                              <div className="mt-6 pt-4 border-t border-white/20">
                                <div className="flex justify-between items-end">
                                  <div>
                                    <div className="h-8 w-32 border-b border-white/50"></div>
                                    <p className="text-xs opacity-75 mt-1">
                                      Employee Signature
                                    </p>
                                  </div>
                                  <div>
                                    <div className="h-8 w-32 border-b border-white/50"></div>
                                    <p className="text-xs opacity-75 mt-1">
                                      Authorized By
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Back Side of ID Card */}
                        <div>
                          <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                            <div className="w-2 h-2 bg-secondary rounded-full"></div>
                            Back Side
                          </h4>
                          <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-black p-8 rounded-2xl shadow-2xl text-white relative overflow-hidden">
                            {/* Background Pattern */}
                            <div className="absolute inset-0 opacity-5">
                              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white to-transparent"></div>
                            </div>

                            {/* Content */}
                            <div className="relative z-10 space-y-6">
                              {/* Contact Information */}
                              <div>
                                <h4 className="text-sm font-bold mb-3 text-secondary-400">
                                  CONTACT INFORMATION
                                </h4>
                                <div className="space-y-2 text-sm">
                                  {employee.phone && (
                                    <div className="flex items-center gap-2">
                                      <div className="w-6 h-6 bg-white/10 rounded flex items-center justify-center">
                                        <span className="text-xs">📞</span>
                                      </div>
                                      <span>{employee.phone}</span>
                                    </div>
                                  )}
                                  {employee.email && (
                                    <div className="flex items-center gap-2">
                                      <div className="w-6 h-6 bg-white/10 rounded flex items-center justify-center">
                                        <span className="text-xs">📧</span>
                                      </div>
                                      <span className="text-xs truncate">
                                        {employee.email}
                                      </span>
                                    </div>
                                  )}
                                  {employee.address && (
                                    <div className="flex items-start gap-2">
                                      <div className="w-6 h-6 bg-white/10 rounded flex items-center justify-center flex-shrink-0">
                                        <span className="text-xs">📍</span>
                                      </div>
                                      <span className="text-xs opacity-90 line-clamp-2">
                                        {employee.address}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Emergency Contact */}
                              {(employee.emergencyContactName ||
                                employee.emergencyContact) && (
                                <div className="border-t border-white/10 pt-4">
                                  <h4 className="text-sm font-bold mb-3 text-red-400">
                                    EMERGENCY CONTACT
                                  </h4>
                                  <div className="space-y-2 text-sm">
                                    {employee.emergencyContactName && (
                                      <div className="flex justify-between">
                                        <span className="opacity-75">
                                          Name:
                                        </span>
                                        <span className="font-semibold">
                                          {employee.emergencyContactName}
                                        </span>
                                      </div>
                                    )}
                                    {employee.emergencyContactRelation && (
                                      <div className="flex justify-between">
                                        <span className="opacity-75">
                                          Relation:
                                        </span>
                                        <span className="font-semibold">
                                          {employee.emergencyContactRelation}
                                        </span>
                                      </div>
                                    )}
                                    {employee.emergencyContact && (
                                      <div className="flex justify-between">
                                        <span className="opacity-75">
                                          Phone:
                                        </span>
                                        <span className="font-semibold">
                                          {employee.emergencyContact}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}

                              {/* Important Notes */}
                              <div className="border-t border-white/10 pt-4">
                                <h4 className="text-xs font-bold mb-2 text-yellow-400">
                                  IMPORTANT NOTES
                                </h4>
                                <ul className="text-xs opacity-75 space-y-1.5">
                                  <li>
                                    • This card is property of GKI Company
                                  </li>
                                  <li>• Must be displayed while on premises</li>
                                  <li>
                                    • Report immediately if lost or stolen
                                  </li>
                                  <li>• Non-transferable</li>
                                </ul>
                              </div>

                              {/* Footer */}
                              <div className="border-t border-white/10 pt-4 flex justify-between items-center">
                                <div className="text-xs opacity-50">
                                  Issued:{" "}
                                  {employee.dateOfJoining
                                    ? new Date(
                                        employee.dateOfJoining,
                                      ).toLocaleDateString()
                                    : new Date().toLocaleDateString()}
                                </div>
                                <div className="bg-white/10 px-3 py-1 rounded">
                                  <p className="text-xs font-mono">
                                    #GKI-{employee.employeeId}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Download Button */}
                        <Button
                          color="secondary"
                          size="lg"
                          className="w-full"
                          startContent={
                            <ArrowDownTrayIcon className="w-5 h-5" />
                          }
                        >
                          Download ID Card (Both Sides)
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <CheckBadgeIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                          Employee Not Verified
                        </h3>
                        <p className="text-gray-500 mb-4">
                          Please verify the employee to generate their ID card
                        </p>
                        <Button
                          color="success"
                          onPress={() => setShowVerifyModal(true)}
                        >
                          Verify Employee
                        </Button>
                      </div>
                    )}
                  </CardBody>
                </Card>
              </Tab>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Photo Upload Modal */}
      <Modal
        isOpen={showPhotoModal}
        onClose={() => setShowPhotoModal(false)}
        size="2xl"
      >
        <ModalContent>
          <ModalHeader>Update Photo</ModalHeader>
          <ModalBody>
            <Tabs selectedKey={photoMode} onSelectionChange={setPhotoMode}>
              <Tab key="upload" title="Upload Photo">
                <div className="py-6">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  <Button
                    color="secondary"
                    fullWidth
                    onPress={() => fileInputRef.current?.click()}
                  >
                    Choose File
                  </Button>
                </div>
              </Tab>
              <Tab key="camera" title="Take Photo">
                <div className="py-6">
                  <CameraCapture onCapture={handleCameraCapture} />
                </div>
              </Tab>
            </Tabs>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Document Upload Modal */}
      <Modal
        isOpen={showDocModal}
        onClose={() => setShowDocModal(false)}
        size="lg"
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            <h3 className="text-xl font-bold">Add Document</h3>
            <p className="text-sm text-gray-500 font-normal">
              Upload employee documents (PDF, Images)
            </p>
          </ModalHeader>
          <ModalBody>
            <Select
              label="Document Type"
              placeholder="Select document type"
              value={newDocType}
              onChange={(e) => setNewDocType(e.target.value)}
              variant="bordered"
              size="lg"
            >
              {documentTypes.map((doc) => (
                <SelectItem key={doc.value} value={doc.value}>
                  {doc.label}
                </SelectItem>
              ))}
            </Select>

            <div className="mt-2">
              <input
                type="file"
                ref={docFileInputRef}
                onChange={(e) => setNewDocFile(e.target.files[0])}
                accept="image/*,application/pdf"
                className="hidden"
              />
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-secondary transition-colors">
                <DocumentIcon className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                {newDocFile ? (
                  <div>
                    <p className="text-sm font-semibold text-gray-700">
                      {newDocFile.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {(newDocFile.size / 1024).toFixed(2)} KB
                    </p>
                    <Button
                      size="sm"
                      variant="flat"
                      color="secondary"
                      onPress={() => docFileInputRef.current?.click()}
                      className="mt-3"
                    >
                      Change File
                    </Button>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-gray-600 mb-3">
                      Click to browse or drag and drop
                    </p>
                    <Button
                      color="secondary"
                      variant="flat"
                      onPress={() => docFileInputRef.current?.click()}
                      startContent={<PlusIcon className="w-4 h-4" />}
                    >
                      Choose File
                    </Button>
                    <p className="text-xs text-gray-400 mt-2">
                      Supports: PDF, JPG, PNG (Max 10MB)
                    </p>
                  </div>
                )}
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="light"
              onPress={() => {
                setShowDocModal(false);
                setNewDocType("");
                setNewDocFile(null);
              }}
            >
              Cancel
            </Button>
            <Button
              color="secondary"
              onPress={handleDocumentUpload}
              isDisabled={!newDocType || !newDocFile}
            >
              Upload Document
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Document Viewer Modal */}
      <Modal
        isOpen={showDocViewer}
        onClose={() => setShowDocViewer(false)}
        size="5xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          <ModalHeader className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold">{viewingDoc?.typeName}</h3>
              <p className="text-sm text-gray-500 font-normal">
                {viewingDoc?.fileName}
              </p>
            </div>
          </ModalHeader>
          <ModalBody className="p-0">
            {viewingDoc && (
              <div className="w-full h-[600px] bg-gray-100 flex items-center justify-center">
                {viewingDoc.fileName?.toLowerCase().endsWith(".pdf") ? (
                  <iframe
                    src={viewingDoc.file}
                    className="w-full h-full"
                    title={viewingDoc.typeName}
                  />
                ) : (
                  <img
                    src={viewingDoc.file}
                    alt={viewingDoc.typeName}
                    className="max-w-full max-h-full object-contain"
                  />
                )}
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              variant="light"
              onPress={() => setShowDocViewer(false)}
              startContent={<XMarkIcon className="w-4 h-4" />}
            >
              Close
            </Button>
            <Button
              color="secondary"
              onPress={() => downloadDocument(viewingDoc)}
              startContent={<ArrowDownTrayIcon className="w-4 h-4" />}
            >
              Download
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Verification Modal */}
      <Modal isOpen={showVerifyModal} onClose={() => setShowVerifyModal(false)}>
        <ModalContent>
          <ModalHeader>Verify Employee</ModalHeader>
          <ModalBody>
            <p className="text-sm text-gray-600 mb-4">
              By verifying this employee, you confirm that all documents and
              information have been reviewed and are accurate.
            </p>
            <Textarea
              label="Verification Notes (Optional)"
              placeholder="Add any notes about the verification..."
              value={verificationNotes}
              onValueChange={setVerificationNotes}
            />
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={() => setShowVerifyModal(false)}>
              Cancel
            </Button>
            <Button color="success" onPress={handleVerify}>
              Verify Employee
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Government ID Modal */}
      <Modal
        isOpen={showGovIdModal}
        onClose={() => setShowGovIdModal(false)}
        size="2xl"
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            <h3 className="text-xl font-bold">Add Government ID</h3>
            <p className="text-sm text-gray-500 font-normal">
              Add official government identification with validation
            </p>
          </ModalHeader>
          <ModalBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="ID Type"
                placeholder="Select ID type"
                selectedKeys={newGovIdType ? [newGovIdType] : []}
                onSelectionChange={(keys) => {
                  const value = Array.from(keys)[0];
                  handleGovIdTypeChange(value);
                }}
                variant="bordered"
                size="lg"
                isRequired
              >
                {govIdTypesData.map((idType) => (
                  <SelectItem key={idType.key} value={idType.key}>
                    {idType.label}
                  </SelectItem>
                ))}
              </Select>

              <Input
                label="ID Number"
                placeholder={
                  newGovIdType
                    ? govIdTypesData.find((id) => id.key === newGovIdType)
                        ?.placeholder || "Enter ID number"
                    : "Select ID type first"
                }
                value={newGovIdNumber}
                onValueChange={handleGovIdNumberChange}
                variant="bordered"
                size="lg"
                isRequired
                isInvalid={!!govIdValidationError}
                errorMessage={govIdValidationError}
                maxLength={
                  newGovIdType
                    ? govIdTypesData.find((id) => id.key === newGovIdType)
                        ?.maxLength
                    : 50
                }
                description={
                  newGovIdType
                    ? `Format: ${govIdTypesData.find((id) => id.key === newGovIdType)?.placeholder}`
                    : ""
                }
              />
            </div>

            {newGovIdType && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Validation Rule:</span>{" "}
                  {
                    govIdTypesData.find((id) => id.key === newGovIdType)
                      ?.validationMessage
                  }
                </p>
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              variant="light"
              onPress={() => {
                setShowGovIdModal(false);
                setNewGovIdType("");
                setNewGovIdNumber("");
                setNewGovIdState("");
                setNewGovIdCountry("IN");
                setGovIdValidationError("");
              }}
            >
              Cancel
            </Button>
            <Button
              color="secondary"
              onPress={async () => {
                if (newGovIdType && newGovIdNumber) {
                  const validation = validateGovId(
                    newGovIdType,
                    newGovIdNumber,
                  );
                  if (!validation.isValid) {
                    setGovIdValidationError(validation.message);
                    return;
                  }

                  const stateLabel =
                    indianStatesData.find((s) => s.key === newGovIdState)
                      ?.label || newGovIdState;
                  const countryLabel =
                    countriesData.find((c) => c.key === newGovIdCountry)
                      ?.label || newGovIdCountry;

                  const newId = {
                    type:
                      govIdTypesData.find((id) => id.key === newGovIdType)
                        ?.label || newGovIdType,
                    number: newGovIdNumber,
                    state: stateLabel,
                    country: countryLabel,
                  };
                  const updatedIds = [...governmentIds, newId];
                  setGovernmentIds(updatedIds);
                  await updateEmployee({ governmentIds: updatedIds });
                  setShowGovIdModal(false);
                  setNewGovIdType("");
                  setNewGovIdNumber("");
                  setNewGovIdState("");
                  setNewGovIdCountry("IN");
                  setGovIdValidationError("");
                }
              }}
              isDisabled={
                !newGovIdType || !newGovIdNumber || !!govIdValidationError
              }
            >
              Add ID
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Family Member Modal */}
      <Modal
        isOpen={showFamilyModal}
        onClose={() => setShowFamilyModal(false)}
        size="2xl"
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            <h3 className="text-xl font-bold">Add Family Member</h3>
            <p className="text-sm text-gray-500 font-normal">
              Add family member details
            </p>
          </ModalHeader>
          <ModalBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Name"
                placeholder="Full name"
                value={newFamilyMember.name}
                onValueChange={(val) =>
                  setNewFamilyMember({ ...newFamilyMember, name: val })
                }
                variant="bordered"
                size="lg"
              />

              <Select
                label="Relationship"
                placeholder="Select relationship"
                value={newFamilyMember.relationship}
                onChange={(e) =>
                  setNewFamilyMember({
                    ...newFamilyMember,
                    relationship: e.target.value,
                  })
                }
                variant="bordered"
                size="lg"
              >
                <SelectItem key="Father" value="Father">
                  Father
                </SelectItem>
                <SelectItem key="Mother" value="Mother">
                  Mother
                </SelectItem>
                <SelectItem key="Spouse" value="Spouse">
                  Spouse
                </SelectItem>
                <SelectItem key="Son" value="Son">
                  Son
                </SelectItem>
                <SelectItem key="Daughter" value="Daughter">
                  Daughter
                </SelectItem>
                <SelectItem key="Brother" value="Brother">
                  Brother
                </SelectItem>
                <SelectItem key="Sister" value="Sister">
                  Sister
                </SelectItem>
                <SelectItem key="Other" value="Other">
                  Other
                </SelectItem>
              </Select>

              <Input
                label="Contact Number"
                placeholder="+91 XXXXX XXXXX"
                value={newFamilyMember.contact}
                onValueChange={(val) => {
                  const phoneRegex = /^[0-9]*$/;
                  if (phoneRegex.test(val) || val === "") {
                    setNewFamilyMember({ ...newFamilyMember, contact: val });
                  }
                }}
                variant="bordered"
                size="lg"
                maxLength={15}
              />
            </div>

            <div className="mt-4">
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Photo (Optional)
              </label>
              <input
                type="file"
                ref={familyPhotoInputRef}
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setNewFamilyMember({
                        ...newFamilyMember,
                        photo: reader.result,
                      });
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                className="hidden"
              />
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-secondary transition-colors">
                {newFamilyMember.photo ? (
                  <div className="flex flex-col items-center gap-3">
                    <Avatar src={newFamilyMember.photo} className="w-20 h-20" />
                    <Button
                      size="sm"
                      variant="flat"
                      color="secondary"
                      onPress={() => familyPhotoInputRef.current?.click()}
                    >
                      Change Photo
                    </Button>
                  </div>
                ) : (
                  <div>
                    <CameraIcon className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                    <p className="text-sm text-gray-600 mb-3">
                      Click to upload photo
                    </p>
                    <Button
                      color="secondary"
                      variant="flat"
                      onPress={() => familyPhotoInputRef.current?.click()}
                    >
                      Choose Photo
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="light"
              onPress={() => {
                setShowFamilyModal(false);
                setNewFamilyMember({
                  name: "",
                  relationship: "",
                  contact: "",
                  photo: "",
                });
              }}
            >
              Cancel
            </Button>
            <Button
              color="secondary"
              onPress={async () => {
                if (
                  newFamilyMember.name &&
                  newFamilyMember.relationship &&
                  newFamilyMember.contact
                ) {
                  const updatedMembers = [...familyMembers, newFamilyMember];
                  setFamilyMembers(updatedMembers);
                  await updateEmployee({ familyMembers: updatedMembers });
                  setShowFamilyModal(false);
                  setNewFamilyMember({
                    name: "",
                    relationship: "",
                    contact: "",
                    photo: "",
                  });
                }
              }}
              isDisabled={
                !newFamilyMember.name ||
                !newFamilyMember.relationship ||
                !newFamilyMember.contact
              }
            >
              Add Family Member
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
