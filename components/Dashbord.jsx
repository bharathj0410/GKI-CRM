import { Button } from "@heroui/button";
import React from "react";
import Toast from "@/components/Toast";

export default function Dashbord() {
  function call() {
    Toast("aa", "bb", "success");
  }
  return (
    <div className="">
      Hello Bharath
      {/* <Button color='secondary' onPress={call}>add</Button> */}
    </div>
  );
}
