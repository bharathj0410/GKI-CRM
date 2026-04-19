"use client";
import React, { useState, useRef, useEffect } from "react";
import { TwitterPicker } from "react-color";

export default function ColorPicker({ name, data, handleSelectionChange }) {
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setShowPicker(false);
      }
    }
    if (showPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPicker]);

  return (
    <div className="relative flex items-center justify-center" ref={pickerRef}>
      <button
        className="w-10 h-10 rounded-full border"
        style={{ backgroundColor: data?.[name] ? data[name] : "#fff" }}
        onClick={() => setShowPicker(!showPicker)}
      />
      {showPicker && (
        <div className="absolute top-12 left-1 z-50">
          <TwitterPicker
            colors={["#FF6900", "#FCB900", "#00D084", "#0693E3"]}
            color={data?.[name] ? data[name] : "#fff"}
            onChangeComplete={(color) => {
              handleSelectionChange(name, color.hex);
              setShowPicker(false);
            }}
          />
        </div>
      )}
    </div>
  );
}
