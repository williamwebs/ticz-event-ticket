"use client";

import { ticketTypes } from "@/constants/data";
import { DevTool } from "@hookform/devtools";
import React, { useState, useCallback, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormDataShema } from "@/lib/schema";
import { z } from "zod";
import { StepProps } from "@/app/page";
import { RiDownloadCloud2Line } from "react-icons/ri";
import { useDropzone } from "react-dropzone";
import html2canvas from "html2canvas";
import QRCode from "react-qr-code";
import Image from "next/image";

type Inputs = z.infer<typeof FormDataShema>;

interface FormProps {
  steps: StepProps[];
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
}

const Form = ({ steps, currentStep, setCurrentStep }: FormProps) => {
  const [qrValue, setQrValue] = useState("");
  const [selectedTicket, setSelectedTicket] = useState<string>("");
  const [previousStep, setPreviousStep] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const delta = currentStep - previousStep;

  const {
    register,
    control,
    handleSubmit,
    trigger,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting, isSubmitted },
  } = useForm<Inputs>({
    resolver: zodResolver(FormDataShema),
    defaultValues: {
      image: "",
      type: "",
      unit: 1,
      email: "",
      about: "",
      name: "",
    },
  });

  type FieldName = keyof Inputs;

  const onSubmit = (data: Inputs) => {
    const encodedData = JSON.stringify(data);
    setQrValue(encodedData);
    // check if theres a ticket in local storage. if yes, pysh the new ticket, if not, create a ticket in the localstorage
    // save the user ticket in the db. should be an array containing user details including qrcode.

    const storedTickets = localStorage.getItem("tickets");
    let tickets: any[] = storedTickets ? JSON.parse(storedTickets) : [];

    // create new ticket from the user data na d qrcode
    const newTicket = {
      ...data,
      qrCode: qrValue,
      createdAt: new Date().toISOString(),
    };

    // push the new ticket to local storage
    tickets.push(newTicket);

    // update ls
    localStorage.setItem("tickets", JSON.stringify(tickets));
    console.log("submitted!", data);
  };

  // handle next
  const next = async (data: Inputs) => {
    const fields = steps[currentStep].fields;
    const output = await trigger(fields as FieldName[], { shouldFocus: true });

    if (!output) return;

    if (currentStep < steps.length - 1) {
      if (currentStep === steps.length - 2) {
        onSubmit(data);
      }
      setPreviousStep(currentStep);
      setCurrentStep((step) => step + 1);
    }
  };

  // onDrop handler for image drag and drop
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];

    if (file) {
      // Begin simulated upload
      setIsUploading(true);
      setUploadProgress(0);

      const simulateUpload = () => {
        let progress = 0;
        const interval = setInterval(() => {
          progress += 10;
          setUploadProgress(progress);
          if (progress >= 100) {
            clearInterval(interval);
            setIsUploading(false);
            // Create a temporary URL for the uploaded image
            const imageUrl = URL.createObjectURL(file);
            setUploadedImage(imageUrl);
            setValue("image", imageUrl, { shouldValidate: true });
          }
        }, 200);
      };
      simulateUpload();
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    // accept: "image/*",
  });

  const prev = () => {
    if (currentStep > 0) {
      setPreviousStep(currentStep);
      setCurrentStep((step) => step - 1);
    }
  };

  // ticket download fns
  const ticketRef = useRef<HTMLDivElement>(null);

  const handleTicketDownload = async () => {
    if (ticketRef.current) {
      try {
        const canvas = await html2canvas(ticketRef.current, {
          useCORS: true,
          scale: window.devicePixelRatio,
        });

        const dataUrl = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = "ticket.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error("Error generating image:", error);
      }
    }
  };

  const handleReset = () => {
    reset();
    setCurrentStep(0);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {currentStep === 0 && (
          <div className="mt-8 sm:border border-stroke rounded-2xl sm:p-6">
            {/* form header */}
            <div className="border border-[#07373F] p-3 sm:p-5 rounded-2xl text-center linear-gradient">
              <h2 className="text-grey text-6xl sm:text-6xl font-medium font-roadrage">
                Techember Fest ”25
              </h2>
              <p className="text-lg sm:text-base text-grey font-roboto my-4 sm:my-3 max-w-xs mx-auto px-3 sm:px-0">
                Join us for an unforgettable experience at [Event Name]! Secure
                your spot now.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center text-sm font-roboto">
                <p className="">📍 [Event Location]</p>
                <p className="hidden sm:inline-block mx-3">| |</p>
                <p className="">March 15, 2025 | 7:00 PM</p>
              </div>
            </div>

            {/* divider */}
            <div className="w-full h-1 bg-[#07373F] my-7"></div>

            {/* form fields */}
            <section>
              <div className="flex flex-col items-start gap-2">
                <p className="text-base sm:text-sm text-grey font-roboto font-normal">
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
                        <div className="flex-1 flex-col space-y-1">
                          <span className="text-sm sm:text-xs text-grey uppercase">
                            {ticket.label}
                          </span>
                          <p className="text-sm sm:text-xs text-grey">
                            {ticket.pcs} left
                          </p>
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
                  <span className="error">{errors.type?.message}</span>
                </div>
              </div>

              <div className="flex flex-col items-start gap-2 mt-4">
                <p className="text-base sm:text-sm text-grey font-roboto font-normal">
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
                <span className="error">{errors.unit?.message}</span>
              </div>
            </section>

            {/* button */}
            <div className="sm:border border-stroke bg-background sm:h-10 rounded-3xl mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:gap-0 justify-evenly">
              <button className="text-base sm:text-sm font-normal font-jejumyeongjo text-blue h-full px-16 py-4 sm:py-0 border border-blue rounded">
                Cancel
              </button>
              <button
                onClick={next}
                className="text-base sm:text-sm font-normal font-jejumyeongjo text-grey h-full px-16 py-4 sm:py-0 border border-blue bg-blue rounded"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {currentStep === 1 && (
          <div className="mt-8 sm:border border-stroke rounded-2xl sm:p-6 text-left bg-background-tertiary">
            {/* form header */}
            <div className="border border-[#07373F] p-3 sm:p-5 rounded-2xl bg-background">
              <h3 className="text-base text-grey font-normal font-roboto">
                Upload Profile Phote
              </h3>

              {/* profile picture upload */}
              <div className="mt-8 bg-background-secondary rounded">
                <div
                  {...getRootProps()}
                  className={`w-60 h-60 mx-auto rounded-3xl relative cursor-pointer flex flex-col items-center justify-center transition-all duration-300 ${
                    isDragActive ? "bg-gray-200" : "bg-stroke"
                  }`}
                >
                  <input {...getInputProps()} />
                  {/* display uploaded image */}
                  {uploadedImage ? (
                    <>
                      {/* image container */}
                      <div className="w-full h-full relative rounded-3xl overflow-hidden">
                        <Image
                          src={uploadedImage}
                          alt="Profile picture"
                          fill
                          className={`object-cover transition-all duration-300 rounded-3xl ${
                            isUploading ? "blur-md" : "blur-0"
                          }`}
                        />

                        {/* Overlay onHover */}
                        {!isUploading && (
                          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-0 hover:bg-opacity-50 transition duration-300 rounded-3xl">
                            <RiDownloadCloud2Line className="size-8" />
                            <span className="text-sm text-grey font-normal font-roboto">
                              Upload Image
                            </span>
                          </div>
                        )}

                        {/* progress overlay while image is uploading */}
                        {isUploading && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-3xl">
                            <span className="text-white text-sm">
                              Uploading {uploadProgress}%
                            </span>
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      <RiDownloadCloud2Line className="size-8 mb-3" />
                      <span className="text-sm text-grey text-center font-normal font-roboto">
                        Drag & drop or click to <br />
                        upload
                      </span>
                    </>
                  )}
                </div>
                <span className="error text-center">
                  {errors.image?.message}
                </span>
              </div>
            </div>

            {/* divider */}
            <div className="w-full h-1 bg-[#07373F] my-7"></div>

            {/* form fields */}
            <div className="flex flex-col gap-4">
              <div>
                <label htmlFor="name" className="label">
                  Enter your name
                </label>
                <input
                  type="text"
                  {...register("name")}
                  id="name"
                  className="input"
                />
                <span className="error">{errors.name?.message}</span>
              </div>

              <div>
                <label htmlFor="email" className="label">
                  Enter your email*
                </label>
                <input
                  type="email"
                  {...register("email")}
                  id="email"
                  className="input"
                />
                <span className="error">{errors.email?.message}</span>
              </div>

              <div>
                <label htmlFor="email" className="label">
                  About the project
                </label>

                <textarea
                  {...register("about")}
                  id="about"
                  className="textarea"
                ></textarea>
                {/* <span className="error">{errors.about?.message}</span> */}
              </div>
            </div>

            {/* button */}
            <div className="sm:h-10 mt-7 flex flex-col gap-3 sm:flex-row sm:gap-2 justify-between">
              <button
                onClick={prev}
                className="text-sm font-normal font-jejumyeongjo text-blue h-full px-16 py-4 sm:py-0 border border-blue rounded w-full sm:w-1/3"
              >
                Back
              </button>
              <button
                onClick={handleSubmit(next)}
                className="text-sm font-normal font-jejumyeongjo text-grey h-full px-16 py-4 sm:py-0 border border-blue bg-blue rounded w-full sm:w-2/3"
              >
                Get My Free Ticket
              </button>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="mt-8">
            <div className="text-center">
              <h3 className="font-medium font-roboto text-3xl text-white">
                Your Ticket is Booked!
              </h3>
              <p className="font-normal font-roboto text-base text-grey mt-2">
                You can download or Check your email for a copy
              </p>
            </div>
            {/* svg */}
            <div ref={ticketRef} className="relative w-[528px] h-[176px] mt-8">
              <Image
                src={"/ticket-bg.svg"}
                width={528}
                height={176}
                alt="ticket bg"
              />

              <div className="absolute top-1 left-0 w-[528px] h-[176px] px-3 flex gap-5 overflow-hidden">
                <section className="relative w-full h-full p-3 rounded-l-2xl">
                  <div className="flex items-start gap-4">
                    {/* qr code */}
                    <div className="w-[140px] h-[123px] p-1 my-0.5 rounded-lg overflow-hidden flex items-center justify-center">
                      {qrValue && (
                        <QRCode value={qrValue} className="w-full h-full" />
                      )}
                    </div>
                    {/* ticket information */}
                    <div className="flex-1">
                      {/* top */}
                      <div className="flex items-start gap-2">
                        <div>
                          <h3 className="text-5xl text-grey font-normal font-roadrage max-w-48 pr-1 -mt-1 mb-1">
                            Techember Fest ”25
                          </h3>
                        </div>
                        <div className="-mt-2 -mr-5">
                          <Image
                            src={"reg.svg"}
                            width={60}
                            height={60}
                            alt="ticket badge"
                          />
                        </div>
                      </div>
                      {/* bottom */}
                      <div>
                        <p className="font-normal font-roboto text-base text-grey">
                          📍 04 Rumens road, Ikoyi, Lagos
                        </p>
                        <p className="font-normal font-roboto text-base text-grey">
                          📅 March 15, 2025 | 7:00 PM
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="font-semibold font-roboto text-xs text-stroke mt-2">
                    Ticket for {watch("unit")} entry only
                  </div>
                </section>
                {/* user information */}
                <section className="w-[74px] h-full py-1 px-2 rounded-r-2xl overflow-hidden">
                  <div className="flex flex-col-reverse items-center gap-1">
                    <div>
                      <Image
                        src={"reg.svg"}
                        width={35}
                        height={35}
                        alt="ticket badge"
                      />
                    </div>
                    <div className="flex-1 p-1">
                      <div className="[writing-mode:vertical-rl] [transform:rotate(180deg)]">
                        <h3 className="text-xl text-grey font-normal font-roadrage max-w-48">
                          Techember Fest ”25
                        </h3>
                        <p className="text-grey text-[11px] font-normal font-roboto">
                          User Name:{" "}
                          <span className="font-light">{watch("name")}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
            {/* button */}
            <div className="sm:border border-stroke bg-background sm:h-10 rounded-3xl mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:gap-0 justify-evenly">
              <button
                onClick={handleReset}
                className="text-base sm:text-sm font-normal font-jejumyeongjo inline-block text-blue h-full px-16 py-4 sm:py-0 border border-blue rounded"
              >
                Book Another Ticket
              </button>
              <button
                onClick={handleTicketDownload}
                className="text-base sm:text-sm font-normal font-jejumyeongjo text-grey h-full px-16 py-4 sm:py-0 border border-blue bg-blue rounded"
              >
                Download Ticket
              </button>
            </div>
          </div>
        )}
      </form>
      <DevTool control={control} />
    </>
  );
};

export default Form;
