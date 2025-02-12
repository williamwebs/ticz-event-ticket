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
      name: "Attendee Details",
      fields: ["image", "name", "email", "project"],
    },
    { id: "Step 3", name: "Ready" },
  ];

  return (
    <main className="max-w-xl mx-2 sm:mx-auto border border-stroke rounded-3xl p-4 py-6 sm:p-6 ms:p-8 lg:p-10">
      <div className="flex flex-col gap-2">
        <div className="flex  items-start sm:items-center space-y-2 sm:space-y-0 justify-between">
          <h3 className="text-white text-2xl font-jejumyeongjo">
            {steps[currentStep]?.name}
          </h3>
          <p className="text-sm text-grey font-roboto">
            Step {currentStep + 1}/{steps.length}
          </p>
        </div>

        <div className="w-full h-1 bg-stroke relative">
          <div
            className={`absolute top-0 left-0 right-0 bg-blue h-full ${
              currentStep === 0
                ? "w-1/3"
                : currentStep === 1
                ? "w-2/3"
                : "w-3/3"
            }`}
          ></div>
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
