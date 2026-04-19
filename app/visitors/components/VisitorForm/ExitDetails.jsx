import { CalendarIcon } from "@heroicons/react/16/solid";
import { DatePicker, Textarea } from "@heroui/react";
import { getLocalTimeZone, now } from "@internationalized/date";
import SignaturePad from "./ui/SignaturePad"

export default function ExitDetails() {
    return (
        <div>
            <p className="font-black uppercase px-10 py-3 text-xl mb-5 rounded-xl">Exit Details</p>
            <div className="flex flex-col gap-4">
                <DatePicker
                    hideTimeZone
                    showMonthAndYearPickers
                    defaultValue={now(getLocalTimeZone())}
                    label="Date and Time of Exit"
                    variant="bordered"
                    className=""
                    startContent={
                        <CalendarIcon className="w-5 text-default-400 pointer-events-none shrink-0" />
                    }
                />
                <Textarea className="w-full col-span-2" label="Items Carried Out" placeholder="Items Carried Out" color="secondary" />
                <div className="flex justify-center">
                </div>
            </div>
        </div>
    )
}
