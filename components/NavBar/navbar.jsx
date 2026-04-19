"use client";
import React, { useState } from "react";
import {
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import { SidebarCloseIcon, SidebarOpenIcon } from "@/public/icons/sidebar";
import Dashboard from "@/public/icons/dashboard";
import { AddUser, AddStocks, Costing } from "@/public/icons/user";
import Avatar from "./Avatar";
import NavButton from "@/components/navButton";
import {
  ComputerDesktopIcon,
  UserPlusIcon,
  InboxStackIcon,
  BanknotesIcon,
  UserCircleIcon,
  BriefcaseIcon,
  ArrowLeftStartOnRectangleIcon,
  ArrowRightStartOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function Navbar({ setTab, tab }) {
  const [closeSideBar, setCloseSideBar] = useState(false);
  const { user, logout, hasPermission } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div
      className={`${closeSideBar ? "w-20" : "w-64"} duration-300 ease-in-out transition-all`}
    >
      <div className="p-3 text-white fixed h-screen z-50">
        <div
          className={`bg-gradient-to-b from-secondary via-secondary to-purple-800 ${closeSideBar ? "w-16" : "w-60"} h-full rounded-2xl flex flex-col ${closeSideBar ? "p-3" : "p-5"} duration-300 ease-in-out justify-between shadow-2xl border border-white/10`}
        >
          {/* Header Section */}
          <div>
            <div className="flex items-center justify-between mb-6">
              {!closeSideBar && (
                <img src="/logo.svg" alt="logo" className="h-16" />
              )}
              <button
                className="hover:bg-white/10 p-2 rounded-lg transition-all hover:scale-110"
                onClick={() => setCloseSideBar(!closeSideBar)}
              >
                {closeSideBar ? (
                  <ArrowRightStartOnRectangleIcon className="w-6" />
                ) : (
                  <ArrowLeftStartOnRectangleIcon className="w-6" />
                )}
              </button>
            </div>

            {closeSideBar && (
              <div className="flex justify-center mb-6">
                <img src="/small-logo.svg" alt="" className="w-8 h-8" />
              </div>
            )}

            <div className="w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent mb-6"></div>

            {/* Navigation Links */}
            <div className="flex flex-col gap-1.5">
              {hasPermission("dashboard") && (
                <NavButton
                  icon={<ComputerDesktopIcon className="w-6" />}
                  currentTab={tab}
                  tab={""}
                  setTab={setTab}
                  closeSideBar={closeSideBar}
                  name={"Dashboard"}
                  route="/"
                />
              )}
              {hasPermission("employee") && (
                <NavButton
                  icon={<UserPlusIcon className="w-6" />}
                  currentTab={tab}
                  tab={"employee"}
                  setTab={setTab}
                  closeSideBar={closeSideBar}
                  name={"Employee"}
                  route="/employee"
                />
              )}
              {hasPermission("stocks") && (
                <NavButton
                  icon={<InboxStackIcon className="w-6" />}
                  currentTab={tab}
                  tab={"stocks"}
                  setTab={setTab}
                  closeSideBar={closeSideBar}
                  name={"Stocks"}
                  route="/stocks"
                />
              )}
              {hasPermission("costing") && (
                <NavButton
                  icon={<BanknotesIcon className="w-6" />}
                  currentTab={tab}
                  tab={"costing"}
                  setTab={setTab}
                  closeSideBar={closeSideBar}
                  name={"Costing"}
                  route="/costing"
                />
              )}
              {hasPermission("visitors") && (
                <NavButton
                  icon={<UserCircleIcon className="w-6" />}
                  currentTab={tab}
                  tab={"visitors"}
                  setTab={setTab}
                  closeSideBar={closeSideBar}
                  name={"Visitors"}
                  route="/visitors"
                />
              )}
              {hasPermission("job") && (
                <NavButton
                  icon={<BriefcaseIcon className="w-6" />}
                  currentTab={tab}
                  tab={"job"}
                  setTab={setTab}
                  closeSideBar={closeSideBar}
                  name={"Job"}
                  route="/job"
                />
              )}
            </div>
          </div>

          {/* Bottom Section - User & Logout */}
          <div className="space-y-3">
            {/* User Profile Dropdown */}
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <div
                  className={`w-full flex ${closeSideBar ? "flex-col-reverse gap-2 justify-center" : ""} items-center bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10 hover:bg-white/10 transition-all cursor-pointer`}
                >
                  {!closeSideBar && (
                    <div className="flex items-center gap-3 flex-1">
                      <div className="relative">
                        <div className="bg-gradient-to-br from-primary-400 to-primary-600 rounded-full p-0.5">
                          <Avatar />
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-secondary"></div>
                      </div>
                      {user && (
                        <div className="text-xs flex-1 min-w-0">
                          <p className="font-semibold text-white truncate">
                            {user.name}
                          </p>
                          <p className="text-white/60 text-[10px] uppercase tracking-wide">
                            {user.role}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                  {closeSideBar && (
                    <div className="relative mx-auto">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full p-0.5">
                        <Avatar />
                      </div>
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-secondary"></div>
                    </div>
                  )}
                </div>
              </DropdownTrigger>
              <DropdownMenu aria-label="Profile Actions" variant="flat">
                <DropdownItem
                  key="profile"
                  className="h-14 gap-2"
                  textValue="Profile"
                >
                  <p className="font-semibold">Signed in as</p>
                  <p className="font-semibold">
                    {user?.email || user?.username}
                  </p>
                </DropdownItem>
                <DropdownItem key="settings" textValue="Settings">
                  My Settings
                </DropdownItem>
                <DropdownItem
                  key="configurations"
                  onPress={() => {
                    router.push("/config");
                  }}
                  textValue="Configurations"
                >
                  Configurations
                </DropdownItem>
                <DropdownItem
                  key="logout"
                  color="danger"
                  onPress={handleLogout}
                  textValue="Logout"
                >
                  Log Out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className={`w-full flex items-center ${closeSideBar ? "justify-center" : "gap-3"} px-3 py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/30 transition-all group`}
            >
              {/* <ArrowRightOnRectangleIcon className='w-5 h-5 text-red-400 group-hover:scale-110 transition-transform' /> */}
              {!closeSideBar && (
                <span className="text-sm font-medium text-red-400">Logout</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
