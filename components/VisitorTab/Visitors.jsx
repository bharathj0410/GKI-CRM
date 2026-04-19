import React, { useEffect, useState } from "react";
import axios from "@/lib/axios";
import Toast from "../Toast";
import VisitorCard from "@/components/VisitorTab/VisitorCard";
export default function Visitors() {
  const [PastVisitor, setPastVisitor] = useState([]);
  const [ActiveVisitor, setActiveVisitor] = useState([]);
  useEffect(() => {
    axios
      .get("getVisitors")
      .then((data) => {
        let visitor = data.data;
        setPastVisitor(visitor.filter((data) => data.exitTime));
        setActiveVisitor(visitor.filter((data) => !data.exitTime));
      })
      .catch(() => Toast("Error", "Error Fetching Data"));
  }, []);
  return (
    <div>
      <div className="font-semibold uppercase text-lg p-5 text-secondary flex items-center">
        Active Visitors
        <div className="bg-success p-[0.4rem] ml-3 rounded-full animate-pulse"></div>
      </div>
      <div className="grid grid-cols-2 gap-5">
        {ActiveVisitor.map((data) => (
          <VisitorCard Visitor={data} key={data.id} />
        ))}
      </div>
      <p className="font-semibold uppercase text-lg p-5 text-secondary">
        Past Visitors
      </p>
      <div className="grid grid-cols-2 gap-5">
        {PastVisitor.map((data) => (
          <VisitorCard Visitor={data} key={data.id} />
        ))}
      </div>
    </div>
  );
}
