import {Tabs, Tab, Card, CardBody} from "@heroui/react";
import AddEmployee from "@/components/AddEmployee"
import Employee from "@/components/Employee"

export default function Members() {
  let tabs = [
    {
      id: "AddEmployee",
      label: "Add Employee",
      content:<AddEmployee/>,
    },
    {
      id: "AddCustomer",
      label: "Add Customer",
      content:
        "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    },
    {
      id: "ViewEmployee",
      label: "Employee",
      content:<Employee/>
    },
    {
      id: "ViewCustomer",
      label: "Customer",
      content:<div>hello</div>
    },
  ];

  return (
    <div className="flex w-full flex-col justify-center items-center">
      <Tabs aria-label="Dynamic tabs" items={tabs} color="secondary" size="md" className="">
        {(item) => (
          <Tab key={item.id} title={item.label} >
            <div className=" ">{item.content}</div>
          </Tab>
        )}
      </Tabs>
    </div>
  );
}
