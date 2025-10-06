"use client";
import "swiper/css";
import { useMediaQuery } from "usehooks-ts";
import { BrandLogo } from "./work/BrandLogo";
import Marquee from "./Marquee";
import { useEffect, useState } from "react";

const partnersLogo = [
	{ id: 1, src: "/images/brands/desperados-beer-logo.png", alt: "desperados" },
	{ id: 2, src: "/images/brands/givenchy_logo.png", alt: "givenchy" },
	{ id: 3, src: "/images/brands/hennessy_logo.png", alt: "hennessy" },
	{ id: 4, src: "/images/brands/mikano_logo.png", alt: "mikano" },
	{ id: 5, src: "/images/brands/momo.png", alt: "momo" },
	{ id: 6, src: "/images/brands/new_infinix_logo.png", alt: "infinix" },
	{ id: 7, src: "/images/brands/octafx.png", alt: "octa" },
	{ id: 8, src: "/images/brands/oraimo_logo.png", alt: "oraimo" },
	{ id: 9, src: "/images/brands/panarottis_logo.png", alt: "panarottis" },
	{ id: 10, src: "/images/brands/silverbird_logo.png", alt: "silverbird" },
	{ id: 11, src: "/images/brands/unicaf.png", alt: "unicaf" },
];
export default function BrandSection() {
	const isMobile = useMediaQuery("(max-width: 600px)");
	const [logoSize, setLogoSize] = useState({ width: 80, height: 40 });

	useEffect(() => {
		const updateLogoSize = () => {
			const width = window.innerWidth;

			if (width < 640) {
				// Mobile
				setLogoSize({ width: 60, height: 20 });
			} else if (width < 1024) {
				// Tablet
				setLogoSize({ width: 70, height: 30 });
			} else {
				// Desktop
				setLogoSize({ width: 80, height: 40 });
			}
		};

		updateLogoSize();
		window.addEventListener("resize", updateLogoSize);

		return () => window.removeEventListener("resize", updateLogoSize);
	}, []);

	return (
		<section className="overflow-hidden bg-white py-12 md:py-16">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="flex flex-col items-center gap-8 md:flex-row md:gap-6">
					{/* Left Label */}
					<div className="w-full text-center md:w-auto md:min-w-[160px] md:max-w-[180px] md:border-r md:border-gray-200 md:pr-6 md:text-right">
						<h2 className="text-xl font-semibold text-gray-900 sm:text-2xl md:text-base lg:text-lg">
							Brands I&apos;ve worked with
						</h2>
					</div>

					{/* Marquee Slider */}
					<div className="w-full flex-1">
						<Marquee speed={30} pauseOnHover={true} className="py-4">
							{partnersLogo.map((partner) => (
								<BrandLogo
									key={partner.id}
									src={partner.src}
									alt={partner.alt}
									width={logoSize.width}
									height={logoSize.height}
									className="opacity-70 transition-opacity duration-300 hover:opacity-100"
								/>
							))}
						</Marquee>
					</div>
				</div>
			</div>
		</section>
	);
}
