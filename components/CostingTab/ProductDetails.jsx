import React, { useCallback, useEffect, useState } from "react";
import {
    Input,
    Button,
    Chip,
    Card,
    CardBody,
    CardFooter,
    Pagination,
    Spinner,
    useDisclosure,
    Modal,
    ModalHeader,
    ModalBody,
    ModalContent,
    ModalFooter,
    Divider,
} from "@heroui/react";
import ProductOrderForm from "./ProductOrderForm";
import { CubeTransparentIcon, DocumentCurrencyRupeeIcon } from "@heroicons/react/24/outline";
import Toast from "../Toast";
import { useRouter } from 'next/navigation';
import axios from "@/lib/axios";
import DeleteProduct from "@/components/ui/deleteProduct"

export const columns = [
    { name: "ID", uid: "id", sortable: true },
    { name: "PRODUCT NAME", uid: "productName", sortable: true },
    // { name: "ENQUIRY DATE", uid: "enquiryDate", sortable: true },
    { name: "BOX TYPE", uid: "boxType", sortable: true },
    { name: "ORDER QUANTITY", uid: "orderQuantity" },
    { name: "PRINTING TYPE", uid: "printingType" },
    { name: "COLOR TYPE", uid: "colorType" },
    { name: "FLAP JOIN TYPE", uid: "flapJointType" },
    { name: "PIECES PER BUNDLE", uid: "piecesPerBundle" },
    { name: "Actions", uid: "actions" },
];

export const statusOptions = [
    { name: "Active", uid: "active" },
    { name: "Paused", uid: "paused" },
    { name: "Vacation", uid: "vacation" },
];


export function capitalize(s) {
    return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";
}

export const PlusIcon = ({ size = 24, width, height, ...props }) => {
    return (
        <svg
            aria-hidden="true"
            fill="none"
            focusable="false"
            height={size || height}
            role="presentation"
            viewBox="0 0 24 24"
            width={size || width}
            {...props}
        >
            <g
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
            >
                <path d="M6 12h12" />
                <path d="M12 18V6" />
            </g>
        </svg>
    );
};

export const VerticalDotsIcon = ({ size = 24, width, height, ...props }) => {
    return (
        <svg
            aria-hidden="true"
            fill="none"
            focusable="false"
            height={size || height}
            role="presentation"
            viewBox="0 0 24 24"
            width={size || width}
            {...props}
        >
            <path
                d="M12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 12c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
                fill="currentColor"
            />
        </svg>
    );
};

export const SearchIcon = (props) => {
    return (
        <svg
            aria-hidden="true"
            fill="none"
            focusable="false"
            height="1em"
            role="presentation"
            viewBox="0 0 24 24"
            width="1em"
            {...props}
        >
            <path
                d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
            />
            <path
                d="M22 22L20 20"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
            />
        </svg>
    );
};

export const ChevronDownIcon = ({ strokeWidth = 1.5, ...otherProps }) => {
    return (
        <svg
            aria-hidden="true"
            fill="none"
            focusable="false"
            height="1em"
            role="presentation"
            viewBox="0 0 24 24"
            width="1em"
            {...otherProps}
        >
            <path
                d="m19.92 8.95-6.52 6.52c-.77.77-2.03.77-2.8 0L4.08 8.95"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeMiterlimit={10}
                strokeWidth={strokeWidth}
            />
        </svg>
    );
};

