"use client";
import React, { use, useEffect, useState } from "react";
import {
  Card,
  CardBody,
  Button,
  Divider,
  Chip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";
import {
  ArrowLeftIcon,
  PencilIcon,
  TrashIcon,
  CubeIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "@/lib/axios";
import ProductOrderForm from "@/components/CostingTab/ProductOrderForm";
import DeleteProduct from "@/components/ui/deleteProduct";

export default function SubProductDetailPage({ params }) {
  const { id, productId, subProductId } = use(params);
  const [subProductData, setSubProductData] = useState(null);
  const [parentProductData, setParentProductData] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalType, setModalType] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (subProductId && productId) {
      // First fetch parent product to get its full ID
      axios
        .get(`getOrderDetails?parentId=${id}`)
        .then((response) => {
          const parentProduct = response.data.find((p) => {
            const dbId = p.id.includes("/") ? p.id.split("/").pop() : p.id;
            return dbId === productId || p.id === productId;
          });
          setParentProductData(parentProduct);

          // Then fetch sub product using parent product's full ID
          if (parentProduct?.id) {
            axios
              .get(`getOrderDetails?parentId=${parentProduct.id}`)
              .then((res) => {
                const subProduct = res.data.find((sp) => {
                  const dbId = sp.id.includes("/")
                    ? sp.id.split("/").pop()
                    : sp.id;
                  return dbId === subProductId || sp.id === subProductId;
                });
                setSubProductData(subProduct);
              })
              .catch((err) => console.log(err));
          }
        })
        .catch((err) => console.log(err));
    }
  }, [id, productId, subProductId]);

  const handleEdit = () => {
    setModalType("edit");
    onOpen();
  };

  const handleDelete = () => {
    setModalType("delete");
    onOpen();
  };

  const handleConfirmDelete = async () => {
    try {
      // Add delete API call here
      // await axios.delete(`deleteProduct?id=${subProductData.id}`);
      onClose();
      router.push(`/costing/guest/${id}/${productId}`);
    } catch (error) {
      console.error("Error deleting sub product:", error);
    }
  };

  const updateData = () => {
    // Refresh sub product data
    if (parentProductData?.id && subProductId) {
      axios
        .get(`getOrderDetails?parentId=${parentProductData.id}`)
        .then((res) => {
          const subProduct = res.data.find((sp) => {
            const dbId = sp.id.includes("/") ? sp.id.split("/").pop() : sp.id;
            return dbId === subProductId || sp.id === subProductId;
          });
          setSubProductData(subProduct);
        })
        .catch((err) => console.log(err));
    }
  };

  if (!subProductData) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6">
      {/* Breadcrumb Navigation */}
      <div className="mb-6">
        <Link href={`/costing/guest/${id}/${productId}`}>
          <Button
            startContent={<ArrowLeftIcon className="w-5 h-5" />}
            variant="light"
            color="secondary"
            className="font-semibold"
          >
            Back to Product
          </Button>
        </Link>
      </div>

      {/* Sub Product Information Card */}
      <Card className="shadow-xl border border-gray-200 dark:border-gray-700">
        {/* Gradient Header */}
        <div className="bg-gradient-to-r from-secondary-500 via-purple-500 to-purple-600 p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
          <div className="flex items-start gap-6 relative z-10">
            <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl shadow-2xl flex-shrink-0">
              <CubeIcon className="w-10 h-10 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white/90 font-medium mb-2 uppercase tracking-wide">
                Sub Product Details
              </p>
              <h1 className="font-bold text-3xl md:text-4xl text-white truncate mb-4 drop-shadow-lg">
                {subProductData.productName}
              </h1>
              <Chip
                size="lg"
                variant="flat"
                classNames={{
                  base: "bg-white/95 backdrop-blur-sm shadow-lg",
                  content: "font-bold text-secondary-700",
                }}
              >
                {subProductData.id}
              </Chip>
            </div>
          </div>
        </div>

        <CardBody className="p-8 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
          {/* Product Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 font-medium">
                Box Type
              </p>
              <p className="font-bold text-xl text-gray-900 dark:text-white">
                {subProductData.boxType || "-"}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 font-medium">
                Order Quantity
              </p>
              <p className="font-bold text-xl text-gray-900 dark:text-white">
                {subProductData.orderQuantity || "-"}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 font-medium">
                Printing Type
              </p>
              <p className="font-bold text-xl text-gray-900 dark:text-white">
                {subProductData.printingType || "-"}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 font-medium">
                Color Type
              </p>
              <p className="font-bold text-xl text-gray-900 dark:text-white">
                {subProductData.colorType || "-"}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 font-medium">
                Flap Join Type
              </p>
              <p className="font-bold text-xl text-gray-900 dark:text-white">
                {subProductData.flapJointType || "-"}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 font-medium">
                Pieces Per Bundle
              </p>
              <p className="font-bold text-xl text-gray-900 dark:text-white">
                {subProductData.piecesPerBundle || "-"}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 font-medium">
                Paper Type
              </p>
              <p className="font-bold text-xl text-gray-900 dark:text-white">
                {subProductData.paperType || "-"}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 font-medium">
                Paper GSM
              </p>
              <p className="font-bold text-xl text-gray-900 dark:text-white">
                {subProductData.paperGSM || "-"}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 font-medium">
                Enquiry Date
              </p>
              <p className="font-bold text-xl text-gray-900 dark:text-white">
                {subProductData.enquiryDate || "-"}
              </p>
            </div>
          </div>

          {/* Dimensions Section */}
          {(subProductData.length ||
            subProductData.width ||
            subProductData.height) && (
            <>
              <Divider className="my-6" />
              <div className="mb-8">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  Dimensions
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 font-medium">
                      Length
                    </p>
                    <p className="font-bold text-xl text-gray-900 dark:text-white">
                      {subProductData.length || "-"}
                    </p>
                  </div>

                  <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 font-medium">
                      Width
                    </p>
                    <p className="font-bold text-xl text-gray-900 dark:text-white">
                      {subProductData.width || "-"}
                    </p>
                  </div>

                  <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 font-medium">
                      Height
                    </p>
                    <p className="font-bold text-xl text-gray-900 dark:text-white">
                      {subProductData.height || "-"}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          <Divider className="my-6" />

          {/* Action Buttons */}
          <div className="flex gap-4 justify-end flex-wrap">
            <Button
              color="secondary"
              startContent={<PencilIcon className="w-5 h-5" />}
              onPress={handleEdit}
              className="font-semibold"
            >
              Edit Sub Product
            </Button>
            <Button
              color="danger"
              variant="flat"
              startContent={<TrashIcon className="w-5 h-5" />}
              onPress={handleDelete}
              className="font-semibold"
            >
              Delete Sub Product
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Edit/Delete Modal */}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size={modalType === "delete" ? "md" : "5xl"}
        scrollBehavior="inside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {modalType === "edit"
                  ? "Edit Sub Product"
                  : "Delete Sub Product"}
              </ModalHeader>
              <ModalBody>
                {modalType === "edit" &&
                  subProductData &&
                  parentProductData && (
                    <ProductOrderForm
                      billId={parentProductData.id}
                      isDisabled={false}
                      formData={subProductData}
                      updateData={updateData}
                      onClose={onClose}
                    />
                  )}
                {modalType === "delete" && subProductData && (
                  <DeleteProduct data={subProductData} onClose={onClose} />
                )}
              </ModalBody>
              {modalType === "delete" && (
                <ModalFooter>
                  <Button color="default" variant="light" onPress={onClose}>
                    Cancel
                  </Button>
                  <Button color="danger" onPress={handleConfirmDelete}>
                    Delete
                  </Button>
                </ModalFooter>
              )}
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
