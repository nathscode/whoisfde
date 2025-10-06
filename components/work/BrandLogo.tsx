"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

// BrandLogo Component with parent-controlled dimensions
type BrandLogoProps = {
	src: string;
	alt: string;
	width?: number;
	height?: number;
	className?: string;
};

export const BrandLogo = ({
	src,
	alt,
	width = 120,
	height = 60,
	className,
}: BrandLogoProps) => {
	return (
		<div
			className={cn("shrink-0 flex items-center justify-center", className)}
			style={{
				width: `${width}px`,
				height: `${height}px`,
			}}
		>
			<Image
				src={src}
				alt={alt}
				width={width}
				height={height}
				quality={90}
				draggable={false}
				className="h-full w-full object-contain"
				sizes="(max-width: 640px) 80px, (max-width: 1024px) 100px, 120px"
				loading="lazy"
			/>
		</div>
	);
};
