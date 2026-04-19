import { Avatar, Chip, Divider, Tooltip } from "@heroui/react";
import Image from "next/image";
import React from "react";

export default function VisitorCard({ Visitor }) {
  console.log(Visitor);
  return (
    <div className="w-full">
      <div className="bg-secondary-50 rounded-xl hover:cursor-pointer hover:shadow-lg ease-in-out duration-200 relative overflow-hidden">
        <div className="p-[1rem]">
          <div className="flex w-full items-center justify-between pr-[4rem]">
            <p className="font-black uppercase text-2xl pl-2">Visitor Pass</p>
            <img src="QrCode.png" alt="" className="w-[5rem]" />
          </div>
          <Divider className="mt-2" />
          <div className="pt-5 text-sm flex">
            <div className="flex flex-col gap-2">
              <div className="flex gap-2 items-center">
                <p className="font-black text-sm">ID : </p>
                <div className="capitalize">
                  {Visitor?.id ? (
                    <p className="font-thin">{Visitor.id}</p>
                  ) : (
                    <Chip color="warning" variant="dot" size="sm">
                      Not Added
                    </Chip>
                  )}
                </div>
              </div>
              <div className="flex gap-2 items-center">
                <p className="font-black text-sm">Guest : </p>
                <div className="capitalize">
                  {Visitor?.Guest ? (
                    <p className="font-light text-secondary">{Visitor.Guest}</p>
                  ) : (
                    <Chip color="warning" variant="dot" size="sm">
                      Not Added
                    </Chip>
                  )}
                </div>
              </div>

              <div className="flex gap-2 items-center">
                <p className="font-black text-sm">Visitor Name : </p>
                <div className="capitalize font-light text-secondary">
                  {Visitor?.name ? (
                    <p color="secondary" variant="solid" size="sm">
                      {Visitor.name}
                    </p>
                  ) : (
                    <Chip color="warning" variant="dot" size="sm">
                      Not Added
                    </Chip>
                  )}
                </div>
              </div>

              <div className="flex gap-2 items-center">
                <p className="font-black text-sm">From : </p>
                <div className="capitalize font-light text-secondary">
                  {Visitor?.from ? (
                    <p>{Visitor.from}</p>
                  ) : (
                    <Chip color="warning" variant="dot" size="sm">
                      Not Added
                    </Chip>
                  )}
                </div>
              </div>
              <div className="flex gap-2 items-center">
                <p className="font-black text-sm">Date Of Visit : </p>
                <div className="font-light text-secondary">
                  {Visitor?.dateOfVisit ? (
                    <p>{Visitor.dateOfVisit}</p>
                  ) : (
                    <Chip color="warning" variant="dot" size="sm">
                      Not Added
                    </Chip>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex gap-2 items-center">
                <p className="font-black text-sm">In Time : </p>
                <div className="font-light text-secondary">
                  {Visitor?.timeOfVisit ? (
                    <p>{Visitor.timeOfVisit}</p>
                  ) : (
                    <Chip color="warning" variant="dot" size="sm">
                      Not Added
                    </Chip>
                  )}
                </div>
              </div>
              <div className="flex gap-2 items-center">
                <p className="font-black text-sm">Exit Time : </p>
                <div className="capitalize font-light text-secondary">
                  {Visitor?.exitTime ? (
                    <p>{Visitor.exitTime}</p>
                  ) : (
                    <Chip color="warning" variant="dot" size="sm">
                      Not Exited
                    </Chip>
                  )}
                </div>
              </div>
              <div className="flex gap-2 items-center">
                <p className="font-black text-sm">Person To Meet : </p>
                <div className="capitalize font-light text-secondary">
                  {Visitor?.personToMeet ? (
                    <p>{Visitor.personToMeet}</p>
                  ) : (
                    <Chip color="warning" variant="dot" size="sm">
                      Not Added
                    </Chip>
                  )}
                </div>
              </div>
              <div className="flex gap-2 row-span-2">
                <p className="font-black text-sm">Purpose Of Visit : </p>
                <div className="font-light text-secondary w-52 line-clamp-2">
                  {Visitor?.purpose ? (
                    <Tooltip
                      content={Visitor.purpose}
                      showArrow={true}
                      className="w-[10rem]"
                    >
                      <p>{Visitor.purpose}</p>
                    </Tooltip>
                  ) : (
                    <Chip color="warning" variant="dot" size="sm">
                      Not Added
                    </Chip>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="bg-secondary h-full rounded-lg w-[4rem] absolute top-0 right-0"></div>
          <img
            src="small-logo.svg"
            alt=""
            className="absolute bottom-5 right-4 w-[2rem]"
          />
        </div>
      </div>
    </div>
  );
}
