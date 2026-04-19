"use client"
import React, { use, useEffect, useState } from 'react'
import { Card, CardBody, Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/react";
import { ArrowLeftIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import ExistingGuestBanner from "@/components/CostingTab/ExistingGuestBanner"
import ProductDetails from "@/components/CostingTab/ProductDetails"
import ProductOrderForm from "@/components/CostingTab/ProductOrderForm"
import EditGuestModal from "@/components/CostingTab/EditGuestModal"
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from "@/lib/axios"
import Toast from "@/components/Toast"

export default function CustomerDetailPage({ params }) {
  const { id } = use(params);
  const [data, setData] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const router = useRouter();

  const fetchData = () => {
    if (id) {
      axios.get(`getGuestData?id=${id}`).then((response) => {
        setData(response.data[0])
      }).catch((err) => console.log(err))
    }
  }

  const handleDeleteCustomer = async () => {
    setIsDeleting(true);
    try {
      const response = await axios.delete(`deleteGuestData?id=${id}`);
      if (response.status === 200) {
        Toast("Deleted", response.data.message, "success");
        setIsDeleteModalOpen(false);
        router.push("/costing/customer");
      }
    } catch (err) {
      Toast("Error", err?.response?.data?.error || "Failed to delete customer", "danger");
    } finally {
      setIsDeleting(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, [id])

  if (showAddProduct) {
    return (
      <div className="flex flex-col w-full min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="px-4 sm:px-6 lg:px-8 py-6 w-full">
          <div className="mb-6 flex items-center gap-4">
            <Button 
              variant="flat" 
              color="default"
              size="md"
              startContent={<ArrowLeftIcon className="w-4 h-4" />}
              className="font-semibold"
              onPress={() => setShowAddProduct(false)}
            >
              Back to Customer
            </Button>
            <div className="h-8 w-px bg-gray-300 dark:bg-gray-600"></div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Add New Product</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{data?.["company/person_name"]} &bull; {id}</p>
            </div>
          </div>
          <Card className="shadow-md border border-gray-200 dark:border-gray-700">
            <CardBody className="p-6">
              <ProductOrderForm 
                billId={id} 
                isDisabled={false} 
                updateData={() => {
                  setRefreshKey(prev => prev + 1);
                  setShowAddProduct(false);
                }} 
                onClose={() => setShowAddProduct(false)} 
              />
            </CardBody>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col w-full min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="px-4 sm:px-6 lg:px-8 py-6 w-full">
        {/* Page Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/costing/customer">
              <Button 
                variant="flat" 
                color="secondary"
                size="md"
                startContent={<ArrowLeftIcon className="w-4 h-4" />}
                className="font-semibold"
              >
                Back to Customer List
              </Button>
            </Link>
            <div className="h-8 w-px bg-gray-300 dark:bg-gray-600"></div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Customer Details</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">View and manage customer information</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              color="danger"
              variant="flat"
              startContent={<TrashIcon className="w-5 h-5" />}
              onPress={() => setIsDeleteModalOpen(true)}
              className="font-semibold"
            >
              Delete Customer
            </Button>
            <Button
              color="secondary"
              variant="flat"
              startContent={<PencilSquareIcon className="w-5 h-5" />}
              onPress={() => setIsEditModalOpen(true)}
              className="font-semibold"
            >
              Edit Customer
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

            {/* Delete Customer Confirmation Modal */}
            <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} backdrop="blur">
              <ModalContent>
                <ModalHeader className="flex flex-col gap-1">
                  <span className="text-lg font-bold text-danger">Delete Customer</span>
                </ModalHeader>
                <ModalBody>
                  <p className="text-gray-600 dark:text-gray-400">
                    Are you sure you want to permanently delete <strong>{data?.["company/person_name"]}</strong> ({data?.id})?
                  </p>
                  <p className="text-sm text-danger-500 mt-1">
                    This action cannot be undone. All associated products and data will be permanently removed.
                  </p>
                </ModalBody>
                <ModalFooter>
                  <Button variant="flat" onPress={() => setIsDeleteModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button color="danger" onPress={handleDeleteCustomer} isLoading={isDeleting}>
                    Yes, Delete Customer
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>

            {/* Product Details Section */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-5">Product Details</h2>
              <ProductDetails key={refreshKey} id={id} type="customer" onAddNew={() => setShowAddProduct(true)} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
