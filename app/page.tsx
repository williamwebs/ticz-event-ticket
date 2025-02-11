"use client";

import Form from "@/components/form/Form";
import { useState } from "react";

export interface StepProps {
  id: string;
  name: string;
  fields?: string[];
}

export default function Home() {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const steps: StepProps[] = [
    {
      id: "Step 1",
      name: "Ticket Selection",
      fields: ["type", "unit"],
    },
    {
      id: "Step 2",
      name: "Address",
      fields: ["country", "state", "city", "street", "zip"],
    },
    { id: "Step 3", name: "Complete" },
  ];

  return (
    <main className="max-w-xl mx-auto border border-stroke rounded-3xl p-10">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h3 className="text-white text-2xl font-jejumyeongjo">
            {steps[currentStep]?.name}
          </h3>
          <p className="text-sm text-grey font-roboto">
            Step {currentStep + 1}/{steps.length}
          </p>
        </div>

        <div className="w-full h-1 bg-stroke relative">
          <div className="absolute w-1/3 top-0 left-0 right-0 bg-blue h-full"></div>
        </div>
      </div>

      {/* form */}
      <Form
        steps={steps}
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
      />
    </main>
  );
}
