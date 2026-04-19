import { Select, SelectItem } from '@heroui/react'
import React from 'react'

export default function FluteType({name,data,handleSelectionChange}) {
    const flute = [
        {key: "A", label: "A"},
        {key: "B", label: "B"},
        {key: "C", label: "C"},
        {key: "E", label: "E"},
        {key: "F", label: "F"},
        {key: "Paper", label: "Paper"},
      ];
  return (
    <Select
    className="w-full"
    label="Flute Type"
    items={flute}
    // placeholder="Select Flute Type..."
    size='lg' color='secondary'
    name={name}
    defaultSelectedKeys={[data?.[name] ? data[name] : ""]}
    onChange={(value) => handleSelectionChange(name, value.target.value)}
  >
    {(box_type) => <SelectItem key={box_type.value}>{box_type.label}</SelectItem>}
  </Select>
  )
}
