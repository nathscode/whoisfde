"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

type Props = {
	src: string;
	alt: string;
	width: number; // natural width of the file you exported
	height: number; // natural height of the file you exported
	className?: string;
};

export const BrandLogo = ({ src, alt, width, height, className }: Props) => (
	<div
		className={cn("shrink-0", className)}
		style={{
			aspectRatio: `${width}/${height}`,
			height: "100%", // takes the height given by parent
			width: "auto",
		}}
	>
		<Image
			src={src}
			alt={alt}
			width={width}
			height={height}
			quality={90}
			draggable={false}
			className="h-full w-auto object-contain"
			sizes="15vw"
		/>
	</div>
);
