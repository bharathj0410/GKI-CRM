import React, { useRef, useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  Input,
  Form,
  Switch,
} from "@heroui/react";
import {
  BuildingOffice2Icon,
  CubeTransparentIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  PhotoIcon,
  BuildingStorefrontIcon,
} from "@heroicons/react/24/outline";
import { TrashIcon } from "@heroicons/react/24/solid";
import axios from "@/lib/axios";
import Toast from "../Toast";

export default function EditGuestModal({ isOpen, onClose, data, onUpdate }) {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(data?.logo || null);
  const [same, setSame] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (data?.logo) {
      setImagePreview(data.logo);
    }
  }, [data]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const formElement = e.currentTarget;
    const formData = Object.fromEntries(new FormData(e.currentTarget));

    // If billing address same as address checkbox is checked, copy address fields to billing fields
    if (same) {
      formData.billing_address_line = formData.address_line;
      formData.billing_city = formData.address_city;
      formData.billing_state = formData.address_state;
      formData.billing_zip_code = formData.address_zip_code;
      formData.billing_country = formData.address_country;
    }

    if (image) {
      const base64 = await convertToBase64(image);
      formData["logo"] = base64;
    } else if (imagePreview) {
      formData["logo"] = imagePreview;
    }

    // Add the ID for updating
    formData.id = data.id;

    try {
      const response = await axios.post("/addGuestData", formData);
      if (response.status === 200) {
        Toast("Updated", "Guest information updated successfully", "success");
        onUpdate();
        onClose();
      } else {
        Toast("Error", response?.data?.error || "Failed to update", "danger");
      }
    } catch (error) {
      Toast(
        "Error",
        error?.response?.data?.error || "Failed to update",
        "danger",
      );
      console.error(error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="5xl"
      scrollBehavior="inside"
      classNames={{
        wrapper: "items-center p-4",
        base: "m-0 sm:m-4 max-h-[calc(100vh-2rem)]",
      }}
    >
      <ModalContent className="flex flex-col h-full max-h-[calc(100vh-2rem)]">
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 border-b border-gray-200 dark:border-gray-700 flex-shrink-0 py-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Edit Guest Information
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Update guest details and billing information
              </p>
            </ModalHeader>
            <ModalBody className="py-6 overflow-y-auto flex-1 min-h-0">
              <Form className="w-full flex flex-col gap-6" onSubmit={onSubmit}>
                <div className="grid grid-cols-4 w-full gap-4">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    className="hidden"
                  />

                  {/* Logo Upload Section */}
                  <div className="flex relative row-span-3">
                    {(image || imagePreview) && (
                      <div
                        role="button"
                        onClick={() => {
                          setImage(null);
                          setImagePreview(null);
                          if (fileInputRef.current)
                            fileInputRef.current.value = null;
                        }}
                        className="absolute top-0 right-0 z-20"
                      >
                        <TrashIcon className="w-6 text-red-600" />
                      </div>
                    )}
                    <div
                      role="button"
                      onClick={handleButtonClick}
                      className="w-full"
                    >
                      <div className="w-full">
                        {image || imagePreview ? (
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="h-[15rem] w-[15rem] object-cover z-10 relative rounded-full"
                          />
                        ) : (
                          <div className="bg-zinc-100 dark:bg-gray-800 h-[15rem] w-[15rem] flex flex-col items-center justify-center rounded-full text-zinc-500">
                            <PhotoIcon className="w-10" />
                            <p className="text-xs font-bold">Upload Logo</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Company Name */}
                  <div className="w-full col-span-3">
                    <p className="block text-sm font-medium text-gray-700 dark:text-gray-300 p-1">
                      Company Name / Person Name
                    </p>
                    <div className="relative mt-1 flex items-center justify-center gap-2">
                      <BuildingOffice2Icon className="h-8 text-gray-400" />
                      <Input
                        type="text"
                        name="company/person_name"
                        className="w-full"
                        placeholder="e.g., Acme Corp"
                        color="secondary"
                        variant="flat"
                        defaultValue={data?.["company/person_name"]}
                      />
                    </div>
                  </div>

                  {/* Company Type */}
                  <div className="w-full col-span-3">
                    <p className="block text-sm font-medium text-gray-700 dark:text-gray-300 p-1">
                      Company Type
                    </p>
                    <div className="relative mt-1 flex items-center justify-center gap-2">
                      <CubeTransparentIcon className="h-8 text-gray-400" />
                      <Input
                        type="text"
                        name="company_type"
                        className=""
                        placeholder="e.g., Private Limited"
                        color="secondary"
                        defaultValue={data?.company_type}
                      />
                    </div>
                  </div>

                  {/* GST Number */}
                  <div className="w-full col-span-3">
                    <p className="block text-sm font-medium text-gray-700 dark:text-gray-300 p-1">
                      GST Number (optional)
                    </p>
                    <div className="relative mt-1 flex items-center justify-center gap-2">
                      <BuildingStorefrontIcon className="h-8 text-gray-400" />
                      <Input
                        type="text"
                        name="gst_number"
                        className="w-full"
                        color="secondary"
                        defaultValue={data?.gst_number}
                      />
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className="w-full">
                  <p className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Address
                  </p>
                  <Input
                    type="text"
                    name="address_line"
                    placeholder="Address Line 1"
                    className="w-full mb-2"
                    color="secondary"
                    defaultValue={data?.address_line}
                  />
                  <div className="grid grid-cols-3 gap-2">
                    <Input
                      type="text"
                      name="address_city"
                      label="City"
                      size="sm"
                      className=""
                      color="secondary"
                      defaultValue={data?.address_city}
                    />
                    <Input
                      type="text"
                      name="address_state"
                      label="State"
                      size="sm"
                      className=""
                      color="secondary"
                      defaultValue={data?.address_state}
                    />
                    <Input
                      type="text"
                      name="address_zip_code"
                      label="ZIP / Postal Code"
                      size="sm"
                      className=""
                      color="secondary"
                      defaultValue={data?.address_zip_code}
                    />
                  </div>
                  <Input
                    type="text"
                    name="address_country"
                    label="Country"
                    className="mt-2 w-full"
                    color="secondary"
                    defaultValue={data?.address_country}
                  />
                </div>

                {/* Billing Address */}
                <div className="w-full">
                  <div className="flex items-center justify-between mb-2">
                    <p className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Billing Address
                    </p>
                    <div className="flex items-center">
                      <Switch
                        aria-label="Billing address same as Address"
                        size="sm"
                        onValueChange={setSame}
                        color="secondary"
                      />
                      <p className="text-xs pl-2">Same as Address</p>
                    </div>
                  </div>
                  {!same && (
                    <>
                      <Input
                        type="text"
                        name="billing_address_line"
                        placeholder="Address Line 1"
                        className="w-full mb-2"
                        color="secondary"
                        defaultValue={data?.billing_address_line}
                      />
                      <div className="grid grid-cols-3 gap-2">
                        <Input
                          type="text"
                          name="billing_city"
                          label="City"
                          size="sm"
                          className=""
                          color="secondary"
                          defaultValue={data?.billing_city}
                        />
                        <Input
                          type="text"
                          name="billing_state"
                          label="State"
                          size="sm"
                          className=""
                          color="secondary"
                          defaultValue={data?.billing_state}
                        />
                        <Input
                          type="text"
                          name="billing_zip_code"
                          label="ZIP / Postal Code"
                          size="sm"
                          className=""
                          color="secondary"
                          defaultValue={data?.billing_zip_code}
                        />
                      </div>
                      <Input
                        type="text"
                        name="billing_country"
                        label="Country"
                        className="mt-2 w-full"
                        color="secondary"
                        defaultValue={data?.billing_country}
                      />
                    </>
                  )}
                  {same && (
                    <p className="text-sm text-gray-500 italic py-2">
                      Billing address will be same as Address
                    </p>
                  )}
                </div>

                {/* Contact Information */}
                <div className="w-full">
                  <p className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Contact Person
                  </p>
                  <div className="relative flex items-center justify-center gap-2">
                    <UserIcon className="h-6 text-gray-400" />
                    <Input
                      type="text"
                      name="contact_person_name"
                      className="w-full"
                      placeholder="John Doe"
                      color="secondary"
                      defaultValue={data?.contact_person_name}
                    />
                  </div>
                </div>

                <div className="w-full">
                  <p className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Contact Email
                  </p>
                  <div className="relative flex items-center justify-center gap-2">
                    <EnvelopeIcon className="h-6 text-gray-400" />
                    <Input
                      type="email"
                      name="contact_email"
                      className="w-full"
                      placeholder="john@example.com"
                      color="secondary"
                      defaultValue={data?.contact_email}
                    />
                  </div>
                </div>

                <div className="w-full">
                  <p className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Contact Phone
                  </p>
                  <div className="relative flex items-center justify-center gap-2">
                    <PhoneIcon className="h-6 text-gray-400" />
                    <Input
                      type="tel"
                      name="contact_phone"
                      className="w-full"
                      placeholder="+91 98765 43210"
                      color="secondary"
                      defaultValue={data?.contact_phone}
                    />
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-3 justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Button variant="flat" onPress={onClose}>
                    Cancel
                  </Button>
                  <Button type="submit" color="secondary">
                    Update Guest
                  </Button>
                </div>
              </Form>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
