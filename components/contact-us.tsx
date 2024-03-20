import Image from "next/image";

export default function ContactUs() {
  return (
    <div className="w-full bg-black text-white flex justify-center px-2 lg:px-[25px] min-[1300px]:px-[100px] min-[1500px]:px-[250px]">
      <div className="bg-[url('/bg-camera.png')] bg-no-repeat w-full py-20 flex md:justify-end items-center">     
        <div>
          <div className="text-bold text-2xl">CONTACT US</div>
          <div className="pt-4 pb-8 text-semibold text-lg">
            sign up to our mailing list to get up to date messages
          </div>
          <div className="flex flex-col md:flex-row gap-8 md:gap-16">
            <div className="flex flex-col gap-8 justify-center items-start text-white">
              <div className="w-full">
                <input
                  className="outline-none bg-transparent w-full border-b border-b-gray-500"
                  placeholder="Enter your name"
                />
              </div>
              <div className="w-full">
                <input
                  className="outline-none bg-transparent w-full border-b border-b-gray-500"
                  placeholder="Enter your message"
                />
              </div>
              <button className="text-yellow-500 active:bg-yellow-200 lg:hover:bg-yellow-200 active:text-black border rounded-lg w-full py-2 text-lg border-gray-500">
                Send
              </button>
              <div>I agree to the terms of service</div>
            </div>
            <div className="flex flex-col gap-10 justify-center items-start">
              <div className="flex items-center gap-2">
                <Image
                  src={"/location.png"}
                  className="bg-blend-difference"
                  width={20}
                  height={20}
                  alt="location"
                />
                <span>West Brom, UK</span>
              </div>
              <div className="flex items-center gap-2">
                <Image
                  src={"/phone1.png"}
                  className="bg-blend-difference"
                  width={20}
                  height={20}
                  alt="phone"
                />
                <span>+234 812340593</span>
              </div>
              <div className="flex gap-4 items-center">
                <Image
                  src={"/instagram.png"}
                  className="bg-blend-difference"
                  width={20}
                  height={20}
                  alt="phone"
                />
                <Image
                  src={"/x.png"}
                  className="bg-blend-difference"
                  width={15}
                  height={15}
                  alt="phone"
                />
                <Image
                  src={"/youtube.png"}
                  className="bg-blend-difference"
                  width={20}
                  height={20}
                  alt="phone"
                />
              </div>
              <div>Lorem Ipsum set</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
