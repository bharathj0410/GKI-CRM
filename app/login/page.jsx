"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import axios from "axios";
import Toast from "@/components/Toast";
import LoginCard from "@/components/LoginCard";

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
        <LoginCard
          requirePasswordReset={requirePasswordReset}
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
          newPassword={newPassword}
          setNewPassword={setNewPassword}
          confirmPassword={confirmPassword}
          setConfirmPassword={setConfirmPassword}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          showNewPassword={showNewPassword}
          setShowNewPassword={setShowNewPassword}
          showConfirmPassword={showConfirmPassword}
          setShowConfirmPassword={setShowConfirmPassword}
          loading={loading}
          errors={errors}
          onSubmit={onSubmit}
        />
      </div>
    </div>
  );
}
