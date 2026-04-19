"use client";
import React from "react";
import { Card, CardBody, Button } from "@heroui/react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import CompanyBillingForm from "@/components/CostingTab/CompanyBillingForm";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewGuestPage() {
  const router = useRouter();

  const handleGuestCreated = (id) => {
    router.push("/costing/guest");
  };

  return (
    <div className="flex flex-col w-full">
      <div className="px-4 sm:px-6 lg:px-8 py-6 w-full">
        <div className="mb-4 flex items-center gap-3">
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            New Guest
          </h1>
        </div>
        <Card className="shadow-md border border-gray-200 dark:border-gray-700">
          <CardBody className="p-4">
            <CompanyBillingForm setBillId={handleGuestCreated} />
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
