"use client";

import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Landing from "../landing";
import Reviews from "../reviews/reviews";
import Pricing from "../pricing";

export default function MinimizedTopNav({
  setHomeSection,
}: {
  setHomeSection: Dispatch<SetStateAction<JSX.Element>>;
}) {
  type DynamicStyles = {
    color: string;
    bg: string;
  };

  const [isHome, setIsHome] = useState(true);

  const [dynamicStyles, setDynamicStyles] = useState<DynamicStyles>('bg-transparent text-white');

  const scrollHandler = () => {
    if (window.scrollY >= window.screen.height / 2 - 50) {
      setDynamicStyles({ bg: "white", color: "black" });
    } else {
      if (window.scrollY <= window.screen.height / 2 - 50) {
        setDynamicStyles({ bg: "transparent", color: "white" });
      }
    }
  };

  useEffect(() => {
    if (isHome) {
      scrollHandler();
      window.addEventListener("scroll", scrollHandler);

      return () => {
        window.removeEventListener("scroll", scrollHandler);
      };
    }
  }, [isHome]);

  const [openNav, setOpenNav] = useState(false);

  const toggleNav = () => {
    setOpenNav(!openNav);
  };

  const navList = () => {
    return (
      <div className="flex flex-col gap-5 text-[20px] font-[350]">
        {/* <button className="px-3 py-2 rounded-lg text-black bg-[#E3C3C3]">Logo</button> */}
        {/* <div className="flex items-center gap-2">
          <span>+234 812340593</span>
          <Image src={"/black-phone.png"} width={20} height={20} alt="phone" />
        </div> */}
        {/* <div className="flex items-center gap-2">
          <span>West Brom, UK</span>{" "}
          <Image src={"/black-location.png"} width={20} height={20} alt="location" />
        </div> */}

        {/* <div>Projects</div>
        <div>About me</div> */}
        {/* <div className="flex gap-2 items-center">
          <span>English</span>
          <Image src={"/black-globe.png"} width={24} height={24} alt="Globe" />
        </div> */}
        <div
          onClick={() => {
            setOpenNav(false);
            setIsHome(false);
            setDynamicStyles( 'bg-white text-black' );
            setHomeSection(<Reviews />);
          }}
          className=""
        >
          Reviews
        </div>
        <div
          className="hover:cursor-pointer hover:opacity-50 "
          onClick={() => {
            setOpenNav(false);
            setIsHome(false);
            setDynamicStyles('bg-white text-black');
            setHomeSection(<Pricing />);
          }}
        >
          Pricing
        </div>
        <div>
          <Image src={"/profile.png"} width={35} height={35} loading="eager" alt="location" />
        </div>
      </div>
    );
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-10` + dynamicStyles}
    >
      <div className="mx-auto md:flex items-center md:justify-between">
        <div className={`flex items-center py-[14px] justify-between pl-2`}>
          <div
            className="text-[26px] font-[350]"
            onClick={() => {
              setIsHome(true);
              setDynamicStyles( 'bg-white text-black');  );
              setOpenNav(false);
              setHomeSection(<Landing />);
            }}
          >
            Journal
          </div>
          <button onClick={toggleNav} className="block md:hidden p-2 rounded focus:outline-none">
            <svg
              className={`w-6 h-6 ${openNav ? "hidden" : "block"}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              ></path>
            </svg>
            <svg
              className={`w-6 h-6 ${openNav ? "block" : "hidden"}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>
        <nav className="hidden md:flex space-x-4">{navList()}</nav>
        <div
          className={`${
            openNav ? "" : "hidden"
          } mt-2 shadow-lg  bg-white text-black flex flex-col gap-4 px-2 pb-5  rounded `}
        >
          {navList()}
        </div>
      </div>
    </header>
  );
}
