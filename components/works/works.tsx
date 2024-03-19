import Image from "next/image";
import Tabs from "./tabs";

export default function Works() {
  return (
    <div className="px-2 min-[1200px]:px-[100px] min-[1400px]:px-[296px]">
      <div>
        <div>
          <Image
            src={"/my-works.png"}
            className="bg-blend-difference"
            width={160}
            height={70}
            alt="my works"
          />
        </div>
        <Tabs />
        <div className="flex justify-center sm:items-center gap-2 flex-row sm:gap-6 lg:gap-8">
          <div className="flex flex-col gap-2 sm:gap-6 lg:gap-8">
            <img src={"/davido.png"} className="bg-blend-difference" alt="artist" />
            <img src={"/under-davido.png"} className="bg-blend-difference" alt="artist" />
          </div>
          <div className="flex flex-col gap-2 sm:gap-7 lg:gap-9">
            <img src={"/rock-n-roll.png"} className="bg-blend-difference" alt="rock n roll" />
            <img src={"/under-rock.png"} className="bg-blend-difference" alt="worship" />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 items-center mt-4 md:mt-8">
        <button className="rounded-lg active:text-gray-300 active:opacity-75 bg-gradient-to-r active:bg-[#c06cf5] from-[#c06cf5] to-[#4159AD] text-white px-7 py-[6px] font-semibold">
          Price list
        </button>
        <button className="rounded-lg border active:text-[#c06cf5] active:border-[#c06cf5] active:opacity-75 border-[#4159AD] text-[#4159AD] px-4 py-[6px] font-bold">
          See more
        </button>
      </div>
    </div>
  );
}