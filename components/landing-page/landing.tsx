import Image from "next/image";
import Works from "./works";
import WhoAmI from "./who-am-i";
import ClientsAndOgComments from "./og-comments";
import FadeOnScroll from "../util/fade-controller";

export default function Landing() {
  return (
    <div className="">
      <FadeOnScroll
        child={
          <div className="h-[50vh] sm:h-screen">
            <div
              className="
          bg-[url('/bg.png')] 
          bg-repeat-round 
          h-full 
          overflow-x-clip 
          flex 
          justify-end 
          pr-3 
          lg-pr-20 
          items-center"
            >
              <div className="flex flex-col gap-4 items-center mt-10">
                <Image
                  src={"/instagram.png"}
                  className="bg-blend-difference"
                  width={15}
                  height={15}
                  alt="phone"
                />
                <Image
                  src={"/x.png"}
                  className="bg-blend-difference"
                  width={10}
                  height={10}
                  alt="phone"
                />
                <Image
                  src={"/youtube.png"}
                  className="bg-blend-difference"
                  width={15}
                  height={15}
                  alt="phone"
                />
              </div>
            </div>
          </div>
        }
      />
      <div className="pt-10 md:pt-20">
        <Works />
      </div>
      <div className="pt-10 md:pt-20">
        <WhoAmI />
      </div>
      <div className="pt-10 md:pt-20">
        <ClientsAndOgComments />
      </div>
    </div>
  );
}
