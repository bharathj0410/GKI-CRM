"use client"
import React, { use, useEffect, useState } from 'react'
import { Card, CardBody, Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/react";
import { ArrowLeftIcon, PencilSquareIcon, ArrowRightCircleIcon } from '@heroicons/react/24/outline';
import ExistingGuestBanner from "@/components/CostingTab/ExistingGuestBanner"
import ProductDetails from "@/components/CostingTab/ProductDetails"
import EditGuestModal from "@/components/CostingTab/EditGuestModal"
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from "@/lib/axios"
import Toast from "@/components/Toast"

export default function GuestDetailPage({ params }) {
  const { id } = use(params);
  const [data, setData] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const router = useRouter();

  const fetchData = () => {
    if (id) {
      axios.get(`getGuestData?id=${id}`).then((response) => {
        setData(response.data[0])
      }).catch((err) => console.log(err))
    }
  }

  const handleMoveToCustomer = async () => {
    setIsMoving(true);
    try {
      const response = await axios.post("moveToCustomer", { id });
      if (response.status === 200) {
        Toast("Success", response.data.message, "success");
        setIsMoveModalOpen(false);
        router.push(`/costing/existing-customer/${id}`);
      }
    } catch (err) {
      Toast("Error", err?.response?.data?.error || "Failed to move guest", "danger");
    } finally {
      setIsMoving(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, [id])

  return (
    <div className="flex flex-col w-full min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="px-4 sm:px-6 lg:px-8 py-6 w-full">
        {/* Page Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/costing/existing-guest">
              <Button 
                variant="flat" 
                color="secondary"
                size="md"
                startContent={<ArrowLeftIcon className="w-4 h-4" />}
                className="font-semibold"
              >
                Back to Guest List
              </Button>
            </Link>
            <div className="h-8 w-px bg-gray-300 dark:bg-gray-600"></div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Guest Details</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">View and manage guest information</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              color="warning"
              variant="flat"
              startContent={<ArrowRightCircleIcon className="w-5 h-5" />}
              onPress={() => setIsMoveModalOpen(true)}
              className="font-semibold"
            >
              Move to Customer
            </Button>
            <Button
              color="secondary"
              variant="flat"
              startContent={<PencilSquareIcon className="w-5 h-5" />}
              onPress={() => setIsEditModalOpen(true)}
              className="font-semibold"
            >
              Edit Guest
            </Button>
          </div>
        </div>
        
        {data && (
          <div className="space-y-6">
            <ExistingGuestBanner data={data} />
            
            <EditGuestModal 
              isOpen={isEditModalOpen}
              onClose={() => setIsEditModalOpen(false)}
              data={data}
              onUpdate={fetchData}
            />

            {/* Move to Customer Confirmation Modal */}
            <Modal isOpen={isMoveModalOpen} onClose={() => setIsMoveModalOpen(false)} backdrop="blur">
              <ModalContent>
                <ModalHeader className="flex flex-col gap-1">
                  <span className="text-lg font-bold">Move Guest to Customer</span>
                </ModalHeader>
                <ModalBody>
                  <p className="text-gray-600 dark:text-gray-400">
                    Are you sure you want to move <strong>{data?.["company/person_name"]}</strong> ({data?.id}) from <strong>Guest</strong> to <strong>Customer</strong>?
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                    This will transfer all data and products to the customer section.
                  </p>
                </ModalBody>
                <ModalFooter>
                  <Button variant="flat" onPress={() => setIsMoveModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button color="warning" onPress={handleMoveToCustomer} isLoading={isMoving}>
                    Yes, Move to Customer
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>

            {/* Product Details Section */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-5">Product Details</h2>
              <ProductDetails id={id} type="guest" />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
