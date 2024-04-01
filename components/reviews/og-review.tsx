import Image from "next/image";

export default function OgReview({
	name,
	work,
	body,
	image,
	images,
}: {
	image: string;
	name: string;
	body: string;
	work: string;
	images: string[];
}) {
	return (
		<div className="flex gap-5">
			<div>
				<Image
					src={image}
					className="bg-blend-difference"
					width={175}
					height={175}
					alt="og"
				/>
			</div>
			<div>
				<div>
					<div className="text-xl">{name}</div>
					<div className="text-sm font-light mt-1 mb-4">{work}</div>
					<div className="text-sm">{body}</div>
				</div>
				<div className="flex gap-2 md:gap-8 mt-10">
					<div className="relative bg-black">
						<div
							className="
               p-1 
                 md:hover:bg-black 
                 active:bg-black 
                 z-10 
                 absolute 
                 top-[35%] 
                 md:top-[40%] 
                 left-[41.5%] 
                 md:left-[45%] 
                 rounded-full"
						>
							<Image
								src={"/play.png"}
								className=""
								height={22.5}
								width={22.5}
								alt="right"
							/>
						</div>
						<Image
							src={images[0]}
							className="rounded-lg"
							height={50}
							width={50}
							alt="og report image"
						/>
					</div>
					<div className="relative bg-black">
						<div
							className="
                p-1 
                md:hover:bg-black 
                active:bg-black 
                z-10 
                absolute 
                top-[35%] 
                md:top-[40%] 
                right-[3px] 
                md:right-[6px] 
                rounded-full"
						>
							<Image
								src={"/white_right.png"}
								className=""
								height={22.5}
								width={22.5}
								alt="right"
							/>
						</div>
						<Image
							src={images[1]}
							height={50}
							width={50}
							className="opacity-50 rounded-lg"
							alt="og report image"
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
