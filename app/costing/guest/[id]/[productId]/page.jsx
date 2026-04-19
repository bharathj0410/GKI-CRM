"use client";
import React, { use, useEffect, useState } from "react";
import {
  Card,
  CardBody,
  Button,
  Divider,
  Chip,
  Tabs,
  Tab,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";
import {
  ArrowLeftIcon,
  DocumentCurrencyRupeeIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  InboxArrowDownIcon,
  CubeIcon,
} from "@heroicons/react/24/outline";
import { CubeTransparentIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "@/lib/axios";
import QuotationCard from "@/components/CostingTab/QuotationCard";
import ProductOrderForm from "@/components/CostingTab/ProductOrderForm";
import DeleteProduct from "@/components/ui/deleteProduct";

export default function ProductDetailPage({ params }) {
  const { id, productId } = use(params);
  const [productData, setProductData] = useState(null);
  const [subProducts, setSubProducts] = useState([]);
  const [quotations, setQuotations] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalType, setModalType] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (productId) {
      // Fetch product details
      axios
        .get(`getOrderDetails?parentId=${id}`)
        .then((response) => {
          // Find product by matching either full ID or ID without GKI/ prefix
          const product = response.data.find((p) => {
            const dbId = p.id.includes("/") ? p.id.split("/").pop() : p.id;
            return dbId === productId || p.id === productId;
          });
          setProductData(product);

          // Fetch sub products for this product
          if (product?.id) {
            axios
              .get(`getOrderDetails?parentId=${product.id}`)
              .then((res) => {
                setSubProducts(res.data || []);
              })
              .catch((err) => console.log(err));
          }
        })
        .catch((err) => console.log(err));

      // Fetch quotations
      axios
        .get(`getQuotation?id=${id}`)
        .then((response) => {
          setQuotations(response.data || []);
        })
        .catch((err) => console.log(err));
    }
  }, [id, productId]);

  const handleGenerateQuotation = () => {
    if (productData?.id) {
      router.push(`/quotation?productId=${productData.id}&orderId=${id}`);
    }
  };

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
      await axios.delete(`deleteProduct?id=${productData.id}`);
      onClose();
      router.push(`/costing/guest/${id}`);
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleAddSubProduct = () => {
    setModalType("addSubProduct");
    onOpen();
  };

  const updateData = () => {
    // Refresh product data
    if (productId) {
      axios
        .get(`getOrderDetails?parentId=${id}`)
        .then((response) => {
          const product = response.data.find((p) => {
            const dbId = p.id.includes("/") ? p.id.split("/").pop() : p.id;
            return dbId === productId || p.id === productId;
          });
          setProductData(product);
          // Also refresh sub products
          if (product?.id) {
            axios
              .get(`getOrderDetails?parentId=${product.id}`)
              .then((res) => {
                setSubProducts(res.data || []);
              })
              .catch((err) => console.log(err));
          }
        })
        .catch((err) => console.log(err));
    }
  };

  if (!productData) {
    return (
      <div className="flex flex-col w-full min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="px-4 sm:px-6 lg:px-8 py-6 w-full">
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500">Loading product details...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="px-4 sm:px-6 lg:px-8 py-6 w-full">
        {/* Page Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href={`/costing/guest/${id}`}>
              <Button
                variant="flat"
                color="secondary"
                size="md"
                startContent={<ArrowLeftIcon className="w-4 h-4" />}
                className="font-semibold"
              >
                Back to Guest
              </Button>
            </Link>
            <div className="h-8 w-px bg-gray-300 dark:bg-gray-600"></div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Product Details
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                View and manage product information
              </p>
            </div>
          </div>
        </div>

        {/* Product Details Card */}
        <div className="rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-md border border-gray-200/80 dark:border-gray-700">
          {/* Accent bar */}
          <div className="h-1 w-full bg-gradient-to-r from-secondary-500 via-purple-500 to-violet-500"></div>

          <div className="p-6">
            {/* Header: Icon + Name + ID */}
            <div className="flex items-center gap-4 mb-5">
              <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-900/20 ring-1 ring-purple-500/20 flex-shrink-0">
                <CubeTransparentIcon className="w-8 h-8 text-purple-500 dark:text-purple-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white truncate leading-tight">
                  {productData.productName}
                </h2>
                {productData.enquiryDate && (
                  <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">
                    Enquiry: {productData.enquiryDate}
                  </p>
                )}
              </div>
              <Chip
                variant="flat"
                color="secondary"
                classNames={{
                  base: "border border-secondary-200/60 dark:border-secondary-700/40",
                  content: "font-bold text-xs",
                }}
              >
                {productData.id}
              </Chip>
            </div>

            {/* Divider */}
            <div className="h-px bg-gray-100 dark:bg-gray-700/60 mb-5"></div>

            {/* Info grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-4 mb-6">
              <div>
                <p className="text-[11px] text-gray-400 dark:text-gray-500 font-medium leading-none mb-1">
                  Box Type
                </p>
                <p className="text-base font-semibold text-gray-800 dark:text-gray-200">
                  {productData.boxType || "—"}
                </p>
              </div>
              <div>
                <p className="text-[11px] text-gray-400 dark:text-gray-500 font-medium leading-none mb-1">
                  Order Quantity
                </p>
                <p className="text-base font-semibold text-gray-800 dark:text-gray-200">
                  {productData.orderQuantity || "—"}
                </p>
              </div>
              <div>
                <p className="text-[11px] text-gray-400 dark:text-gray-500 font-medium leading-none mb-1">
                  Printing Type
                </p>
                <p className="text-base font-semibold text-gray-800 dark:text-gray-200">
                  {productData.printingType || "—"}
                </p>
              </div>
              <div>
                <p className="text-[11px] text-gray-400 dark:text-gray-500 font-medium leading-none mb-1">
                  Color Type
                </p>
                <p className="text-base font-semibold text-gray-800 dark:text-gray-200">
                  {productData.colorType || "—"}
                </p>
              </div>
              <div>
                <p className="text-[11px] text-gray-400 dark:text-gray-500 font-medium leading-none mb-1">
                  Flap Join Type
                </p>
                <p className="text-base font-semibold text-gray-800 dark:text-gray-200">
                  {productData.flapJointType || "—"}
                </p>
              </div>
              <div>
                <p className="text-[11px] text-gray-400 dark:text-gray-500 font-medium leading-none mb-1">
                  Pieces Per Bundle
                </p>
                <p className="text-base font-semibold text-gray-800 dark:text-gray-200">
                  {productData.piecesPerBundle || "—"}
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-gray-100 dark:bg-gray-700/60 mb-5"></div>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-end flex-wrap">
              <Button
                color="secondary"
                variant="flat"
                size="sm"
                startContent={<PencilIcon className="w-4 h-4" />}
                onPress={handleEdit}
                className="font-semibold"
              >
                Edit Product
              </Button>
              <Button
                color="danger"
                variant="flat"
                size="sm"
                startContent={<TrashIcon className="w-4 h-4" />}
                onPress={handleDelete}
                className="font-semibold"
              >
                Delete Product
              </Button>
            </div>
          </div>
        </div>

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
                    ? "Edit Product"
                    : modalType === "addSubProduct"
                      ? "Add Sub Product"
                      : "Delete Product"}
                </ModalHeader>
                <ModalBody>
                  {modalType === "edit" && productData && (
                    <ProductOrderForm
                      billId={id}
                      isDisabled={false}
                      formData={productData}
                      updateData={updateData}
                      onClose={onClose}
                    />
                  )}
                  {modalType === "addSubProduct" && productData && (
                    <ProductOrderForm
                      billId={productData.id}
                      isDisabled={false}
                      updateData={updateData}
                      onClose={onClose}
                    />
                  )}
                  {modalType === "delete" && productData && (
                    <DeleteProduct data={productData} onClose={onClose} />
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

        {/* Tabs Section */}
        <div className="mt-6">
          <Tabs
            aria-label="Product Details Tabs"
            className="w-full"
            color="secondary"
            variant="underlined"
            classNames={{
              tabList:
                "gap-6 w-full relative rounded-none p-0 border-b border-gray-200 dark:border-gray-700",
              cursor: "w-full bg-secondary-500",
              tab: "max-w-fit px-4 h-12 font-semibold",
              tabContent:
                "group-data-[selected=true]:text-secondary-600 dark:group-data-[selected=true]:text-secondary-400",
            }}
          >
            {/* Sub Products Tab */}
            <Tab key="sub-products" title="Sub Products">
              <div className="mt-4">
                <div className="flex justify-between items-center mb-5">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Sub Products
                  </h3>
                  <Button
                    color="secondary"
                    size="sm"
                    startContent={<PlusIcon className="w-4 h-4" />}
                    onPress={handleAddSubProduct}
                    className="font-semibold"
                  >
                    Add Sub Product
                  </Button>
                </div>

                {subProducts.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    {subProducts.map((subProduct) => {
                      const subProductId = subProduct.id.includes("/")
                        ? subProduct.id.split("/").pop()
                        : subProduct.id;
                      return (
                        <div
                          key={subProduct.id}
                          onClick={() =>
                            router.push(
                              `/costing/guest/${id}/${productId}/${subProductId}`,
                            )
                          }
                          className="group rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer border border-gray-200/80 dark:border-gray-700"
                        >
                          <div className="h-1 w-full bg-gradient-to-r from-secondary-500 via-purple-500 to-violet-500"></div>
                          <div className="p-5">
                            {/* Header */}
                            <div className="flex items-center gap-3 mb-4">
                              <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-900/20 ring-1 ring-purple-500/20 flex-shrink-0 transition-transform duration-300 group-hover:scale-110">
                                <CubeIcon className="w-5 h-5 text-purple-500 dark:text-purple-400" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-bold text-base text-gray-900 dark:text-white truncate leading-tight">
                                  {subProduct.productName}
                                </p>
                                {subProduct.enquiryDate && (
                                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                                    {subProduct.enquiryDate}
                                  </p>
                                )}
                              </div>
                              <Chip
                                size="sm"
                                variant="flat"
                                color="secondary"
                                classNames={{
                                  content:
                                    "text-[10px] font-bold uppercase tracking-wide",
                                }}
                              >
                                {subProductId}
                              </Chip>
                            </div>
                            <div className="h-px bg-gray-100 dark:bg-gray-700/60 mb-3"></div>
                            <div className="grid grid-cols-2 gap-x-5 gap-y-2.5">
                              <div>
                                <p className="text-[11px] text-gray-400 dark:text-gray-500 font-medium leading-none mb-0.5">
                                  Box Type
                                </p>
                                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">
                                  {subProduct.boxType || "—"}
                                </p>
                              </div>
                              <div>
                                <p className="text-[11px] text-gray-400 dark:text-gray-500 font-medium leading-none mb-0.5">
                                  Order Qty
                                </p>
                                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">
                                  {subProduct.orderQuantity || "—"}
                                </p>
                              </div>
                              <div>
                                <p className="text-[11px] text-gray-400 dark:text-gray-500 font-medium leading-none mb-0.5">
                                  Printing
                                </p>
                                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">
                                  {subProduct.printingType || "—"}
                                </p>
                              </div>
                              <div>
                                <p className="text-[11px] text-gray-400 dark:text-gray-500 font-medium leading-none mb-0.5">
                                  Color Type
                                </p>
                                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">
                                  {subProduct.colorType || "—"}
                                </p>
                              </div>
                            </div>
                            {/* Footer */}
                            <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700/50 flex items-center justify-end">
                              <span className="text-xs font-semibold text-secondary-500 dark:text-secondary-400 group-hover:text-secondary-600 transition-colors flex items-center gap-1">
                                View details
                                <svg
                                  className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                  strokeWidth={2.5}
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M8.25 4.5l7.5 7.5-7.5 7.5"
                                  />
                                </svg>
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 rounded-xl bg-white dark:bg-gray-800 border border-gray-200/80 dark:border-gray-700">
                    <div className="p-4 rounded-2xl bg-gray-100 dark:bg-gray-700/50 mb-4">
                      <CubeIcon className="w-10 h-10 text-gray-400 dark:text-gray-500" />
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 font-semibold">
                      No sub products available
                    </p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                      Add sub products to see them here
                    </p>
                  </div>
                )}
              </div>
            </Tab>

            {/* Quotations Tab */}
            <Tab key="quotations" title="Quotations">
              <div className="mt-4">
                <div className="flex justify-between items-center mb-5">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Quotations
                  </h3>
                  <Button
                    color="secondary"
                    size="sm"
                    startContent={
                      <DocumentCurrencyRupeeIcon className="w-4 h-4" />
                    }
                    onPress={handleGenerateQuotation}
                    className="font-semibold"
                  >
                    Generate Quotation
                  </Button>
                </div>

                {quotations && quotations.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {quotations.map((data) => (
                      <QuotationCard data={data} key={data.id} />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 rounded-xl bg-white dark:bg-gray-800 border border-gray-200/80 dark:border-gray-700">
                    <div className="p-4 rounded-2xl bg-gray-100 dark:bg-gray-700/50 mb-4">
                      <DocumentCurrencyRupeeIcon className="w-10 h-10 text-gray-400 dark:text-gray-500" />
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 font-semibold">
                      No quotations available
                    </p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                      Generate a quotation to see it here
                    </p>
                  </div>
                )}
              </div>
            </Tab>

            {/* Jobs Tab */}
            <Tab key="jobs" title="Jobs">
              <div className="mt-4">
                <div className="flex flex-col items-center justify-center py-16 rounded-xl bg-white dark:bg-gray-800 border border-gray-200/80 dark:border-gray-700">
                  <div className="p-4 rounded-2xl bg-gray-100 dark:bg-gray-700/50 mb-4">
                    <InboxArrowDownIcon className="w-10 h-10 text-gray-400 dark:text-gray-500" />
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 font-semibold">
                    Jobs section coming soon
                  </p>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                    Job management features will be available here
                  </p>
                </div>
              </div>
            </Tab>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
