"use client";
import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Chip,
  Tab,
  Tabs,
  Divider,
  Skeleton,
} from "@heroui/react";
import {
  PencilIcon,
  ArrowRightOnRectangleIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  UserIcon,
  TruckIcon,
  IdentificationIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/solid";

// Safely coerce any value (Set, null, string, array) to a plain array
const toArr = (val) => (Array.isArray(val) ? val : val ? Array.from(val) : []);

const statusColorMap = {
  inside: "success",
  exited: "default",
  unknown: "warning",
};

const typeColors = {
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

function InfoBlock({ label, value, className = "" }) {
  return (
    <div
      className={`bg-white p-3.5 rounded-xl border border-gray-100 shadow-sm ${className}`}
    >
      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">
        {label}
      </p>
      <p className="text-sm font-semibold text-gray-900 break-words">
        {value || "—"}
      </p>
    </div>
  );
}

function BadgeList({ items }) {
  const arr = toArr(items);
  if (!arr.length) return <span className="text-sm text-gray-400">None</span>;
  return (
    <div className="flex flex-wrap gap-1.5">
      {arr.map((item) => (
        <Chip
          key={item}
          size="sm"
          variant="flat"
          color="secondary"
          className="capitalize"
        >
          {item}
        </Chip>
      ))}
    </div>
  );
}

export default function VisitorDetailModal({
  visitor,
  isOpen,
  onClose,
  onEdit,
  onExit,
  onDelete,
}) {
  if (!visitor) return null;

  const isInside = visitor.status === "inside";

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl" scrollBehavior="inside">
      <ModalContent>
        <ModalHeader className="flex items-center gap-4 border-b pb-4 bg-gradient-to-r from-purple-50 to-white">
          <div className="relative">
            {visitor.photo ? (
              <img
                src={visitor.photo}
                alt={visitor.fullName}
                className="w-14 h-14 rounded-full object-cover border-2 border-purple-300 shadow"
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                {visitor.fullName?.charAt(0)?.toUpperCase() || "V"}
              </div>
            )}
            <div
              className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-white ${isInside ? "bg-green-500" : "bg-gray-400"}`}
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-bold text-gray-900 truncate">
                {visitor.fullName}
              </h2>
              <Chip
                size="sm"
                color={typeColors[visitor.visitorType] || "default"}
                variant="flat"
                className="capitalize font-semibold"
              >
                {visitor.visitorType}
              </Chip>
              <Chip
                size="sm"
                color={statusColorMap[visitor.status] || "default"}
                variant="dot"
                className="capitalize font-semibold"
              >
                {visitor.status}
              </Chip>
            </div>
            <p className="text-sm text-gray-500 mt-0.5">
              {visitor.company || "Individual"} · GP:{" "}
              {visitor.gatePassNumber || "N/A"}
            </p>
          </div>
        </ModalHeader>

        <ModalBody className="py-5">
          <Tabs
            color="secondary"
            variant="underlined"
            aria-label="Visitor details tabs"
          >
            {/* Personal Info */}
            <Tab
              key="personal"
              title={
                <span className="flex items-center gap-1.5">
                  <UserIcon className="w-4 h-4" />
                  Personal
                </span>
              }
            >
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-3">
                <InfoBlock label="Full Name" value={visitor.fullName} />
                <InfoBlock label="Phone" value={visitor.phone} />
                <InfoBlock
                  label="Alternate Phone"
                  value={visitor.alternatePhone}
                />
                <InfoBlock label="Email" value={visitor.email} />
                <InfoBlock label="Company" value={visitor.company} />
                <InfoBlock label="Designation" value={visitor.designation} />
                <InfoBlock label="Group Size" value={visitor.groupSize} />
                <InfoBlock label="City" value={visitor.city} />
                <InfoBlock label="State" value={visitor.state} />
                <InfoBlock
                  label="Address"
                  value={visitor.address}
                  className="md:col-span-3"
                />
              </div>
            </Tab>

            {/* Visit Details */}
            <Tab
              key="visit"
              title={
                <span className="flex items-center gap-1.5">📋 Visit</span>
              }
            >
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-3">
                <InfoBlock label="Purpose" value={visitor.purposeOfVisit} />
                <InfoBlock label="Meeting With" value={visitor.meetingWith} />
                <InfoBlock label="Location" value={visitor.visitLocation} />
                <InfoBlock
                  label="Expected Duration"
                  value={visitor.expectedDuration}
                />
                <InfoBlock
                  label="Check In"
                  value={
                    visitor.checkIn
                      ? new Date(visitor.checkIn).toLocaleString("en-IN")
                      : null
                  }
                />
                <InfoBlock
                  label="Check Out"
                  value={
                    visitor.checkOut
                      ? new Date(visitor.checkOut).toLocaleString("en-IN")
                      : "Still Inside"
                  }
                />
                <InfoBlock
                  label="Recurring"
                  value={
                    visitor.isRecurring
                      ? `Yes — ${visitor.recurringFrequency || ""}`
                      : "No"
                  }
                />
                <InfoBlock label="Visit Details" value={visitor.visitDetails} />
                <InfoBlock
                  label="Remarks"
                  value={visitor.remarks}
                  className="md:col-span-2"
                />
                {visitor.materialsCarriedOut && (
                  <InfoBlock
                    label="Materials Carried Out"
                    value={visitor.materialsCarriedOut}
                    className="md:col-span-3"
                  />
                )}
              </div>
            </Tab>

            {/* Security */}
            <Tab
              key="security"
              title={
                <span className="flex items-center gap-1.5">
                  <ShieldCheckIcon className="w-4 h-4" />
                  Security
                </span>
              }
            >
              <div className="space-y-4 pt-3">
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                    ID Proofs Provided
                  </p>
                  <BadgeList items={visitor.providedIDProofs} />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <InfoBlock label="ID Number" value={visitor.idNumber} />
                  <InfoBlock label="Gate Pass" value={visitor.gatePassNumber} />
                  <InfoBlock
                    label="Security Guard"
                    value={visitor.securityGuard}
                  />
                  <InfoBlock
                    label="Vehicle"
                    value={
                      visitor.hasVehicle
                        ? `${visitor.vehicleType} — ${visitor.vehicleNumber}`
                        : "None"
                    }
                  />
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                    Materials Carried In
                  </p>
                  <BadgeList items={visitor.materialsCarriedIn} />
                </div>
                <div className="flex gap-4">
                  <div
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg ${visitor.safetyBriefingGiven ? "bg-green-50 text-green-700" : "bg-gray-50 text-gray-500"}`}
                  >
                    {visitor.safetyBriefingGiven ? (
                      <CheckCircleIcon className="w-4 h-4" />
                    ) : (
                      <XCircleIcon className="w-4 h-4" />
                    )}
                    <span className="text-sm font-medium">Safety Briefing</span>
                  </div>
                  <div
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg ${visitor.ndaSigned ? "bg-green-50 text-green-700" : "bg-gray-50 text-gray-500"}`}
                  >
                    {visitor.ndaSigned ? (
                      <CheckCircleIcon className="w-4 h-4" />
                    ) : (
                      <XCircleIcon className="w-4 h-4" />
                    )}
                    <span className="text-sm font-medium">NDA Signed</span>
                  </div>
                </div>

                {/* Attachments */}
                {visitor.attachments?.length > 0 && (
                  <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                      Attachments ({visitor.attachments.length})
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {visitor.attachments.map((att, i) => (
                        <a
                          key={i}
                          href={att.base64}
                          download={att.name}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 border border-purple-200 rounded-lg text-xs text-purple-700 font-medium hover:bg-purple-100 transition"
                        >
                          📎 {att.name}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Tab>

            {/* Signatures */}
            <Tab key="signatures" title="✍️ Signatures">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-3">
                {[
                  { label: "Visitor Signature", sig: visitor.visitorSignature },
                  {
                    label: "Security Officer Signature",
                    sig: visitor.securitySignature,
                  },
                  { label: "Exit Signature", sig: visitor.exitSignature },
                ]
                  .filter((s) => s.sig)
                  .map(({ label, sig }) => (
                    <div
                      key={label}
                      className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm"
                    >
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                        {label}
                      </p>
                      <img
                        src={sig}
                        alt={label}
                        className="max-h-32 border border-gray-200 rounded-lg"
                      />
                    </div>
                  ))}
                {!visitor.visitorSignature &&
                  !visitor.securitySignature &&
                  !visitor.exitSignature && (
                    <p className="text-sm text-gray-400 col-span-2">
                      No signatures recorded.
                    </p>
                  )}
              </div>
            </Tab>

          </Tabs>
        </ModalBody>

        <ModalFooter className="border-t pt-4 flex flex-wrap gap-2">
          <Button variant="flat" onPress={onClose} className="mr-auto">
            Close
          </Button>
          {isInside && (
            <Button
              color="warning"
              variant="flat"
              startContent={<ArrowRightOnRectangleIcon className="w-4 h-4" />}
              onPress={() => {
                onClose();
                onExit(visitor);
              }}
            >
              Mark Exit
            </Button>
          )}
          <Button
            color="secondary"
            variant="flat"
            startContent={<PencilIcon className="w-4 h-4" />}
            onPress={() => {
              onClose();
              onEdit(visitor);
            }}
          >
            Edit
          </Button>
          <Button
            color="danger"
            variant="flat"
            startContent={<TrashIcon className="w-4 h-4" />}
            onPress={() => {
              onClose();
              onDelete(visitor);
            }}
          >
            Delete
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
