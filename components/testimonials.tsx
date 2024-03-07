import Image from "next/image";

export default function Testimonials() {
  return (
    <div className="bg-[#3A454B] text-white px-2 xl:px-46 pt-8 pb-16">
      <div className="text-[38px] sm:text-[40px] md:text-[46px] font-semibold py-10">Customer Reviews</div>
      <div className="rounded-md p-10 bg-white text-[#3A454B]">
        <div className="flex flex-col items-center">
          <Image
            className="rounded-full"
            src="/customer-1.jpg"
            height={85}
            width={85}
            alt="customer" />
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
