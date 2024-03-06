import RideIn from "@/components/gifs/ride-in";
import SafetyProtocol from "@/components/gifs/safety-protocol";
import SwiftDelivery from "@/components/gifs/swift-delivery";
import TrustedService from "@/components/gifs/trusted-service";
import VacinatedCourier from "@/components/gifs/vacinated-courier";
import Image from "next/image";

export default function Home() {
  return (
    <div className="">
      <First />
      <Second />
      <Third />
      <Fourth />
      <Fifth />
      <Sixth />
      <Seventh />
      <Eighth />
      <Ninth />
      <Tenth />
    </div>
  );
}

export function Tenth() {
  return (
    <div className="bg-white text-[#3A454B] px-4 xl:px-56 pt-16 md:pt-24 pb-10">
      <div className="flex flex-col max-lg:gap-8 text-center text-lg lg:flex-row justify-between mb-16">
        <div>
          <div className="text-bold text-2xl mb-2">Company</div>
          <div>About</div>
          <div>Product</div>
          <div>Blog</div>
        </div>
        <div>
          <div className="text-bold text-2xl mb-2">Join Us</div>
          <div>Driver partner</div>
          <div>Merchant</div>
        </div>
        <div>
          <div className="text-bold text-2xl mb-2">Career</div>
          <div>Internship</div>
          <div>Professional</div>
        </div>
        <div>
          <div className="text-bold text-2xl mb-2">Further information</div>
          <div>Terms & condition</div>
          <div>Privacy policy</div>
        </div>
      </div>
      <div className="text-center font-extralight">Copyright © 2024 Freights inc.</div>
    </div>
  );
}

export function Ninth() {
  return (
    <div className="bg-[#3A454B] text-white px-4 xl:px-56 pt-8 pb-16">
      <div className="text-[46px] font-semibold py-10">Customer testimonials</div>
      <div className="rounded-xl p-10 bg-white text-[#3A454B]">
        <div className="flex flex-col items-center">
          <Image
            className="rounded-full"
            src="/customer-1.jpg"
            height={75}
            width={75}
            alt="customer"
          />
          <div className="font-bold text-[24px] pt-4">James may</div>
          <div className="text-[16px] pb-2 font-light">Sales consultant</div>
          <div className="flex gap-3 pb-4">
            <Image src="/star.svg" height={17.5} width={17.5} alt="star" />
            <Image src="/star.svg" height={17.5} width={17.5} alt="star" />
            <Image src="/star.svg" height={17.5} width={17.5} alt="star" />
            <Image src="/star.svg" height={17.5} width={17.5} alt="star" />
            <Image src="/star.svg" height={17.5} width={17.5} alt="star" />
          </div>
        </div>
        <div>
          Sed sollicitudin magna sit amet lacinia consectetur. Vivamus rhoncus accumsan facilisis.
          Praesent mi mi, placerat eu metus ac, porttitor laoreet sem. Praesent sed sem sed augue
          semper iaculis eu in eros. Morbi sed.
        </div>
      </div>
    </div>
  );
}

export function Eighth() {
  return (
    <div className="px-4 xl:px-56  bg-white text-[#3A454B] flex flex-col lg:flex-row items-center justify-between py-10">
      <div>
        <div className="text-[40px] font-semibold">Stay At Home We Will Deliver Your Order</div>
        <div className="py-8">
          Nullam et suscipit odio. Praesent bibendum felis arcu. Suspendisse potenti. Nam fermentum
          purus sit amet fringilla ornare. Suspendisse efficitur sagittis est quis facilisis. Donec
          a ligula quis diam ultrices mattis.
        </div>
        <div className="w-fit max-lg:mb-20">
          <button className="rounded-lg px-9 py-3 bg-[#F39F39] text-white">Order now</button>
        </div>
      </div>
      <img src="/deliver.svg" alt="Delivery  man" />
    </div>
  );
}

export function Seventh() {
  return (
    <div>
      <div className="px-4 xl:px-56 text-white bg-[#3A454B] text-center py-28">
        <div className="text-[46px] font-bold pb-6">How Delivery Works</div>
        <div className="text-lg xl:px-[400px]">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec
          ullamcorper mattis, pulvinar dapibus leo.
        </div>
      </div>
      <div className="px-4 xl:px-56 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-7 lg:gap-5 object-center bg-white p-10 text-[#3A3A3A]">
        <div className="">
          {/* <Image src="/vespa.png" height={50} width={50} alt="" /> */}
          <div className="font-semibold text-3xl py-6">1. Place your order</div>
          <div className="text-lg">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</div>
        </div>
        <div className="">
          {/* <Image src="/vespa.png" height={50} width={50} alt="" /> */}
          <div className="font-semibold text-3xl py-6">2. Pay for order</div>
          <div className="text-lg">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</div>
        </div>
        <div className="">
          {/* <Image src="/vespa.png" height={50} width={50} alt="" /> */}
          <div className="font-semibold text-3xl py-6">3. Order delivered</div>
          <div className="text-lg">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</div>
        </div>
        <div className="">
          {/* <Image src="/vespa.png" height={50} width={50} alt="" /> */}
          <div className="font-semibold text-3xl py-6">4. Receive your order</div>
          <div className="text-lg">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</div>
        </div>
      </div>
    </div>
  );
}

