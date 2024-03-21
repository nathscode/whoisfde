import Image from "next/image";
import TabController from "../tab-controller";

export default function Works() {
  return (
    <div className="px-2 min-[1200px]:px-[100px] min-[1400px]:px-[296px]">
      <div>
        <div className="text-3xl font-[500]">SOME OF MY WORKS</div>
        <div className="my-7">
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
              <Image
                src={"/wedding_camera.png"}
                className="bg-blend-difference"
                width={10}
                height={10}
                alt="photography"
              />
            </div>
          </TabController>
        </div>
        <div className="flex justify-center sm:items-center gap-2 flex-row sm:gap-4">
          <div className="flex flex-col gap-2 sm:gap-4">
            <img src={"/davido.png"} className="bg-blend-difference" alt="artist" />
            <img src={"/under-davido.png"} className="bg-blend-difference" alt="artist" />
          </div>
          <div className="flex flex-col gap-2 sm:gap-5">
            <img src={"/rock-n-roll.png"} className="bg-blend-difference" alt="rock n roll" />
            <img src={"/under-rock.png"} className="bg-blend-difference" alt="worship" />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 items-center mt-4 md:mt-8">
        <button className="rounded-lg active:text-gray-300 active:opacity-75 bg-gradient-to-r active:bg-[#c06cf5] from-[#c06cf5] to-[#4159AD] text-white px-7 py-[6px] font-semibold">
          Price list
        </button>
        <button className="rounded-lg border active:text-white active:bg-[#f3e0ff] active:border-[#c06cf5] border-[#4159AD] text-[#4159AD] px-4 py-[6px] font-bold">
          See more
        </button>
      </div>
    </div>
  );
}
