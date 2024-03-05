import SafetyProtocol from "@/components/gifs/safety-protocol";
import SwiftDelivery from "@/components/gifs/swift-delivery";
import TrustedService from "@/components/gifs/trusted-service";
import VacinatedCourier from "@/components/gifs/vacinated-courier";
import Padding from "@/components/padding";
import Image from "next/image";

export default function Home() {
  return (
    <div className="">
      <First />
      <Second />
      <div className="relative overflow-x-hidden h-fit">
        <div className="bg-[#3A454B] flex flex-col justify-center items-center py-16 px-4 xl:px-56 text-center gap-10">
          <div className="text-[38px] font-bold">Try Us And See How Good Our Services Are.</div>
          <div className="w-fit">
            <button className="rounded-lg px-9 py-3 bg-[#F39F39] text-white">Call us</button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 max-sm:gap-20 px-4 xl:px-56 bg-white py-10 justify-between md:justify-around">
          <div className="flex flex-col gap-2 text-black items-center justify-center">
            <SwiftDelivery />
            <div className="text-xl font-semibold text-[#3A454B]">Swift delivery</div>
            <div className="text-wrap text-center">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </div>
          </div>
          <div className="flex flex-col gap-2 text-black items-center justify-center">
            <TrustedService />
            <div className="text-xl font-semibold text-[#3A454B]">Trusted service</div>
            <div className="text-wrap text-center">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </div>
          </div>
          <div className="flex flex-col gap-2 text-black items-center justify-center">
            
            <SafetyProtocol />
            
            <div className="text-xl font-semibold text-[#3A454B]">Safety protocol</div>
            <div className="text-wrap text-center">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </div>
          </div>
          <div className="flex flex-col gap-2 text-black items-center justify-center">
            <VacinatedCourier />
            <div className="text-xl font-semibold text-[#3A454B]">Vaccinated courier</div>
            <div className="text-wrap text-center">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function First() {
  return (
    <div className="px-4 xl:px-56 pb-20 lg:pb-40 pt-2 bg-[#3A454B] dark:text-white">
      <div className="flex justify-between items-center">
        <Image src="/logo.png" height={50} width={135} alt="Exchange" />
        <Image src="/burger.svg" height={30} width={30} alt="menu" />
      </div>
      <div className="flex flex-col lg:flex-row gap-3 lg:gap-16 mt-14 lg:mt-28">
        <div>
          <div className="text-5xl md:text-7xl lg:text-[68px]">Reliable Service Every Time</div>
          <div className="pb-10 font-light text-[18px] pt-5 pr-10">
            Nullam ac aliquam purus. Donec tempor, metus sed porttitor posuere, elit sapien rutrum
            lit, eget tincidunt nisl tortor nec metus. Donec tempor rhoncus convallis.
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              className="
      rounded-lg 
      border-none
      flex-1
      py-3
      pl-5
      bg-white
      placeholder:font-light 
      placeholder:opacity-60
      placeholder:text-sm
      placeholder:md:text-lg
      outline-none
      text-lg
      font-light
      placeholder:tracking-wide
      placeholder:text-[#5D5D5D]
      text-black
      "
              placeholder="Have a tracking number? Enter!"
            />
            <button className="rounded-lg px-9 py-3 bg-[#F39F39] text-white">Search</button>
          </div>
        </div>
        <Image src="/bag-exchange.svg" className="pt-16" height={550} width={550} alt="Exchange" />
      </div>
    </div>
  );
}

function Second() {
  return (
    <div className="flex flex-col lg:flex-row px-4 xl:px-56 py-14 lg:py-28 gap-10 lg:gap-20 items-center bg-white text-black">
      <Image src="/bag-exchange.svg" height={550} width={550} alt="We deliver" />
      <div className="flex flex-col gap-10">
        <div className="text-[44px] font-bold opacity-75">
          Do You Want A Fast Service? Just Call Us.
        </div>
        <div className="pr-16">
          Aenean quis sagittis sem. Sed volutpat quam a imperdiet volutpat. Quisque maximus nibh
          elit, nec molestie erat tincidunt sit amet. Duis nec ante molestie, volutpat mi ac,
          convallis quam. Fusce laoreet bibendum luctus. Maecenas malesuada fermentum mi.
        </div>
        <div className="w-fit">
          <button className="rounded-lg px-9 py-3 bg-[#F39F39] text-white">Call us</button>
        </div>
      </div>
    </div>
  );
}
