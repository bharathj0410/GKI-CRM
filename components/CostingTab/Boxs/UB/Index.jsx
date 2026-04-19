import React, { useState } from 'react'
import UB from "../UB"
import { Button, NumberInput, Select, SelectItem } from '@heroui/react';
import {
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';

export default function Index({ ref, handleDownload }) {
  const [unit, setUnit] = useState("centimeter");
  const [labelL, setLabelL] = useState('L');
  const [labelW, setLabelW] = useState('W');
  const [labelH, setLabelH] = useState('H');
  const [labelPF, setLabelPF] = useState('PF');
  const [labelTF, setLabelTF] = useState('TF');
  const [labelF, setLabelF] = useState('F');
  const [labelC, setLabelC] = useState('C');
  const [labelD, setLabelD] = useState('D');
  const [labelLF, setLabelLF] = useState('LF');
  const [labelCF, setLabelCF] = useState('CF');

  const units = [
    { key: "millimeter", label: "mm" },
    { key: "centimeter", label: "cm" },
    { key: "inch", label: "inch" },
  ]


  return (
    <div className='w-full'>
      <div ref={ref} className='bg-white p-5'>

        <div className='font-bold flex text-sm pr-10 justify-end'>Note: All dimensions are in <div className='text-secondary'>&nbsp;{unit}</div>
        </div>
        <div className='flex items-center justify-center'>
        <UB labelL={labelL}
          labelW={labelW}
          labelH={labelH}
          labelPF={labelPF}
          labelTF={labelTF}
          labelF={labelF}
          labelC={labelC}
          labelD={labelD}
          labelLF={labelLF}
          labelCF={labelCF}
          />
          </div>
      </div>
      <div className='flex justify-end py-5'>
      <Button onPress={handleDownload} type='button' color='secondary'>
        <div className='flex items-center gap-3'><ArrowDownTrayIcon className='w-5' /> Download</div>
      </Button>
      </div>
      <h2 className="text-xl font-semibold mb-4">Product Size Information</h2>
      <div className='flex w-full justify-between items-center '>
        <Select
          className="max-w-sm"
          name="measurementUnits"
          items={units}
          label="units of size"
          onSelectionChange={(unit) => setUnit(unit.currentKey)}
          color='secondary'
          defaultSelectedKeys={["centimeter"]}
        >
          {(box_type) => <SelectItem>{box_type.label}</SelectItem>}
        </Select>
        <div className='font-bold flex text-sm pr-10'>Note: All dimensions are in <div className='text-secondary'>&nbsp;{unit}</div></div>
      </div>
      <div className='flex items-center justify-center w-full pt-10'>
        <div className='grid grid-cols-4 gap-4 '>
          <NumberInput
            hideStepper
            className="w-full"
            label="L"
            name="LabelL"
            color='secondary'
            formatOptions={{
              style: "unit",
              unit: unit,
              unitDisplay: "long",
            }}
            placeholder='Length'
            onValueChange={setLabelL}
            size='sm'
          />
          <NumberInput
            hideStepper
            className="w-full"
            label="W"
            name="LabelW"
            color='secondary'
            formatOptions={{
              style: "unit",
              unit: unit,
              unitDisplay: "long",
            }}
            onValueChange={setLabelW}
            size='sm'
          />
          <NumberInput
            hideStepper
            className="w-full"
            label="H"
            name="LabelH"
            color='secondary'
            formatOptions={{
              style: "unit",
              unit: unit,
              unitDisplay: "long",
            }}
            onValueChange={setLabelH}
            size='sm'
          />
          <NumberInput
            hideStepper
            className="w-full"
            label="PF"
            name="LabelPF"
            color='secondary'
            formatOptions={{
              style: "unit",
              unit: unit,
              unitDisplay: "long",
            }}
            onValueChange={setLabelPF}
            size='sm'
          />
          <NumberInput
            hideStepper
            className="w-full"
            label="TF"
            name="LabelTF"
            color='secondary'
            formatOptions={{
              style: "unit",
              unit: unit,
              unitDisplay: "long",
            }}
            onValueChange={setLabelTF}
            size='sm'
          />
          <NumberInput
            hideStepper
            className="w-full"
            label="F"
            name="LabelF"
            color='secondary'
            formatOptions={{
              style: "unit",
              unit: unit,
              unitDisplay: "long",
            }}
            onValueChange={setLabelF}
            size='sm'
          />
          <NumberInput
            hideStepper
            className="w-full"
            label="C"
            name="LabelC"
            color='secondary'
            formatOptions={{
              style: "unit",
              unit: unit,
              unitDisplay: "long",
            }}
            onValueChange={setLabelC}
            size='sm'
          />
          <NumberInput
            hideStepper
            className="w-full"
            label="D"
            name="LabelD"
            color='secondary'
            formatOptions={{
              style: "unit",
              unit: unit,
              unitDisplay: "long",
            }}
            onValueChange={setLabelD}
            size='sm'
          />

        </div>
      </div>
    </div>
  )
}
