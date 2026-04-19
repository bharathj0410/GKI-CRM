"use client";
import React, { useState } from "react";
import { Input, Select, SelectItem, Textarea, Switch } from "@heroui/react";
import { I18nProvider } from "@react-aria/i18n";
import { getLocalTimeZone, now, parseDateTime } from "@internationalized/date";
import { DatePicker } from "@heroui/react";
import {
  CubeIcon,
  IdentificationIcon,
  BuildingOffice2Icon,
  ClockIcon,
  DocumentTextIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/solid";

const purposesOfVisit = [
  { key: "materialDelivery", label: "Material Delivery" },
  { key: "goodsPickup", label: "Finished Goods Pickup" },
  { key: "salesMeeting", label: "Sales Meeting" },
  { key: "purchaseMeeting", label: "Purchase Meeting" },
  { key: "qualityInspection", label: "Quality Inspection" },
  { key: "regulatoryInspection", label: "Regulatory Inspection" },
  { key: "technicalSupport", label: "Technical Support / Maintenance" },
  { key: "machineInstallation", label: "Machine Installation / Repair" },
  { key: "training", label: "Training Session" },
  { key: "jobInterview", label: "Job Interview" },
  { key: "consultation", label: "Consultation" },
  { key: "factoryTour", label: "Factory Tour" },
  { key: "safetyAudit", label: "Safety Audit" },
  { key: "internalMeeting", label: "Internal Meeting" },
  { key: "documentation", label: "Documentation / Paperwork" },
  { key: "eventMedia", label: "Event / Media Coverage" },
  { key: "personalVisit", label: "Personal Visit" },
  { key: "other", label: "Other" },
];

const visitLocations = [
  { key: "securityRoom", label: "Security Room" },
  { key: "office", label: "Office" },
  { key: "lab", label: "Lab / Testing Room" },
  { key: "storeRoom", label: "Store Room" },
  { key: "boilers", label: "Boiler Room" },
  { key: "machines", label: "Machine Floor" },
  { key: "electricalRoom", label: "Electrical Room" },
  { key: "generators", label: "Generator Room" },
  { key: "wasteLoadingUnit", label: "Waste Loading Unit" },
  { key: "other", label: "Other" },
];

const durations = [
  { key: "30min", label: "30 Minutes" },
  { key: "1hr", label: "1 Hour" },
  { key: "2hr", label: "2 Hours" },
  { key: "4hr", label: "4 Hours" },
  { key: "halfDay", label: "Half Day" },
  { key: "fullDay", label: "Full Day" },
];

const frequencies = [
  { key: "daily", label: "Daily" },
  { key: "weekly", label: "Weekly" },
  { key: "monthly", label: "Monthly" },
];

function zonedToCalendarDateTime(str) {
  try {
    const clean = str.replace(/\[.*\]/, "");
    const formatted = new Date(clean).toISOString().slice(0, 16);
    return parseDateTime(formatted);
  } catch {
    return now(getLocalTimeZone());
  }
}

export default function VisitDetails({ data, onChange }) {
  const set = (key, val) => onChange((prev) => ({ ...prev, [key]: val }));

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-gray-900 pb-2 border-b border-gray-100">
        Visit Details
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <I18nProvider locale="en-IN">
          <DatePicker
            granularity="minute"
            hourCycle={12}
            hideTimeZone
            showMonthAndYearPickers
            defaultValue={data.checkIn || now(getLocalTimeZone())}
            onChange={(val) => set("checkIn", val)}
            label="Check-In Date & Time"
            color="secondary"
            variant="flat"
          />
        </I18nProvider>

        <Select
          items={purposesOfVisit}
          label="Purpose of Visit"
          placeholder="Select purpose"
          color="secondary"
          variant="flat"
          isRequired
          selectedKeys={
            data.purposeOfVisit ? new Set([data.purposeOfVisit]) : new Set()
          }
          onSelectionChange={(keys) =>
            set("purposeOfVisit", Array.from(keys)[0] || "")
          }
          startContent={<CubeIcon className="w-4 h-4 text-gray-400" />}
        >
          {(item) => <SelectItem key={item.key}>{item.label}</SelectItem>}
        </Select>

        {data.purposeOfVisit === "other" && (
          <Input
            label="Visit Details"
            placeholder="Describe the visit"
            color="secondary"
            variant="flat"
            value={data.visitDetails}
            onValueChange={(v) => set("visitDetails", v)}
            startContent={
              <DocumentTextIcon className="w-4 h-4 text-gray-400" />
            }
          />
        )}

        <Input
          label="Meeting With"
          placeholder="Person or department"
          color="secondary"
          variant="flat"
          value={data.meetingWith}
          onValueChange={(v) => set("meetingWith", v)}
          startContent={
            <IdentificationIcon className="w-4 h-4 text-gray-400" />
          }
        />

        <Select
          items={visitLocations}
          label="Visit Location / Department"
          placeholder="Select location"
          color="secondary"
          variant="flat"
          selectedKeys={
            data.visitLocation ? new Set([data.visitLocation]) : new Set()
          }
          onSelectionChange={(keys) =>
            set("visitLocation", Array.from(keys)[0] || "")
          }
          startContent={
            <BuildingOffice2Icon className="w-4 h-4 text-gray-400" />
          }
        >
          {(item) => <SelectItem key={item.key}>{item.label}</SelectItem>}
        </Select>

        <Select
          items={durations}
          label="Expected Duration"
          placeholder="Select duration"
          color="secondary"
          variant="flat"
          selectedKeys={
            data.expectedDuration ? new Set([data.expectedDuration]) : new Set()
          }
          onSelectionChange={(keys) =>
            set("expectedDuration", Array.from(keys)[0] || "")
          }
          startContent={<ClockIcon className="w-4 h-4 text-gray-400" />}
        >
          {(item) => <SelectItem key={item.key}>{item.label}</SelectItem>}
        </Select>
      </div>

      <Textarea
        label="Special Instructions / Remarks"
        placeholder="Any special instructions or remarks..."
        color="secondary"
        variant="flat"
        value={data.remarks}
        onValueChange={(v) => set("remarks", v)}
        minRows={2}
      />

      <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-xl border border-purple-100">
        <ArrowPathIcon className="w-5 h-5 text-purple-600 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-800">
            Recurring Visit?
          </p>
          <p className="text-xs text-gray-500">
            Enable if this visitor comes regularly
          </p>
        </div>
        <Switch
          color="secondary"
          isSelected={data.isRecurring}
          onValueChange={(v) => set("isRecurring", v)}
        />
        {data.isRecurring && (
          <Select
            items={frequencies}
            label="Frequency"
            placeholder="Select"
            color="secondary"
            variant="flat"
            className="w-36"
            selectedKeys={
              data.recurringFrequency
                ? new Set([data.recurringFrequency])
                : new Set()
            }
            onSelectionChange={(keys) =>
              set("recurringFrequency", Array.from(keys)[0] || "")
            }
          >
            {(item) => <SelectItem key={item.key}>{item.label}</SelectItem>}
          </Select>
        )}
      </div>
    </div>
  );
}
