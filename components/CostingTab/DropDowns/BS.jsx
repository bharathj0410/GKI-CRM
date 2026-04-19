import { NumberInput, Select, SelectItem } from "@heroui/react";
import React from "react";

export default function Bs({ name, data, handleSelectionChange }) {
  return (
    <NumberInput
      className=""
      name={name}
      size="lg"
      hideStepper
      label="BS"
      color="secondary"
      value={data?.[name] ? data[name] : undefined}
      onValueChange={(value) => {
        handleSelectionChange(name, value);
      }}
    />
  );
}
