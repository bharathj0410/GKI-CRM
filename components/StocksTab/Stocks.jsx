import React from "react";
import Test from "./Text";
import { Button, Form } from "@heroui/react";

export default function Stocks() {
  const [submitted, setSubmitted] = React.useState(null);

  const onSubmit = (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));

    setSubmitted(data);
  };
  return (
    <Form className="w-full max-w-xs" onSubmit={onSubmit}>
      <Test />
      <Button color="primary" type="submit">
        Submit
      </Button>
      {submitted && (
        <div className="text-small text-default-500">
          You submitted: <code>{JSON.stringify(submitted)}</code>
        </div>
      )}
    </Form>
  );
}
