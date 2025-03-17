import { InfiniteSlider } from "@/components/motion-primitives/infinite-slider";
import { ProgressiveBlur } from "@/components/motion-primitives/progressive-blur";
import Image from "next/image";

export default function BrandSection() {
	return (
		<section className="bg-white overflow-hidden pt-16">
			<div className="group relative m-auto max-w-7xl px-6">
				<div className="flex flex-col items-center md:flex-row">
					<div className="md:max-w-44 md:border-r md:pr-6">
						<p className="text-end text-base font-heading font-semibold sm:text-sm">
							Brands have worked with
						</p>
					</div>
					<div className="relative py-6 md:w-[calc(100%-11rem)]">
						<InfiniteSlider speedOnHover={20} speed={40} gap={112}>
							<div className="flex">
								<img
									className="mx-auto h-5 w-fit dark:invert"
									src="/images/brands/desperados-beer-logo.png"
									alt="Desperado logo"
									height="50"
									width="auto"
								/>
							</div>

							<div className="flex">
								<img
									className="mx-auto h-4 w-fit dark:invert"
									src="/images/brands/givenchy_logo.svg"
									alt="Givenchy Logo"
									height="16"
									width="auto"
								/>
							</div>
							<div className="flex">
								<img
									className="mx-auto h-4 w-fit dark:invert"
									src="/images/brands/hennessy_logo.svg"
									alt="Hennessy Logo"
									height="50"
									width="auto"
								/>
							</div>
							<div className="flex">
								<img
									className="mx-auto h-5 w-fit dark:invert"
									src="/images/brands/infinix_logo.png"
									alt="infinix Logo"
									height="20"
									width="auto"
								/>
							</div>
							<div className="flex">
								<img
									className="mx-auto h-5 w-fit dark:invert"
									src="/images/brands/mikano_logo.png"
									alt="Mikano Logo"
									height="20"
									width="auto"
								/>
							</div>
							<div className="flex">
								<img
									className="mx-auto h-4 w-fit dark:invert"
									src="/images/brands/unicaf.png"
									alt="Unicaf Logo"
									height="16"
									width="auto"
								/>
							</div>
							<div className="flex">
								<img
									className="mx-auto h-4 w-fit dark:invert"
									src="/images/brands/momo.png"
									alt="momo mtn Logo"
									height="16"
									width="auto"
								/>
							</div>
							<div className="flex">
								<img
									className="mx-auto h-7 w-fit dark:invert"
									src="/images/brands/octafx.svg"
									alt="Octafx Logo"
									height="28"
									width="auto"
								/>
							</div>

							<div className="flex">
								<img
									className="mx-auto h-6 w-fit dark:invert"
									src="/images/brands/oraimo_logo.png"
									alt="Oraimo Logo"
									height="24"
									width="auto"
								/>
							</div>
							<div className="flex">
								<img
									className="mx-auto h-6 w-fit dark:invert"
									src="/images/brands/panarottis_logo.png"
									alt="panarottis Logo"
									height="24"
									width="auto"
								/>
							</div>
							<div className="flex">
								<img
									className="mx-auto h-6 w-fit dark:invert"
									src="/images/brands/silverbird_logo.png"
									alt="silverbird Logo"
									height="24"
									width="auto"
								/>
							</div>
						</InfiniteSlider>

						<div className="bg-linear-to-r from-background absolute inset-y-0 left-0 w-20"></div>
						<div className="bg-linear-to-l from-background absolute inset-y-0 right-0 w-20"></div>
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
