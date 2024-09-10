import { getFileExtension } from "@/lib/utils";
import { Files } from "@prisma/client";
import Image from "next/image";

export default function OgReview({
	name,
	body,
	image,
	files,
}: {
	image: string;
	name: string;
	body: string;
	files: Files[];
}) {
	return (
		<div className="flex gap-5">
			<div className="relative shrink-0 w-16  h-16 overflow-hidden  rounded-full">
				<Image
					src={image}
					fill
					className="
                            object-cover 
                            h-full 
                            w-full 
                            transition-all"
					alt="og"
				/>
			</div>
			<div>
				<div>
					<div className="text-base font-semibold">{name}</div>
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
						{files &&
							files.length > 0 &&
							files.map((file, index) => {
								const extension = getFileExtension(file.url!);
								const isImage = ["jpg", "jpeg", "png", "gif"].includes(
									extension!
								);

								return (
									<div key={index}>
										{isImage ? (
											<img
												src={file.url!}
												className="rounded-lg"
												height={50}
												width={50}
												alt="file"
											/>
										) : (
											<video controls>
												<source src={file.url!} type={`video/${extension}`} />
												Your browser does not support the video tag.
											</video>
										)}
									</div>
								);
							})}
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
					</div>
				</div>
			</div>
		</div>
	);
}
