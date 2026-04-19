import React, { useState } from 'react'
import {Tabs, Tab, Card, CardBody, Switch} from "@heroui/react";
import CompanyBillingForm from "@/components/CostingTab/CompanyBillingForm"
import ProductOrderForm from "@/components/CostingTab/ProductOrderForm"
import { NewspaperIcon,UsersIcon } from '@heroicons/react/24/outline';
import ExistingCust from "./ExistingCust"
import ExistingGuest from "./ExistingGuest"

export default function Costing() {
  const [billId,setBillId] = useState()
  const [selectedKey, setSelectedKey] = useState("new_guest");
  return (
    <div className="flex flex-col px-4 w-full">
      {/* <div className="flex items-center justify-center">
        <div className='w-[90%]'>
      
      <ProductOrderForm/>
      </div>
        </div> */}
        <div className="flex w-full flex-col">
        <Tabs aria-label="Options" variant='solid' color='secondary' size='md' selectedKey={selectedKey}  onSelectionChange={setSelectedKey}>
          <Tab key="new_guest" title={<div className="flex items-center space-x-2">
              <UsersIcon className='w-5'/>
              <span>New Guest</span>
            </div>} className='w-full' >
            <Card className='p-0'>
              <CardBody>
                {billId ? <ProductOrderForm billId={billId} isDisabled={true}/>:<CompanyBillingForm setBillId={setBillId}/>}
                
              </CardBody>
            </Card>
          </Tab>
          <Tab key="existing_guest" title={<div className="flex items-center space-x-2">
              <NewspaperIcon className=' w-5'/>
              <span>Existing Guest</span>
            </div>}>
            <Card  className='shadow-none'>
              <CardBody className='px-1'>
                <ExistingGuest setSelectedKey={setSelectedKey}/>
              </CardBody>
            </Card>
          </Tab>
          <Tab key="existing_cust" title={<div className="flex items-center space-x-2">
              <NewspaperIcon className=' w-5'/>
              <span>Existing Customer</span>
            </div>}>
            <Card className='shadow-none'>
              <CardBody className='px-1'>
                <ExistingCust setBillId={setBillId}/>
              </CardBody>
            </Card>
          </Tab>
        </Tabs>
      </div>
    </div>
  )
}
