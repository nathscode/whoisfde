import Image from "next/image";

export default function WhyUs() {
  return (
    <div className="px-2 xl:px-46 bg-white text-[#3A3A3A]">
      <div className="text-[40px] font-bold pb-10">Why choose us?</div>
      <div className="pb-10">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut ultricies tincidunt nulla vel
        cursus. Fusce egestas quis est non feugiat. Maecenas faucibus nunc in enim fringilla semper
      </div>
      <div className="flex flex-col gap-10 text-2xl md:text-3xl  md:font-semibold">  
      <div className="flex gap-2">
          <Image src="/guarantee.svg" height={27.5} width={27.5} alt="guaranteed" />
          <div>Diversity of freights</div>
        </div>      
        <div className="flex gap-2">
          <Image src="/guarantee.svg" height={27.5} width={27.5} alt="guaranteed" />
          <div>Easy service delivery</div>
        </div>
        <div className="flex gap-2">
          <Image src="/guarantee.svg" height={27.5} width={27.5} alt="guaranteed" />
          <div>Secure transaction</div>
        </div>     
        <div className="flex gap-2">
          <Image src="/guarantee.svg" height={27.5} width={27.5} alt="guaranteed" />
          <div>Variety of delivery</div>
        </div>
        <div className="flex gap-2">
          <Image src="/guarantee.svg" height={27.5} width={27.5} alt="guaranteed" />
          <div>Affordability of service</div>
        </div>
        <div className="flex gap-2">
          <Image src="/guarantee.svg" height={27.5} width={27.5} alt="guaranteed" />
          <div>Years of experience</div>
        </div>
      </div>
    </div>
  );
}
