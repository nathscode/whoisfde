import ContactUs from "@/components/contact-us";
import ExpandedNav from "@/components/nav";
import ClientsAndOgComments from "@/components/og-comments";
import WhoAmI from "@/components/who-am-i";
import Works from "@/components/works/works";
import Image from "next/image";

export default function Home() {
  return (
    <div className="h-screen">
      {/* <ExpandedNav /> */}
      <div className="bg-[url('/bg.png')] bg-repeat-round h-[50%] sm:h-screen overflow-x-clip flex justify-end pr-3 lg-pr-20 items-center">
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
      <div>
        <div className="pt-10 md:pt-20">
          <Works />
        </div>
        <div className="pt-10 md:pt-20">
          <WhoAmI />
        </div>
        <div className="pt-10 md:pt-20">
          <ClientsAndOgComments />
        </div>
        <div className="pt-10 md:pt-20">
          <ContactUs />
        </div>
      </div>
    </div>
  );
}
