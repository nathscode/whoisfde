"use client";
import Image from "next/image";
import Reveal from "../Reveal";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";

export default function ClientsAndOgComments() {
	const testimonials: {
		id: number;
		name: string;
		location: string;
		text: string;
		image?: string;
	}[] = [
		{
			id: 1,
			name: "Ajakaye Joshua",
			location: "E.O.Y 23' PARTY",
			text: "I recently used this website for a purchase and I was extremely satisfied with the ease of use and the variety of options 							available. The checkout process was seamless and the delivery was				prompt",
			image: "/who-image.png",
		},
		{
			id: 2,
			name: "John Peter",
			location: "E.O.Y 23' PARTY",
			text: "I recently used this website for a purchase and I was extremely satisfied.",
		},
	];

	return (
		<div
			className="
      px-2 
    
      md:h-screen 
      flex 
      items-center 
      justify-center
      relative"
		>
			<div className="px-4 py-10">
				<Reveal>
					<div className="clients font-heading text-4xl font-semibold mb-6 md:mb-12">
						CLIENTS AND OG&apos;S COMMENTS
					</div>
				</Reveal>
				<div className="flex flex-col md:flex-row gap-4 justify-center">
					<Carousel className="w-full sm:max-w-4xl">
						<CarouselContent>
							{testimonials.map((testimonial, i) => (
								<CarouselItem key={testimonial.id}>
									<blockquote
										key={i}
										className="relative flex flex-col items-center p-4"
									>
										<div className="absolute -left-1  text-black">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												viewBox="0 0 24 24"
												fill="currentColor"
												className="h-10 w-10"
											>
												<path d="M4.58341 17.3211C3.55316 16.2274 3 15 3 13.0103C3 9.51086 5.45651 6.37366 9.03059 4.82318L9.92328 6.20079C6.58804 8.00539 5.93618 10.346 5.67564 11.822C6.21263 11.5443 6.91558 11.4466 7.60471 11.5105C9.40908 11.6778 10.8312 13.159 10.8312 15C10.8312 16.933 9.26416 18.5 7.33116 18.5C6.2581 18.5 5.23196 18.0095 4.58341 17.3211ZM14.5834 17.3211C13.5532 16.2274 13 15 13 13.0103C13 9.51086 15.4565 6.37366 19.0306 4.82318L19.9233 6.20079C16.588 8.00539 15.9362 10.346 15.6756 11.822C16.2126 11.5443 16.9156 11.4466 17.6047 11.5105C19.4091 11.6778 20.8312 13.159 20.8312 15C20.8312 16.933 19.2642 18.5 17.3312 18.5C16.2581 18.5 15.232 18.0095 14.5834 17.3211Z"></path>
											</svg>
										</div>
										<Reveal>
											<p className="flex flex-col max-w-4xl text-lg font-medium text-center md:text-2xl pl-7">
												{testimonial.text}
											</p>
										</Reveal>

										{testimonial.image && (
											<div className="flex flex-col justify-start items-center mt-10">
												<Image
													src={testimonial.image!}
													alt={testimonial.location}
													className="object-cover rounded-lg"
													width={300}
													height={50}
												/>
											</div>
										)}
										<Reveal>
											<footer className="flex items-center gap-3 mt-6 md:mt-12">
												<a
													href=""
													target="_blank"
													className="inline-block font-bold tracking-tight"
												>
													<p>{testimonial.name}</p>
													<p className="font-medium text-black/60 flex items-center mt-1">
														<svg
															xmlns="http://www.w3.org/2000/svg"
															width="24"
															height="24"
															viewBox="0 0 24 24"
															fill="none"
															stroke="currentColor"
															strokeWidth="2"
															strokeLinecap="round"
															strokeLinejoin="round"
															className="h-4 w-4 mr-2"
														>
															<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
															<circle cx="12" cy="10" r="3" />
														</svg>{" "}
														<span>{testimonial.location}</span>
													</p>
												</a>
											</footer>
										</Reveal>
									</blockquote>
								</CarouselItem>
							))}
						</CarouselContent>
						<CarouselPrevious />
						<CarouselNext />
					</Carousel>
					{/* {testimonials.map((testimonial, i) => (
						<blockquote
							key={i}
							className="relative flex flex-col items-center p-4"
						>
							<div className="absolute -left-5 text-black">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 24 24"
									fill="currentColor"
									className="h-10 w-10"
								>
									<path d="M4.58341 17.3211C3.55316 16.2274 3 15 3 13.0103C3 9.51086 5.45651 6.37366 9.03059 4.82318L9.92328 6.20079C6.58804 8.00539 5.93618 10.346 5.67564 11.822C6.21263 11.5443 6.91558 11.4466 7.60471 11.5105C9.40908 11.6778 10.8312 13.159 10.8312 15C10.8312 16.933 9.26416 18.5 7.33116 18.5C6.2581 18.5 5.23196 18.0095 4.58341 17.3211ZM14.5834 17.3211C13.5532 16.2274 13 15 13 13.0103C13 9.51086 15.4565 6.37366 19.0306 4.82318L19.9233 6.20079C16.588 8.00539 15.9362 10.346 15.6756 11.822C16.2126 11.5443 16.9156 11.4466 17.6047 11.5105C19.4091 11.6778 20.8312 13.159 20.8312 15C20.8312 16.933 19.2642 18.5 17.3312 18.5C16.2581 18.5 15.232 18.0095 14.5834 17.3211Z"></path>
								</svg>
							</div>
							<Reveal>
								<p className="flex flex-col max-w-4xl text-xl font-medium text-center md:text-2xl">
									{testimonial.text}
								</p>
							</Reveal>

							{testimonial.image && (
								<div className="flex flex-col justify-start items-center mt-10">
									<Image
										src={testimonial.image!}
										alt={testimonial.location}
										className="object-cover rounded-lg"
										width={300}
										height={50}
									/>
								</div>
							)}
							<Reveal>
								<footer className="flex items-center gap-3 mt-6 md:mt-12">
									<a
										href=""
										target="_blank"
										className="inline-block font-bold tracking-tight"
									>
										<p>{testimonial.name}</p>
										<p className="font-medium text-black/60 flex items-center mt-1">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												width="24"
												height="24"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
												className="h-4 w-4 mr-2"
											>
												<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
												<circle cx="12" cy="10" r="3" />
											</svg>{" "}
											<span>{testimonial.location}</span>
										</p>
									</a>
								</footer>
							</Reveal>
						</blockquote>
					))} */}
				</div>
			</div>
		</div>
	);
}
