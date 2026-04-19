"use client"
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react'
import axios from '@/lib/axios';
import { Button } from '@heroui/button';
import html2pdf from 'html2pdf.js';
import { Input } from '@heroui/input';
import Toast from "@/components/Toast"
import { useRouter } from 'next/navigation';

export default function page() {
    const searchParams = useSearchParams();
    const productId = searchParams.get('productId'); // returns string
    const orderId = searchParams.get('orderId'); // returns string
    const [data, setData] = useState()
    const [formArray, setFormArray] = useState();
    const ref = useRef(null);
    const Router = useRouter()

    useEffect(() => {
        axios.get(`/generateQutation?productId=${productId}&orderId=${orderId}`).then((data) => {
            setData(data.data)
            setFormArray(data.data["product_quotation"])
        }).catch((err) => console.log(err))
    }, [])
    const handleChange = (e, index) => {
        index = index - 1
        const { name, value } = e.target;
        const updatedArray = [...formArray];
        updatedArray[index] = { ...updatedArray[index], [name]: value };
        setFormArray(updatedArray);
    };

    const handleDownloadPDF = () => {
        if (!ref.current) return;

        const opt = {
            margin: 0.4,
            filename: 'my-component.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
        };

        html2pdf().set(opt).from(ref.current).save();
    };
    const handleSaveQuotation = async () => {
  const opt = {
    margin: 0.4,
    filename: 'my-component.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
  };

  const pdfBlob = await html2pdf()
    .set(opt)
    .from(ref.current)
    .output('blob');

  // Convert Blob to base64
  const toBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const base64Pdf = await toBase64(pdfBlob); // returns a data URL like: data:application/pdf;base64,...

  // Add data to send
  const payload = {
    ...data,
    product_quotation: formArray,
    generated_date: formattedDate,
    quotation_pdf: base64Pdf
  };

  axios.post("/addQuotation", payload)
    .then((response) => {
      if (response.status === 200) {
        Toast("Quotation Added", response.data.message, "success");
        Router.push("/costing");
      }
    })
    .catch((err) => {
      Toast("Failed to Add Quotation", err?.response?.data?.error, "danger");
      console.error(err);
    });
};


  

    const date = new Date();
    const formattedDate =
        String(date.getDate()).padStart(2, '0') + '/' +
        String(date.getMonth() + 1).padStart(2, '0') + '/' +
        date.getFullYear();
    return (
        data ? <div className='flex items-center justify-center gap-[5rem]'>
            <div className='w-[45rem]'>
                <div className='w-full text-xs relative' ref={ref}>
                    <img src="watermark.svg" alt="watermark" className='w-[20rem] text-zinc-100 absolute bottom-0 left-0' />
                    <img src="watermark.svg" alt="watermark" className='w-[20rem] text-zinc-100 absolute top-[10rem] right-0' />
                    <div className='z-20 relative'>
                        <div className='w-full items-center flex justify-center relative '>
                            {/* <img src="small-logo.svg" alt="" className='w-[5rem] absolute top-2 left-[0.5rem] ' /> */}
                            <div className='flex flex-col items-center justify-center pl-7'>
                                <div className=''>
                                    <img src="/logo_black.svg" alt="" className='text-white w-[20rem]' />
                                </div>
                                {/* <div className='text-4xl font-bold pb-3'>
                                    GURUKRUPA INDUSTRIES
                                </div> */}
                                <div>#34/D, Industrial ‘A’ Layout, Bannimantap, Mysore -570015</div>
                                <div className='flex gap-10 pt-5'>
                                    <div>Phone : 9448067061</div><div>GSTIN : 29ALF3687R1ZV</div>
                                </div>
                            </div>
                        </div>
                        <div className='pt-[3rem] text-right'>Date : {formattedDate}</div>
                        <div className='pt-[2rem]'>
                            <div>To,</div>
                            <div className='pl-[2rem]'>
                                <div>{data["order_data"]["company/person_name"]}</div>
                                <div className='w-[25rem]'>{data["order_data"]["billing_address_line"]}</div>
                                <div>{data["order_data"]["billing_city"]}, {data["order_data"]["billing_state"]}, {data["order_data"]["billing_country"]}</div>
                            </div>
                        </div>

                        <div className='pt-[3rem]'>
                            <div>Dear Sir,</div>
                            <div className='pl-[2rem]'>As per the samples provided, we are pleased to submit our quotation for the following products:</div>
                        </div>


                        <div className='w-full rounded-2xl py-5 '>

                            {/* Header Row */}
                            <div className="grid grid-cols-[40px_50px_180px_130px_80px_90px_70px_70px] w-full bg-zinc-100 rounded-xl text-center">
                                {data["table_name"].map((heading) => (
                                    <div key={heading} className="py-2 px-2 text-xs font-semibold text-zinc-500">
                                        {heading}
                                    </div>
                                ))}
                            </div>

                            {/* Data Rows */}
                            {formArray.map((productData, idx) => (
                                <div
                                    className="grid grid-cols-[40px_50px_180px_130px_80px_90px_70px_70px] w-full text-center border-b"
                                    key={productData["sl. No"] || idx}
                                >
                                    {Object.entries(productData).map(([key, value]) => (
                                        <div key={key} className="py-2 px-2 text-xs font-semibold text-zinc-700">
                                            {value}
                                        </div>
                                    ))}
                                </div>
                            ))}


                            <div className='pt-[2rem]'>
                                <div className='text-center'>We assure you of the best quality and service. We look forward to receiving your valuable orders.</div>
                                <div className='pt-[2rem]'>
                                    <div>Terms & Conditions:</div>

                                    <ul className='pl-[2rem]'>
                                        <li><strong>Taxes:</strong> 18% GST applicable on sales</li>
                                        <li><strong>Transportation:</strong> Charges extra</li>
                                        <li><strong>Payment:</strong> 100% in advance</li>
                                        <li><strong>Additional Charges:</strong> Development charges extra as applicable</li>
                                        <li><strong>Delivery Schedule:</strong> Within 20 days from the date of Purchase Order (PO)</li>
                                    </ul>
                                    <div className='text-center pt-10'>Thank you for the opportunity.</div>
                                </div>
                            </div>

                            <div className='pt-[8rem] text-right pr-[2rem]'>Founder / CEO</div>
                        </div>
                    </div>
                </div>
                {/* {data && <div>{data["order_data"]["company/person_name"]}</div>} */}
            </div>
            <div>
                <div className='flex flex-col items-center justify-center'>
                    <div className='text-2xl font-bold uppercase'>Edit Product Data</div>
                    <div className='w-[10rem] py-[0.2rem] bg-secondary rounded-full mb-5'></div>
                </div>

                {formArray.map((productData) => (
                    <div key={productData["sl. No"]} className='py-3'>
                        <p className='font-bold py-2'>Product {productData["sl. No"]}</p>
                        <div className='grid grid-cols-2 gap-3'>
                            <Input label="Product name" type="text" name='Product name' value={productData["Product name"]} onChange={(e) => handleChange(e, productData["sl. No"])} />
                            <Input label="Size" type="text" name='Size' value={productData["Size"]} onChange={(e) => handleChange(e, productData["sl. No"])} />
                            <Input label="Quantity" type="text" name='Quantity' value={productData["Quantity"]} onChange={(e) => handleChange(e, productData["sl. No"])} />
                            <Input label="Die charges" type="text" name='Die charges' value={productData["Die charges"]} onChange={(e) => handleChange(e, productData["sl. No"])} />
                            <Input label="Printing charges" type="text" name='Printing charges' value={productData["Printing charges"]} onChange={(e) => handleChange(e, productData["sl. No"])} />
                            <Input label="Price per unit" type="text" name='Price per unit' value={productData["Price per unit"]} onChange={(e) => handleChange(e, productData["sl. No"])} />
                        </div>
                    </div>
                ))}
                <div className='py-10'>
                    <Button color='secondary' onPress={handleDownloadPDF}>Download</Button>
                    <Button color='secondary' onPress={handleSaveQuotation}>Save</Button>
                </div>
            </div>

        </div> : <div>Loading</div>

    )
}
