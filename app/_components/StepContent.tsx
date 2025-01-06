"use client";

import { steps } from "../constants/steps";
import { ORDER_TYPES } from "../constants/Steps/orderType";
import { useForm } from "../context/FormContext";
import { Logistics } from "./Steps/Logistics";
import { Order_Type } from "./Steps/OrderType";

export const StepContent = () => {
  const { stepState, selectedIndex, setSelectedIndex } = useForm();

  return (
    <>
      <h1 className="text-4xl font-serif italic font-bold text-black/60">
        {steps[stepState].title}
      </h1>
      <p className="text-black/55 mt-2 font-extralight ">
        {steps[stepState].description}
      </p>

      {stepState === 0 && (
        <div className="grid grid-cols-2 gap-4 mt-4 justify-center">
          {ORDER_TYPES.map((orderType, index) => (
            <Order_Type
              key={index}
              label={orderType.label}
              para={orderType.para}
              image={orderType.image}
              index={index}
              selectedIndex={selectedIndex ?? -1}
              setSelectedIndex={setSelectedIndex}
            />
          ))}
        </div>
      )}

      {stepState === 1 && <Logistics />}
      {stepState === 2 && <div>This is step 3: Style Details</div>}
      {stepState === 3 && <div>This is step 4: Order Details</div>}
      {stepState === 4 && <div>This is step 5: Footage Upload</div>}
      {stepState === 5 && <div>This is step 6: Review Order</div>}
      {stepState === 6 && <div>This is step 7: Payment</div>}
    </>
  );
};
