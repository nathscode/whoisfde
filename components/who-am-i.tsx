import Image from "next/image";

export default function WhoAmI() {
  return (
    <div className="bg-black text-white relative py-4 px-2 min-[1200px]:px-[100px] min-[1400px]:px-[296px]">
      <div className="mb-5 text-4xl font-semibold pl-2 min-[1200px]:pl-[100px] min-[1400px]:pl-[296px]">WHO AM I?</div>
      <div className="py-10">
        <div className="flex-1 flex flex-col md:flex-row gap-10 justify-center items-center">
          <div className="relative">
            <Image
              src={"/fde-small.png"}
              className="absolute right-16 top-1"
              width={30}
              height={15}
              alt="fde"
            />
            <Image
              src={"/fde-small.png"}
              className="rotate-90 absolute right-0 top-16"
              width={30}
              height={10}
              alt="fde"
            />
            <div className="w-32 h-32 border-l border-t absolute top-[-10] left-[-10]" />
            <div className="w-32 h-32 border-b border-r absolute bottom-[0] right-[0]" />

            <div className="p-4">
            <img src={"/who-image.png"} className="object-fill" alt="who image" />
            </div>
          </div>
          <div className="flex-1 flex flex-col gap-4">
            <div className="text-2xl font-bold">HELLO, MY NAME IS FAVOUR IMIDE</div>
            <div className="leading-loose">
              Lorem ipsum dolor sit amet consectetur. Tincidunt morbi pretium mattis semper odio sit
              duis. Habitant nisi amet pellentesque diam nibh risus nibh viverra. Ullamcorper sociis
              pharetra sagittis pretium quis pretium et ipsum mauris. Quam nunc arcu non integer.
              Felis amet facilisi nibh elit lectus in in leo. Sollicitudin purus tortor amet
              vestibulum adipiscing fusce diam. Malesuada vulputate cursus
            </div>
            <div className="w-4/5 sm:w-3/5 bg-gray-300 h-[1px]" />
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center h-full">
        <div className="h-fit">
          <Image src={"/fde-small.png"} width={35} height={20} alt="fde" />
        </div>
        <Image src={"/fde.png"} width={150} height={100} alt="fde" />
      </div>
    </div>
  );
}
