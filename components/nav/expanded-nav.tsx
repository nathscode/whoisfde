import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import Landing from "../landing-page/landing";
import Pricing from "../pricing";
import Reviews from "../reviews/reviews";

export default function ExpandedNav({
  setHomeSection,
}: {
  setHomeSection: Dispatch<SetStateAction<JSX.Element>>;
}) {
  const isHome = useRef(true);
  const [dynamicStyles, setDynamicStyles] = useState("bg-transparent text-white");

  const scrollHandler = () => {
    if (!isHome.current) {
      return;
    }
    if (window.scrollY >= window.screen.height - 175) {
      setDynamicStyles("bg-white text-black shadow-lg");
    } else {
      if (window.scrollY <= window.screen.height - 175) {
        setDynamicStyles("bg-transparent text-white");
      }
    }
  };

  useEffect(() => {
    scrollHandler();
    window.addEventListener("scroll", scrollHandler);

    return () => {
      window.removeEventListener("scroll", scrollHandler);
    };
  }, []);

  return (
    <div
      className={`fixed flex left-0 right-0 z-10 h-[61px] text-semibold text-lg ${dynamicStyles}`}
    >
      <div
        className="px-2
    lg:px-[150px] 
    xl:px-[250px] flex justify-between items-center text-lg w-full"
      >
        <div className="flex gap-20 justify-around items-center ">
          <div
            className="text-[24px] hover:cursor-pointer hover:opacity-50 active:opacity-50"
            onClick={() => {
              isHome.current = true;
              scrollHandler();
              setHomeSection(<Landing />);
            }}
          >
            Journal
          </div>
        </div>
        <div className="flex gap-20 justify-around items-center">
          <div
            className="hover:cursor-pointer hover:opacity-50 active:opacity-50"
            onClick={() => {
              isHome.current = false;
              setDynamicStyles("bg-white text-black shadow-lg");
              setHomeSection(<Reviews />);
            }}
          >
            Reviews
          </div>
          <div
            className="hover:cursor-pointer hover:opacity-50 active:opacity-50"
            onClick={() => {
              isHome.current = false;
              setDynamicStyles("bg-white text-black shadow-lg");
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
