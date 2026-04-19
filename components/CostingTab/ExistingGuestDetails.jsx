import React, { useEffect, useState } from 'react'
import { ArrowLeftIcon, InboxArrowDownIcon, DocumentCurrencyRupeeIcon } from '@heroicons/react/24/outline';
import ExistingGuestBanner from "./ExistingGuestBanner"
import { Button } from '@heroui/button';
import ProductOrderForm from './ProductOrderForm';
import axios from "@/lib/axios"
import ProductCard from "./ProductCard"
import { CheckboxGroup } from '@heroui/react';
import Toast from "@/components/Toast"
import { Tabs, Tab, Card, CardBody } from "@heroui/react";
import QuotationCard from "./QuotationCard"
import ProductDetails from "./ProductDetails"

export default function ExistingGuestDetails({ id, setSelectedGuestId }) {
  const [addProduct, setAddProduct] = useState(false)
  const [data, setdata] = useState(false)
  // const [orderData, setOrderData] = useState(null)
  const [quotationData, setQuotationData] = useState(null)
  const [selected, setSelected] = useState([])
  const [buttonAction, setButtonAction] = useState(0)
  useEffect(() => {
    axios.get(`getGuestData?id=${id}`).then((data) => {
      setdata(data.data[0])
    }).catch((err) => console.log(err))

    // axios.get(`getOrderDetails?parentId=${id}`).then((data) => {
    //   setOrderData(data.data)
    // }).catch((err) => console.log(err))

    axios.get(`getQuotation?id=${id}`).then((data) => {
      setQuotationData(data.data)
    }).catch((err) => console.log(err))
  }, [])

  // useEffect(() => {
  //   axios.get(`getOrderDetails?parentId=${id}`).then((data) => {
  //     setOrderData(data.data)
  //   }).catch((err) => console.log(err))
  // }, [addProduct])




  return (
    <div>
      {data && (
        <div>
          <div role='button' onClick={() => setSelectedGuestId(null)} className='flex mb-2'><div className='bg-secondary-100 px-5 py-2 rounded-full'>
            <ArrowLeftIcon className='w-5' /></div></div>

          <ExistingGuestBanner data={data} />

          <Tabs aria-label="Options" className='pt-5 flex items-center justify-center' color='secondary'>
            <Tab key="Product Details" title="Product Details">
              <Card className='shadow-none rounded-none'>
                <CardBody className='p-0'>
                  <div className='overflow-hidden p-1'>
                    <ProductDetails id={id} />
                  </div>
                </CardBody>
              </Card>
            </Tab>
            <Tab key="Quotations" title="Quotations" className=''>
              <Card className='shadow-none rounded-none'>
                <CardBody className='p-0'>
                  <div className='grid grid-cols-3 gap-2' >
                    {quotationData?.map((data) => <QuotationCard data={data} key={data.id} />)}
                  </div>
                </CardBody>
              </Card>
            </Tab>
            <Tab key="Job" title="Job">
              <Card className='shadow-none rounded-none'>
                <CardBody className='p-0'>
                  Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
                  mollit anim id est laborum.
                </CardBody>
              </Card>
            </Tab>
          </Tabs>

        </div>)}


    </div>
  )
}
