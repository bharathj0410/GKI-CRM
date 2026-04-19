"use client";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const QuotationContent = dynamic(() => import("./QuotationContent"), {
  ssr: false,
});

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <QuotationContent />
    </Suspense>
  );
}
