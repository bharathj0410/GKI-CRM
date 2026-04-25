"use client";
import React, { useState, useEffect } from "react";
import { Button, Form, Input, Card, CardBody } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import axios from "axios";
import Toast from "@/components/Toast";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [requirePasswordReset, setRequirePasswordReset] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const { login, user, loading: authLoading } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && user) {
      router.push("/");
    }
  }, [user, authLoading, router]);

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

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // If password reset is required, validate new password
      if (requirePasswordReset) {
        if (newPassword !== confirmPassword) {
          Toast("Error", "Passwords do not match", "danger");
          setLoading(false);
          return;
        }
        if (errors.length > 0) {
          Toast("Error", errors[0], "danger");
          setLoading(false);
          return;
        }
      }

      const response = await axios.post("/api/login", {
        username,
        password,
        newPassword: requirePasswordReset ? newPassword : undefined,
      });

      if (response.status === 200) {
        // Check if password reset is required
        if (response.data.requirePasswordReset && !requirePasswordReset) {
          setRequirePasswordReset(true);
          Toast("Password Reset Required", response.data.message, "warning");
          setLoading(false);
          return;
        }

        Toast("Login Successful", response.data.message, "success");
        login(response.data.user, response.data.token);
        router.push("/");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || "Login failed. Please try again.";
      Toast("Login Failed", errorMessage, "danger");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
      </div>
    );
  }

  // Don't render login form if user is already logged in
  if (user) {
    return null;
  }

  return (
    <div className="flex h-full min-h-screen justify-center w-full">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-secondary via-purple-600 to-primary-600 p-12 flex-col justify-between relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>

        <div className="relative z-10">
          <img src="/logo.svg" alt="Logo" className="h-20 mb-8" />
          <h1 className="text-5xl font-bold text-white mb-4">
            CRM Application
          </h1>
          <p className="text-purple-100 text-lg">
            Powerful customer relationship management with advanced tools for
            sales, analytics, and team collaboration.
          </p>
        </div>

        <div className="relative z-10 space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-1">Secure Access</h3>
              <p className="text-purple-100 text-sm">
                Role-based permissions ensure data security
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-1">
                Customer Management
              </h3>
              <p className="text-purple-100 text-sm">
                Track and manage customer relationships
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-1">Sales Analytics</h3>
              <p className="text-purple-100 text-sm">
                Track performance and forecast revenue
              </p>
            </div>
          </div>
        </div>

        <p className="text-purple-200 text-sm relative z-10">
          © 2025 GKI App. All rights reserved.
        </p>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <img src="/logo.svg" alt="Logo" className="mx-auto h-16 mb-4" />
          </div>

          <Card className="shadow-2xl border-0 bg-white">
            <CardBody className="p-10">
              <div className="mb-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-secondary to-purple-600 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-secondary to-purple-600 bg-clip-text text-transparent">
                    {requirePasswordReset ? "Reset Password" : "Log In"}
                  </h2>
                </div>
                <p className="text-gray-600 text-sm ml-0">
                  {requirePasswordReset
                    ? "Create a strong password to secure your account"
                    : "Access your CRM dashboard with your credentials"}
                </p>
              </div>

              <Form onSubmit={onSubmit} className="space-y-6">
                {!requirePasswordReset ? (
                  <div className="flex flex-col w-full gap-6">
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
                        startContent={
                          <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        }
                        classNames={{
                          input: "text-base bg-gray-50",
                          label: "font-semibold text-gray-700",
                          mainWrapper: "mb-2",
                          inputWrapper: "bg-gray-50 border-2 border-gray-200 hover:border-secondary transition-colors",
                        }}
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
                        startContent={
                          <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        }
                        classNames={{
                          input: "text-base bg-gray-50",
                          label: "font-semibold text-gray-700",
                          mainWrapper: "mb-2",
                          inputWrapper: "bg-gray-50 border-2 border-gray-200 hover:border-secondary transition-colors",
                        }}
                        endContent={
                          <button
                            className="focus:outline-none"
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <svg
                                className="w-5 h-5 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                                />
                              </svg>
                            ) : (
                              <svg
                                className="w-5 h-5 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                              </svg>
                            )}
                          </button>
                        }
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="bg-warning-50 border-l-4 border-warning-500 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <svg
                          className="w-5 h-5 text-warning-600 mt-0.5 flex-shrink-0"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <div>
                          <p className="font-semibold text-warning-800 text-sm mb-1">
                            Password Reset Required
                          </p>
                          <p className="text-sm text-warning-700">
                            Your account requires a password change. Please
                            create a new secure password.
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
                      classNames={{
                        label: "font-semibold text-gray-700",
                      }}
                      endContent={
                        <button
                          className="focus:outline-none"
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? (
                            <svg
                              className="w-5 h-5 text-gray-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                              />
                            </svg>
                          ) : (
                            <svg
                              className="w-5 h-5 text-gray-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                          )}
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
                      classNames={{
                        label: "font-semibold text-gray-700",
                      }}
                      endContent={
                        <button
                          className="focus:outline-none"
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                        >
                          {showConfirmPassword ? (
                            <svg
                              className="w-5 h-5 text-gray-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                              />
                            </svg>
                          ) : (
                            <svg
                              className="w-5 h-5 text-gray-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                          )}
                        </button>
                      }
                    />
                  </>
                )}
                <Button
                  color="secondary"
                  type="submit"
                  className="w-full font-semibold text-base h-12 mt-2 bg-gradient-to-r from-secondary to-purple-600 hover:from-purple-600 hover:to-secondary transition-all duration-300 shadow-lg hover:shadow-xl text-white"
                  isLoading={loading}
                  disabled={loading}
                  size="lg"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Processing...
                    </span>
                  ) : requirePasswordReset ? (
                    <span className="flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Set Password & Login
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Log In
                    </span>
                  )}
                </Button>
              </Form>

              {/* {!requirePasswordReset && (
                                <div className="mt-6 text-center">
                                    <p className="text-sm text-gray-600">
                                        Need help? <a href="#" className="text-secondary font-semibold hover:underline">Contact Support</a>
                                    </p>
                                </div>
                            )} */}
            </CardBody>
          </Card>

          <p className="text-center text-gray-500 text-sm mt-8 flex items-center justify-center gap-2">
            <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            Secure login powered by GKI App
          </p>
        </div>
      </div>
    </div>
  );
}
