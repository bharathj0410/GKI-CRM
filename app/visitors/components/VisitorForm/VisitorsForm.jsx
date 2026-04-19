"use client"
import React, { useRef, useState } from "react"
import {
  Button, Input, Select, SelectItem,
  Progress, Card, CardBody,
} from "@heroui/react"
import {
  UserIcon, PhoneIcon, EnvelopeIcon, BuildingOffice2Icon,
  AcademicCapIcon, CameraIcon, MapPinIcon, ArrowLeftIcon,
  ArrowRightIcon, CheckIcon, PencilSquareIcon,
} from "@heroicons/react/24/solid"
import { HomeModernIcon } from "@heroicons/react/24/solid"
import VisitorDetails from "./steps/VisitDetails"
import SecurityStep from "./steps/SecurityStep"
import ConfirmationStep from "./steps/ConfirmationStep"
import Toast from "@/components/Toast"
import axios from "@/lib/axios"

const STEPS = [
  { id: 1, label: "Personal Info", icon: "👤" },
  { id: 2, label: "Visit Details", icon: "📋" },
  { id: 3, label: "Security", icon: "🔒" },
  { id: 4, label: "Confirm & Sign", icon: "✅" },
]

const visitorTypes = [
  { key: "vendor", label: "Vendor / Supplier" },
  { key: "customer", label: "Customer / Client" },
  { key: "logistics", label: "Logistics / Transport" },
  { key: "jobApplicant", label: "Job Applicant" },
  { key: "government", label: "Government Official" },
  { key: "serviceProvider", label: "Service Provider" },
  { key: "consultant", label: "Consultant" },
  { key: "family", label: "Friends / Family" },
  { key: "intern", label: "Intern / Trainee" },
  { key: "media", label: "Media / PR" },
  { key: "contractor", label: "Contractor" },
  { key: "auditor", label: "Auditor" },
  { key: "researcher", label: "Researcher" },
  { key: "delivery", label: "Delivery Person" },
  { key: "other", label: "Other" },
]

