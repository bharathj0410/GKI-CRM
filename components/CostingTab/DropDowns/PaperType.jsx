import { Select, SelectItem } from '@heroui/react'
import React from 'react'

export default function PaperType({name,data,handleSelectionChange}) {
    const paperType = [
        {key:"Kraft",label:"Kraft"},
        {key:"GYT",label:"GYT"},
        {key:"Duplex",label:"Duplex"},
        {key:"Cyber XL",label:"Cyber XL"},

    ]
  return (
    <>
    <Select
      className="w-full"
      name={name}
      label="Paper Type"
      items={paperType}
        size='lg'
      // placeholder="Select Paper Type.."
      color='secondary'
      defaultSelectedKeys={[data?.[name] ? data[name] : ""]}
      onChange={(value) => handleSelectionChange(name, value.target.value)}
    >
      {(paperType) => <SelectItem>{paperType.label}</SelectItem>}
    </Select>
    </>
  )
}
