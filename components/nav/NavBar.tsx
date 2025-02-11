"use client";

import { navLinks } from "@/constants/data";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IoIosArrowRoundForward } from "react-icons/io";

function NavBar() {
  const path = usePathname();

  console.log(path);
  return (
    <nav className="sticky top-0 border border-blue-primary rounded-3xl px-4 py-2 w-full bg-[rgba(5,37,44,0.4)] mt-2 backdrop-blur z-10">
      <div className="flex items-center justify-between w-full text-white">
        {/* logo */}
        <div className="">
          <Link href={"/"}>
            <Image
              src={"/ticz-logo.svg"}
              width={98}
              height={36}
              alt="ticz logo"
            />
          </Link>
        </div>
        {/* navigation */}
        <div className="hidden sm:flex items-center gap-7">
          {navLinks.map((link) => (
            <Link
              href={link.url}
              key={link.name}
              className={`font-jejumyeongjo text-base font-normal ${
                path === link.url ? "text-white" : "text-[#B3B3B3]"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>
        {/* cta */}
        <Link
          href={"/"}
          className="flex items-center gap-1 bg-white rounded font-jejumyeongjo text-sm text-[#0a0c11] uppercase py-3 px-5"
        >
          My Tickets
          <IoIosArrowRoundForward className="size-5" />
        </Link>
      </div>
    </nav>
  );
}

export default NavBar;
