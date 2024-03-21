import Image from "next/image";
import { Dispatch, SetStateAction, useContext, useEffect, useRef, useState } from "react";
import Reviews from "../reviews/reviews";
import Landing from "../landing";
import Pricing from "../pricing";

export default function ExpandedNav({
  setHomeSection,
}: {
  setHomeSection: Dispatch<SetStateAction<JSX.Element>>;
}) {
  type DynamicStyles = {
    color: string;
    bg: string;
  };

  const [isHome, setIsHome] = useState(true);

  const [dynamicStyles, setDynamicStyles] = useState<DynamicStyles>({
    bg: "transparent",
    color: "white",
  });

  const scrollHandler = () => {
    if (window.scrollY >= window.screen.height) {
      setDynamicStyles({ bg: "white", color: "black" });
    } else {
      if (window.scrollY <= window.screen.height) {
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

  return (
    <div
      style={{ color: dynamicStyles.color, backgroundColor: dynamicStyles.bg }}
      className={"fixed flex left-0 right-0 z-10 h-[61px]  text-semibold text-lg"}
    >
      <div className="flex justify-between items-center px-2 text-lg w-full">
        <div className="flex gap-20 justify-around items-center ">
          {/* <button className="px-5 py-2 rounded-sm text-black bg-[#E3C3C3]">Logo</button> */}
          <div
            className="text-[24px] hover:cursor-pointer hover:opacity-50 active:opacity-50"
            onClick={() => {
              setIsHome(true);
              setDynamicStyles({ bg: "transparent", color: "white" });
              setHomeSection(<Landing />);
            }}
          >
            Journal
          </div>
          {/* <div className="flex items-center gap-2  hover:cursor-pointer hover:opacity-50">
            <span>+234 812340593</span>
            <Image
              src={"/black-phone.png"}
              
              width={20}
              height={20}
              alt="phone"
            />
          </div>
          <div className="flex items-center gap-2 hover:cursor-pointer hover:opacity-50" >
            <span>West Brom, UK</span>{" "}
            <Image
              src={"/black-location.png"}
              
              width={20}
              height={20}
              alt="location"
            />
          </div> */}
        </div>
        <div className="flex gap-20 justify-around items-center">
          {/*<div className="hover:cursor-pointer hover:opacity-50">Projects</div>
          <div className="hover:cursor-pointer hover:opacity-50">About me</div>
           <div className="flex gap-2 items-center hover:cursor-pointer hover:opacity-50">
            <span>English</span>
            <Image
              src={"/black-globe.png"}
              
              width={24}
              height={24}
              alt="Globe"
            />
          </div> */}
          <div
            className="hover:cursor-pointer hover:opacity-50 active:opacity-50"
            onClick={() => {
              setIsHome(false);
              setDynamicStyles({ bg: "white", color: "black" });
              setHomeSection(<Reviews />);
            }}
          >
            Reviews
          </div>
          <div
            className="hover:cursor-pointer hover:opacity-50 active:opacity-50"
            onClick={() => {
              setIsHome(false);
              setDynamicStyles({ bg: "white", color: "black" });
              setHomeSection(<Pricing />);
            }}
          >
            Pricing
          </div>
          <div>
            <Image
              src={"/profile.png"}
              width={35}
              className="hover:cursor-pointer hover:opacity-50"
              height={35}
              alt="location"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
