"use client";

import Image from "next/image";

import { lightLogoImage } from "@/app/constants/constantImages";

export const CircularLogo = () => {
  return (
    <div
      className=" bg-gradient-to-tl from-black to-black/55
    p-4 rounded-full w-48 h-48 flex items-center justify-center flex-col
    shadow-lg 
  "
    >
      <Image src={lightLogoImage} width={100} height={100} alt="Logo" />

      <h1 className="text-3xl font-serif italic font-bold mt-2 text-white">
        Studios
      </h1>
    </div>
  );
};
