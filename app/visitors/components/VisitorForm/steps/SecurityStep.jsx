"use client";
import React from "react";
import {
  Input,
  Select,
  SelectItem,
  Switch,
  Checkbox,
  CheckboxGroup,
} from "@heroui/react";
import {
  IdentificationIcon,
  TruckIcon,
  ShieldCheckIcon,
  PaperClipIcon,
  KeyIcon,
} from "@heroicons/react/24/solid";
import MultiFileUploader from "../ui/MultiFileUploader";

// HeroUI CheckboxGroup may pass a Set or array — always normalize to plain array
const toArr = (val) => (Array.isArray(val) ? val : val ? Array.from(val) : []);

const idProofOptions = [
  { value: "aadhar", label: "Aadhar Card" },
  { value: "drivingLicense", label: "Driving License" },
  { value: "passport", label: "Passport" },
  { value: "companyId", label: "Company ID" },
  { value: "voterId", label: "Voter ID" },
  { value: "panCard", label: "PAN Card" },
  { value: "rationCard", label: "Ration Card" },
  { value: "governmentId", label: "Govt. Employee ID" },
  { value: "studentId", label: "Student ID" },
  { value: "militaryId", label: "Military / Defence ID" },
  { value: "workPermit", label: "Work Permit" },
  { value: "other", label: "Other" },
];

const vehicleTypes = [
  { key: "car", label: "Car" },
  { key: "bike", label: "Motorbike / Scooter" },
  { key: "truck", label: "Truck / Lorry" },
  { key: "tempo", label: "Tempo / Mini Truck" },
  { key: "van", label: "Van" },
  { key: "tractor", label: "Tractor" },
  { key: "bicycle", label: "Bicycle" },
  { key: "bus", label: "Bus" },
  { key: "auto", label: "Auto Rickshaw" },
  { key: "other", label: "Other" },
];

const materialsOptions = [
  { value: "tools", label: "Tools" },
  { value: "rawMaterials", label: "Raw Materials" },
  { value: "spareParts", label: "Spare Parts" },
  { value: "documents", label: "Documents" },
  { value: "samples", label: "Product Samples" },
  { value: "packagingMaterial", label: "Packaging Material" },
  { value: "machinery", label: "Machinery / Equipment" },
  { value: "electricalItems", label: "Electrical Items" },
  { value: "personalItems", label: "Personal Items" },
  { value: "other", label: "Other" },
];

