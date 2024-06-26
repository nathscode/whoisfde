"use client";
import Image from "next/image";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import Reveal from "../Reveal";
import { useRef } from "react";
import Link from "next/link";

type Props = {};

function useParallax(value: any, distance: any) {
	return useTransform(value, [0, 1], [-distance, distance]);
}

const HeroSection = (props: Props) => {
	return (
		<motion.div className="relative hero h-[50vh] sm:h-screen">
			<motion.div
				className="
          bg-[url('/bg-2.png')] 
          bg-repeat-round 
          h-full 
          overflow-x-clip 
          flex 
          justify-end 
          pr-3 
          lg:pr-20
          items-center"
			>
				<div className="overlay absolute top-0 left-0 bg-black/70 w-full h-full"></div>
				<div className=" flex flex-col h-auto justify-center items-center w-[600px] pr-0 md:pr-12">
					{/* <Reveal>
						<h4
							id="intro"
							className="uppercase text-lg mb-2 font-medium text-white"
						>
							My name is
						</h4>
					</Reveal> */}
					<Reveal>
						<h1 className="name text-4xl md:text-5xl font-heading font-extrabold uppercase text-neutral-400">
							My name is <span className="font-[900] text-white ">FDE</span>
						</h1>
					</Reveal>
					<Reveal>
						<div className="occupation border border-[#FFE500] text-[#FFE500] py-2 px-10 font-medium uppercase md:text-sm text-[10px] mt-2">
							visual prodigy
						</div>
					</Reveal>
				</div>
				<div className="flex flex-col gap-4 items-center mt-12 z-30">
					<Link href={"https://www.instagram.com/whoisfde/"}>
						<Image
							src={"/instagram.png"}
							className="bg-blend-difference"
							width={15}
							height={15}
							alt="phone"
						/>
					</Link>
					<Link
						href={"https://twitter.com/whoisfde?s=21&t=5JI4fTXO-ojJnYgPmGxchA"}
					>
						<Image
							src={"/x.png"}
							className="bg-blend-difference"
							width={10}
							height={10}
							alt="phone"
						/>
					</Link>
					<Link href={"https://youtube.com/@whoisfde?si=GjNm22At7bOxrRo_"}>
						<Image
							src={"/youtube.png"}
							className="bg-blend-difference"
							width={15}
							height={15}
							alt="phone"
						/>
					</Link>
				</div>
			</motion.div>
		</motion.div>
	);
};

export default HeroSection;
