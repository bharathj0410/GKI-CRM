import { NumberInput, Select, SelectItem } from "@heroui/react";
import React from "react";

export default function Cobb({ name, data, handleSelectionChange }) {
  return (
    <NumberInput
      className=""
      name={name}
      size="lg"
      hideStepper
      label="COBB"
      color="secondary"
      value={data?.[name] ? data[name] : undefined}
      onValueChange={(value) => {
        handleSelectionChange(name, value);
      }}
    />
  );
}
