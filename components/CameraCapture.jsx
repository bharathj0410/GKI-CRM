"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@heroui/react";

export default function CameraCapture({ onCapture, onCancel }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [photo, setPhoto] = useState(null);
  const [stream, setStream] = useState(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const mediaStream = await navigator.mediaDevices.getUserMedia({
            video: true,
          });
          setStream(mediaStream);
          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
          }
        } else {
          alert("Camera not supported on this device/browser.");
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        alert("Unable to access camera. Please check permissions.");
      }
    };

    startCamera();

    return () => {
      stopCamera();
    };
  }, []);

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => {
        track.stop();
      });
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      setStream(null);
    }
  };

  const takePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video && canvas) {
      const context = canvas.getContext("2d");
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL("image/png");
        setPhoto(imageData);
      }
    }
  };

  const handleUsePhoto = () => {
    if (photo && onCapture) {
      stopCamera();
      onCapture(photo);
    }
  };

  const handleRetake = () => {
    setPhoto(null);
  };

  return (
    <div className="space-y-4">
      {!photo ? (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="rounded-lg border shadow-lg w-full"
          />
          <div className="flex gap-2 justify-center">
            <Button color="secondary" onPress={takePhoto}>
              Capture Photo
            </Button>
            {onCancel && (
              <Button
                variant="light"
                onPress={() => {
                  stopCamera();
                  onCancel();
                }}
              >
                Cancel
              </Button>
            )}
          </div>
        </>
      ) : (
        <>
          <div className="text-center">
            <img
              src={photo}
              alt="Captured"
              className="rounded-lg border shadow-lg max-w-full mx-auto"
            />
          </div>
          <div className="flex gap-2 justify-center">
            <Button color="secondary" onPress={handleUsePhoto}>
              Use This Photo
            </Button>
            <Button variant="light" onPress={handleRetake}>
              Retake
            </Button>
          </div>
        </>
      )}
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
}
