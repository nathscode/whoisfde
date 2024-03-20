"use client";

import ContactUs from "@/components/contact-us";
import Landing from "@/components/landing";
import Nav from "@/components/nav/nav";
import ClientsAndOgComments from "@/components/og-comments";
import Reviews from "@/components/reviews/reviews";
import WhoAmI from "@/components/who-am-i";
import Works from "@/components/works/works";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [homeSection, setHomeSection] = useState(<Landing />);

  return (
    <div className="flex flex-col justify-between">
      <Nav setHomeSection={setHomeSection} />
      {homeSection}
      <div className="pt-10">
        <ContactUs />
      </div>
    </div>
  );
}
