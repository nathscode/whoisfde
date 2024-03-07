import WeDeliverEverything from "@/components/deliver-everything";
import Footer from "@/components/footer";
import OurServices from "@/components/our-services";
import QuickForm from "@/components/quick-form";
import Testimonials from "@/components/testimonials";
import OurProcess from "@/components/the_process";
import WhyUs from "@/components/why-us";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <First />
      <OurServices />
      <WhyUs />
      <WeDeliverEverything />
      <OurProcess />
      <StayHome />
      <Testimonials />
      <QuickForm />
      <Footer />
    </>
  );
}

function StayHome() {
  return (
    <div className="px-2 xl:px-46  bg-white text-[#3A454B] flex flex-col md:flex-row gap-4 pt-10 sm:pt-16 pb-16">
      <div className="flex-1">
        <div className="text-[40px] font-semibold">Stay Home, We Will Notify You</div>
        <div className="py-6">
          Nullam et suscipit odio. Praesent bibendum felis arcu. Suspendisse potenti. Nam fermentum
          purus sit amet fringilla ornare. Suspendisse efficitur sagittis est quis facilisis. Donec
          a ligula quis diam ultrices mattis.
        </div>
      </div>
      <div className="flex-1 max-md:mt-5">
      <img src="/containers.jpg" className="rounded-md w-full" alt="Containers" />
      </div>
    </div>
  );
}

function First() {
  return (
    <div className="px-2 xl:px-46 pb-20 lg:pb-40 pt-2 bg-[#3A454B] text-white">
      <div className="flex justify-between items-center">
        <Image src="/logo.png" height={50} width={135} alt="Exchange" />
        <Image src="/burger.svg" height={30} width={30} alt="menu" />
      </div>
      <div className="flex flex-col lg:flex-row gap-3 lg:gap-16 mt-14 lg:mt-28">
        <div>
          <div className="text-[40px] md:text-7xl lg:text-[68px]">
            Professional solutions to global scale shipping
          </div>
          <div className="pb-10 font-light text-[18px] pt-5 pr-10">
            Nullam ac aliquam purus. Donec tempor, metus sed porttitor posuere, elit sapien rutrum
            lit, eget tincidunt nisl tortor nec metus. Donec tempor rhoncus convallis.
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              className="
      rounded-md 
      border-none
      flex-1
      py-3
      pl-5
      bg-white
      placeholder:font-light 
      placeholder:opacity-60
      placeholder:text-sm
      placeholder:md:text-xl
      outline-none
      text-xl
      font-light
      placeholder:tracking-wide
      placeholder:text-[#5D5D5D]
      text-black
      "
              placeholder="Have a tracking number? Enter!"
            />
            <button className="rounded-md px-9 py-3 bg-[#F39F39] text-white">Track freight</button>
          </div>
        </div>
        <Image src="/bag-exchange.svg" className="pt-16" height={550} width={550} alt="Exchange" />
      </div>
    </div>
  );
}
