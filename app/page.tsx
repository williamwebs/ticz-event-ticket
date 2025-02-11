"use client";

import { ticketTypes } from "@/constants/data";
import { useState } from "react";

export default function Home() {
  const [selectedTicket, setSelectedTicket] = useState<string>("");

  return (
    <main className="max-w-xl mx-auto border border-stroke rounded-3xl p-10">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h3 className="text-white text-2xl font-jejumyeongjo">
            Ticket Selection
          </h3>
          <p className="text-sm text-grey font-roboto">Step 1/3</p>
        </div>

        <div className="w-full h-1 bg-stroke relative">
          <div className="absolute w-1/3 top-0 left-0 right-0 bg-blue h-full"></div>
        </div>
      </div>

      {/* form container */}
      <div className="mt-8 border border-stroke rounded-2xl p-6">
        {/* form header */}
        <div className="border border-[#07373F] p-5 rounded-2xl text-center linear-gradient">
          <h2 className="text-grey text-6xl font-medium font-roadrage">
            Techember Fest ”25
          </h2>
          <p className="text-base text-grey font-roboto my-2 max-w-xs mx-auto">
            Join us for an unforgettable experience at [Event Name]! Secure your
            spot now.
          </p>
          <div className="flex items-center justify-center">
            <p className="text-base font-roboto">📍 [Event Location]</p>
            <p className="text-base font-roboto mx-3">| |</p>
            <p className="text-base font-roboto">March 15, 2025 | 7:00 PM</p>
          </div>
        </div>

        {/* divider */}
        <div className="w-full h-1 bg-[#07373F] my-7"></div>

        {/* form fields */}
        <div className="flex flex-col items-start gap-2">
          <p className="text-sm text-grey font-roboto font-normal">
            Select Ticket Type:
          </p>

          <section className="border border-[#07373F] bg-[#052228] rounded-2xl p-4 w-full font-normal font-roboto">
            <div className="grid grid-cols-2 gap-3">
              {ticketTypes.map((ticket) => (
                <div
                  onClick={() => setSelectedTicket(ticket.htmlFor)}
                  className={`flex items-center gap-4 border border-blue-primary p-2 rounded-lg cursor-pointer ${
                    selectedTicket === ticket.htmlFor && "bg-blue-primary"
                  }`}
                >
                  <div className="flex-1 flex-col">
                    <label
                      htmlFor={ticket.htmlFor}
                      className="text-xs text-grey uppercase"
                    >
                      {ticket.label}
                    </label>
                    <p className="text-xs text-grey">{ticket.pcs} left</p>
                  </div>

                  <div className="bg-stroke border border-[#2BA4B9] p-2 pl-5 rounded font-medium text-sm">
                    {typeof ticket.price === "number"
                      ? `$${ticket.price}`
                      : ticket.price}
                  </div>
                  <input
                    type="radio"
                    name="ticket-type"
                    id={ticket.htmlFor}
                    className="hidden"
                    checked={selectedTicket === ticket.htmlFor}
                    onChange={() => setSelectedTicket(ticket.htmlFor)}
                  />
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="flex flex-col items-start gap-2 mt-4">
          <p className="text-sm text-grey font-roboto font-normal">
            Number of Tickets
          </p>

          <select
            name="unit"
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
        </div>

        {/* button */}
        <div className="border border-stroke bg-background h-10 rounded-3xl mt-7 flex justify-evenly">
          <button className="text-sm font-normal font-jejumyeongjo text-blue h-full px-16 border border-blue rounded">
            Cancel
          </button>
          <button className="text-sm font-normal font-jejumyeongjo text-grey h-full px-16 border border-blue bg-blue rounded">
            Next
          </button>
        </div>
      </div>
    </main>
  );
}
