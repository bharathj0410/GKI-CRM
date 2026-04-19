import React, { useState } from 'react'
import { downloadBase64Pdf } from "@/utils"
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline"
import { Button } from '@heroui/button';
import { Checkbox, Chip, DatePicker, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@heroui/react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";
import DraggableCard from "./DraggableCard"

export default function QuotationCard({ data }) {

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const handleDownload = async () => {
    if (data["quotation_pdf"]) {
      // console.log(data["quotation_pdf"])
      downloadBase64Pdf(data["quotation_pdf"], "report.pdf");
    }
  };
  return (
    <div className='bg-zinc-100 p-3 flex flex-col gap-3 text-sm rounded-lg'>
      <div>
        <div className='flex justify-between py-5 text-xs px-2'>
          <div><strong>{data["id"]}</strong></div>
          <div className=''>Generated Date  : <strong>{data["generated_date"]}</strong></div>
        </div>
        <Table aria-label="Example static collection table">
          <TableHeader>
            <TableColumn>Product Name</TableColumn>
            <TableColumn>Box Type</TableColumn>
            <TableColumn>Order Quantity</TableColumn>
          </TableHeader>
          <TableBody>
            {data["product_data"].map((product) => <TableRow key={product["bill_id"]}>
              <TableCell>{product["product_name"]}</TableCell>
              <TableCell>{product["box_type"]}</TableCell>
              <TableCell>{product["order_quantity"]}</TableCell>
            </TableRow>)}
          </TableBody>
        </Table>
      </div>
      <div className='flex items-center justify-between'>
        <Chip color="warning" variant="dot">
          Waiting For Approval
        </Chip>
        <div className='flex gap-3'>
          <Button onPress={onOpen} color='secondary' type='button' variant='flat' className='p-0'>Action</Button>
          <Button onPress={handleDownload} color='secondary' type='button' variant='flat' className='p-0'><ArrowDownTrayIcon className='w-6' /></Button>
        </div>
      </div>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size={"5xl"} backdrop="blur">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Create Job</ModalHeader>
              <ModalBody>
                <div className='flex flex-col gap-5'>
                  <Checkbox color="secondary" size='lg'>
                    Approved
                  </Checkbox>

                  <DatePicker name="dispatchDate"
                              className="w-full"
                              color='secondary'
                              placeholder="Date of Enquiry" label="Date of Dispatch" />
                </div>
                {/* <div className="flex min-[100rem] items-center justify-center bg-zinc-100 py-10">
                <DraggableCard data={data["product_data"]}/>
                </div> */}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="secondary" onPress={onClose}>
                  Create
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  )
}
