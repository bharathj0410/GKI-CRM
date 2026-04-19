"use client";
import React from "react";
import { Checkbox, Chip, Divider } from "@heroui/react";
import SignaturePadWidget from "../ui/SignaturePad";

// HeroUI CheckboxGroup.onValueChange can return a Set or an array — normalize both
const toArr = (val) => (Array.isArray(val) ? val : val ? Array.from(val) : []);

const purposeLabels = {
  materialDelivery: "Material Delivery",
  goodsPickup: "Finished Goods Pickup",
  salesMeeting: "Sales Meeting",
  purchaseMeeting: "Purchase Meeting",
  qualityInspection: "Quality Inspection",
  regulatoryInspection: "Regulatory Inspection",
  technicalSupport: "Technical Support",
  machineInstallation: "Machine Installation",
  training: "Training Session",
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

const locationLabels = {
  securityRoom: "Security Room",
  office: "Office",
  lab: "Lab",
  storeRoom: "Store Room",
  boilers: "Boilers",
  machines: "Machine Floor",
  electricalRoom: "Electrical Room",
  generators: "Generators",
  wasteLoadingUnit: "Waste Loading Unit",
  other: "Other",
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

function InfoRow({ label, value }) {
  if (!value && value !== 0) return null;
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
        {label}
      </span>
      <span className="text-sm font-medium text-gray-900">{value}</span>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-bold text-purple-700 uppercase tracking-widest">
        {title}
      </p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-3">
        {children}
      </div>
    </div>
  );
}

export default function ConfirmationStep({
  step1Data,
  photo,
  visitData,
  securityData,
  visitorSignature,
  setVisitorSignature,
  securitySignature,
  setSecuritySignature,
  agreedToTerms,
  setAgreedToTerms,
}) {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-gray-900 pb-2 border-b border-gray-100">
        Review & Confirm
      </h2>

      {/* Summary Card */}
      <div className="bg-gray-50 rounded-xl border border-gray-200 p-5 space-y-5">
        {/* Profile header */}
        <div className="flex items-center gap-4">
          {photo ? (
            <img
              src={photo}
              alt="visitor"
              className="w-16 h-16 rounded-full object-cover border-2 border-purple-300 shadow"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white text-2xl font-bold shadow">
              {step1Data.fullName?.charAt(0)?.toUpperCase() || "V"}
            </div>
          )}
          <div>
            <p className="text-xl font-bold text-gray-900">
              {step1Data.fullName || "—"}
            </p>
            <div className="flex items-center gap-2 mt-1">
              {step1Data.visitorType && (
                <Chip
                  size="sm"
                  color={typeColors[step1Data.visitorType] || "default"}
                  variant="flat"
                  className="capitalize font-semibold"
                >
                  {step1Data.visitorType}
                </Chip>
              )}
              <span className="text-sm text-gray-500">
                {step1Data.company || ""}
              </span>
            </div>
          </div>
        </div>

        <Divider />

        <Section title="Personal Information">
          <InfoRow label="Phone" value={step1Data.phone} />
          <InfoRow label="Alt. Phone" value={step1Data.alternatePhone} />
          <InfoRow label="Email" value={step1Data.email} />
          <InfoRow label="Designation" value={step1Data.designation} />
          <InfoRow label="Group Size" value={step1Data.groupSize} />
          <InfoRow
            label="City / State"
            value={[step1Data.city, step1Data.state].filter(Boolean).join(", ")}
          />
        </Section>

        <Divider />

        <Section title="Visit Details">
          <InfoRow
            label="Purpose"
            value={
              purposeLabels[visitData.purposeOfVisit] ||
              visitData.purposeOfVisit
            }
          />
          <InfoRow label="Meeting With" value={visitData.meetingWith} />
          <InfoRow
            label="Location"
            value={
              locationLabels[visitData.visitLocation] || visitData.visitLocation
            }
          />
          <InfoRow label="Duration" value={visitData.expectedDuration} />
          <InfoRow
            label="Recurring"
            value={
              visitData.isRecurring
                ? `Yes — ${visitData.recurringFrequency || ""}`
                : "No"
            }
          />
        </Section>

        <Divider />

        <Section title="Security & Compliance">
          <InfoRow
            label="ID Proofs"
            value={toArr(securityData.providedIDProofs).join(", ") || "None"}
          />
          <InfoRow
            label="Vehicle"
            value={
              securityData.hasVehicle
                ? `${securityData.vehicleType} — ${securityData.vehicleNumber}`
                : "None"
            }
          />
          <InfoRow
            label="Materials"
            value={toArr(securityData.materialsCarriedIn).join(", ") || "None"}
          />
          <InfoRow label="Gate Pass" value={securityData.gatePassNumber} />
          <InfoRow label="Guard" value={securityData.securityGuard} />
          <div className="flex items-center gap-3">
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded-full ${securityData.safetyBriefingGiven ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}
            >
              Safety:{" "}
              {securityData.safetyBriefingGiven ? "✓ Given" : "✗ Not given"}
            </span>
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded-full ${securityData.ndaSigned ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}
            >
              NDA: {securityData.ndaSigned ? "✓ Signed" : "✗ Not signed"}
            </span>
          </div>
        </Section>
      </div>

      {/* Signatures */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SignaturePadWidget
          title="Visitor Signature"
          onSave={setVisitorSignature}
          value={visitorSignature}
        />
        <SignaturePadWidget
          title="Security Officer Signature"
          onSave={setSecuritySignature}
          value={securitySignature}
        />
      </div>

      {/* Terms */}
      <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
        <Checkbox
          color="secondary"
          isSelected={agreedToTerms}
          onValueChange={setAgreedToTerms}
        >
          <span className="text-sm font-medium text-gray-800">
            I confirm that all provided information is accurate and I agree to
            the factory visitor terms and conditions.
          </span>
        </Checkbox>
      </div>
    </div>
  );
}