export default function SecurityStep({ data, onChange }) {
  const set = (key, val) => onChange((prev) => ({ ...prev, [key]: val }));

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-gray-900 pb-2 border-b border-gray-100">
        Security &amp; Compliance
      </h2>

      {/* ID Proofs */}
      <div>
        <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <IdentificationIcon className="w-4 h-4 text-purple-600" /> Provided ID
          Proofs
        </p>
        <div className="p-4 bg-secondary-50 rounded-xl border border-secondary-100">
          <CheckboxGroup
            orientation="horizontal"
            value={toArr(data.providedIDProofs)}
            onValueChange={(v) => set("providedIDProofs", toArr(v))}
            classNames={{ wrapper: "gap-2 flex-wrap" }}
          >
            {idProofOptions.map((opt) => (
              <Checkbox
                key={opt.value}
                value={opt.value}
                color="secondary"
                classNames={{
                  base: "border border-secondary-200 rounded-lg px-3 py-1.5 bg-white data-[selected=true]:bg-secondary-100 data-[selected=true]:border-secondary-400 cursor-pointer m-0",
                  label: "text-sm font-medium",
                }}
              >
                {opt.label}
              </Checkbox>
            ))}
          </CheckboxGroup>
        </div>
      </div>

      <Input
        label="ID Number"
        placeholder="Enter ID number (optional)"
        color="secondary"
        variant="flat"
        value={data.idNumber}
        onValueChange={(v) => set("idNumber", v)}
        startContent={<KeyIcon className="w-4 h-4 text-gray-400" />}
        className="max-w-sm"
      />

      {/* Vehicle */}
      <div className="p-4 bg-orange-50 rounded-xl border border-orange-100 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TruckIcon className="w-5 h-5 text-orange-600" />
            <div>
              <p className="text-sm font-semibold text-gray-800">
                Has Vehicle?
              </p>
              <p className="text-xs text-gray-500">
                Visitor arrived with a vehicle
              </p>
            </div>
          </div>
          <Switch
            color="warning"
            isSelected={data.hasVehicle}
            onValueChange={(v) => set("hasVehicle", v)}
          />
        </div>
        {data.hasVehicle && (
          <div className="grid grid-cols-2 gap-4 pt-2">
            <Input
              label="Vehicle Number"
              placeholder="e.g. MH 12 AB 1234"
              color="secondary"
              variant="flat"
              value={data.vehicleNumber}
              onValueChange={(v) => set("vehicleNumber", v)}
              startContent={
                <IdentificationIcon className="w-4 h-4 text-gray-400" />
              }
            />
            <Select
              items={vehicleTypes}
              label="Vehicle Type"
              placeholder="Select type"
              color="secondary"
              variant="flat"
              selectedKeys={
                data.vehicleType ? new Set([data.vehicleType]) : new Set()
              }
              onSelectionChange={(keys) =>
                set("vehicleType", Array.from(keys)[0] || "")
              }
              startContent={<TruckIcon className="w-4 h-4 text-gray-400" />}
            >
              {(item) => <SelectItem key={item.key}>{item.label}</SelectItem>}
            </Select>
          </div>
        )}
      </div>

      {/* Materials */}
      <div>
        <p className="text-sm font-semibold text-gray-700 mb-3">
          Materials Carried In
        </p>
        <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
          <CheckboxGroup
            orientation="horizontal"
            value={toArr(data.materialsCarriedIn)}
            onValueChange={(v) => set("materialsCarriedIn", toArr(v))}
            classNames={{ wrapper: "gap-2 flex-wrap" }}
          >
            {materialsOptions.map((opt) => (
              <Checkbox
                key={opt.value}
                value={opt.value}
                color="primary"
                classNames={{
                  base: "border border-blue-200 rounded-lg px-3 py-1.5 bg-white data-[selected=true]:bg-blue-100 data-[selected=true]:border-blue-400 cursor-pointer m-0",
                  label: "text-sm font-medium",
                }}
              >
                {opt.label}
              </Checkbox>
            ))}
          </CheckboxGroup>
        </div>
      </div>

      {/* Compliance */}
      <div className="p-4 bg-green-50 rounded-xl border border-green-100">
        <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <ShieldCheckIcon className="w-4 h-4 text-green-600" /> Compliance
          Checklist
        </p>
        <div className="flex flex-col gap-3">
          <Checkbox
            color="success"
            isSelected={data.safetyBriefingGiven}
            onValueChange={(v) => set("safetyBriefingGiven", v)}
          >
            <span className="text-sm font-medium">Safety Briefing Given</span>
          </Checkbox>
          <Checkbox
            color="success"
            isSelected={data.ndaSigned}
            onValueChange={(v) => set("ndaSigned", v)}
          >
            <span className="text-sm font-medium">
              NDA / Confidentiality Agreement Signed
            </span>
          </Checkbox>
        </div>
      </div>

      {/* Gate Pass & Guard */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Gate Pass Number"
          placeholder="Auto-generated or manual"
          color="secondary"
          variant="flat"
          value={data.gatePassNumber}
          onValueChange={(v) => set("gatePassNumber", v)}
          startContent={<PaperClipIcon className="w-4 h-4 text-gray-400" />}
        />
        <Input
          label="Security Guard Name / Badge ID"
          placeholder="Guard name or badge"
          color="secondary"
          variant="flat"
          value={data.securityGuard}
          onValueChange={(v) => set("securityGuard", v)}
          startContent={<ShieldCheckIcon className="w-4 h-4 text-gray-400" />}
        />
      </div>

      {/* File Uploader */}
      <div>
        <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
          <PaperClipIcon className="w-4 h-4 text-purple-600" /> Upload
          Attachments
        </p>
        <MultiFileUploader
          formData={{ attachments: data.attachments }}
          files={data.attachments}
          setFiles={(files) =>
            set(
              "attachments",
              typeof files === "function" ? files(data.attachments) : files,
            )
          }
        />
      </div>
    </div>
  );
}
