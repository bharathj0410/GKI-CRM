"use client";
import { Button } from "@heroui/button";
import React, { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";

export default function SignaturePad({title}) {
  const sigCanvas = useRef({});
  const [imageURL, setImageURL] = useState(null);

  // Clear signature
  const clear = () => sigCanvas.current.clear();

  // Save signature as image
  const save = () => {
    setImageURL(sigCanvas.current.getTrimmedCanvas().toDataURL("image/png"));
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <p className="font-bold">{title}</p>
      <SignatureCanvas
        ref={sigCanvas}
        penColor="black"
        canvasProps={{
          width: 400,
          height: 200,
          className: "border border-gray-400 rounded"
        }}
      />

      <div className="flex gap-2">
        <Button
          onPress={clear}
          color="danger"
        >
          Clear
        </Button>
        <Button
          onPress={save}
          color="success"
        >
          Save
        </Button>
      </div>

      {imageURL && (
        <div className="mt-4">
          <p>Saved Signature:</p>
          <img
            src={imageURL}
            alt="signature"
            className="border border-gray-400 rounded"
          />
        </div>
      )}
    </div>
  );
}
