"use client";
import { Button } from "@heroui/button";
import React, { useRef } from "react";
import SignatureCanvas from "react-signature-canvas";

export default function SignaturePadWidget({ title, onSave, value }) {
  const sigCanvas = useRef(null);

  const handleSave = () => {
    if (!sigCanvas.current || sigCanvas.current.isEmpty()) return;
    const dataUrl = sigCanvas.current.getTrimmedCanvas().toDataURL("image/png");
    onSave?.(dataUrl);
  };

  const handleClear = () => {
    sigCanvas.current?.clear();
    onSave?.(null);
  };

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm font-semibold text-gray-700">{title}</p>
      <div className="border-2 border-dashed border-gray-300 rounded-xl overflow-hidden bg-white">
        <SignatureCanvas
          ref={sigCanvas}
          penColor="#4C1D95"
          canvasProps={{
            className: "w-full",
            height: 160,
          }}
        />
      </div>
      {value && (
        <div className="flex items-center gap-2 text-xs text-green-600 font-semibold">
          <span>✓</span> Signature captured
        </div>
      )}
      <div className="flex gap-2">
        <Button
          size="sm"
          color="danger"
          variant="flat"
          onPress={handleClear}
          fullWidth
        >
          Clear
        </Button>
        <Button
          size="sm"
          color="success"
          variant="flat"
          onPress={handleSave}
          fullWidth
        >
          Save Signature
        </Button>
      </div>
    </div>
  );
}
