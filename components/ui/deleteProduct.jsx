import React from "react";
import { TrashIcon } from "@heroicons/react/24/outline";

export default function DeleteProduct({ data, onClose }) {
  return (
    <div>
      <div className="flex justify-center items-center mb-3 font-poppins">
        <TrashIcon className="w-[5rem] text-slate-400" />
      </div>
      <div className="flex flex-col gap-2 justify-center items-center">
        <p>Are you about to delete a product !!</p>
        <div className="font-bold">{data["id"]}</div>
        <div className="text-slate-500 text-xs flex flex-col items-center">
          <p>
            This will delete your product from DataBase action cannot be undone.
          </p>
          <p>Are you sure you want to proceed?</p>
        </div>
      </div>
    </div>
  );
}
