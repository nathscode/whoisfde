import Image from "next/image";

export default function ClientsAndOgComments() {
  return (
    <div className="px-2 min-[1200px]:px-[100px] md:h-screen flex items-center justify-center min-[1400px]:px-[296px]">
      <div>
        <div>
          <div className="text-4xl font-semibold mb-6 md:mb-12">
            CLIENTS AND OG&apos;S COMMENTS
          </div>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <div className="md:flex-[2] flex flex-col sm:flex-row gap-4">
              <div className="flex-1 flex flex-col gap-2">
                <div className="font-semibold text-xl">Ajakaye Joshua</div>
                <div className="font-semibold text-[18px] text-blue-700 mb-3">
                  E.O.Y 23&apos; PARTY
                </div>
                <i>
                  <div className="leading-loose font-bold">
                    <span className="text-3xl font-extrabold">&quot;</span>
                    Lorem ipsum dolor sit amet consectetur. Tincidunt morbi pretium mattis semper
                    odio sit duis. Habitant nisi amet pellentesque diam nib
                    <span className="text-3xl font-extrabold">&quot;</span>
                  </div>
                </i>
              </div>
              <div className="flex-1 w-full flex justify-start">
                <Image
                  src={"/og-pic.png"}
                  className="rounded-md"
                  width={500}
                  height={750}
                  alt="og image"
                />
              </div>
            </div>

            <div className="md:flex-1 h-vh flex items-center">
              <i>
                <div className="leading-loose font-bold">
                  <span className="text-3xl font-extrabold">&quot;</span>
                  Lorem ipsum dolor sit amet consectetur. Tincidunt morbi pretium mattis semper odio
                  sit duis. Habitant nisi amet pellentesque diam nibh risus nibh viverra.
                  Ullamcorper sociis adipiscing fusce diam. Malesuada vulputate cursus
                  <span className="text-3xl font-extrabold">&quot;</span>
                </div>
              </i>
            </div>
          </div>
        </div>
        <div className="flex justify-between w-full mt-14">
          <div className="px-[14px] py-2 border active:bg-gray-200 active:border-none border-black rounded-md">
            <Image src={"/previous.png"} className="" width={15} height={15} alt="previous" />
          </div>
          <div className="px-[14px] py-2 border active:bg-gray-200 active:border-none border-black rounded-md">
            <Image src={"/next.png"} className="" width={15} height={15} alt="next" />
          </div>
        </div>
      </div>
    </div>
  );
}
