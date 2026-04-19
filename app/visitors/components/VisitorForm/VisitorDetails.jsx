import React, { useState } from "react";
import { I18nProvider } from "@react-aria/i18n";
import {
  getLocalTimeZone,
  now,
  parseDate,
  parseDateTime,
} from "@internationalized/date";
import { DatePicker, Input, Select, SelectItem } from "@heroui/react";
import { IdentificationIcon } from "@heroicons/react/24/solid";
import {
  BuildingOffice2Icon,
  CubeIcon,
  DocumentTextIcon,
} from "@heroicons/react/16/solid";

export default function VisitorDetails({ formData }) {
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
    { key: "documentation", label: "Documentation / Paperwork Submission" },
    { key: "eventMedia", label: "Event / Media Coverage" },
    { key: "personalVisit", label: "Personal Visit" },
    { key: "other", label: "Other" },
  ];
  const visitLocations = [
    { key: "securityRoom", label: "Security Room" },
    { key: "office", label: "Office" },
    { key: "lab", label: "Lab" },
    { key: "storeRoom", label: "Store Room" },
    { key: "boilers", label: "Boilers" },
    { key: "machines", label: "Machines" },
    { key: "electricalRoom", label: "Electrical Room" },
    { key: "generators", label: "Generators" },
    { key: "wasteLoadingUnit", label: "Waste Loading Unit" },
    { key: "other", label: "Other" },
  ];

  function zonedToCalendarDateTime(zonedString) {
    const cleanString = zonedString.replace(/\[.*\]/, "");
    const dateObj = new Date(cleanString);
    const formatted = dateObj.toISOString().slice(0, 16);
    return parseDateTime(formatted);
  }
  const [visitorType, setVisitorType] = useState();

  return (
    <div>
      <p className="font-black uppercase px-10 py-3 text-xl mb-5 rounded-xl">
        Visit Details
      </p>
      <div className="grid grid-cols-3 gap-3">
        <I18nProvider locale="en-GB">
          <DatePicker
            granularity="minute"
            hourCycle={12}
            hideTimeZone
            showMonthAndYearPickers
            defaultValue={
              formData?.checkIn
                ? zonedToCalendarDateTime(formData?.checkIn)
                : now(getLocalTimeZone())
            }
            name="checkIn"
            label="Date and Time of Visit"
            color="secondary"
            variant="flat"
          />
        </I18nProvider>
        <Select
          className="w-full"
          items={purposesOfVisit}
          label="Purpose of Visit"
          color="secondary"
          name="purposesOfVisit"
          defaultSelectedKeys={[formData?.purposesOfVisit]}
          onSelectionChange={setVisitorType}
          startContent={<CubeIcon className="w-5" />}
        >
          {(purposesOfVisit) => (
            <SelectItem>{purposesOfVisit.label}</SelectItem>
          )}
        </Select>
        {visitorType?.currentKey === "other" && (
          <Input
            className="w-full"
            name="visitDetails"
            defaultValue={formData?.visitDetails}
            label="Visit Details"
            startContent={<DocumentTextIcon className="w-5" />}
            color="secondary"
            type="text"
            variant="flat"
          />
        )}
        <Input
          className="w-full"
          name="meetingWith"
          defaultValue={formData?.meetingWith}
          label="Meeting With"
          startContent={<IdentificationIcon className="w-5" />}
          color="secondary"
          type="text"
          variant="flat"
        />
        <Select
          items={visitLocations}
          name="visitLocationOrDepartment"
          label="Visit Location / Department"
          startContent={<BuildingOffice2Icon className="w-5" />}
          color="secondary"
        >
          {(visitLocations) => <SelectItem>{visitLocations.label}</SelectItem>}
        </Select>
      </div>
    </div>
  );
}
