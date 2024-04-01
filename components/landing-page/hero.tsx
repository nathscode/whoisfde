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
					<Reveal>
						<h4
							id="intro"
							className="uppercase text-lg mb-2 font-medium text-white"
						>
							My name is
						</h4>
					</Reveal>
					<Reveal>
						<h1 className="name text-2xl md:text-5xl font-semibold font-heading text-white">
							FDE - FAVOUR IMIDE
						</h1>
					</Reveal>
					<Reveal>
						<div className="occupation border border-[#FFE500] text-[#FFE500] p-2 font-medium md:text-sm text-[10px] mt-2">
							VIDEOGRAPHER & PHOTOGRAPHER
						</div>
					</Reveal>
				</div>
				<div className="flex flex-col gap-4 items-center mt-12 z-30">
					<Link href={"#"}>
						<Image
							src={"/instagram.png"}
							className="bg-blend-difference"
							width={15}
							height={15}
							alt="phone"
						/>
					</Link>
					<Link href={"#"}>
						<Image
							src={"/x.png"}
							className="bg-blend-difference"
							width={10}
							height={10}
							alt="phone"
						/>
					</Link>
					<Link href={"#"}>
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
