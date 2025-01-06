import React, { useState } from "react";
import Image from "next/image";
import { Check } from "lucide-react";

interface OrderType {
  label: string;
  para: string;
  image: {
    src: string;
    alt: string;
  };
  index: number;
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
}

export const Order_Type = ({
  label,
  para,
  image,
  index,
  selectedIndex,
  setSelectedIndex,
}: OrderType) => {
  return (
    <div
      key={index}
      className={`
              bg-black/50 p-4 rounded-lg flex items-center justify-between relative
              ${selectedIndex === index ? "outline outline-white" : ""}
                h-52
            `}
      onClick={() => setSelectedIndex(index)}
    >
      <div className="flex flex-col items-center justify-center w-full h-full">
        <Image
          src={image.src}
          alt={image.alt}
          width={50}
          height={50}
          className="rounded-lg bg-white p-2"
        />
        <h2
          className="
          text-base text-center
        lg:text-xl font-serif mt-2 italic font-bold text-white"
        >
          {label}
        </h2>
        <p
          className="mt-2 text-xs text-white text-center
        lg:text-base font-extralight 
        "
        >
          {para}
        </p>
      </div>

      {selectedIndex === index && (
        <Check
          className="h-6 w-6 text-white absolute top-4 right-4 
                bg-blue-500 rounded-full p-1"
        />
      )}
    </div>
  );
};
