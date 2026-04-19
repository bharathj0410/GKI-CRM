import { NumberInput, Select, SelectItem } from '@heroui/react'
import React, { useEffect, useState } from 'react'

export default function ProductTable({ row,handleSelectionChange,data }) {
    const paperType = [
        { key: "Liner", label: "Liner" },
        { key: "Flute", label: "Flute" },
    ]

    const layer = String(row.layers).toLocaleLowerCase().replaceAll(" ","")+"Type"

    useEffect(()=>{
        handleSelectionChange(layer,String(row.layers).includes("Flute")? "Flute":"Liner")
    },[row.layers])
    useEffect(()=>{
        if(!data[layer]){
            handleSelectionChange(layer,String(row.layers).includes("Flute") ? "Flute":"Liner")
        }
    },[])
    return (
        <div className='w-full 0px 1px 4px; rounded-2xl mt-5'>
            <h2 className='text-xl font-semibold mb-2'>{row.layers}</h2>

            <div className='grid grid-cols-4 gap-3'>
                <div>
                    <Select
                        className="w-full"
                        label="Type"
                        items={paperType}
                        size='lg'
                        color='secondary'
                        onChange={(key) => handleSelectionChange(layer,key.target.value)}
                        defaultSelectedKeys={[data[layer]]}
                    >
                        {(paperType) => <SelectItem>{paperType.label}</SelectItem>}
                    </Select>
                </div>
                <div className='w-full'>
                    <div className="rounded text-xs  text-zinc-500 w-full">
                        {row?.paperType}
                    </div>
                </div>
                {(data[layer] == "Flute") && <div className='w-full'>
                    <div className="rounded text-xs  text-zinc-500 w-full">
                        {row?.typeOfFlute}
                    </div>
                </div>}
                <div className='w-full'>
                    <div className="rounded text-xs  text-zinc-500 w-full">
                        {row?.bf}
                    </div>
                </div>
                <div className='w-full'>
                    <div className="rounded text-xs  text-zinc-500 w-full">
                        {row?.gsm}
                    </div>
                </div>
                <div className='w-full'>
                    <div className="rounded text-xs  text-zinc-500 w-full">
                        {row?.bs}
                    </div>
                </div>
                    <div className='w-full'>
                    <div className="rounded text-xs  text-zinc-500 w-full">
                        {row?.cobb}
                    </div>
                </div>
            </div>
        </div>
    )
}
