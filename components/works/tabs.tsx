import Image from "next/image";

export default function Tabs() {
  return (
    <div>
      <div className="sm:hidden flex py-7 font-semibold text-[10.5px] min-[400px]:text-[11px] items-center">
        <div className="w-[17.5%] min-[400px]:w-[70px] justify-center items-center">
          <div className="text-left">CONCERTS</div>
          <div className="h-[2.5px] rounded-full w-full bg-gray-600"></div>
        </div>
        <div className="w-[16%] min-[400px]:w-[56px] justify-center items-center">
          <div className="text-center">PARTIES</div>
          <div className="h-[2.5px] w-full bg-gray-400"></div>
        </div>
        <div className="w-[15%] min-[400px]:w-[72px] justify-center items-center">
          <div className="text-center">WEDDINGS</div>
          <div className="h-[2.5px] w-full bg-gray-400"></div>
        </div>
        <div className="w-[21.5%] min-[400px]:w-[76px] justify-center items-center">
          <div className="text-center">CONTENTS</div>
          <div className="h-[2.5px] w-full bg-gray-400"></div>
        </div>
        <div className="w-[30%] min-[400px]:w-[110px] flex items-end">
          <div>
            <div className="flex gap-2">
              <span>PHOTOGRAPHY</span>
              <Image
                src={"/wedding_camera.png"}
                className="bg-blend-difference"
                width={10}
                height={10}
                alt="photography"
              />
            </div>
            <div className="h-[2.5px] w-full rounded-full bg-gray-400" />
          </div>
        </div>
      </div>
      <div className="max-sm:hidden flex py-9 font-medium items-center">
        <div className="w-24 justify-center items-center">
          <div className="">CONCERTS</div>
          <div className="h-[4.5px] rounded-full w-full bg-gray-500"></div>
        </div>
        <div className="w-[108px] justify-center items-center">
          <div className="text-center">PARTIES</div>
          <div className="h-[2.5px] w-full bg-gray-400"></div>
        </div>
        <div className="w-[100px] justify-center items-center">
          <div className="text-center">WEDDINGS</div>
          <div className="h-[2.5px] w-full bg-gray-400"></div>
        </div>
        <div className="w-32 justify-center items-center">
          <div className="text-center">CONTENTS</div>
          <div className="h-[2.5px] w-full bg-gray-400"></div>
        </div>
        <div className="w-[162px] justify-center items-center">
          <div className="flex gap-2">
            <span>PHOTOGRAPHY</span>
            <Image
              src={"/wedding_camera.png"}
              className="bg-blend-difference"
              width={20}
              height={20}
              alt="photography"
            />
          </div>
          <div className="h-[2.5px] w-full bg-gray-400"></div>
        </div>
      </div>
    </div>
  );
}