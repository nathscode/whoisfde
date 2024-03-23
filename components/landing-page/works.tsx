import Image from "next/image";
import TabController from "../util/tab-controller";
import { useEffect, useRef } from "react";
import FadeOnScroll from "../util/fade-controller";

export default function Works() {
  return (
    <FadeOnScroll
      child={
        <div className="px-2 lg:px-[150px] xl:px-[250px]">
          <div>
            <div className="text-[33px] sm:text-4xl font-semibold">SOME OF MY WORKS</div>
            <div className="my-8 text-[10.5px] sm:text-[14px] md:text-[18px]">
              <TabController
                elementsStyle="flex justify-between items-center mb-1"
                activeElementColor="#4159AD"
                indicatorColor="#4159AD"
                railColor="#eeeeee"
              >
                <div>CONCERTS</div>
                <div>PARTIES</div>
                <div>WEDDINGS</div>
                <div>CONTENTS</div>
                <div className="flex gap-2 items-center">
                  <span>PHOTOGRAPHY</span>
                  <Image src={"/wedding_camera.png"} width={10} height={10} alt="photography" />
                </div>
              </TabController>
            </div>
            <div className="flex justify-center sm:items-center gap-1 flex-row sm:gap-2">
              <div className="flex flex-col gap-1 sm:gap-2">
                <img src={"/davido.png"} className="aspect-[5/3.4125]" alt="artist" />
                <img src={"/under-davido.png"} className="aspect-[3/2.75]" alt="artist" />
              </div>
              <div className="flex flex-col gap-1 sm:gap-2">
                <img src={"/rock-n-roll.png"} className="aspect-[5/4.5]" alt="rock n roll" />
                <img src={"/under-rock.png"} className="aspect-[5/3.5]" alt="worship" />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 items-center mt-4 md:mt-6">
            <button
              className="
              rounded-lg 
              active:text-gray-300 
              active:opacity-75 
              bg-gradient-to-r 
              active:bg-[#c06cf5] 
              from-[#c06cf5] 
              to-[#4159AD] 
              text-white 
              px-7 py-[6px] 
              font-semibold"
            >
              Price list
            </button>
            <button
              className="
              rounded-lg 
              border 
              active:text-white 
              active:bg-[#f3e0ff] 
              active:border-[#c06cf5] 
              border-[#4159AD] 
              text-[#4159AD] 
              px-4 py-[6px] 
              font-bold"
            >
              See more
            </button>
          </div>
        </div>
      }
    />
  );
}
