import {
  BuildingOffice2Icon,
  CubeTransparentIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  PhotoIcon,
  BuildingStorefrontIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Form, Switch } from "@heroui/react";
import { useRef, useState } from "react";
import axios from "@/lib/axios";
import Toast from "../Toast";
import { TrashIcon } from "@heroicons/react/24/solid";

export default function CompanyBillingForm({ setBillId }) {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [same, setSame] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };
  const handleButtonClick = () => {
    fileInputRef.current.click(); // Trigger the hidden file input
  };
  // Convert File to Base64 String
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
      const base64 = await convertToBase64(image); // Convert file to ArrayBuffer
      formData["logo"] = base64;
    }
    console.log(formData);
    if (formData) {
      const response = await axios.post("/addGuestData", formData);
      if (response.status === 200) {
        Toast("Saved", response.data.message, "success");
        formElement.reset();
        setBillId(response.data.id);
      } else {
        Toast("Error", response?.data?.error, "danger");
        console.log(response);
      }
    }
  };
  return (
    <Form
      className="w-full p-6 rounded-2xl  flex items-center "
      onSubmit={onSubmit}
    >
      <div className="text-2xl font-bold text-gray-700">
        Company & Billing Information
      </div>
      <div className="w-[15rem] h-1 bg-secondary rounded-full mb-6"></div>
      <div className="grid grid-cols-4 w-full gap-4">
        <Input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          ref={fileInputRef}
          className="hidden"
        />
        <div className="flex relative row-span-3 ">
          {image && (
            <div
              role="button"
              onClick={() => {
                setImage(null);
                fileInputRef.current.value = null;
              }}
            >
              <TrashIcon className="absolute top-0 right-0 w-6 text-red-600 z-20" />
            </div>
          )}
          <div role="button" onClick={handleButtonClick} className="w-full">
            <div className="w-full">
              {image ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-[15rem] w-[15rem] object-fill z-10 relative rounded-full"
                />
              ) : (
                <div className=" bg-zinc-100 h-[15rem] w-[15rem] flex flex-col items-center justify-center rounded-full text-zinc-500">
                  <PhotoIcon className=" w-10" />{" "}
                  <p className="text-xs font-bold ">Upload Logo</p>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Company Name */}
        <div className="w-full col-span-3">
          <p className="block text-sm font-medium text-gray-700 p-1">
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
            />
          </div>
        </div>

        {/* Company Type */}
        <div className="w-full col-span-3">
          <p className="block text-sm font-medium text-gray-700 p-1">
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
            />
          </div>
        </div>

        {/* GST Number */}
        <div className="w-full col-span-3">
          <p className="block text-sm font-medium text-gray-700 p-1">
            GST Number (optional)
          </p>
          <div className="relative mt-1 flex items-center justify-center gap-2">
            <BuildingStorefrontIcon className="h-8 text-gray-400" />
            <Input
              type="text"
              name="gst_number"
              className="w-full "
              color="secondary"
            />
          </div>
        </div>
      </div>
      {/* Website URL */}
      {/* <div className='w-full'>
        <p className="block text-sm font-medium text-gray-700">Website (optional)</p>
        <div className="relative mt-1">
          <Input
            type="url"
            name="website_url"
            className=" pl-10 "
            placeholder="https://example.com"
            color='secondary'
          />
          <GlobeAltIcon className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
        </div>
      </div> */}

      {/* Address */}
      <div className="w-full">
        <p className="block text-sm font-medium text-gray-700">Address</p>
        <Input
          type="text"
          name="address_line"
          placeholder="Address Line 1"
          className="w-full mb-2 p-2 "
          color="secondary"
        />
        <div className="grid grid-cols-3 gap-2">
          <Input
            type="text"
            name="address_city"
            label="City"
            size="sm"
            className="p-2 "
            color="secondary"
          />
          <Input
            type="text"
            name="address_state"
            label="State"
            size="sm"
            className="p-2 "
            color="secondary"
          />
          <Input
            type="text"
            name="address_zip_code"
            label="ZIP / Postal Code"
            size="sm"
            className="p-2 "
            color="secondary"
          />
        </div>
        <Input
          type="text"
          name="address_country"
          label="Country"
          className="mt-2 w-full p-2 "
          color="secondary"
        />
      </div>

      {/* Billing Address */}
      <div className="w-full">
        <div className="flex items-center justify-between mb-2">
          <p className="block text-sm font-medium text-gray-700">
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
              className="w-full mb-2 p-2 "
              color="secondary"
            />
            <div className="grid grid-cols-3 gap-2">
              <Input
                type="text"
                name="billing_city"
                label="City"
                size="sm"
                className="p-2 "
                color="secondary"
              />
              <Input
                type="text"
                name="billing_state"
                label="State"
                size="sm"
                className="p-2 "
                color="secondary"
              />
              <Input
                type="text"
                name="billing_zip_code"
                label="ZIP / Postal Code"
                size="sm"
                className="p-2 "
                color="secondary"
              />
            </div>
            <Input
              type="text"
              name="billing_country"
              label="Country"
              className="mt-2 w-full p-2 "
              color="secondary"
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
        <p className="block text-sm font-medium text-gray-700">
          Contact Person
        </p>
        <div className="relative mt-1 flex items-center justify-center gap-2">
          <UserIcon className="h-6 text-gray-400" />
          <Input
            type="text"
            name="contact_person_name"
            className="w-full "
            placeholder="John Doe"
            color="secondary"
          />
        </div>
      </div>

      <div className="w-full">
        <p className="block text-sm font-medium text-gray-700">Contact Email</p>
        <div className="relative mt-1 flex items-center justify-center gap-2">
          <EnvelopeIcon className="h-6 text-gray-400" />
          <Input
            type="email"
            name="contact_email"
            className="w-full"
            placeholder="john@example.com"
            color="secondary"
          />
        </div>
      </div>

      <div className="w-full">
        <p className="block text-sm font-medium text-gray-700">Contact Phone</p>
        <div className="relative mt-1 flex items-center justify-center gap-2">
          <PhoneIcon className="h-6 text-gray-400" />
          <Input
            type="tel"
            name="contact_phone"
            className="w-full"
            placeholder="+91 98765 43210"
            color="secondary"
          />
        </div>
      </div>

      {/* Company Business Data Section */}
      {/* <div className="w-full pt-6">
  <div className="text-xl font-semibold text-gray-800 mb-2">Company Business Data</div>

  <div className="grid grid-cols-2 gap-4">
    <Input type="text" name="bank_name" label="Bank Name" placeholder="Enter Bank Name" color="secondary" />
    <Input type="text" name="branch_name" placeholder="Branch Name" color="secondary" />
    <Input type="text" name="account_number" placeholder="A/C Number" color="secondary" />
    <Input type="text" name="ifsc_code" placeholder="IFSC Code" color="secondary" />
  </div>


        <p className="block text-sm font-medium text-gray-700 py-3">Delivery Address</p>
        <div className='flex items-center'>
        <Switch aria-label="Automatic updates" size='sm' onValueChange={setSame} color='secondary'/> <p className='text-xs pl-2'>Same As Billing Address</p>
        </div>
        {!same && 
  <div className='w-full'>
        <Input type="text" name="billing_address_line_1" placeholder="Address Line 1" className="w-full mb-2 p-2 " color='secondary'/>
        <Input type="text" name="billing_address_line_2" placeholder="Address Line 2 (optional)" className="w-full mb-2 p-2 " color='secondary'/>
        <Input type="text" name="billing_address_line_3" placeholder="Address Line 3 (optional)" className="w-full mb-2 p-2 " color='secondary'/>
        <div className="grid grid-cols-3 gap-2">
          <Input type="text" name="billing_city" placeholder="City" className="p-2 " color='secondary'/>
          <Input type="text" name="billing_state" placeholder="State" className="p-2 " color='secondary'/>
          <Input type="text" name="billing_zip_code" placeholder="ZIP / Postal Code" className="p-2 " color='secondary'/>
        </div>
        <Input type="text" name="billing_country" placeholder="Country" className="mt-2 w-full p-2 " color='secondary'/>
      </div>}

</div> */}

      {/* Submit Button */}
      <Button type="submit" className="w-full mt-8" color="secondary">
        Save
      </Button>
    </Form>
  );
}