function StepIndicator({ currentStep }) {
  return (
    <div className="flex items-center justify-between mb-8">
      {STEPS.map((step, idx) => {
        const isCompleted = currentStep > step.id
        const isActive = currentStep === step.id
        return (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center gap-1.5">
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300
                ${isCompleted ? "bg-purple-600 text-white shadow-lg shadow-purple-200" : ""}
                ${isActive ? "bg-purple-600 text-white ring-4 ring-purple-200 shadow-lg" : ""}
                ${!isCompleted && !isActive ? "bg-gray-100 text-gray-400 border-2 border-gray-200" : ""}
              `}>
                {isCompleted ? <CheckIcon className="w-5 h-5" /> : <span>{step.icon}</span>}
              </div>
              <span className={`text-xs font-semibold whitespace-nowrap ${isActive ? "text-purple-700" : isCompleted ? "text-purple-500" : "text-gray-400"}`}>
                {step.label}
              </span>
            </div>
            {idx < STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 rounded transition-all duration-500 ${currentStep > step.id ? "bg-purple-500" : "bg-gray-200"}`} />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}

export default function VisitorsForm({ setOpenVisitorsForm, formData = {}, onSuccess }) {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Step 1 — personal info
  const [photo, setPhoto] = useState(formData?.photo || null)
  const [streaming, setStreaming] = useState(false)
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const fileInputRef = useRef(null)

  // Step 2 — visit details (lifted state for summary)
  const [visitData, setVisitData] = useState({
    checkIn: null,
    purposeOfVisit: formData?.purposeOfVisit || "",
    visitDetails: formData?.visitDetails || "",
    meetingWith: formData?.meetingWith || "",
    visitLocation: formData?.visitLocation || "",
    expectedDuration: formData?.expectedDuration || "",
    remarks: formData?.remarks || "",
    isRecurring: formData?.isRecurring || false,
    recurringFrequency: formData?.recurringFrequency || "",
  })

  // Step 3 — security
  const [securityData, setSecurityData] = useState({
    providedIDProofs: formData?.providedIDProofs || [],
    idNumber: formData?.idNumber || "",
    hasVehicle: formData?.hasVehicle || false,
    vehicleNumber: formData?.vehicleNumber || "",
    vehicleType: formData?.vehicleType || "",
    materialsCarriedIn: formData?.materialsCarriedIn || [],
    safetyBriefingGiven: formData?.safetyBriefingGiven || false,
    ndaSigned: formData?.ndaSigned || false,
    gatePassNumber: formData?.gatePassNumber || "",
    securityGuard: formData?.securityGuard || "",
    attachments: [],
  })

  // Step 4 — signatures
  const [visitorSignature, setVisitorSignature] = useState(null)
  const [securitySignature, setSecuritySignature] = useState(null)
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  // Step 1 form refs (for reading values during submit)
  const step1Ref = useRef({})

  // Camera
  async function startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
      }
      setStreaming(true)
    } catch {
      Toast("Camera Error", "Could not access camera", "danger")
    }
  }
  function stopCamera() {
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(t => t.stop())
      videoRef.current.srcObject = null
    }
    setStreaming(false)
  }
  function capturePhoto() {
    if (!videoRef.current || !canvasRef.current) return
    canvasRef.current.width = 640
    canvasRef.current.height = 480
    canvasRef.current.getContext("2d").drawImage(videoRef.current, 0, 0, 640, 480)
    const base64 = canvasRef.current.toDataURL("image/jpeg", 0.9)
    setPhoto(base64)
    stopCamera()
  }
  function handlePhotoUpload(e) {
    const f = e.target.files?.[0]
    if (!f) return
    const reader = new FileReader()
    reader.onloadend = () => setPhoto(reader.result)
    reader.readAsDataURL(f)
  }

  // Validation per step
  const validateStep = () => {
    if (currentStep === 1) {
      const name = document.getElementById("vf-fullName")?.value?.trim()
      const phone = document.getElementById("vf-phone")?.value?.trim()
      const vtype = document.getElementById("vf-visitorType")
      if (!name) { Toast("Validation", "Full name is required", "warning"); return false }
      if (!phone || phone.length !== 10) { Toast("Validation", "Valid 10-digit phone is required", "warning"); return false }
      return true
    }
    if (currentStep === 2) {
      if (!visitData.purposeOfVisit) { Toast("Validation", "Purpose of visit is required", "warning"); return false }
      return true
    }
    return true
  }

  const goNext = () => {
    if (!validateStep()) return
    setCurrentStep(s => Math.min(s + 1, 4))
  }
  const goPrev = () => setCurrentStep(s => Math.max(s - 1, 1))

  async function handleSubmit() {
    if (!agreedToTerms) { Toast("Validation", "Please confirm the terms", "warning"); return }
    setIsSubmitting(true)
    try {
      const payload = {
        // Step 1
        fullName: document.getElementById("vf-fullName")?.value || "",
        phone: document.getElementById("vf-phone")?.value || "",
        alternatePhone: document.getElementById("vf-altPhone")?.value || "",
        email: document.getElementById("vf-email")?.value || "",
        company: document.getElementById("vf-company")?.value || "",
        designation: document.getElementById("vf-designation")?.value || "",
        visitorType: document.getElementById("vf-visitorType-hidden")?.value || "",
        groupSize: Number(document.getElementById("vf-groupSize")?.value) || 1,
        photo,
        address: document.getElementById("vf-address")?.value || "",
        city: document.getElementById("vf-city")?.value || "",
        state: document.getElementById("vf-state")?.value || "",
        // Step 2
        ...visitData,
        // Step 3
        ...securityData,
        // Step 4
        visitorSignature,
        securitySignature,
      }

      await axios.post("visitors", payload)
      Toast("Success", "Visitor registered successfully!", "success")
      setTimeout(() => { onSuccess?.(); setOpenVisitorsForm(false) }, 1500)
    } catch (err) {
      Toast("Error", err.response?.data?.error || "Registration failed", "danger")
    } finally {
      setIsSubmitting(false)
    }
  }

  const step1Data = {
    fullName: formData?.fullName || "",
    phone: formData?.phone || "",
    alternatePhone: formData?.alternatePhone || "",
    email: formData?.email || "",
    company: formData?.company || "",
    designation: formData?.designation || "",
    visitorType: formData?.visitorType || "",
    groupSize: formData?.groupSize || 1,
    address: formData?.address || "",
    city: formData?.city || "",
    state: formData?.state || "",
  }

  return (
    <div className="">
      <div className="w-full mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl shadow-lg">
              <PencilSquareIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {formData?._id ? "Edit Visitor" : "New Visitor Entry"}
              </h1>
              <p className="text-sm text-gray-500">Step {currentStep} of {STEPS.length}</p>
            </div>
          </div>
          <Button
            variant="flat"
            onPress={() => setOpenVisitorsForm(false)}
            startContent={<ArrowLeftIcon className="w-4 h-4" />}
          >
            Back
          </Button>
        </div>

        {/* Progress */}
        <Card shadow="sm" className="mb-6 rounded-xl">
          <CardBody className="px-6 pt-5 pb-4">
            <StepIndicator currentStep={currentStep} />
            <Progress
              value={(currentStep / STEPS.length) * 100}
              color="secondary"
              className="h-1.5"
              aria-label="Form progress"
            />
          </CardBody>
        </Card>

        {/* Step Content */}
        <Card shadow="sm" className="rounded-xl">
          <CardBody className="p-6 sm:p-8">
            {/* ── STEP 1 ── */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-lg font-bold text-gray-900 pb-2 border-b border-gray-100">Personal Information</h2>

                {/* Visitor Type */}
                <VisitorTypeSelect defaultValue={step1Data.visitorType} />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Photo */}
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Visitor Photo</p>
                    {photo ? (
                      <div className="space-y-2">
                        <img src={photo} alt="visitor" className="w-full h-52 object-cover rounded-xl border-2 border-purple-200" />
                        <Button size="sm" color="danger" variant="flat" fullWidth onPress={() => setPhoto(null)}>Remove</Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="relative bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 overflow-hidden h-52">
                          <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                          <canvas ref={canvasRef} className="hidden" />
                          {!streaming && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-gray-400">
                              <CameraIcon className="w-10 h-10" />
                              <span className="text-xs">No photo</span>
                            </div>
                          )}
                        </div>
                        <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handlePhotoUpload} />
                        {!streaming ? (
                          <div className="grid grid-cols-2 gap-2">
                            <Button size="sm" color="secondary" variant="flat" onPress={startCamera}>📷 Camera</Button>
                            <Button size="sm" variant="flat" onPress={() => fileInputRef.current?.click()}>📁 Upload</Button>
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 gap-2">
                            <Button size="sm" color="success" variant="flat" onPress={capturePhoto}>Capture</Button>
                            <Button size="sm" variant="flat" onPress={stopCamera}>Cancel</Button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Personal Fields */}
                  <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      id="vf-fullName"
                      label="Full Name"
                      placeholder="Enter full name"
                      isRequired
                      color="secondary"
                      variant="flat"
                      defaultValue={step1Data.fullName}
                      startContent={<UserIcon className="w-4 h-4 text-gray-400" />}
                    />
                    <Input
                      id="vf-phone"
                      label="Phone Number"
                      placeholder="10-digit mobile"
                      isRequired
                      color="secondary"
                      variant="flat"
                      maxLength={10}
                      defaultValue={step1Data.phone}
                      startContent={<PhoneIcon className="w-4 h-4 text-gray-400" />}
                    />
                    <Input
                      id="vf-altPhone"
                      label="Alternate Phone"
                      placeholder="Optional"
                      color="secondary"
                      variant="flat"
                      maxLength={10}
                      defaultValue={step1Data.alternatePhone}
                      startContent={<PhoneIcon className="w-4 h-4 text-gray-400" />}
                    />
                    <Input
                      id="vf-email"
                      label="Email Address"
                      type="email"
                      placeholder="email@example.com"
                      color="secondary"
                      variant="flat"
                      defaultValue={step1Data.email}
                      startContent={<EnvelopeIcon className="w-4 h-4 text-gray-400" />}
                    />
                    <Input
                      id="vf-company"
                      label="Company / Organization"
                      placeholder="Company name"
                      color="secondary"
                      variant="flat"
                      defaultValue={step1Data.company}
                      startContent={<BuildingOffice2Icon className="w-4 h-4 text-gray-400" />}
                    />
                    <Input
                      id="vf-designation"
                      label="Designation / Job Title"
                      placeholder="Role or title"
                      color="secondary"
                      variant="flat"
                      defaultValue={step1Data.designation}
                      startContent={<AcademicCapIcon className="w-4 h-4 text-gray-400" />}
                    />
                    <Input
                      id="vf-groupSize"
                      label="Group Size"
                      type="number"
                      min={1}
                      defaultValue={String(step1Data.groupSize)}
                      color="secondary"
                      variant="flat"
                    />
                    <Input
                      id="vf-city"
                      label="City"
                      color="secondary"
                      variant="flat"
                      defaultValue={step1Data.city}
                      startContent={<MapPinIcon className="w-4 h-4 text-gray-400" />}
                    />
                    <Input
                      id="vf-state"
                      label="State"
                      color="secondary"
                      variant="flat"
                      defaultValue={step1Data.state}
                    />
                    <Input
                      id="vf-address"
                      label="Address"
                      placeholder="Full address"
                      color="secondary"
                      variant="flat"
                      className="sm:col-span-2"
                      defaultValue={step1Data.address}
                      startContent={<HomeModernIcon className="w-4 h-4 text-gray-400" />}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ── STEP 2 ── */}
            {currentStep === 2 && (
              <VisitorDetails data={visitData} onChange={setVisitData} />
            )}

            {/* ── STEP 3 ── */}
            {currentStep === 3 && (
              <SecurityStep data={securityData} onChange={setSecurityData} />
            )}

            {/* ── STEP 4 ── */}
            {currentStep === 4 && (
              <ConfirmationStep
                step1Data={step1Data}
                photo={photo}
                visitData={visitData}
                securityData={securityData}
                visitorSignature={visitorSignature}
                setVisitorSignature={setVisitorSignature}
                securitySignature={securitySignature}
                setSecuritySignature={setSecuritySignature}
                agreedToTerms={agreedToTerms}
                setAgreedToTerms={setAgreedToTerms}
              />
            )}
          </CardBody>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between mt-5">
          <Button
            variant="flat"
            onPress={goPrev}
            isDisabled={currentStep === 1}
            startContent={<ArrowLeftIcon className="w-4 h-4" />}
          >
            Previous
          </Button>
          {currentStep < 4 ? (
            <Button
              color="secondary"
              variant="shadow"
              onPress={goNext}
              endContent={<ArrowRightIcon className="w-4 h-4" />}
            >
              Next Step
            </Button>
          ) : (
            <Button
              color="secondary"
              variant="shadow"
              onPress={handleSubmit}
              isLoading={isSubmitting}
              startContent={!isSubmitting && <CheckIcon className="w-4 h-4" />}
            >
              {isSubmitting ? "Registering..." : "Register Visitor"}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

// Extracted so it can maintain a hidden input for reading the value
function VisitorTypeSelect({ defaultValue }) {
  const [selected, setSelected] = useState(new Set(defaultValue ? [defaultValue] : []))
  const val = Array.from(selected)[0] || ""
  return (
    <div>
      <input type="hidden" id="vf-visitorType-hidden" value={val} />
      <Select
        id="vf-visitorType"
        items={visitorTypes}
        label="Visitor Type"
        placeholder="Select visitor type"
        color="secondary"
        variant="flat"
        isRequired
        selectedKeys={selected}
        onSelectionChange={setSelected}
        className="max-w-xs"
      >
        {(item) => <SelectItem key={item.key}>{item.label}</SelectItem>}
      </Select>
    </div>
  )
}
