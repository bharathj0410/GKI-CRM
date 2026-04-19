import { Checkbox, cn } from "@heroui/react";
import React from "react";
import {
  Chip,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";

export default function ProductCard({ data, buttonAction }) {
  const cardData = () => (
    <div className="p-4 rounded-lg w-full bg-zinc-200 flex flex-col gap-2 text-xs">
      <div className="w-full capitalize flex px-2 justify-between">
        <div className="font-bold">{data.id}</div>
        <div>
          Enquiry Date : <strong>{data.enquiry_date}</strong>
        </div>
      </div>

      <Table
        aria-label="Example static collection table"
        className="text-xs w-full"
      >
        <TableHeader>
          <TableColumn>Product Name</TableColumn>
          <TableColumn>Box Type</TableColumn>
          <TableColumn>Order Quantity</TableColumn>
        </TableHeader>
        <TableBody className="text-xs">
          <TableRow>
            <TableCell>{data.product_name}</TableCell>
            <TableCell>{data.box_type}</TableCell>
            <TableCell>{data.order_quantity}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
  return (
    <div className="w-full">
      {buttonAction == 1 ? (
        <Checkbox
          color="secondary"
          classNames={{
            base: "w-full m-0 hover:bg-content2 rounded-lg cursor-pointer",
          }}
          value={data.id}
        >
          <div className="w-[41rem]">{cardData()}</div>
        </Checkbox>
      ) : (
        <div className="p-2">{cardData()}</div>
      )}
    </div>
  );
}
