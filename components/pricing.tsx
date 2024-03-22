import { formatWithComma } from "@/lib/price-format";
import Image from "next/image";
import Padding from "./util/home-padding";

export default function Pricing() {
  return (
    <div>
      <Padding className="flex flex-col items-center gap-4 mb-10 mt-20">
        <div className="text-[28px] sm:text-3xl font-[500]">SERVICE BOOKING FORM</div>
        <div className="text-lg font-light text-left md:text-center">
          Fill the form below in other for me to get a complete idea and scenario of what we will be
          working on.
        </div>
      </Padding>
      <div className="flex flex-col sm:flex-row gap-2 lg:gap-8 justify-center px-2">
        <Plan
          name="Regular plan"
          cost={300000}
          planColor="#000000"
          planFeatures={[
            "One of the nice things about plan",
            "One of the nice things about plan",
            "One of the nice things about plan",
            "One of the nice things about plan",
            "One of the nice things about plan",
            "One of the nice things about plan",
          ]}
        />
        <Plan
          name="Gold plan"
          cost={400000}
          planColor="#EE9610"
          planFeatures={[
            "One of the nice things about plan",
            "One of the nice things about plan",
            "One of the nice things about plan",
            "One of the nice things about plan",
            "One of the nice things about plan",
            "One of the nice things about plan",
          ]}
        />
        <Plan
          name="Diamond plan"
          cost={500000}
          planColor="#BD06FD"
          planFeatures={[
            "One of the nice things about plan",
            "One of the nice things about plan",
            "One of the nice things about plan",
            "One of the nice things about plan",
            "One of the nice things about plan",
            "One of the nice things about plan",
          ]}
        />
      </div>
    </div>
  );
}

function Plan({
  name,
  cost,
  planColor,
  planFeatures,
}: {
  name: string;
  cost: number;
  planColor: string;
  planFeatures: string[];
}) {
  return (
    <div
      style={{ borderColor: planColor }}
      className="border-[0.65px] shadow-md rounded-md px-3 py-4"
    >
      <div className="mb-6">
        <div style={{ color: planColor }} className="text-3xl font-light sm:font-normal">
          {name}
        </div>
        <div className="mt-2 text-2xl font-light">
          <span className="font-[350]">{`\u20A6`}</span>
          {formatWithComma(cost)}
        </div>
      </div>
      <div className="flex flex-col gap-4 text-lg font-light">
        {planFeatures.map((feature, index) => (
          <div key={index} className="flex items-center gap-2">
            <Image src={"/star.svg"} width={22} height={22} alt={`${name} feature`} />
            <div>{feature}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
