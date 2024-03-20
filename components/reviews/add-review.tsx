import Image from "next/image";

export default function AddReview() {

  return (
    <div className="px-4">
      <div className="flex gap-8 flex-col sm:flex-row">
        <div className="flex-1">
          <img src="/under-rock.png" className="rounded-lg" />
        </div>
        <div className="flex-1 flex flex-col gap-2">
          <div className="border flex-1 border-dashed px-10 py-10 border-spacing-24 rounded-lg border-gray-500 flex justify-center items-center">
            <Image src={"/add_black.svg"} width={20} height={20} alt="add" />
          </div>
          <div className="border flex-3 border-dashed px-10 py-10 border-spacing-24 rounded-lg border-gray-500 flex justify-center items-center">
            <div className="flex gap-2 items-center">
              <div>
                <Image src={"/add_black.svg"} width={16} height={16} alt="add" />
              </div>
              <div className="font-semibold">Add location</div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <textarea rows={6} cols={50} className="border-[0.75px] my-2 w-full p-2 outline-none rounded-md border-gray-400">
          Type in your reviews or captions here
        </textarea>
      </div>
      <div className="w-full flex justify-end">
        <button className="bg-[#4159AD] md:hover:opacity-50 active:opacity-50 text-white rounded-lg px-[10px] py-[6px]">Done</button>
      </div>
    </div>
  );
}
