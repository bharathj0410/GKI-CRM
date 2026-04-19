import { Button, DatePicker, Form, Input, NumberInput, Select, SelectItem, Textarea, TimeInput } from "@heroui/react";
import CameraCapture from "@/components/CameraCapture"
import { useState } from "react";
import axios from "@/lib/axios";
import Toast from "../Toast";

export const representative = [
    { key: "owner", label: "Owner" },
    { key: "representitive", label: "Representitive" },
    { key: "employee", label: "Employee" },
    { key: "driver", label: "Driver" },
    { key: "customer", label: "Customer" },
    { key: "supplyer", label: "Supplyer" },
    { key: "service_provider", label: "Service Provider" }
];
export const Person = [
    { key: "pranav", label: "Pranav" },
    { key: "others", label: "Others" },
];
export default function VisitorForm() {
    const [submitted, setSubmitted] = useState(null);

    const onSubmit = (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const data = Object.fromEntries(new FormData(e.currentTarget));
        axios.post("addVisitor", data).
            then((data) => {
                Toast("Visitor Added", data.data.message, "success")
                form.reset()
            }).
            catch((data) => {Toast("Error","", "danger")
                console.log(data)
            })
        setSubmitted(data);
    };
    const onReset = (e) => {
        e.preventDefault();
        e.currentTarget.reset();
    };
    return (
        <div className="flex flex-col items-center">
            <div className="w-full flex justify-center pb-10">
                <p className="text-2xl uppercase font-bold">Visitor Details</p>
            </div>
            <div>
                <Form className="" onSubmit={onSubmit} onReset={onReset}>
                    <div className="grid grid-cols-3 gap-3 w-[55rem]">
                        <Select
                            className="max-w-xs" items={representative} label="Visitor" placeholder="Type of Guest" color="secondary" name="Guest" isRequired >
                            {(visitor) => <SelectItem>{visitor.label}</SelectItem>}
                        </Select>
                        <Input label="Name of Visitor" type="text" color="secondary" className="max-w-xs" name="name" isRequired/>
                        <Input label="From (City/Organization)" type="text" color="secondary" className="max-w-xs" name="from" isRequired/>
                        <DatePicker className="max-w-[284px]" label="Date of Visit" color="secondary" name="dateOfVisit" isRequired/>
                        <TimeInput label="Time of Visit" color="secondary" name="timeOfVisit" isRequired />
                        <TimeInput label="Exit Time" color="secondary" name="exitTime" />
                        <Textarea label="Purpose of Visit" type="text" color="secondary" className="col-span-2" name="purpose" isRequired/>
                        <Select label="Select Person to Meet" items={Person} placeholder="Person to Meet" color="secondary" className="max-w-xs" name="personToMeet" isRequired>{(person) => <SelectItem>{person.label}</SelectItem>}</Select>
                    </div>
                    <div className="flex justify-center items-center w-full gap-3 py-8">

                        <Button type="submit" color="secondary" variant="shadow">Add Visitor</Button>
                        <Button type="reset" color="danger" variant="flat">Cancel</Button>
                    </div>
                    {/* {submitted && (
                        <div className="text-small text-default-500">
                            You submitted: <code>{JSON.stringify(submitted)}</code>
                        </div>
                    )} */}
                </Form>
            </div>

        </div>
    )
}
