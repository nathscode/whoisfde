import { InfiniteSlider } from "@/components/motion-primitives/infinite-slider";
import { ProgressiveBlur } from "@/components/motion-primitives/progressive-blur";
import { BrandLogo } from "./work/BrandLogo";
import { useMediaQuery } from "usehooks-ts";

export default function BrandSection() {
	const isMobile = useMediaQuery("(max-width: 600px)");
	const width500 = isMobile ? 50 : 400;
	const height50 = isMobile ? 10 : 50;

	return (
		<section className="overflow-hidden bg-white pt-16">
			<div className="group relative m-auto max-w-7xl px-6">
				<div className="flex flex-col items-center md:flex-row">
					{/* left label */}
					<div className="md:max-w-44 md:border-r md:pr-6">
						<p className="text-center text-2xl font-semibold sm:text-end sm:text-sm">
							Brands I have worked with
						</p>
					</div>

					{/* slider area */}
					<div className="relative py-6 md:w-[calc(100%-11rem)]">
						<InfiniteSlider
							speedOnHover={20}
							speed={40}
							gap={30}
							className="flex justify-center items-center w-full"
						>
							<BrandLogo
								src="/images/brands/desperados-beer-logo.png"
								alt="Desperados"
								width={50}
								height={50}
								className=" flex flex-col justify-center items-center w-full"
							/>

							<BrandLogo
								src="/images/brands/givenchy_logo.png"
								alt="Givenchy"
								width={width500}
								height={isMobile ? 20 : 50}
								className=" flex flex-col justify-center items-center w-full"
							/>

							<BrandLogo
								src="/images/brands/hennessy_logo.png"
								alt="Hennessy"
								width={150}
								height={50}
								className=" flex flex-col justify-center items-center w-full"
							/>

							<BrandLogo
								src="/images/brands/new_infinix_logo.png"
								alt="Infinix"
								width={width500}
								height={isMobile ? 10 : 50}
								className=" flex flex-col justify-center items-center w-full"
							/>

							<BrandLogo
								src="/images/brands/mikano_logo.png"
								alt="Mikano"
								width={150}
								height={50}
								className=" flex flex-col justify-center items-center w-full"
							/>

							<BrandLogo
								src="/images/brands/unicaf.png"
								alt="Unicaf"
								width={width500}
								height={height50}
								className=" flex flex-col justify-center items-center w-full"
							/>

							<BrandLogo
								src="/images/brands/momo.png"
								alt="MTN MoMo"
								width={150}
								height={50}
								className=" flex flex-col justify-center items-center w-full"
							/>

							<BrandLogo
								src="/images/brands/octafx.png"
								alt="OctaFX"
								width={width500}
								height={height50}
								className=" flex flex-col justify-center items-center w-full"
							/>

							<BrandLogo
								src="/images/brands/oraimo_logo.png"
								alt="Oraimo"
								width={width500}
								height={height50}
								className=" flex flex-col justify-center items-center w-full"
							/>

							<BrandLogo
								src="/images/brands/panarottis_logo.png"
								alt="Panarottis"
								width={150}
								height={50}
								className=" flex flex-col justify-center items-center w-full"
							/>

							<BrandLogo
								src="/images/brands/silverbird_logo.png"
								alt="Silverbird"
								width={60}
								height={isMobile ? 40 : 50}
								className=" flex flex-col justify-center items-center w-full"
							/>
						</InfiniteSlider>

						{/* fade edges */}
						<div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-white to-transparent" />
						<div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-white to-transparent" />

						<ProgressiveBlur
							className="pointer-events-none absolute left-0 top-0 h-full w-20"
							direction="left"
							blurIntensity={1}
						/>
						<ProgressiveBlur
							className="pointer-events-none absolute right-0 top-0 h-full w-20"
							direction="right"
							blurIntensity={1}
						/>
					</div>
				</div>
			</div>
		</section>
	);
}
