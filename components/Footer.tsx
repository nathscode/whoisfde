import Image from "next/image";

export default function Footer() {
	return (
		<div className="w-full bg-black text-white flex justify-center items-center">
			<div
				className="
        bg-[url('/bg-camera.png')] 
        px-2  
        bg-no-repeat w-full 
        py-20 
        flex 
        justify-start 
        sm:justify-center 
        lg:justify-end 
        lg:pr-[100px] 
        xl:pr-[200px] 
        items-center"
			>
				<div className="px-4">
					<div className="font-heading text-white text-bold text-2xl">
						CONTACT US
					</div>
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
							<button
								className="
                text-yellow-500 
                active:bg-yellow-200 
                lg:hover:opacity-50 
                active:text-black border 
                rounded-lg w-full 
                py-2 text-lg 
                border-gray-500"
							>
								Send
							</button>
							<div className="flex items-center gap-3">
								<div>
									<input
										type="checkbox"
										defaultChecked
										className="checked:bg-white rounded-full accent-black"
									/>
								</div>
								<div>I agree to the terms of service</div>
							</div>
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
							<div>Company info</div>
						</div>
					</div>
					<div className="text-light text-gray-600 text-[12px] mt-10">
						&copy; 2024 Journals Inc. All rights reserved
					</div>
				</div>
			</div>
		</div>
	);
}
