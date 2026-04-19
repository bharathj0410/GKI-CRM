import { Autocomplete, AutocompleteItem, Button, Input, Skeleton } from '@heroui/react'
import React, { useEffect, useRef, useState } from 'react'
import { UserPlusIcon, MagnifyingGlassIcon, InboxStackIcon } from '@heroicons/react/24/outline';
import CompanyBillingForm from "./CompanyBillingForm"
import ExistingGuestCard from "./ExistingGuestCard"
import ExistingGuestBanner from "./ExistingGuestBanner"
import axios from "@/lib/axios"
import ExistingGuestDetails from './ExistingGuestDetails';



export default function ExistingGuest({ setSelectedKey }) {
    const [data, setData] = useState(null)
    const [seletedGuestId, setSelectedGuestId] = useState(null)

    // useEffect(() => {
    //     setSelectedGuestId(null)
    //     axios.get('getGuestData').then((data) => {
    //         setData(data.data)
    //     }).catch((err) => console.log(err))
    // }, [])

    return (
        <div className="w-full">
            {seletedGuestId ? <ExistingGuestDetails id={seletedGuestId} setSelectedGuestId={setSelectedGuestId} /> :
                <ExistingGuestCard setSelectedGuestId={setSelectedGuestId} setSelectedKey={setSelectedKey}/>}


            {/* <CompanyBillingForm setBillId={setBillId} /> */}
        </div>
    )
}
