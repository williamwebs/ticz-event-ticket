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
import { motion } from "framer-motion";
import html2canvas from "html2canvas";
import Image from "next/image";
import BarCode from "../barcode/BarCode";

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
    getValues,
    formState: { errors },
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

  const ticketType = watch("type");

  const onSubmit = (data: Inputs) => {
    const encodedData = JSON.stringify(data);
    setQrValue(encodedData);
    // check if theres a ticket in local storage. if yes, pysh the new ticket, if not, create a ticket in the localstorage
    // save the user ticket in the db. should be an array containing user details including qrcode.

    const storedTickets = localStorage.getItem("tickets");
    const tickets: Inputs[] = storedTickets ? JSON.parse(storedTickets) : [];

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
  const next = async (
    dataOrEvent?: Inputs | React.MouseEvent<HTMLButtonElement>
  ) => {
    let data: Inputs;

    if (dataOrEvent && "preventDefault" in dataOrEvent) {
      data = getValues();
    } else if (dataOrEvent) {
      data = dataOrEvent as Inputs;
    } else {
      data = getValues();
    }
    const fields = steps[currentStep].fields;
    console.log(fields);
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
    setSelectedTicket("");
    setCurrentStep(0);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {currentStep === 0 && (
          <motion.div
            initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="mt-8 sm:border border-stroke rounded-2xl sm:p-6"
            role="region"
            aria-labelledby="form-header"
          >
            {/* form header */}
            <div
              id="form-header"
              className="border border-[#07373F] p-3 sm:p-5 rounded-2xl text-center linear-gradient"
            >
              <h2 className="text-grey text-5xl sm:text-6xl font-medium font-roadrage">
                Techember Fest ”25
              </h2>
              <p className="text-lg sm:text-base text-grey font-roboto my-4 sm:my-3 max-w-xs mx-auto px-2 sm:px-0">
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
            <div
              className="w-full h-1 bg-[#07373F] my-7"
              aria-hidden="true"
            ></div>

            {/* form fields */}
            <section aria-labelledby="ticket-type-heading">
              <div className="flex flex-col items-start gap-2">
                <p
                  id="ticket-type-heading"
                  className="text-base sm:text-sm text-grey font-roboto font-normal"
                >
                  Select Ticket Type:
                </p>

                <fieldset className="border border-[#07373F] bg-[#052228] rounded-2xl p-4 w-full font-normal font-roboto">
                  <legend className="sr-only">Ticket Types</legend>
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
                          aria-describedby="ticket-type-error"
                        />
                      </label>
                    ))}
                  </div>
                  <span id="ticket-type-error" className="error">
                    {errors.type?.message}
                  </span>
                </fieldset>
              </div>

              <div className="flex flex-col items-start gap-2 mt-4">
                <label
                  htmlFor="unit"
                  className="text-base sm:text-sm text-grey font-roboto font-normal"
                >
                  Number of Tickets
                </label>

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
            <div
              role="group"
              aria-label="form navigation"
              className="sm:border border-stroke bg-background sm:h-10 rounded-3xl mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:gap-0 justify-evenly"
            >
              <button
                type="button"
                className="text-base sm:text-sm font-normal font-jejumyeongjo text-blue h-full px-16 py-4 sm:py-0 border border-blue rounded"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={next}
                className="text-base sm:text-sm font-normal font-jejumyeongjo text-grey h-full px-16 py-4 sm:py-0 border border-blue bg-blue rounded"
              >
                Next
              </button>
            </div>
          </motion.div>
        )}

        {currentStep === 1 && (
          <motion.div
            initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="mt-8 sm:border border-stroke rounded-2xl sm:p-6 text-left sm:bg-background-tertiary"
            role="region"
            aria-labelledby="form-header-step-2"
          >
            {/* form header */}
            <div
              id="form-header-step-2"
              className="border border-[#07373F] p-3 sm:p-5 rounded-2xl bg-background"
            >
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
                  role="button"
                  tabIndex={0}
                  aria-label="Upload profile picture: drag and drop or click to select an image"
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
            <div
              className="w-full h-1 bg-[#07373F] my-7"
              aria-hidden="true"
            ></div>

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
                  aria-invalid={errors.name ? "true" : "false"}
                  aria-describedby={errors.name ? "name-error" : undefined}
                />
                <span id="name-error" className="error">
                  {errors.name?.message}
                </span>
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
                  aria-invalid={errors.email ? "true" : "false"}
                  aria-describedby={errors.email ? "email-error" : undefined}
                />
                <span id="email-error" className="error">
                  {errors.email?.message}
                </span>
              </div>

              <div>
                <label htmlFor="email" className="label">
                  Special request
                </label>

                <textarea
                  {...register("about")}
                  id="about"
                  className="textarea"
                  aria-invalid={errors.about ? "true" : "false"}
                  aria-describedby={errors.about ? "about-error" : undefined}
                ></textarea>
                {/* <span className="error">{errors.about?.message}</span> */}
              </div>
            </div>

            {/* button */}
            <div
              role="group"
              aria-label="Form navigation"
              className="sm:h-10 mt-7 flex flex-col gap-3 sm:flex-row sm:gap-2 justify-between"
            >
              <button
                type="button"
                onClick={prev}
                className="text-sm font-normal font-jejumyeongjo text-blue h-full px-16 py-4 sm:py-0 border border-blue rounded w-full sm:w-1/3"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleSubmit(next)}
                className="text-sm font-normal font-jejumyeongjo text-grey h-full px-16 py-4 sm:py-0 border border-blue bg-blue rounded w-full sm:w-2/3"
              >
                Get My Free Ticket
              </button>
            </div>
          </motion.div>
        )}

        {currentStep === 2 && (
          <motion.div
            initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="mt-8"
            role="region"
            aria-labelledby="ticket-booked-heading"
          >
            <div className="text-left sm:text-center">
              <h3
                id="ticket-booked-heading"
                className="font-medium font-roboto text-3xl text-white"
              >
                Your Ticket is Booked!
              </h3>
              <p className="font-normal font-roboto text-base text-grey mt-2">
                You can download or Check your <br className="sm:hidden" />
                email for a copy
              </p>
            </div>
            {/* svg */}
            <div
              ref={ticketRef}
              className="relative border border-stroke bg-background mx-auto w-[300px] h-[600px] p-4 mt-8"
              role="img"
              aria-label="Your ticket, showing event details and QR code"
            >
              {/* edges starts here */}
              <div className="absolute rounded-full -top-2 -left-2 border-r border-stroke rotate-45 bg-background-secondary w-5 h-5"></div>
              <div className="absolute rounded-full -top-2 -right-2 border-b border-stroke rotate-45 bg-background-secondary w-5 h-5"></div>
              <div className="absolute rounded-full -bottom-2 -left-2 border-l border-stroke rotate-90 bg-background-secondary w-5 h-5"></div>
              <div className="absolute rounded-full -bottom-2 -right-2 border-l border-stroke rotate-90 bg-background-secondary w-5 h-5"></div>
              <div className="absolute rounded-full bottom-24 -left-2 border-r border-stroke bg-background-secondary w-5 h-5"></div>
              <div className="absolute rounded-full bottom-24 -right-2 border-l border-stroke bg-background-secondary w-5 h-5"></div>
              {/* edges ends here */}

              <div className="rounded-2xl border border-stroke w-full h-[446px] py-3 px-3">
                <h3 className="text-center text-white text-4xl font-roadrage mb-2">
                  Techember Fest ”25
                </h3>
                <p className="text-xs text-center font-normal font-roboto my-1">
                  📍 04 Rumens road, Ikoyi, Lagos
                </p>
                <p className="text-xs text-center font-normal font-roboto my-1">
                  📅 March 15, 2025 | 7:00 PM
                </p>

                {/* user image */}
                <div className="border-2 border-blue w-[140px] h-[140px] mx-auto bg-blue rounded-2xl my-5 p-1 overflow-hidden">
                  {watch("image") ? (
                    <div className="w-full h-full relative overflow-hidden">
                      <Image
                        src={watch("image")}
                        alt="Profile Picture"
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                  ) : (
                    <p></p>
                  )}
                </div>

                <div className="border border-[#133D44] w-full bg-[#08343C] rounded-lg p-2 shadow">
                  {/* user details */}
                  <div className="border-b border-[#133D44] flex items-start justify-between pb-1">
                    <div className="w-1/2">
                      <span className="font-roboto text-[10px] text-gray-600">
                        Enter your name
                      </span>
                      <h4 className="font-normal font-roboto text-xs my-0.5">
                        {watch("name")}
                      </h4>
                    </div>
                    <div className="h-10 border border-[#133D44] -mb-1"></div>
                    <div className="w-1/2 pl-2">
                      <span className="font-roboto text-[10px] text-gray-600">
                        Enter your email*
                      </span>
                      <h4 className="font-normal font-roboto text-xs my-0.5">
                        {watch("email").slice(0, 17)}
                      </h4>
                    </div>
                  </div>
                  {/* ticket info */}
                  <div className="border-b border-[#133D44] flex items-start justify-between pb-1">
                    <div className="w-1/2">
                      <span className="font-roboto text-[10px] text-gray-600">
                        Ticket Type:
                      </span>
                      <h4 className="font-normal font-roboto text-xs my-0.5 uppercase">
                        {watch("type")}
                      </h4>
                    </div>
                    <div className="h-10 border border-[#133D44] -mb-1"></div>
                    <div className="w-1/2 pl-2">
                      <span className="font-roboto text-[10px] text-gray-600">
                        Ticket for:
                      </span>
                      <h4 className="font-normal font-roboto text-xs my-0.5">
                        {watch("unit")}
                      </h4>
                    </div>
                  </div>

                  {/* request details */}
                  <div className="">
                    <span className="font-roboto text-[10px] text-gray-600">
                      Special request?
                    </span>
                    <p className="font-normal font-roboto text-xs">
                      {watch("about")
                        ? watch("about").split(/\s+/).slice(0, 30).join(" ")
                        : ""}
                    </p>
                  </div>
                </div>
              </div>

              <div className="w-full mt-6 flex items-center gap-1">
                {Array.from({ length: 18 }, (_, index) => (
                  <div
                    key={index}
                    className="border-2 border-stroke rounded w-3 p-0.5"
                  ></div>
                ))}
              </div>

              {/* barcode */}
              <div className="max-h-[68px] mt-5">
                <BarCode value="123456789012" />
              </div>
            </div>
            {/* button */}
            <div
              role="group"
              aria-label="Ticket actions"
              className="sm:border border-stroke bg-background sm:h-10 rounded-3xl mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:gap-0 justify-evenly"
            >
              <button
                type="button"
                onClick={handleReset}
                className="text-base sm:text-sm font-normal font-jejumyeongjo inline-block text-blue h-full px-16 py-4 sm:py-0 border border-blue rounded"
              >
                Book Another Ticket
              </button>
              <button
                type="button"
                onClick={handleTicketDownload}
                className="text-base sm:text-sm font-normal font-jejumyeongjo text-grey h-full px-16 py-4 sm:py-0 border border-blue bg-blue rounded"
              >
                Download Ticket
              </button>
            </div>
          </motion.div>
        )}
      </form>
      <DevTool control={control} />
    </>
  );
};

export default Form;