export default function ProductDetails({ id, setAddProduct, addProduct, type = "guest", onAddNew }) {
    const [isLoading, setIsLoading] = useState(true);
    const [filterValue, setFilterValue] = useState("");
    const [selectedAction, setSelectedAction] = useState(null);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [products, setproducts] = useState([])
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selectedProduct, setSelectedProduct] = useState(null);
    useEffect(() => {
        axios.get(`getOrderDetails?parentId=${id}`).then((data) => {
            setproducts(data.data)
            setIsLoading(false)
        }).catch((err) => console.log(err))
    }, [])
    function updateData() {
        setIsLoading(true)
        axios.get(`getOrderDetails?parentId=${id}`).then((data) => {
            setproducts(data.data)
            setIsLoading(false)
        }).catch((err) => console.log(err))
    }


    const router = useRouter();
    function onClickGenerateQuotation(productId) {
        if (productId) {
            router.push(`/quotation?productId=${productId}&orderId=${id}`)
        } else {
            Toast("Product Not Selected", "Oops! Please select a product before proceeding", "danger")
        }
    }

    function handleCardClick(product) {
        // Navigate to product detail page
        const basePath = type === "customer" ? "customer" : "guest";
        // Extract product ID without GKI/ prefix
        const productId = product.id.includes('/') ? product.id.split('/').pop() : product.id;
        router.push(`/costing/${basePath}/${id}/${productId}`);
    }

    function handleAddSubProduct() {
        setSelectedAction("addSub");
        // Keep modal open, just change the action
    }



    const [page, setPage] = React.useState(1);

    const hasSearchFilter = Boolean(filterValue);

    const filteredItems = React.useMemo(() => {
        let filteredUsers = [...products];

        if (hasSearchFilter) {
            filteredUsers = filteredUsers.filter((user) =>
                user.productName?.toLowerCase().includes(filterValue.toLowerCase()),
            );
        }

        return filteredUsers;
    }, [products, filterValue, hasSearchFilter]);

    const pages = Math.ceil(filteredItems.length / rowsPerPage) || 1;

    const items = React.useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return filteredItems.slice(start, end);
    }, [page, filteredItems, rowsPerPage]);

    const onNextPage = React.useCallback(() => {
        if (page < pages) {
            setPage(page + 1);
        }
    }, [page, pages]);

    const onPreviousPage = React.useCallback(() => {
        if (page > 1) {
            setPage(page - 1);
        }
    }, [page]);

    const onRowsPerPageChange = React.useCallback((e) => {
        setRowsPerPage(Number(e.target.value));
        setPage(1);
    }, []);

    const onSearchChange = React.useCallback((value) => {
        if (value) {
            setFilterValue(value);
            setPage(1);
        } else {
            setFilterValue("");
        }
    }, []);

    const onClear = React.useCallback(() => {
        setFilterValue("");
        setPage(1);
    }, []);

    const topContent = React.useMemo(() => {
        return (
            <div className="flex flex-col gap-4">
                <div className="flex justify-between gap-3 items-end">
                    <Input
                        isClearable
                        className="w-full sm:max-w-[44%]"
                        placeholder="Search by product name..."
                        startContent={<SearchIcon />}
                        value={filterValue}
                        onClear={() => onClear()}
                        onValueChange={onSearchChange}
                    />
                    <div className="flex gap-3">
                        <Button color="secondary" endContent={<PlusIcon />} onPress={() => {
                            if (onAddNew) {
                                onAddNew();
                            }
                        }}>
                            Add New
                        </Button>
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-default-400 text-small">Total {products.length} products</span>
                    <label className="flex items-center text-default-400 text-small">
                        Rows per page:
                        <select
                            className="bg-transparent outline-none text-default-400 text-small"
                            onChange={onRowsPerPageChange}
                        >
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="15">15</option>
                        </select>
                    </label>
                </div>
            </div>
        );
    }, [
        filterValue,
        products.length,
        onSearchChange,
        hasSearchFilter,
        onRowsPerPageChange,
    ]);

    const bottomContent = React.useMemo(() => {
        return (
            <div className="py-2 px-2 flex justify-between items-center">
                <span className="w-[30%] text-small text-default-400">
                    Total {filteredItems.length} products
                </span>
                <Pagination
                    isCompact
                    showControls
                    showShadow
                    color="secondary"
                    page={page}
                    total={pages}
                    onChange={setPage}
                />
                <div className="hidden sm:flex w-[30%] justify-end gap-2">
                    <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onPreviousPage}>
                        Previous
                    </Button>
                    <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onNextPage}>
                        Next
                    </Button>
                </div>
            </div>
        );
    }, [filteredItems.length, page, pages]);

    const getModalContent = () => {
        if (selectedAction === "details") {
            return (
                <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-4">
                        <CubeTransparentIcon className="w-8 h-8 text-secondary" />
                        <div>
                            <h3 className="text-2xl font-semibold">{selectedProduct?.productName}</h3>
                            {selectedProduct?.enquiryDate && (
                                <p className="text-sm text-default-400">{selectedProduct?.enquiryDate}</p>
                            )}
                        </div>
                    </div>
                    
                    <Divider />
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-default-400 text-sm">Box Type</p>
                            <p className="font-medium text-lg">{selectedProduct?.boxType || "-"}</p>
                        </div>
                        <div>
                            <p className="text-default-400 text-sm">Order Quantity</p>
                            <p className="font-medium text-lg">{selectedProduct?.orderQuantity || "-"}</p>
                        </div>
                        <div>
                            <p className="text-default-400 text-sm">Printing Type</p>
                            <p className="font-medium text-lg">{selectedProduct?.printingType || "-"}</p>
                        </div>
                        <div>
                            <p className="text-default-400 text-sm">Color Type</p>
                            <p className="font-medium text-lg">{selectedProduct?.colorType || "-"}</p>
                        </div>
                        <div>
                            <p className="text-default-400 text-sm">Flap Join Type</p>
                            <p className="font-medium text-lg">{selectedProduct?.flapJointType || "-"}</p>
                        </div>
                        <div>
                            <p className="text-default-400 text-sm">Pieces Per Bundle</p>
                            <p className="font-medium text-lg">{selectedProduct?.piecesPerBundle || "-"}</p>
                        </div>
                    </div>

                    <Divider />

                    <div className="flex gap-3 justify-end flex-wrap">
                        <Button 
                            color="secondary" 
                            variant="flat"
                            endContent={<PlusIcon />}
                            onPress={() => handleAddSubProduct()}
                        >
                            Add Sub Product
                        </Button>
                        <Button 
                            color="secondary"
                            endContent={<DocumentCurrencyRupeeIcon className='w-5' />}
                            onPress={() => {
                                onClickGenerateQuotation(selectedProduct?.id);
                                onClose();
                            }}
                        >
                            Generate Quotation
                        </Button>
                        <Button 
                            color="primary"
                            onPress={() => setSelectedAction("edit")}
                        >
                            Edit
                        </Button>
                        <Button 
                            color="danger"
                            onPress={() => setSelectedAction("delete")}
                        >
                            Delete
                        </Button>
                    </div>
                </div>
            );
        }
        else if (selectedAction === "edit") {
            return <ProductOrderForm billId={id} isDisabled={false} formData={selectedProduct} updateData={updateData} onClose={onClose}/>;
        }
        else if (selectedAction === "delete") {
            return <DeleteProduct data={selectedProduct} />;
        }
        else if (selectedAction === "add" || selectedAction === "addSub") {
            return <ProductOrderForm billId={id} isDisabled={false} updateData={updateData} onClose={onClose} />;
        }
        return null;
    }

    return (
        <div>
            <Modal 
                isOpen={isOpen} 
                size={selectedAction === "delete" ? "xl" : selectedAction === "details" ? "3xl" : "6xl"} 
                onClose={onClose} 
                backdrop="blur" 
                placement="center"
                scrollBehavior="inside"
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            {selectedAction === "delete" && (
                                <ModalHeader className="flex flex-col gap-1 font-light text-base">
                                    Delete Product
                                </ModalHeader>
                            )}
                            {selectedAction === "details" && (
                                <ModalHeader className="flex flex-col gap-1 font-light text-xl">
                                    Product Details
                                </ModalHeader>
                            )}
                            {selectedAction === "addSub" && (
                                <ModalHeader className="flex flex-col gap-1 font-light text-xl">
                                    Add Sub Product
                                </ModalHeader>
                            )}
                            <ModalBody>
                                {getModalContent()}
                            </ModalBody>
                            {selectedAction === "delete" && (
                                <ModalFooter>
                                    <Button color="secondary" variant="light" onPress={onClose}>
                                        Close
                                    </Button>
                                    <Button color="danger" onPress={onClose}>
                                        Delete
                                    </Button>
                                </ModalFooter>
                            )}
                        </>
                    )}
                </ModalContent>
            </Modal>

            <div className="flex flex-col gap-4">
                {topContent}

                {isLoading ? (
                    <div className="flex justify-center items-center py-20">
                        <Spinner label="Loading..." />
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-20 text-default-400">
                        No products found
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                            {items.map((product) => (
                                <Card 
                                    key={product.id} 
                                    isPressable
                                    onPress={() => handleCardClick(product)}
                                    className="group shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer overflow-hidden border-none bg-white dark:bg-gray-800 rounded-xl"
                                >
                                    {/* Top accent bar */}
                                    <div className="h-1 w-full bg-gradient-to-r from-secondary-500 via-purple-500 to-violet-500"></div>

                                    <CardBody className="p-5">
                                        {/* Header: Icon + Name + Date */}
                                        <div className="flex items-center gap-3.5 mb-4">
                                            <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-900/20 ring-1 ring-purple-500/20 flex-shrink-0 transition-transform duration-300 group-hover:scale-110">
                                                <CubeTransparentIcon className="w-6 h-6 text-purple-500 dark:text-purple-400" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-bold text-lg text-gray-900 dark:text-white truncate leading-tight">
                                                    {product.productName}
                                                </p>
                                                {product.enquiryDate && (
                                                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{product.enquiryDate}</p>
                                                )}
                                            </div>
                                            <Chip size="sm" variant="flat" color="secondary" classNames={{ content: "text-[10px] font-bold uppercase tracking-wide" }}>
                                                {product.id?.includes('/') ? product.id.split('/').pop() : product.id}
                                            </Chip>
                                        </div>

                                        {/* Divider */}
                                        <div className="h-px bg-gray-100 dark:bg-gray-700/60 mb-4"></div>

                                        {/* Info grid */}
                                        <div className="grid grid-cols-3 gap-x-5 gap-y-3">
                                            <div>
                                                <p className="text-[11px] text-gray-400 dark:text-gray-500 font-medium leading-none mb-1">Box Type</p>
                                                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">{product.boxType || "—"}</p>
                                            </div>
                                            <div>
                                                <p className="text-[11px] text-gray-400 dark:text-gray-500 font-medium leading-none mb-1">Order Qty</p>
                                                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">{product.orderQuantity || "—"}</p>
                                            </div>
                                            <div>
                                                <p className="text-[11px] text-gray-400 dark:text-gray-500 font-medium leading-none mb-1">Printing</p>
                                                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">{product.printingType || "—"}</p>
                                            </div>
                                            <div>
                                                <p className="text-[11px] text-gray-400 dark:text-gray-500 font-medium leading-none mb-1">Color Type</p>
                                                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">{product.colorType || "—"}</p>
                                            </div>
                                            <div>
                                                <p className="text-[11px] text-gray-400 dark:text-gray-500 font-medium leading-none mb-1">Flap Join</p>
                                                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">{product.flapJointType || "—"}</p>
                                            </div>
                                            <div>
                                                <p className="text-[11px] text-gray-400 dark:text-gray-500 font-medium leading-none mb-1">Pcs/Bundle</p>
                                                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">{product.piecesPerBundle || "—"}</p>
                                            </div>
                                        </div>

                                        {/* Footer */}
                                        <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700/50 flex items-center justify-end">
                                            <span className="text-xs font-semibold text-secondary-500 dark:text-secondary-400 group-hover:text-secondary-600 dark:group-hover:text-secondary-300 transition-colors flex items-center gap-1">
                                                View details
                                                <svg className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
                                            </span>
                                        </div>
                                    </CardBody>
                                </Card>
                            ))}
                        </div>
                        {bottomContent}
                    </>
                )}
            </div>
        </div>
    );
}

