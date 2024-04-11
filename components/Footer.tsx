import Image from "next/image";
import Link from "next/link";

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
					<div className="font-heading text-white font-bold text-2xl mb-4">
						CONTACT US
					</div>
					<div className="flex flex-col md:flex-row gap-8 md:gap-16">
						<div className="flex flex-col space-y-4 justify-center items-start">
							<div className="flex items-center gap-2">
								<Image
									src={"/location.png"}
									className="bg-blend-difference"
									width={20}
									height={20}
									alt="location"
								/>
								<span>Warri, Delta State</span>
							</div>
							<div className="flex items-center gap-2 ">
								<Image
									src={"/phone1.png"}
									className="bg-blend-difference"
									width={20}
									height={20}
									alt="phone"
								/>
								<span>+(234)8133676423</span>
							</div>
							<div className="flex gap-4 items-center mt-4">
								<Link href={"https://www.instagram.com/whoisfde/"}>
									<Image
										src={"/instagram.png"}
										className="bg-blend-difference"
										width={20}
										height={20}
										alt="phone"
									/>
								</Link>
								<Link
									href={
										"https://twitter.com/whoisfde?s=21&t=5JI4fTXO-ojJnYgPmGxchA"
									}
								>
									<Image
										src={"/x.png"}
										className="bg-blend-difference"
										width={16}
										height={16}
										alt="phone"
									/>
								</Link>
								<Link
									href={"https://youtube.com/@whoisfde?si=GjNm22At7bOxrRo_"}
								>
									<Image
										src={"/youtube.png"}
										className="bg-blend-difference"
										width={20}
										height={20}
										alt="phone"
									/>
								</Link>
							</div>
						</div>
					</div>
					<div className="text-light text-gray-600 text-[12px] mt-10">
						&copy; 2024 Whoisfde.com. All rights reserved
					</div>
				</div>
			</div>
		</div>
	);
}
