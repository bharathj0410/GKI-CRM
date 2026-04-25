"use client";
import React from "react";
import { Button, Form, Input, Card, CardBody } from "@heroui/react";

export default function LoginCard({
  requirePasswordReset,
  username,
  setUsername,
  password,
  setPassword,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  showPassword,
  setShowPassword,
  showNewPassword,
  setShowNewPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  loading,
  errors,
  onSubmit,
}) {
  return (
    <div className="w-full max-w-lg">
      {/* Mobile Logo */}
      <div className="lg:hidden text-center mb-6">
        <img src="/logo.svg" alt="Logo" className="mx-auto h-14 mb-4" />
      </div>

      <Card className="rounded-2xl border border-slate-200 bg-white shadow-[0_20px_45px_-25px_rgba(15,23,42,0.35)]">
        <CardBody className="p-8 md:p-10">
          <div className="mb-8 space-y-3">
            <p className="inline-flex rounded-full bg-secondary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-secondary">
              Welcome Back
            </p>
            <h2 className="text-3xl font-bold text-slate-900">
              {requirePasswordReset ? "Reset Password" : "Log In"}
            </h2>
            <p className="text-slate-600 text-sm leading-6">
              {requirePasswordReset
                ? "Create a strong password to secure your account"
                : "Access your CRM dashboard with your credentials"}
            </p>
          </div>

          <Form onSubmit={onSubmit} className="space-y-5">
            {!requirePasswordReset ? (
              <div className="flex flex-col w-full gap-5">
                <div>
                  <Input
                    isRequired
                    label="Username"
                    placeholder="Enter your username"
                    type="text"
                    color="secondary"
                    value={username}
                    onValueChange={setUsername}
                    size="lg"
                  />
                </div>

                <div>
                  <Input
                    isRequired
                    label="Password"
                    placeholder="Enter your password"
                    type={showPassword ? "text" : "password"}
                    color="secondary"
                    value={password}
                    onValueChange={setPassword}
                    size="lg"
                    endContent={
                      <button
                        className="focus:outline-none text-xs font-semibold uppercase tracking-wide text-secondary"
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? "Hide" : "Show"}
                      </button>
                    }
                  />
                </div>
              </div>
            ) : (
              <>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <div>
                      <p className="font-semibold text-amber-800 text-sm mb-1">
                        Password Reset Required
                      </p>
                      <p className="text-sm text-amber-700 leading-6">
                        Your account requires a password change. Please create a
                        new secure password.
                      </p>
                    </div>
                  </div>
                </div>

                <Input
                  isRequired
                  label="New Password"
                  placeholder="Create a strong password"
                  type={showNewPassword ? "text" : "password"}
                  color="secondary"
                  value={newPassword}
                  onValueChange={setNewPassword}
                  size="lg"
                  isInvalid={errors.length > 0}
                  errorMessage={
                    errors.length > 0 ? (
                      <ul className="list-disc list-inside text-xs mt-1">
                        {errors.map((error, i) => (
                          <li key={i}>{error}</li>
                        ))}
                      </ul>
                    ) : (
                      ""
                    )
                  }
                  endContent={
                    <button
                      className="focus:outline-none text-xs font-semibold uppercase tracking-wide text-secondary"
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? "Hide" : "Show"}
                    </button>
                  }
                />

                <Input
                  isRequired
                  label="Confirm Password"
                  placeholder="Re-enter your password"
                  type={showConfirmPassword ? "text" : "password"}
                  color="secondary"
                  value={confirmPassword}
                  onValueChange={setConfirmPassword}
                  size="lg"
                  isInvalid={
                    confirmPassword && newPassword !== confirmPassword
                  }
                  errorMessage={
                    confirmPassword && newPassword !== confirmPassword
                      ? "Passwords do not match"
                      : ""
                  }
                  endContent={
                    <button
                      className="focus:outline-none text-xs font-semibold uppercase tracking-wide text-secondary"
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? "Hide" : "Show"}
                    </button>
                  }
                />
              </>
            )}
            <Button
              color="secondary"
              type="submit"
              className="w-full font-semibold text-base h-12 mt-3 bg-secondary shadow-md text-white rounded-xl"
              isLoading={loading}
              disabled={loading}
              size="lg"
            >
              {loading
                ? "Processing..."
                : requirePasswordReset
                ? "Set Password & Login"
                : "Log In"}
            </Button>
          </Form>
        </CardBody>
      </Card>

      <p className="text-center text-slate-500 text-sm mt-6">
        Secure login powered by GKI App
      </p>
    </div>
  );
}
