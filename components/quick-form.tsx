export default function QuickForm() {
  return (
    <div className="pt-10 pb-16 px-2 bg-white text-[#3A454B]">
      <div className="flex flex-col justify-center pb-5 gap-1">
        <div className="text-[43px] font-bold">What are you waiting for?</div>
        <div className="text-2xl font-light">Request a quote now!</div>
      </div>
      <div className="flex flex-col md:flex-row gap-2">
        <div className="flex-1 grid grid-cols-1 xl:grid-cols-2 gap-1">
          <input
            className="
      rounded-md 
      bg-[#F0EFF6]
      flex-1
      py-3
      px-3
      
      placeholder:font-light 
      placeholder:opacity-50
      placeholder:text-lg
      outline-none
      text-lg
      font-light
      placeholder:tracking-wide
      placeholder:text-[#5D5D5D]
      text-black
      "
            placeholder="Your email"
          />
          <input
            className="
      rounded-md 
      bg-[#F0EFF6]
      flex-1
      py-3
      px-3
      
      placeholder:font-light 
      placeholder:opacity-50
      placeholder:text-lg
      outline-none
      text-lg
      font-light
      placeholder:tracking-wide
      placeholder:text-[#5D5D5D]
      text-black
      "
            placeholder="Departure address"
          />
          <input
            className="
      rounded-md 
      bg-[#F0EFF6]
      flex-1
      py-3
      px-3
      
      placeholder:font-light 
      placeholder:opacity-50
      placeholder:text-lg
      outline-none
      text-lg
      font-light
      placeholder:tracking-wide
      placeholder:text-[#5D5D5D]
      text-black
      "
            placeholder="Destination address"
          />
          <input
            className="
      rounded-md 
      bg-[#F0EFF6]
      flex-1
      py-3
      px-3
      
      placeholder:font-light 
      placeholder:opacity-50
      placeholder:text-lg
      outline-none
      text-lg
      font-light
      placeholder:tracking-wide
      placeholder:text-[#5D5D5D]
      text-black
      "
            placeholder="Weight of goods"
          />
        </div>
        <textarea
          draggable
rows={4}
          className="
          flex-1
      rounded-md
      border-[0.65px]
      border-[#3A454B]
      bg-[#F0EFF6]
      px-3
      py-1
      placeholder:font-light 
      placeholder:opacity-50
      placeholder:text-lg
      outline-none
      text-lg
      font-light
      placeholder:tracking-wide
      resize-y
      placeholder:text-[#5D5D5D]
      text-black
      
      "
          placeholder="Send us your remarks?"
        />
        
      </div>
      <button className="px-2 max-sm:w-full mt-2 py-3 text-white font-light md:font-medium rounded-lg text-lg bg-[#3A454B]">
          SUBMIT REQUEST
        </button>
    </div>
  );
}
