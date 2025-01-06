"use client";

// FormContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";

interface FormContextType {
  stepState: number;
  setStepState: (step: number) => void;
  selectedIndex: number | null;
  setSelectedIndex: (index: number | null) => void;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

export const FormProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [stepState, setStepState] = useState<number>(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  return (
    <FormContext.Provider
      value={{ stepState, setStepState, selectedIndex, setSelectedIndex }}
    >
      {children}
    </FormContext.Provider>
  );
};

export const useForm = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("useForm must be used within a FormProvider");
  }
  return context;
};
