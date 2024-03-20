"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import ClientReview from "./ordinary-review";
import { ordinaryReviews } from "./data";
import OrdinaryReview from "./ordinary-reviews";
import OrdinaryReviews from "./ordinary-reviews";
import OgReviews from "./og-reviews";
import AddReview from "./add-review";

export default function Reviews() {
  let activeRef = useRef(null);
  const secondRef = useRef(null);
  const thirdRef = useRef(null);
  const [lp, setLp] = useState(0);
  const [colorAt, setColorAt] = useState(0);
  const [activeComponent, setActiveComponent] = useState(<OrdinaryReviews />);

  const [indicatorWidth, setWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setWidth((activeRef.current! as Element).getBoundingClientRect().width);
      setLp((activeRef.current! as Element).getBoundingClientRect().left);
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="bg-white text-black mt-10">
      <div className="flex flex-col items-center gap-4">
        <div className="px-2 md:px-[50px] lg:px-[200px] xl:px-[400px] flex flex-col items-center gap-4">
          <Image src="/reviews_and_ogs.png" width={350} height={60} alt="reviews and ogs" />
          <div className="text-lg font-light text-left md:text-center">
            Read reviews of clients I have worked with, pictures and recordings from behind the scene
            with my OGs
          </div>
        </div>
        <div className="flex justify-center items-center gap-10 mt-5 mb-0 text-sm">
          <div
            ref={activeRef}
            onClick={() => {
              setWidth((activeRef.current! as Element).getBoundingClientRect().width);
              setLp((activeRef.current! as Element).getBoundingClientRect().left);
              setColorAt(0);
              setActiveComponent(<OrdinaryReviews />);
            }}
            style={{ color: colorAt === 0 ? "#4159AD" : "black" }}
            className="hover:cursor-pointer"
          >
            Client Reviews
          </div>
          <div
            ref={secondRef}
            onClick={() => {
              activeRef = secondRef;
              setWidth((activeRef.current! as Element).getBoundingClientRect().width);
              setLp((activeRef.current! as Element).getBoundingClientRect().left);
              setColorAt(1);
              setActiveComponent(<OgReviews />);
            }}
            style={{ color: colorAt === 1 ? "#4159AD" : "black" }}
            className="hover:cursor-pointer"
          >
            <div className="max-md:hidden">OGs Behind The Scene</div>
            <div className="md:hidden">OGs Reviews</div>
          </div>
          <div
            ref={thirdRef}
            onClick={() => {
              activeRef = thirdRef;
              setWidth((activeRef.current! as Element).getBoundingClientRect().width);
              setLp((activeRef.current! as Element).getBoundingClientRect().left);
              setColorAt(2);
              setActiveComponent(<AddReview />);
            }}
            style={{ color: colorAt === 2 ? "#4159AD" : "black" }}
            className="flex gap-2 items-center hover:cursor-pointer"
          >
            <div>
              {colorAt !== 2 ? (
                <Image src={"/add_black.svg"} width={14} height={14} alt="add" />
              ) : (
                <Image src={"/add_blue.svg"} width={14} height={14} alt="add" />
              )}
            </div>
            <div>Add</div>
          </div>
        </div>
        <div className="h-[2.5px] mt-[-10px] bg-gray-200 w-full relative flex items-center">
          <div
            style={{ left: lp, width: indicatorWidth }}
            className={`absolute bg-[#4159AD] h-[2.5px] rounded-full hover:cursor-pointer`}
          />
        </div>
        {activeComponent}
      </div>
      <div className="px-[2px] md:px-32 mt-24">
        <div className="h-[1px] w-full bg-black rounded-full" />
      </div>
    </div>
  );
}
