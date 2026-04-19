import React, { useEffect, useRef, useState } from "react";
import {
  TrashIcon,
  PaperClipIcon,
  ArrowDownTrayIcon,
  EyeIcon,
} from "@heroicons/react/24/solid";
import { Button } from "@heroui/react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";

export default function MultiFileUploader({ formData, setFiles, files }) {
  const [viewFileObj, setViewFileObj] = useState(null);
  const fileInputRef = useRef(null);

  // Convert base64 -> Blob
  function dataURLtoBlob(dataurl) {
    const arr = dataurl.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  }

  // Guess extension from MIME type
  function getExtensionFromMime(mime) {
    const map = {
      "image/jpeg": ".jpg",
      "image/png": ".png",
      "application/pdf": ".pdf",
      "application/msword": ".doc",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        ".docx",
      "audio/mpeg": ".mp3",
      "video/mp4": ".mp4",
    };
    return map[mime] || "";
  }

  // Load existing files from formData (MongoDB data)
  useEffect(() => {
    if (formData?.attachments?.length) {
      const existingFiles = formData.attachments.map((att, index) => {
        // Extract base64 and type from stored data
        const base64Str = att.base64 || att.file?.base64 || "";
        const mimeType =
          att.type ||
          base64Str.match(/data:(.*?);/)?.[1] ||
          "application/octet-stream";
        const name =
          att.name || `file_${index + 1}${getExtensionFromMime(mimeType)}`;

        const file = new File([dataURLtoBlob(base64Str)], name, {
          type: mimeType,
        });

        return { file, base64: base64Str, name, type: mimeType };
      });
      setFiles(existingFiles);
    }
  }, [formData, setFiles]);

  // Convert file -> base64
  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  // Handle file select
  const handleFileChange = async (e) => {
    const selectedFiles = Array.from(e.target.files);
    const filesWithBase64 = await Promise.all(
      selectedFiles.map(async (file) => {
        const base64 = await fileToBase64(file);
        return {
          file,
          name: file.name,
          type: file.type,
          base64,
        };
      }),
    );
    setFiles((prev) => [...prev, ...filesWithBase64]);
  };

  // Remove a file
  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Download a file
  const downloadFile = (fileObj) => {
    const link = document.createElement("a");
    link.href = fileObj.base64;
    link.download = fileObj.name || "download";
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  // Check if file can be viewed inline
  const isViewable = (type) => {
    const viewableTypes = [
      "image/",
      "application/pdf",
      "text/",
      "audio/",
      "video/",
    ];
    return viewableTypes.some((t) => type.startsWith(t));
  };

  return (
    <div>
      <label className="block mb-2 font-medium pt-2">Upload Files</label>

      <input
        type="file"
        multiple
        onChange={handleFileChange}
        accept="
          image/*,
          video/*,
          audio/*,
          application/pdf,
          application/msword,
          application/vnd.openxmlformats-officedocument.wordprocessingml.document,
          .doc,
          .docx
        "
        className="hidden"
        ref={fileInputRef}
      />

      <Button
        type="button"
        color="secondary"
        onPress={() => fileInputRef.current.click()}
        startContent={<PaperClipIcon className="w-5" />}
        className="mb-5"
      >
        Upload Relevant Documents
      </Button>

      {files.length > 0 && (
        <ul className="space-y-3">
          {files.map((fileObj, index) => (
            <li
              key={index}
              className="flex items-center gap-4 p-3 border rounded-lg bg-gray-50"
            >
              {fileObj.type.startsWith("image/") ? (
                <img
                  src={fileObj.base64}
                  alt={fileObj.name}
                  className="w-16 h-16 object-cover rounded"
                />
              ) : (
                <div className="w-16 h-16 flex items-center justify-center bg-gray-200 rounded text-gray-600">
                  📄
                </div>
              )}

              <div className="flex-1">
                <p className="text-sm font-medium">{fileObj.name}</p>
                <p className="text-xs text-gray-500">
                  {(fileObj.file?.size / 1024).toFixed(2)} KB
                </p>
              </div>

              <div className="flex gap-1">
                <Button
                  onPress={() =>
                    isViewable(fileObj.type)
                      ? setViewFileObj(fileObj)
                      : alert("Not viewable in browser")
                  }
                  color="success"
                  size="sm"
                >
                  <EyeIcon className="w-5 text-white" />
                </Button>
                <Button
                  onPress={() => downloadFile(fileObj)}
                  color="primary"
                  size="sm"
                >
                  <ArrowDownTrayIcon className="w-5" />
                </Button>
                <Button
                  onPress={() => removeFile(index)}
                  color="danger"
                  size="sm"
                >
                  <TrashIcon className="w-5" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Modal
        isOpen={!!viewFileObj}
        onClose={() => setViewFileObj(null)}
        size="5xl"
      >
        <ModalContent>
          <ModalHeader>{viewFileObj?.name}</ModalHeader>
          <ModalBody>
            {viewFileObj?.type.startsWith("image/") && (
              <img
                src={viewFileObj.base64}
                alt={viewFileObj.name}
                className="max-h-[80vh] mx-auto"
              />
            )}
            {viewFileObj?.type === "application/pdf" && (
              <iframe
                src={viewFileObj.base64}
                className="w-full h-[80vh] border-none"
              />
            )}
            {viewFileObj?.type.startsWith("text/") && (
              <iframe
                src={viewFileObj.base64}
                className="w-full h-[80vh] border-none"
              />
            )}
            {viewFileObj?.type.startsWith("audio/") && (
              <audio controls src={viewFileObj.base64} className="w-full" />
            )}
            {viewFileObj?.type.startsWith("video/") && (
              <video
                controls
                src={viewFileObj.base64}
                className="w-full h-[70vh]"
              />
            )}
          </ModalBody>
          <ModalFooter>
            <Button onPress={() => setViewFileObj(null)} color="danger">
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
