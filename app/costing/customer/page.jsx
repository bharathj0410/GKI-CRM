"use client"
import React from 'react'
import { Button } from "@heroui/react";
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import GuestCustomerTable from "@/components/CostingTab/GuestCustomerTable"
import Link from 'next/link';

export default function ExistingCustomerPage() {
  return (
    <div className="flex flex-col w-full min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="px-4 sm:px-6 lg:px-8 py-6 w-full">
        <div className="mb-5 flex items-center gap-3">
          <Link href="/costing">
            <Button 
              variant="flat" 
              color="default"
              size="sm"
              startContent={<ArrowLeftIcon className="w-4 h-4" />}
              className="font-medium"
            >
              Back to Costing
            </Button>
          </Link>
          <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Customer</h1>
        </div>
        <GuestCustomerTable type="customer" baseRoute="/costing/customer" />
      </div>
    </div>
  )
}
