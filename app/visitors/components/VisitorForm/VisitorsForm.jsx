// pages/visitor-form.jsx
import { Button, Form, Input, NumberInput, Select, SelectItem, Textarea } from "@heroui/react";
import React, { useEffect, useRef, useState } from "react";
import { CameraIcon, ArrowLeftIcon, PhoneIcon, UserGroupIcon, UserIcon, UsersIcon, AcademicCapIcon, BuildingStorefrontIcon, HomeModernIcon } from "@heroicons/react/24/solid";
import VisitorDetails from "./VisitorDetails"
import SecurityDetails from "./SecurityDetails"
import ExitDetails from "./ExitDetails"
import { AtSymbolIcon, BuildingOffice2Icon, EnvelopeIcon } from "@heroicons/react/16/solid";
import axios from "@/lib/axios";
import Toast from "@/components/Toast";

export default function VisitorFormPage({ setOpenVisitorsForm, formData = {} }) {
  const [files, setFiles] = useState([]);
  const [visitorType, setVisitorType] = useState("");
  const [vendorData, setVendorData] = useState({
    name: "",
    company: "",
    from: "",
    phone: "",
    gst: "",
    address: "",
    product: "",
  });
  const [dateOfVisit] = useState(new Date().toISOString().split("T")[0]);

  // camera / photo
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [streaming, setStreaming] = useState(false);
  const [capturedBlobUrl, setCapturedBlobUrl] = useState(null);
  const [capturedBlobFile, setCapturedBlobFile] = useState(null);

  // documents
  const [documents, setDocuments] = useState([]);

  // Start camera
  async function startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setStreaming(true);
    } catch (err) {
      console.error("Camera error:", err);
      alert("Could not access camera. Allow camera permission or try HTTPS / localhost.");
    }
  }

  // stop camera
  function stopCamera() {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((t) => t.stop());
      videoRef.current.srcObject = null;
    }
    setStreaming(false);
  }
  useEffect(() => setCapturedBlobUrl(formData.photo), [])

  function capturePhoto() {
    if (!videoRef.current || !canvasRef.current) return;

    const width = 640;
    const height = 480;

    canvasRef.current.width = width;
    canvasRef.current.height = height;

    const ctx = canvasRef.current.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0, width, height);

    // Get Base64 directly
    const base64String = canvasRef.current.toDataURL("image/jpeg", 0.9);

    // You can still set a preview URL if needed
    setCapturedBlobUrl(base64String);

    // Stop camera after capture
    stopCamera();
  }


  // upload photo via file picker (fallback)
  function handlePhotoUpload(e) {
    const f = e.target.files && e.target.files[0];
    if (f) {
      // Keep the file object (Blob)
      setCapturedBlobFile(f);

      // Set preview URL
      setCapturedBlobUrl(URL.createObjectURL(f));

      // Convert to Base64
      const reader = new FileReader();
      reader.onloadend = function () {
        const base64String = reader.result; // includes "data:image/...;base64,"
        setCapturedBlobUrl(base64String);

      };
      reader.readAsDataURL(f);
    }
  }


  // documents change
  function handleDocumentsChange(e) {
    const files = e.target.files ? Array.from(e.target.files) : [];
    setDocuments(files);
  }

  // text change
  function handleInputChange(e) {
    const { name, value } = e.target;
    setVendorData((p) => ({ ...p, [name]: value }));
  }

  // submit form -> multipart/form-data
  async function handleSubmit(e) {
    e.preventDefault();
    let formData = new FormData(e.target);

    let formElement = Object.fromEntries(new FormData(e.currentTarget));
    formElement["providedIDProofs"] = formData.getAll('providedIDProofs');
    formElement["photo"] = capturedBlobUrl
    formElement["attachments"] = files
    console.log(formElement)

    axios.post("addVisitor", formElement).
      then((response) => {
        const visitorId = response.data.visitorId || "N/A"
        Toast("Visitor Registered Successfully!", `Visitor ID: ${visitorId}`, "success")
        
        // Reset form after successful submission
        setTimeout(() => {
          setOpenVisitorsForm(false)
        }, 2000)
      }).
      catch((error) => {
        Toast("Registration Failed", error.response?.data?.error || "Please try again", "danger")
        console.log(error)
      })
    return null


    // photo (captured or uploaded)
    if (capturedBlobFile) {
      fd.append("photo", capturedBlobFile);
    }

    // documents (multiple)
    documents.forEach((doc) => fd.append("documents", doc));

    try {
      const res = await fetch("/api/visitors", {
        method: "POST",
        body: fd,
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Upload failed");
      }

      const data = await res.json();
      alert("Uploaded successfully: " + data.message);
      // reset form
      setVendorData({
        name: "",
        company: "",
        from: "",
        phone: "",
        gst: "",
        address: "",
        product: "",
      });
      setCapturedBlobFile(null);
      setCapturedBlobUrl(null);
      setDocuments([]);
      setVisitorType("");
    } catch (err) {
      console.error(err);
      alert("Upload error: " + (err.message || err));
    }
  }
  const visitorTypes = [
    { key: "vendor", label: "Vendors / Suppliers" },
    { key: "customer", label: "Customers / Clients" },
    { key: "logistics", label: "Logistics / Transport Personnel" },
    { key: "jobApplicant", label: "Job Applicants" },
    { key: "government", label: "Government Officials" },
    { key: "serviceProvider", label: "Service Providers" },
    { key: "consultant", label: "Consultants" },
    { key: "family", label: "Friends/Family of Employees" },
    { key: "intern", label: "Interns / Trainees" },
    { key: "media", label: "Media / PR" },
  ];


  const fileInputRef = useRef(null);
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className=" mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">New Visitor Entry</h1>
            <p className="text-gray-600">Fill in the visitor details below</p>
          </div>
          <Button 
            color="default" 
            variant="flat" 
            onPress={() => setOpenVisitorsForm(false)}
            startContent={<ArrowLeftIcon className="w-4 h-4" />}
          >
            Back
          </Button>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <Form onSubmit={handleSubmit} className="p-6 sm:p-8">
            <div className="space-y-8">
              {/* Basic Info Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  Basic Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <Select
                    items={visitorTypes}
                    label="Visitor Type"
                    placeholder="Select type"
                    color="secondary"
                    variant="flat"
                    name="visitorType"
                    isRequired
                    defaultSelectedKeys={[formData?.visitorType]}
                  >
                    {(visitorType) => <SelectItem key={visitorType.key}>{visitorType.label}</SelectItem>}
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Photo Section */}
                  <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Photo</label>
                    {capturedBlobUrl ? (
                      <div className="flex flex-col gap-2">
                        <img 
                          src={capturedBlobUrl} 
                          alt="captured" 
                          className="w-full h-64 object-contain rounded-lg border-2 border-gray-200" 
                        />
                        <Button 
                          type="button" 
                          onPress={() => { setCapturedBlobUrl(null); setCapturedBlobFile(null); }} 
                          color="danger"
                          variant="flat"
                          size="sm"
                          fullWidth
                        >
                          Remove
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2">
                        <div className="relative bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 overflow-hidden">
                          <video 
                            ref={videoRef} 
                            autoPlay 
                            playsInline 
                            muted 
                            className="w-full h-64 object-cover" 
                          />
                          {!streaming && (
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                              <CameraIcon className="w-16 h-64 text-gray-400" />
                            </div>
                          )}
                          <canvas ref={canvasRef} className="hidden" />
                        </div>
                        {!streaming ? (
                          <div className="grid grid-cols-2 gap-2">
                            <Button 
                              type="button" 
                              onPress={startCamera} 
                              color="secondary"
                              variant="flat"
                              size="sm"
                            >
                              Camera
                            </Button>
                            <input 
                              type="file" 
                              accept="image/*" 
                              style={{ display: "none" }} 
                              onChange={handlePhotoUpload} 
                              ref={fileInputRef} 
                            />
                            <Button
                              type="button"
                              onPress={() => fileInputRef.current.click()}
                              variant="flat"
                              size="sm"
                            >
                              Upload
                            </Button>
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 gap-2">
                            <Button 
                              type="button" 
                              onPress={capturePhoto} 
                              color="success"
                              variant="flat"
                              size="sm"
                            >
                              Capture
                            </Button>
                            <Button 
                              type="button" 
                              onPress={stopCamera} 
                              color="default"
                              variant="flat"
                              size="sm"
                            >
                              Cancel
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Personal Details */}
                  <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      defaultValue={formData?.name}
                      label="Full Name"
                      name="name"
                      color="secondary"
                      type="text"
                      variant="flat"
                      isRequired
                      startContent={<UserIcon className="w-5" />}
                    />
                    <Input
                      label="Company/Organization"
                      type="text"
                      color="secondary"
                      variant="flat"
                      name="companyOrOrganization"
                      startContent={<BuildingOffice2Icon className="w-5" />}
                      defaultValue={formData?.companyOrOrganization}
                    />
                    <Input
                      defaultValue={formData?.designationOrRole}
                      name="designationOrRole"
                      label="Designation / Role"
                      startContent={<AcademicCapIcon className="w-5" />}
                      color="secondary"
                      type="text"
                      variant="flat"
                    />
                    <NumberInput
                      maxLength={10}
                      defaultValue={formData?.phoneNumber}
                      name="phoneNumber"
                      formatOptions={{ useGrouping: false }}
                      startContent={<PhoneIcon className="w-5" />}
                      hideStepper
                      color="secondary"
                      label="Mobile Number"
                      variant="flat"
                      isRequired={true}
                    />
                    <Input
                      defaultValue={formData?.email}
                      name="email"
                      startContent={<EnvelopeIcon className="w-5" />}
                      label="Email Address"
                      color="secondary"
                      type="email"
                      variant="flat"
                    />
                    <Input
                      defaultValue={formData?.gst}
                      name="gst"
                      startContent={<BuildingStorefrontIcon className="w-5" />}
                      label="GST Number"
                      color="secondary"
                      type="text"
                      variant="flat"
                    />
                    <Input
                      defaultValue={formData?.address}
                      name="address"
                      startContent={<HomeModernIcon className="w-5" />}
                      label="Address"
                      placeholder="Enter full address"
                      color="secondary"
                      variant="flat"
                      className="md:col-span-2"
                    />
                  </div>
                </div>
              </div>

              <VisitorDetails formData={formData} />
              <SecurityDetails formData={formData} setFiles={setFiles} files={files} />
              <ExitDetails formData={formData} />

              {/* Submit Buttons */}
              <div className="flex justify-end gap-3 pt-6 border-t">
                <Button 
                  type="button"
                  variant="flat" 
                  onPress={() => setOpenVisitorsForm(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  color="secondary" 
                  variant="shadow"
                >
                  Register Visitor
                </Button>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
