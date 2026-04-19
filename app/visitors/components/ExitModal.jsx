"use client";
import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Textarea,
  Input,
} from "@heroui/react";
import { I18nProvider } from "@react-aria/i18n";
import { getLocalTimeZone, now } from "@internationalized/date";
import { DatePicker } from "@heroui/react";
import {
  ArrowRightOnRectangleIcon,
  ShieldCheckIcon,
  CubeTransparentIcon,
} from "@heroicons/react/24/solid";
import SignaturePadWidget from "./VisitorForm/ui/SignaturePad";
import axios from "@/lib/axios";
import Toast from "@/components/Toast";

export default function ExitModal({ visitor, isOpen, onClose, onSuccess }) {
  const [checkOut, setCheckOut] = useState(null);
  const [materialsCarriedOut, setMaterialsCarriedOut] = useState("");
  const [securityGuardExit, setSecurityGuardExit] = useState("");
  const [exitSignature, setExitSignature] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleMarkExit = async () => {
    setIsLoading(true);
    try {
      await axios.put(`visitors/${visitor._id}/exit`, {
        checkOut: checkOut
          ? checkOut.toDate(getLocalTimeZone()).toISOString()
          : new Date().toISOString(),
        materialsCarriedOut,
        securityGuardExit,
        exitSignature,
      });
      Toast(
        "Exit Recorded",
        `${visitor.fullName} has been marked as exited`,
        "success",
      );
      onSuccess?.();
      onClose();
    } catch (err) {
      Toast(
        "Error",
        err.response?.data?.error || "Failed to mark exit",
        "danger",
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!visitor) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl" scrollBehavior="inside">
      <ModalContent>
        <ModalHeader className="flex items-center gap-3 border-b pb-4">
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center shadow">
            <ArrowRightOnRectangleIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Mark Exit</h3>
            <p className="text-sm text-gray-500">{visitor.fullName}</p>
          </div>
        </ModalHeader>

        <ModalBody className="py-5 space-y-5">
          {/* Exit Time */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">
              Actual Exit Date &amp; Time
            </p>
            <I18nProvider locale="en-IN">
              <DatePicker
                granularity="minute"
                hourCycle={12}
                hideTimeZone
                showMonthAndYearPickers
                defaultValue={now(getLocalTimeZone())}
                onChange={setCheckOut}
                label="Exit Date & Time"
                color="secondary"
                variant="flat"
              />
            </I18nProvider>
          </div>

          {/* Materials Carried Out */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
              <CubeTransparentIcon className="w-4 h-4 text-purple-600" />
              Items / Materials Carried Out
            </p>
            <Textarea
              placeholder="List any items or materials taken out..."
              color="secondary"
              variant="flat"
              value={materialsCarriedOut}
              onValueChange={setMaterialsCarriedOut}
              minRows={2}
            />
          </div>

          {/* Security Guard */}
          <Input
            label="Security Officer Name"
            placeholder="Officer name or badge ID"
            color="secondary"
            variant="flat"
            value={securityGuardExit}
            onValueChange={setSecurityGuardExit}
            startContent={<ShieldCheckIcon className="w-4 h-4 text-gray-400" />}
          />

          {/* Exit Signature */}
          <SignaturePadWidget
            title="Exit Signature (Visitor)"
            onSave={setExitSignature}
            value={exitSignature}
          />

          {/* Check-in info reminder */}
          <div className="p-3 bg-purple-50 rounded-xl border border-purple-100 text-sm text-gray-600">
            <span className="font-semibold text-purple-700">Check-in: </span>
            {visitor.checkIn
              ? new Date(visitor.checkIn).toLocaleString("en-IN")
              : "N/A"}
            {" · "}
            <span className="font-semibold text-purple-700">Purpose: </span>
            {visitor.purposeOfVisit || "N/A"}
          </div>
        </ModalBody>

        <ModalFooter className="border-t pt-4">
          <Button variant="flat" onPress={onClose} isDisabled={isLoading}>
            Cancel
          </Button>
          <Button
            color="danger"
            variant="shadow"
            onPress={handleMarkExit}
            isLoading={isLoading}
            startContent={
              !isLoading && <ArrowRightOnRectangleIcon className="w-4 h-4" />
            }
          >
            {isLoading ? "Processing..." : "Confirm Exit"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
