import { motion } from "framer-motion";
import React, { useState } from "react";

import {
	arrowMotion,
	dividerMotion,
	itemContentMotion,
	itemCoverMotion,
} from "@/components/util/animations";
import { ArrowBigRight } from "lucide-react";
import Link from "next/link";

interface NavMenuItem {
	index: number;
	title: string;
	href: string;
}

const NavMenuItem: React.FC<NavMenuItem> = ({ index, href, title }) => {
	const [isLoading, setIsLoading] = useState(true);

	return (
		<motion.li
			className={`cursor-pointer py-4 relative w-full ${
				isLoading ? "pointer-events-none" : "pointer-events-auto"
			}`}
			initial="initial"
			animate="animate"
			whileHover="hover"
			onAnimationComplete={() => setIsLoading(false)}
		>
			<Link href={href} className="flex items-center relative w-full">
				<motion.div
					className="absolute left-0 top-0 right-0 bottom-0 bg-black"
					variants={itemCoverMotion}
				/>
				<motion.span
					className="w-[4ch] text-white text-lg"
					variants={itemContentMotion}
				>
					({index.toLocaleString("en-US", { minimumIntegerDigits: 2 })})
				</motion.span>
				<h1 className="uppercase text-white tracking-wide text-lg sm:text-5xl md:text-6xl flex-1">
					{title}
				</h1>
				<motion.div variants={arrowMotion}>
					<ArrowBigRight className="h-6 w-6 text-white" />
				</motion.div>
			</Link>
			<motion.div
				className="absolute bottom-0 h-[2px] bg-black w-full origin-left"
				variants={dividerMotion}
			/>
		</motion.li>
	);
};

export default NavMenuItem;