export function Sixth() {
  return (
    <div className="flex flex-col justify-around items-center px-4 xl:px-56 lg:flex-row bg-white text-[#3A3A3A]">
      <div className="flex-1">
        <div className="text-[40px] font-bold pb-10">Order From Our Apps And Get Special Offer</div>
        <div className="pb-10">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut ultricies tincidunt nulla vel
          cursus. Fusce egestas quis est non feugiat. Maecenas faucibus nunc in enim fringilla
          semper
        </div>
        <div className="flex flex-col gap-8 text-3xl font-semibold mb-16">
          <div className="flex gap-3">
            <Image src="/guarantee.svg" height={40} width={40} alt="guaranteed" />
            <div>Cashback Bonus</div>
          </div>
          <div className="flex gap-3">
            <Image src="/guarantee.svg" height={40} width={40} alt="guaranteed" />
            <div>Secure payment</div>
          </div>
          <div className="flex gap-3">
            <Image src="/guarantee.svg" height={40} width={40} alt="guaranteed" />
            <div>Free shipping</div>
          </div>
        </div>
        <div className="flex gap-5 flex-row items-start md:pb-10">
          <Image src="/google-play.png" height={100} width={150} alt="google play" />
          <Image src="/ios-store.png" height={100} width={150} alt="ios store" />
        </div>
      </div>
      <div className="flex-1 px-5 py-10">
        <img src="/our-app.png" alt="our app" />
      </div>
    </div>
  );
}

export function Fifth() {
  return (
    <div className="pb-10 px-4 xl:px-56 bg-white text-[#3A3A3A]">
      <div className="flex flex-col items-center justify-center pb-28 gap-3">
        <div className="text-[46px] font-bold">You should join the crew now</div>
      </div>
      <div className="flex flex-col md:flex-row justify-around gap-5 lg:gap-20 items-center">
        <CrewCard
          image="/bike.png"
          title="Swift Biker"
          body="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper."
        />
        <CrewCard
          image="/vespa.png"
          title="Motorcycle Rider"
          body="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper."
        />
        <CrewCard
          image="/truck.png"
          title="Pickup Driver"
          body="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper."
        />
      </div>
    </div>
  );
}

export function CrewCard({ image, title, body }: { image: string; title: string; body: string }) {
  return (
    <div className="bg-[#253138] max-md:mb-16 text-white rounded-xl h-[325px] sm:h-[395px] w-full flex flex-col px-6 py-4 relative">
      <div className="absolute left-[10%] top-[-50px] p-2 bg-[#E1ECB8] rounded-xl">
        <Image src={image} height={95} width={95} alt={image} />
      </div>
      <div className="mt-20">
        <div className="text-[22px] lg:text-[30px] font-medium">{title}</div>
        <div className="pt-3 pb-4">{body}</div>
        <div className="w-fit">
          <button className="rounded-lg px-7 py-3 bg-[#F39F39] text-white">Join us</button>
        </div>
      </div>
    </div>
  );
}

export function Fourth() {
  return (
    <div className="pt-20 pb-18 lg:pb-28 bg-white text-[#3A3A3A] px-4 xl:px-56">
      <div className="flex flex-col items-center justify-center pb-36 gap-3">
        <div className="text-[46px] font-bold">We Deliver Everything</div>
        <div className="text-lg">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec
          ullamcorper.
        </div>
      </div>
      <div className="flex flex-col md:flex-row justify-around gap-4 lg:gap-20 items-center">
        <DeliveryCard
          image="/burger.png"
          title="Food And Drinks"
          body="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper."
        />
        <DeliveryCard
          image="/delivery-box.png"
          title="Packages"
          body="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper."
        />
        <DeliveryCard
          image="/groceries.png"
          title="Groceries"
          body="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper."
        />
      </div>
    </div>
  );
}

export function DeliveryCard({
  image,
  title,
  body,
}: {
  image: string;
  title: string;
  body: string;
}) {
  return (
    <div className="bg-[#F0EFE6] max-md:mb-24 rounded-xl h-[325px] sm:h-[395px] w-full flex flex-col p-4 relative">
      <Image
        className="absolute left-[29.5%] top-[-70px]"
        src={image}
        height={50}
        width={135}
        alt={image}
      />
      <div className="mt-20">
        <div className="text-[30px] font-medium text-center">{title}</div>
        <div className="pt-3 pb-4 px-4 text-center">{body}</div>
        <div className="flex justify-center">
          <div className="w-fit">
            <button className="rounded-lg px-7 py-3 bg-[#F39F39] text-white">Order now</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Third() {
  return (
    <div className="relative overflow-x-hidden h-fit">
      <div className="bg-[#3A454B] text-white flex flex-col justify-center items-center py-16 px-4 xl:px-56 text-center gap-10">
        <div className="text-[38px] font-bold">Try Us And See How Good Our Services Are.</div>
        <div className="w-fit">
          <button className="rounded-lg px-9 py-3 bg-[#F39F39] text-white">Call us</button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 max-sm:gap-10 px-4 xl:px-56 bg-white py-10 items-center justify-between md:justify-around">
        <div className="flex flex-col gap-2 text-black items-center justify-center">
          <SwiftDelivery />
          <div className="text-xl font-semibold text-[#3A454B]">Swift delivery</div>
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
          <TrustedService />
          <div className="text-xl font-semibold text-[#3A454B]">Trusted service</div>
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
  );
}

function First() {
  return (
    <div className="px-4 xl:px-56 pb-20 lg:pb-40 pt-2 bg-[#3A454B] text-white">
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
      <div className="overflow-x-hidden overflow-y-hidden w-full flex justify-center h-[350px]">
        <RideIn />
      </div>
      <div className="flex flex-col gap-10">
        <div className="text-[44px] font-bold opacity-75">
          Do You Want A Fast Service?{" "}
          <span className="text-green-500">We are always available!</span>
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
