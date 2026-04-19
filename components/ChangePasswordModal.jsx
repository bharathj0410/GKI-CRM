"use client";
import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@heroui/react";
import Toast from "@/components/Toast";
import api from "@/lib/axios";

export default function ChangePasswordModal({
  isOpen,
  onClose,
  employee,
  onSuccess,
}) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const errors = [];
  if (newPassword.length > 0 && newPassword.length < 4) {
    errors.push("Password must be 4 characters or more.");
  }
  if (
    newPassword.length > 0 &&
    (newPassword.match(/[A-Z]/g) || []).length < 1
  ) {
    errors.push("Password must include at least 1 upper case letter");
  }
  if (
    newPassword.length > 0 &&
    (newPassword.match(/[^a-z0-9]/gi) || []).length < 1
  ) {
    errors.push("Password must include at least 1 symbol.");
  }

  const handleSubmit = async () => {
    if (newPassword !== confirmPassword) {
      Toast("Error", "Passwords do not match", "danger");
      return;
    }

    if (errors.length > 0) {
      Toast("Error", errors[0], "danger");
      return;
    }

    setLoading(true);
    try {
      const response = await api.put("/api/changePassword", {
        _id: employee._id,
        newPassword: newPassword,
      });
      Toast("Success", response.data.message, "success");
      setNewPassword("");
      setConfirmPassword("");
      onSuccess();
      onClose();
    } catch (err) {
      Toast(
        "Error",
        err.response?.data?.error || "Failed to change password",
        "danger",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <h3 className="text-xl font-bold">Change Password</h3>
          <p className="text-sm text-gray-500 font-normal">
            Change password for{" "}
            <span className="font-semibold text-secondary">
              {employee?.name}
            </span>
          </p>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <Input
              label="New Password"
              placeholder="Enter new password"
              type="password"
              value={newPassword}
              onValueChange={setNewPassword}
              color="secondary"
              isRequired
              isInvalid={errors.length > 0}
              errorMessage={errors.length > 0 ? errors.join(", ") : ""}
            />
            <Input
              label="Confirm Password"
              placeholder="Confirm new password"
              type="password"
              value={confirmPassword}
              onValueChange={setConfirmPassword}
              color="secondary"
              isRequired
              isInvalid={confirmPassword && newPassword !== confirmPassword}
              errorMessage={
                confirmPassword && newPassword !== confirmPassword
                  ? "Passwords do not match"
                  : ""
              }
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="default" variant="light" onPress={onClose}>
            Cancel
          </Button>
          <Button color="secondary" onPress={handleSubmit} isLoading={loading}>
            Change Password
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
