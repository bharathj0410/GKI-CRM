import { NumberInput, Select, SelectItem } from '@heroui/react'
import React, { use, useEffect } from 'react'

export default function Bf({name,data,handleSelectionChange}) {

  return (
    <>
    <NumberInput
  className=""
  name={name}
  size="lg"
  hideStepper
  label="BF"
  color="secondary"
  value={data?.[name] ? data[name] : undefined}
  onValueChange={(value) => {
    handleSelectionChange(name, value);
  }}
/>
    </>
  )
}
