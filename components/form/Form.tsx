"use client";

import { ticketTypes } from "@/constants/data";
import { DevTool } from "@hookform/devtools";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormDataShema } from "@/lib/schema";
import { z } from "zod";
import { StepProps } from "@/app/page";

type Inputs = z.infer<typeof FormDataShema>;

interface FormProps {
  steps: StepProps[];
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
}

const Form = ({ steps, currentStep, setCurrentStep }: FormProps) => {
  const [selectedTicket, setSelectedTicket] = useState<string>("");
  const [previousStep, setPreviousStep] = useState<number>(0);
  const delta = currentStep - previousStep;

  const {
    register,
    control,
    handleSubmit,
    trigger,
    formState: { errors, isSubmitting, isSubmitted },
  } = useForm<Inputs>({ resolver: zodResolver(FormDataShema) });

  const onSubmit = (data: Inputs) => {
    console.log("submitted!", data);
  };

  type FieldName = keyof Inputs;

  // handle next
  const next = async () => {
    const fields = steps[currentStep].fields;
    const output = await trigger(fields as FieldName[], { shouldFocus: true });

    if (!output) return;

    if (currentStep < steps.length - 1) {
      if (currentStep === steps.length - 2) {
        // submit when user clicks on the button in the second form
      }
      setPreviousStep(currentStep);
      setCurrentStep((step) => step + 1);
    }
  };

  const pre = () => {
    if (currentStep > 0) {
      setPreviousStep(currentStep);
      setCurrentStep((step) => step - 1);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {currentStep === 0 && (
          <div className="mt-8 border border-stroke rounded-2xl p-6">
            {/* form header */}
            <div className="border border-[#07373F] p-5 rounded-2xl text-center linear-gradient">
              <h2 className="text-grey text-6xl font-medium font-roadrage">
                Techember Fest ”25
              </h2>
              <p className="text-base text-grey font-roboto my-2 max-w-xs mx-auto">
                Join us for an unforgettable experience at [Event Name]! Secure
                your spot now.
              </p>
              <div className="flex items-center justify-center">
                <p className="text-base font-roboto">📍 [Event Location]</p>
                <p className="text-base font-roboto mx-3">| |</p>
                <p className="text-base font-roboto">
                  March 15, 2025 | 7:00 PM
                </p>
              </div>
            </div>

            {/* divider */}
            <div className="w-full h-1 bg-[#07373F] my-7"></div>

            {/* form fields */}
            <section>
              <div className="flex flex-col items-start gap-2">
                <p className="text-sm text-grey font-roboto font-normal">
                  Select Ticket Type:
                </p>

                <div className="border border-[#07373F] bg-[#052228] rounded-2xl p-4 w-full font-normal font-roboto">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {ticketTypes.map((ticket) => (
                      <label
                        htmlFor={ticket.htmlFor}
                        onClick={() => setSelectedTicket(ticket.htmlFor)}
                        key={ticket.label}
                        className={`flex items-center gap-4 border border-blue-primary p-2 rounded-lg cursor-pointer ${
                          selectedTicket === ticket.htmlFor && "bg-blue-primary"
                        }`}
                      >
                        <div className="flex-1 flex-col">
                          <span className="text-xs text-grey uppercase">
                            {ticket.label}
                          </span>
                          <p className="text-xs text-grey">{ticket.pcs} left</p>
                        </div>

                        <div className="bg-stroke border border-[#2BA4B9] p-2 pl-5 rounded font-medium text-sm">
                          {typeof ticket.price === "number"
                            ? `$${ticket.price}`
                            : ticket.price}
                        </div>
                        <input
                          type="radio"
                          {...register("type", {
                            required: "Select a valid ticket type!",
                          })}
                          id={ticket.htmlFor}
                          className="sr-only"
                          value={ticket.htmlFor}
                        />
                      </label>
                    ))}
                  </div>
                  <p>{errors.type?.message}</p>
                </div>
              </div>

              <div className="flex flex-col items-start gap-2 mt-4">
                <p className="text-sm text-grey font-roboto font-normal">
                  Number of Tickets
                </p>

                <select
                  {...register("unit", {
                    valueAsNumber: true,
                  })}
                  id="unit"
                  className="w-full border border-[#07373F] outline-none bg-transparent rounded p-2 text-sm cursor-pointer"
                >
                  <option value={1} className="text-background">
                    1
                  </option>
                  <option value={2} className="text-background">
                    2
                  </option>
                  <option value={3} className="text-background">
                    3
                  </option>
                </select>
                <p>{errors.unit?.message}</p>
              </div>
            </section>

            {/* button */}
            <div className="border border-stroke bg-background h-10 rounded-3xl mt-7 flex justify-evenly">
              <button className="text-sm font-normal font-jejumyeongjo text-blue h-full px-16 border border-blue rounded">
                Cancel
              </button>
              <button
                onClick={next}
                className="text-sm font-normal font-jejumyeongjo text-grey h-full px-16 border border-blue bg-blue rounded"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {currentStep === 1 && <div>second form</div>}

        {currentStep === 2 && <div>third form</div>}
      </form>
      <DevTool control={control} />
    </>
  );
};

export default Form;
