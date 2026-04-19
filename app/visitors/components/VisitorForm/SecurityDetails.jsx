import MultiFileUploader from "./ui/MultiFileUploader";
import CheckBox from "./ui/CheckBox";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/react";
import { IdentificationIcon, TruckIcon } from "@heroicons/react/16/solid";
import { CubeTransparentIcon } from "@heroicons/react/24/solid";

export default function SecurityDetails({ formData, setFiles, files }) {
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
  const materialsCarriedIn = [
    { key: "tools", label: "Tools" },
    { key: "rawMaterials", label: "Raw Materials" },
    { key: "spareParts", label: "Spare Parts" },
    { key: "documents", label: "Documents" },
    { key: "samples", label: "Product Samples" },
    { key: "packagingMaterial", label: "Packaging Material" },
    { key: "machinery", label: "Machinery / Equipment" },
    { key: "electricalItems", label: "Electrical Items" },
    { key: "personalItems", label: "Personal Items" },
    { key: "other", label: "Other" },
  ];
  return (
    <div>
      <p className="font-black uppercase px-10 py-3 text-xl mb-5 rounded-xl">
        Security & Compliance
      </p>
      <CheckBox formData={formData} />
      <div className="grid grid-cols-3 gap-3">
        <Input
          className="w-full"
          name="vehicalNumber"
          defaultValue={formData?.vehicalNumber}
          label="Vehicle Number"
          color="secondary"
          startContent={<IdentificationIcon className="w-5" />}
          type="text"
          variant="flat"
        />
        <Select
          className="w-full"
          items={vehicleTypes}
          label="Vehicle Types"
          startContent={<TruckIcon className="w-5" />}
          color="secondary"
          defaultSelectedKeys={[formData?.vehicalType]}
          name="vehicalType"
        >
          {(vehicleType) => <SelectItem>{vehicleType.label}</SelectItem>}
        </Select>
        <Select
          className="w-full"
          items={materialsCarriedIn}
          label="Materials Carried In"
          color="secondary"
          selectionMode="multiple"
          startContent={<CubeTransparentIcon className="w-5" />}
          defaultSelectedKeys={[formData?.materialsCarriedIn]}
          name="materialsCarriedIn"
        >
          {(materialsCarriedIn) => (
            <SelectItem>{materialsCarriedIn.label}</SelectItem>
          )}
        </Select>
      </div>

      <MultiFileUploader
        formData={formData}
        setFiles={setFiles}
        files={files}
      />
    </div>
  );
}
