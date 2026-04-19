'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Input, Spinner, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from '@heroui/react';
import axios from "@/lib/axios";
import Toast from "@/components/Toast";

export default function TagInput({ tableName, hasPrice }) {
    const [tags, setTags] = useState([]);
    const [originalTags, setOriginalTags] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [priceValue, setPriceValue] = useState('');
    const [error, setError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [tagToRemove, setTagToRemove] = useState(null);
    
    const { isOpen: isSaveOpen, onOpen: onSaveOpen, onClose: onSaveClose } = useDisclosure();
    const { isOpen: isRemoveOpen, onOpen: onRemoveOpen, onClose: onRemoveClose } = useDisclosure();

    useEffect(() => {
        axios.get(`getConfigData?tableName=${tableName}&hasPrice=${hasPrice}`).then((data) => {
            const fetchedTags = data.data || [];
            setTags(fetchedTags);
            setOriginalTags(fetchedTags);
            setIsLoading(false);
        }).catch((err) => {
            console.log(err);
        });
    }, []);

    const addTag = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const trimmed = inputValue.trim();
            if (trimmed === '') return;

            const isDuplicate = tags.some(tag =>
                (typeof tag === 'string' ? tag.toLowerCase() : tag.key.toLowerCase()) === trimmed.toLowerCase()
            );

            if (isDuplicate) {
                setError(true);
            } else {
                const newTag = hasPrice
                    ? { key: trimmed, price: Number(priceValue) || 0 }
                    : trimmed;

                const newTags = [...tags, newTag];
                setTags(newTags);
                setInputValue('');
                setPriceValue('');
                setError(false);
                
                // Auto-save after adding
                saveData(newTags);
            }
        }
    };

    const removeTag = (index) => {
        const tag = tags[index];
        setTagToRemove({ tag, index });
        onRemoveOpen();
    };

    const confirmRemoveTag = () => {
        if (tagToRemove !== null) {
            const newTags = tags.filter((_, index) => index !== tagToRemove.index);
            setTags(newTags);
            setError(false);
            onRemoveClose();
            setTagToRemove(null);
            
            // Auto-save after removing
            saveData(newTags);
        }
    };

    const normalize = (arr) =>
        arr.map(tag => typeof tag === 'string' ? { key: tag, price: 0 } : tag)
            .sort((a, b) => a.key.localeCompare(b.key));

    const saveData = (tagsToSave = tags) => {
        axios.post("/addConfigData", { key: tableName, value: tagsToSave, hasPrice })
            .then((response) => {
                if (response.status === 200) {
                    Toast("Updated Data", response.data.message, "success");
                    setOriginalTags(tagsToSave);
                }
            })
            .catch((err) => {
                Toast("Failed to Update Data", err?.response?.data?.error, "danger");
                console.error(err);
            });
    };

    return (
        <div>
            <div className='flex gap-5'>
                <div className="flex-1 space-y-4">
                    {/* Tags Display Area */}
                    <div className="min-h-[120px] p-5 bg-white border-2 border-dashed border-purple-200 rounded-xl">
                        {isLoading ? (
                            <div className="flex items-center justify-center h-[100px]">
                                <Spinner color='secondary' size="lg" />
                            </div>
                        ) : tags.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-[100px] text-gray-400">
                                <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                </svg>
                                <p className="text-sm font-medium">No tags yet. Add one below!</p>
                            </div>
                        ) : (
                            <div className="flex flex-wrap gap-2.5">
                                <AnimatePresence>
                                    {tags.map((tag, index) => {
                                        const display = hasPrice
                                            ? (typeof tag === 'string' ? tag : `${tag.key} (₹${tag?.price})`)
                                            : (typeof tag === 'string' ? tag : tag.key);
                                        return (
                                            <motion.div
                                                key={typeof tag === 'string' ? tag : tag.key}
                                                initial={{ opacity: 0, scale: 0.8, y: -10 }}
                                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.8, y: 10 }}
                                                transition={{ duration: 0.2 }}
                                                className="group flex items-center gap-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-2.5 rounded-lg shadow-md hover:shadow-lg hover:from-purple-600 hover:to-purple-700 transition-all"
                                            >
                                                <span className="font-medium text-sm">{display}</span>
                                                <button
                                                    onClick={() => removeTag(index)}
                                                    className="flex items-center justify-center w-5 h-5 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                                                    title="Remove tag"
                                                >
                                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                    </svg>
                                                </button>
                                            </motion.div>
                                        );
                                    })}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>

                    {/* Input Area */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                            <span>Add New {hasPrice ? '(with price)' : ''}</span>
                        </div>
                        <div className='flex gap-3'>
                            <Input
                                type="text"
                                value={inputValue}
                                color='secondary'
                                variant="bordered"
                                size="lg"
                                onChange={(e) => {
                                    setInputValue(e.target.value);
                                    if (error) setError(false);
                                }}
                                onKeyDown={addTag}
                                placeholder="Type tag name & press Enter"
                                classNames={{
                                    input: "text-base",
                                    inputWrapper: "border-2"
                                }}
                            />

                            {hasPrice && (
                                <Input
                                    label=""
                                    labelPlacement="outside"
                                    placeholder="0.00"
                                    color='secondary'
                                    variant="bordered"
                                    size="lg"
                                    value={priceValue}
                                    onKeyDown={addTag}
                                    onChange={(e) => setPriceValue(e.target.value)}
                                    startContent={
                                        <div className="pointer-events-none flex items-center">
                                            <span className="text-default-500 text-base font-semibold">₹</span>
                                        </div>
                                    }
                                    type="number"
                                    classNames={{
                                        input: "text-base",
                                        inputWrapper: "border-2"
                                    }}
                                    className="w-[200px]"
                                />
                            )}
                        </div>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center gap-2 text-red-600 text-sm font-medium bg-red-50 px-3 py-2 rounded-lg border border-red-200"
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                Tag already exists
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>

            {/* Remove Confirmation Modal */}
            <Modal isOpen={isRemoveOpen} onClose={onRemoveClose} size="sm">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                    <svg className="w-6 h-6 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    <span>Confirm Removal</span>
                                </div>
                            </ModalHeader>
                            <ModalBody>
                                <p className="text-gray-700">
                                    Are you sure you want to remove{' '}
                                    <span className="font-bold text-purple-600">
                                        {tagToRemove && (typeof tagToRemove.tag === 'string' ? tagToRemove.tag : tagToRemove.tag.key)}
                                    </span>
                                    ? This action cannot be undone.
                                </p>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="default" variant="flat" onPress={onClose}>
                                    Cancel
                                </Button>
                                <Button color="danger" variant="shadow" onPress={confirmRemoveTag}>
                                    Remove
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
}
