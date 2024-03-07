import Image from "next/image";

export default function OurServices() {
  return (
    <div className="px-2 xl:px-46 pb-14 md:pb-28 bg-white text-[#3A454B]">

<div className="py-14 md:py-28 gap-10 lg:gap-20 items-center bg-white text-black">
      <div className="flex flex-col gap-5 md:gap-10">
        <div className="text-[40px] md:text-[46px] font-semibold opacity-75">
          <div>Want A Fast and Reliable freight provider?</div>
          <div className="text-orange-600 mt-5 text-[44px] sm:text-[54px] font-bold">Look no further!</div>
        </div>
        <div>
          Aenean quis sagittis sem. Sed volutpat quam a imperdiet volutpat. Quisque maximus nibh
          elit, nec molestie erat tincidunt sit amet. Duis nec ante molestie, volutpat mi ac,
          convallis quam. Fusce laoreet bibendum luctus.
        </div>
      </div>
    </div>

      <div className="flex flex-col mb-10">
        <div className="text-[40px] md:text-[46px] pb-4 font-semibold">OUR SERVICES</div>
        <div className="text-[18px] lg:px-32">
          Praesent bibendum felis arcu. Suspendisse potenti. Nam fermentum purus sit amet fringilla
          ornare. Nam fermentum purus sit amet fringilla ornare
        </div>
      </div>
      <div className="flex max-md:flex-col gap-2">
        <OceanFreight
          title="OCEAN FREIGHT SHIPPING"
          body={`Nullam et suscipit odio. Lives the one felis is arcu. Suspendisse potenti. Nam is be a very fermentum
          purus sit amet as fringilla is as the custom`}
          image="/ocean-freight.jpg"
        />
        <OceanFreight
          title="DIRECT AIR LIFTING"
          body={`Nullam et suscipit odio. Lives the one felis is arcu. Suspendisse potenti. Nam is be a very fermentum
          purus sit amet as fringilla is as the custom`}
          image="/air-freight.jpg"
        />
        <OceanFreight
          title="LAND TRUCK HAULAGE"
          body={`Nullam et suscipit odio. Lives the one felis is arcu. Suspendisse potenti. Nam is be a very fermentum
          purus sit amet as fringilla is as the custom`}
          image="/truck-freight.jpg"
        />
      </div>{" "}
    </div>
  );
}

function OceanFreight({ title, image, body }: { title: string; body: string; image: string }) {
  return (
    <div className="flex flex-col sm:flex-row md:flex-col shadow-lg max-md:mb-5 rounded-md">
      <Image
        src={image}
        height={275}
        width={200}
        className="w-full h-[220px] sm:h-full md:h-[285px] object-fill rounded-t-md sm:rounded-tl-md md:rounded-t-md"
        alt={title}
      />
      <div className="px-5 my-4 sm:my-0 md:my-4">
        <div className="text-2xl">{title}</div>
        <div className="w-32 h-[3px] bg-slate-400 rounded-full"></div>
        <div className="py-4">{body}</div>
        <div className="text-orange-600 font-medium hover:cursor-pointer hover:font-semibold">
          KNOW MORE
        </div>
      </div>
    </div>
  );
}
