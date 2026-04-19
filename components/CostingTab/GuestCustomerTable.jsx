import React, { useCallback, useEffect, useState } from "react";
import {
    Card,
    CardBody,
    Input,
    Button,
    Pagination,
    Spinner,
    Avatar,
} from "@heroui/react";
import { 
    BuildingOffice2Icon, 
    EnvelopeIcon, 
    PhoneIcon, 
    MapPinIcon,
    UserIcon,
    CubeTransparentIcon 
} from "@heroicons/react/24/outline";
import { useRouter } from 'next/navigation';
import axios from "@/lib/axios";


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

export const SearchIcon = (props) => {
    return (
        <svg
            aria-hidden="true"
            fill="none"
            focusable="false"
            height={props.size || 24}
            role="presentation"
            viewBox="0 0 24 24"
            width={props.size || 24}
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

export default function GuestCustomerTable({ type = "guest", baseRoute = "/costing/guest" }) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [filterValue, setFilterValue] = useState("");
    const [rowsPerPage, setRowsPerPage] = useState(8);
    const [guests, setGuests] = useState([])
    const [page, setPage] = React.useState(1);
    
    useEffect(() => {
        axios.get('getGuestData').then((data) => {
            setGuests(data.data)
            setIsLoading(false)
        }).catch((err) => {
            console.log(err)
            setIsLoading(false)
        })
    }, [type])

    const hasSearchFilter = Boolean(filterValue);

    const filteredItems = React.useMemo(() => {
        let filteredUsers = [...guests];

        // Filter by type: "customer" shows only type==="customer", "guest" shows type undefined/null/"guest"
        if (type === "customer") {
            filteredUsers = filteredUsers.filter((user) => user.type === "customer");
        } else {
            filteredUsers = filteredUsers.filter((user) => !user.type || user.type === "guest");
        }

        if (hasSearchFilter) {
            filteredUsers = filteredUsers.filter((user) =>
                user["company/person_name"]?.toLowerCase().includes(filterValue.toLowerCase()) ||
                user.contact_email?.toLowerCase().includes(filterValue.toLowerCase()) ||
                user.contact_phone?.toLowerCase().includes(filterValue.toLowerCase())
            );
        }

        return filteredUsers;
    }, [guests, filterValue, hasSearchFilter, type]);

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
        setFilterValue("")
        setPage(1)
    }, [])

    return (
        <div className="w-full flex flex-col gap-4">
            {/* Search and Add Button */}
            <div className="flex justify-between gap-4 items-end">
                <Input
                    isClearable
                    className="w-full sm:max-w-[50%]"
                    placeholder={`Search ${type}s by name, email, or phone...`}
                    startContent={<SearchIcon />}
                    value={filterValue}
                    onClear={() => onClear()}
                    onValueChange={onSearchChange}
                    size="lg"
                    classNames={{
                        input: "text-sm",
                        inputWrapper: "h-12 border-2 border-gray-200 dark:border-gray-700 hover:border-secondary-300 dark:hover:border-secondary-600"
                    }}
                />
                <Button 
                    color="secondary" 
                    endContent={<PlusIcon />} 
                    onPress={() => router.push('/costing/new-guest')}
                    size="lg"
                    className="font-semibold shadow-md"
                >
                    Add New {type === 'guest' ? 'Guest' : 'Customer'}
                </Button>
            </div>

            {/* Results Count */}
            <div className="flex justify-between items-center px-1">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Total:</span>
                    <span className="px-3 py-1 bg-secondary-100 dark:bg-secondary-900/30 text-secondary-700 dark:text-secondary-300 rounded-full text-sm font-bold">
                        {filteredItems.length} {type}{filteredItems.length !== 1 ? 's' : ''}
                    </span>
                </div>
                <label className="flex items-center text-gray-600 dark:text-gray-400 text-sm font-medium">
                    Items per page:
                    <select
                        className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg outline-none text-gray-700 dark:text-gray-300 text-sm ml-2 px-2 py-1 font-semibold"
                        onChange={onRowsPerPageChange}
                        value={rowsPerPage}
                    >
                        <option value="4">4</option>
                        <option value="8">8</option>
                        <option value="16">16</option>
                    </select>
                </label>
            </div>

            {/* Cards Grid */}
            {isLoading ? (
                <div className="flex justify-center items-center py-20">
                    <Spinner label="Loading..." color="secondary" size="lg" />
                </div>
            ) : items.length === 0 ? (
                <div className="flex flex-col justify-center items-center py-20 px-4">
                    <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                        <BuildingOffice2Icon className="w-12 h-12 text-gray-400 dark:text-gray-600" />
                    </div>
                    <p className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-2">No {type}s found</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Try adjusting your search criteria</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    {items.map((item) => {
                        // Extract just the ID if it contains a slash (e.g., "GKI/ID-AA000001" -> "ID-AA000001")
                        const itemId = item.id?.includes('/') ? item.id.split('/').pop() : item.id;
                        return (
                        <Card 
                            key={item.id}
                            isPressable
                            onPress={() => router.push(`${baseRoute}/${itemId}`)}
                            className="group shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 bg-white dark:bg-gray-800 border border-gray-200/80 dark:border-gray-700 overflow-hidden rounded-xl"
                        >
                            <CardBody className="p-0">
                                {/* Accent top bar */}
                                <div className="h-1 w-full bg-gradient-to-r from-secondary-500 via-purple-500 to-violet-500"></div>

                                <div className="p-5">
                                    {/* Top row: Avatar + Name + Badge */}
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="relative flex-shrink-0">
                                            <Avatar
                                                src={item.logo}
                                                size="lg"
                                                className="w-14 h-14 ring-2 ring-secondary-100 dark:ring-secondary-900/40"
                                                fallback={
                                                    <BuildingOffice2Icon className="w-7 h-7 text-secondary-400" />
                                                }
                                            />
                                            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-400 rounded-full border-2 border-white dark:border-gray-800"></div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate leading-tight">
                                                {item["company/person_name"]}
                                            </h3>
                                            <span className="inline-flex items-center gap-1.5 mt-1 text-xs font-medium text-secondary-600 dark:text-secondary-400">
                                                <CubeTransparentIcon className="w-3.5 h-3.5" />
                                                {item.company_type || "Not specified"}
                                            </span>
                                        </div>
                                        <span className="flex-shrink-0 text-[10px] font-bold tracking-wide uppercase px-2.5 py-1 rounded-full bg-secondary-50 dark:bg-secondary-900/30 text-secondary-600 dark:text-secondary-400 border border-secondary-200/60 dark:border-secondary-700/40">
                                            {itemId}
                                        </span>
                                    </div>

                                    {/* Divider */}
                                    <div className="h-px bg-gray-100 dark:bg-gray-700/60 mb-4"></div>

                                    {/* Info grid - compact rows */}
                                    <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center flex-shrink-0">
                                                <UserIcon className="w-4 h-4 text-purple-500 dark:text-purple-400" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-[11px] text-gray-400 dark:text-gray-500 font-medium leading-none mb-0.5">Contact</p>
                                                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">
                                                    {item.contact_person_name || "—"}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2.5">
                                            <div className="w-8 h-8 rounded-lg bg-green-50 dark:bg-green-900/20 flex items-center justify-center flex-shrink-0">
                                                <PhoneIcon className="w-4 h-4 text-green-500 dark:text-green-400" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-[11px] text-gray-400 dark:text-gray-500 font-medium leading-none mb-0.5">Phone</p>
                                                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">
                                                    {item.contact_phone || "—"}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2.5">
                                            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
                                                <EnvelopeIcon className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-[11px] text-gray-400 dark:text-gray-500 font-medium leading-none mb-0.5">Email</p>
                                                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">
                                                    {item.contact_email || "—"}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2.5">
                                            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center flex-shrink-0">
                                                <MapPinIcon className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-[11px] text-gray-400 dark:text-gray-500 font-medium leading-none mb-0.5">Location</p>
                                                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">
                                                    {[item.billing_city, item.billing_state].filter(Boolean).join(", ") || "—"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="px-5 py-3 bg-gray-50/80 dark:bg-gray-800/80 border-t border-gray-100 dark:border-gray-700/50">
                                    <div className="flex items-center justify-end">
                                        <span className="text-xs font-semibold text-secondary-500 dark:text-secondary-400 group-hover:text-secondary-600 dark:group-hover:text-secondary-300 transition-colors flex items-center gap-1">
                                            View details
                                            <svg className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
                                        </span>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                        );
                    })}
                </div>
            )}

            {/* Pagination */}
            <div className="py-4 px-2 flex justify-between items-center bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-800/80 rounded-xl border border-gray-200 dark:border-gray-700">
                <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                    Showing <span className="text-secondary-600 dark:text-secondary-400">{items.length > 0 ? (page - 1) * rowsPerPage + 1 : 0}</span> to <span className="text-secondary-600 dark:text-secondary-400">{Math.min(page * rowsPerPage, filteredItems.length)}</span> of <span className="text-secondary-600 dark:text-secondary-400">{filteredItems.length}</span>
                </span>
                <Pagination
                    isCompact
                    showControls
                    showShadow
                    color="secondary"
                    page={page}
                    total={pages}
                    onChange={setPage}
                    classNames={{
                        cursor: "shadow-md"
                    }}
                />
                <div className="hidden sm:flex justify-end gap-2">
                    <Button isDisabled={page === 1} size="sm" variant="flat" onPress={onPreviousPage} className="font-semibold">
                        Previous
                    </Button>
                    <Button isDisabled={page === pages} size="sm" variant="flat" onPress={onNextPage} className="font-semibold">
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
}
