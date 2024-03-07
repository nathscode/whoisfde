import Image from "next/image";

export default function WeDeliverEverything() {
  return (
    <div className="py-14 bg-white text-[#3A3A3A] px-2 xl:px-46">
      <div className="flex flex-col justify-center pb-12 md:pb-24 gap-3">
        <div className="text-[38px] md:text-[46px] font-bold">Diversity of freights</div>
        <div className="text-lg">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec
          ullamcorper adipiscing elit. Ut elit tellus.
        </div>
      </div>
      <div className="flex flex-col md:flex-row justify-around gap-4 lg:gap-10 items-center">
        <DeliveryCard
          image="/burger.png"
          title="Home appliances"
          body="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper."
        />
        <DeliveryCard
          image="/delivery-box.png"
          title="Heavy machines"
          body="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper."
        />
        <DeliveryCard
          image="/groceries.png"
          title="Construction equipments"
          body="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper."
        />
      </div>
    </div>
  );
}

function DeliveryCard({ image, title, body }: { image: string; title: string; body: string }) {
  return (
    <div className="bg-[#F0EFE6] flex flex-col sm:flex-row items-center justify-center md:flex-col rounded-md w-full px-4 py-4 md:py-3">
      <div className="h-36 flex flex-col justify-center m-4">
        <Image src={image} height={130} width={150} alt={image} />
      </div>
      <div className="md:mt-10">
        <div className="text-[34px] mb-4 font-medium text-center sm:text-left">{title}</div>
        <div className="text-center sm:text-left">{body}</div>
      </div>
    </div>
  );
}
