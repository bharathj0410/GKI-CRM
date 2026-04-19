import React from "react";
import Form from "./Form";

export default function SignIn({ setIsLogin,setRole }) {
  return (
    <div className="items-center flex w-full pt-5 h-screen bg-secondary justify-around">
      <img src="login.svg" alt="" className="w-[40rem]" />
      <div className="py-[5rem] mt-[2rem] flex flex-col justify-center items-center rounded-3xl shadow-2xl px-[4rem] bg-secondary-50 w-[30rem]">
        {/* <img src="logo.svg" alt="text-black" /> */}
        <p className="font-semibold text-4xl font-sans">Login</p>
        <p className="font-semibold text-sm font-sans py-5 text-zinc-500">
          Welcom Back !!
        </p>
        <div className="flex w-full">
          <Form setIsLogin={setIsLogin} setRole={setRole} />
        </div>
        
      </div>
    </div>
  );
}
