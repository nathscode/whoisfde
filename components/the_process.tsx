import Image from "next/image";

export default function OurProcess() {
  return (
    <div className="px-2 xl:px-46 bg-white text-[#3A3A3A]">
      <div className="flex flex-col justify-center pb-14 md:pb-24 gap-1">
        <div className="text-[40px] md:text-[46px] font-bold">Easy service delivery process</div>
        <div className="text-lg">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec
          ullamcorper adipiscing elit. Ut elit tellus.
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-around gap-1 lg:gap-8 items-center">
        <CrewCard
          step="1"
          title="Place your order"
          body="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper."
        />
        <CrewCard
          step="2"
          title="Receive admin quote"
          body="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper."
        />
        <CrewCard
          step="3"
          title="Pay service charge"
          body="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper."
        />
        <CrewCard
          step="4"
          title="Track your order"
          body="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper."
        />
        <CrewCard
          step="5"
          title="Pickup your freight"
          body="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper."
        />
        <CrewCard
          step="6"
          title="Give product feedback"
          body="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper."
        />
      </div>
    </div>
  );
}

function CrewCard({ step, title, body }: { step: string; title: string; body: string }) {
  return (
    <div className="bg-slate-600 max-md:mb-9 text-white rounded-md h-[200px] w-full flex flex-col px-6 py-4 relative">
      <div className="absolute left-[10%] w-[65px] h-[65px] top-[-32.5px] flex justify-center items-center p-2 bg-[#F0EFE6] rounded-full">
        <div className="text-[50px] font-medium md:font-semibold text-[#253138]">{step}</div>
      </div>
      <div className="mt-12">
        <div className="text-2xl lg:text-[30px] md:font-medium">{title}</div>
        <div className="text-sm pt-3">{body}</div>        
      </div>
    </div>
  );
}
