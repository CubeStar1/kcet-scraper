"use client";
import React from "react";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import Image from "next/image";
 
export function HeroScrollDemo() {
  return (
    <div className="flex flex-col overflow-hidden px-10">
      <ContainerScroll
        titleComponent={
          <>
            <h1 className="text-4xl font-semibold text-black dark:text-white">
             View Latest Counselling data <br /> and Rankings
              {/* <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none"> */}
                
              {/* </span> */}
            </h1>
          </>
        }
      >
        <Image
          src={`/hero-demo.png`}
          alt="hero"
          height={720}
          width={1400}
          className="mx-auto rounded-2xl object-cover h-full object-left-top"
          draggable={false}
        />
      </ContainerScroll>
    </div>
  );
}