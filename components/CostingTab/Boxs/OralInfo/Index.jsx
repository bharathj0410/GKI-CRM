import React, { useEffect, useState } from 'react'
import OralInfo from "../OralInfo"
import { Button, NumberInput, Select, SelectItem } from '@heroui/react';
import {
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';

export default function Index({ ref, data,handleSelectionChange }) {
  const [unit, setUnit] = useState(data?.oralInfoUnit ? data.oralInfoUnit : "centimeter");

  const units = [
    { key: "millimeter", label: "mm" },
    { key: "centimeter", label: "cm" },
    { key: "inch", label: "inch" },
  ]
  useEffect(() => {
    function toNumberOrZero(val) {
      const num = Number(val);
      return isNaN(num) ? 0 : num;
    }

    function CalculateC(w,WrapT,PT,HC){
      return (HC*(w+(WrapT*2)))+PT*(HC-1)
    }
    
    let C = CalculateC(toNumberOrZero(data.articleWidth),toNumberOrZero(data.wrapThickness),toNumberOrZero(data.plateThickness),toNumberOrZero( data.horizontalArtical))
    handleSelectionChange("labelC",C)
    // dimensionInfo["C"] = C;
    // setDimensionInfo({ ...dimensionInfo });
  }, [data.articleWidth,data.wrapThickness,data.plateThickness,data.horizontalArtical])


  return (
    <div className='w-full'>
      <div ref={ref} className='bg-white p-5'>

        <div className='font-bold flex text-sm pr-10 justify-end'>Note: All dimensions are in <div className='text-secondary'>&nbsp;{unit}</div>
        </div>
        <div className='flex items-center justify-center'>
          <OralInfo labelL={data?.articleLength ? data.articleLength : 'L'}
            labelW={data?.articleWidth ? data.articleWidth : 'W'}
            HorizontalCount={data?.horizontalArtical ? data.horizontalArtical : 1}
            VerticalCount={data?.verticalArtical ? data.verticalArtical : 1}
            labelPT={data?.plateThickness ? data.plateThickness : "PT"}
            boxThickness={data?.boxThickness ? data.boxThickness : 'BT'}
            WrapT={data?.wrapThickness ? data.wrapThickness : 0} />
        </div>
      </div>
      {/* <div className='flex justify-end py-5'>
      <Button onPress={handleDownload} type='button' color='secondary'>
        <div className='flex items-center gap-3'><ArrowDownTrayIcon className='w-5' /> Download</div>
      </Button>
      </div> */}
      <h2 className="text-xl font-semibold mb-4">Product Size Information</h2>
      <div className='flex w-full justify-between items-center '>
        <Select
          className="max-w-sm"
          name="oralInfoUnit"
          items={units}
          label="units of size"
          onSelectionChange={(unit) => setUnit(unit.currentKey)}
           value={data?.oralInfoUnit ? data.oralInfoUnit : ""}
              onChange={(value) => handleSelectionChange("oralInfoUnit", value)}
          color='secondary'
          defaultSelectedKeys={[data?.oralInfoUnit ? data.oralInfoUnit : "centimeter"]}
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
            label="Article Length"
            name="LabelL"
            color='secondary'
            formatOptions={{
              style: "unit",
              unit: unit,
              unitDisplay: "long",
            }}
            // onValueChange={LabelL}
            value={data?.articleLength ? data.articleLength : ""}
            onValueChange={(value) => handleSelectionChange("articleLength", value)}
            size='sm'
          />
          <NumberInput
            hideStepper
            className="w-full"
            label="Article Width"
            name="LabelW"
            color='secondary'
            formatOptions={{
              style: "unit",
              unit: unit,
              unitDisplay: "long",
            }}
            // onValueChange={setLabelW}
            value={data?.articleWidth ? data.articleWidth : ""}
            onValueChange={(value) => handleSelectionChange("articleWidth", value)}
            size='sm'
          />
          <NumberInput
            hideStepper
            className="w-full"
            label="Horizontal Artical"
            name="LabelH"
            color='secondary'
            // onValueChange={setHorizontalCount}
             value={data?.horizontalArtical ? data.horizontalArtical : ""}
            onValueChange={(value) => handleSelectionChange("horizontalArtical", value)}
            size='sm'
          />
          <NumberInput
            hideStepper
            className="w-full"
            label="Vertical Artical"
            name="LabelPF"
            color='secondary'
            // onValueChange={setVerticalCount}
            value={data?.verticalArtical ? data.verticalArtical : ""}
            onValueChange={(value) => handleSelectionChange("verticalArtical", value)}
            size='sm'
          />
          <NumberInput
            hideStepper
            className="w-full"
            label="Plate Thickness"
            name="LabelPT"
            color='secondary'
            formatOptions={{
              style: "unit",
              unit: unit,
              unitDisplay: "long",
            }}
            // onValueChange={setLabelPT}
            value={data?.plateThickness ? data.plateThickness : ""}
            onValueChange={(value) => handleSelectionChange("plateThickness", value)}
            size='sm'
          />
          <NumberInput
            hideStepper
            className="w-full"
            label="Box Thickness"
            name="LabelF"
            color='secondary'
            formatOptions={{
              style: "unit",
              unit: unit,
              unitDisplay: "long",
            }}
            // onValueChange={setBoxThickness}
            value={data?.boxThickness ? data.boxThickness : ""}
            onValueChange={(value) => handleSelectionChange("boxThickness", value)}
            size='sm'
          />
          <NumberInput
            hideStepper
            className="w-full"
            label="Wrap Thickness"
            name="LabelD"
            color='secondary'
            formatOptions={{
              style: "unit",
              unit: unit,
              unitDisplay: "long",
            }}
            // onValueChange={setWrapT}
            value={data?.wrapThickness ? data.wrapThickness : ""}
            onValueChange={(value) => handleSelectionChange("wrapThickness", value)}
            size='sm'
          />

        </div>
      </div>
    </div>
  )
}
