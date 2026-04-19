import {Tabs, Tab, Card, CardBody} from "@heroui/react";
import VisitorForm from "@/components/VisitorTab/VisitorForm"
import Visitors from "@/components/VisitorTab/Visitors"

export default function VisitorDetails() {
  let tabs = [
    {
      id: "VisitorForm",
      label: "Add Visitor",
      content:<VisitorForm/>
    },
    {
      id: "View Visitors",
      label: "View Visitors",
      content:<Visitors/>,
    },
  ];

  return (
    <div className="flex w-full flex-col">
      <Tabs aria-label="Dynamic tabs" items={tabs} size="lg" className="shadow-none">
        {(item) => (
          <Tab key={item.id} title={item.label} >
            <Card className="shadow-none">
              <CardBody>{item.content}</CardBody>
            </Card>
          </Tab>
        )}
      </Tabs>
    </div>
  );
}
