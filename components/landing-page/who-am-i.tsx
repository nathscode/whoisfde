"use client";
import Image from "next/image";
import Reveal from "../Reveal";
import { useState } from "react";
import { motion } from "framer-motion";
import { useMediaQuery } from "usehooks-ts";

export default function WhoAmI() {
	const [isExpanded, setIsExpanded] = useState<boolean>(false);

	const toggleExpand = () => {
		setIsExpanded(!isExpanded);
	};

	const media = useMediaQuery("(max-width: 600px)");

	const mobile = media ? "850px" : "500px";
	return (
		<div
			className="
         px-2
         lg:px-[150px] 
         xl:px-[250px] 
         bg-black 
         text-white 
         relative 
         max-md:py-6 
         md:h-screen 
         flex 
				 flex-col
         items-start 
         justify-start
				 py-20"
		>
			<Reveal>
				<div className="who font-heading mb-14 text-4xl font-semibold">
					WHO AM I?
				</div>
			</Reveal>
			<div className="py-10">
				<div className="flex-1 flex flex-col md:flex-row gap-10 justify-center items-center">
					<div className="relative ">
						<Image
							src={"/fde-small.png"}
							className="absolute right-16 top-1"
							width={30}
							height={15}
							alt="fde"
						/>
						<Image
							src={"/fde-small.png"}
							className="rotate-90 absolute right-0 top-16"
							width={30}
							height={10}
							alt="fde"
						/>
						<div className="w-32 h-32 border-l border-t absolute top-[-10] left-[-10]" />
						<div className="w-32 h-32 border-b border-r absolute bottom-[0] right-[0]" />

						<div className="p-4">
							<Image
								src={"/who-image.png"}
								className="object-fill"
								alt="who image"
								height={300}
								width={300}
							/>
						</div>
					</div>
					<div className="flex-1 flex flex-col gap-4 px-4">
						<Reveal>
							<div className="text-2xl font-bold">
								HELLO, MY NAME IS FAVOUR IMIDE
							</div>
						</Reveal>
						<Reveal>
							<motion.div
								className=" w-full"
								animate={{ height: isExpanded ? mobile : "100px" }}
								transition={{ duration: 0.5 }}
							>
								<div
									className={`leading-loose mb-1 ${
										!isExpanded && "line-clamp-3"
									} `}
								>
									As a passionate professional in videography and video editing,
									I specialize in weaving compelling stories and creative
									inspirations into captivating visual narratives. With a
									commitment to excellence, I approach each project with a focus
									on bringing out the best in my clients&apos; ideas, ensuring
									that every frame tells a meaningful story.
								</div>
								<div className="leading-loose m-1">
									I firmly believe in the power of collaboration and actively
									involve my clients throughout the creative process, ensuring
									that their vision is not only realized but exceeded. I
									don&apos;t settle for mediocrity; instead, I strive to breathe
									life into every project, transforming concepts into visually
									stunning masterpieces.
								</div>
								<div className="leading-loose mb-1">
									With a keen eye for detail and a dedication to quality, I aim
									to create videos that resonate with audiences and leave a
									lasting impact. Whether it&apos;s a corporate video, a
									documentary, or a promotional piece, I bring professionalism,
									creativity, and enthusiasm to every project I undertake.
								</div>
								<div className="leading-loose mb-1">
									Let&apos;s work together to turn your ideas into unforgettable
									visual experiences.
								</div>
							</motion.div>
						</Reveal>
						<div className="block mt-5">
							<button
								type="button"
								className="text-yellow-500"
								onClick={toggleExpand}
							>
								{isExpanded ? "See Less" : "See More"}
							</button>
						</div>
						<div className="w-4/5 sm:w-3/5 bg-gray-300 h-[1px]" />
					</div>
				</div>
			</div>
			<div className="flex justify-between items-center h-full">
				<div className="h-fit">
					<Image src={"/fde-small.png"} width={35} height={20} alt="fde" />
				</div>
				<Image src={"/fde.png"} width={150} height={100} alt="fde" />
			</div>
		</div>
	);
}
