"use client";
import Link from "next/link";
import { useRef, useState } from "react";
import TabController from "../util/tab-controller";
import ConcertContent from "../work/ConcertContent";
import GeneralContent from "../work/GeneralContent";
import PartiesContent from "../work/PartiesContent";
import PhotographyContent from "../work/PhotographyContent";
import WeddingContent from "../work/WeddingContent";
import Reveal from "../Reveal";

export default function Works() {
	const [activeComponent, setActiveComponent] = useState(<ConcertContent />);
	const position = useRef(0);

	return (
		<div className="py-20 h-full">
			<div className="px-2 lg:px-[150px] xl:px-[250px]">
				<div>
					<Reveal>
						<div className=" font-heading text-[33px] sm:text-4xl font-semibold">
							MY WORKS
						</div>
					</Reveal>
					<div className=" my-8 text-[10.5px] sm:text-[14px] md:text-[18px]">
						<TabController
							elementsStyle="flex justify-start space-x-5 items-center mb-1"
							activeElementColor="#4159AD"
							indicatorColor="#4159AD"
							railColor="#eeeeee"
							onTabPress={(index) => {
								position.current = index;
								if (index === 0) {
									setActiveComponent(<ConcertContent />);
								} else if (index === 1) {
									setActiveComponent(<PartiesContent />);
								} else if (index === 2) {
									setActiveComponent(<WeddingContent />);
								} else if (index === 3) {
									setActiveComponent(<GeneralContent />);
								} else {
									setActiveComponent(<PhotographyContent />);
								}
							}}
						>
							<div className="text-sm uppercase font-medium">CONCERTS</div>
							<div className="text-sm uppercase font-medium">PARTIES</div>
							<div className="text-sm uppercase font-medium">WEDDINGS</div>
							<div className="text-sm uppercase font-medium">CONTENTS</div>
							<div className="flex text-sm uppercase font-medium">
								Photography
							</div>
						</TabController>
						{activeComponent}
					</div>
				</div>

				<div className="flex justify-end gap-2 items-center mt-4 md:mt-6">
					<Link
						href={"/package"}
						className="flex justify-center w-fit px-10 py-3 mt-4 text-sm font-semibold text-white bg-black border border-black rounded active:text-gray-500 hover:bg-transparent hover:text-black focus:outline-none focus:ring"
					>
						View Packages
					</Link>
				</div>
			</div>
		</div>
	);
}
