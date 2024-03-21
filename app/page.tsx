"use client";

import ContactUs from "@/components/contact-us";
import Landing from "@/components/landing";
import Nav from "@/components/nav/nav";
import {  useState } from "react";


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
