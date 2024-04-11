import Link from "next/link";
import React from "react";

type Props = {
	name: string;
	features: string[];
};

const PricingCard = ({ name, features }: Props) => {
	return (
		<div
			className="border-gray-600 rounded-2xl border  divide-y divide-gray-200 max-w-sm space-x-5 mt-20"
			style={{
				boxShadow:
					"rgba(45, 50, 130, 0.15) 0px 12px 16px -4px, rgba(45, 50, 130, 0.15) 0px 4px 6px -2px",
			}}
		>
			<div className="p-6">
				<div className="flex justify-between">
					<h2 className="text-lg font-semibold text-gray-600">{name}</h2>
				</div>

				<Link
					href={`/book?type=${name}`}
					className="flex justify-center w-full py-3 mt-4 text-sm font-semibold text-white bg-black border border-black rounded active:text-gray-500 hover:bg-transparent hover:text-black focus:outline-none focus:ring"
				>
					Book Now
				</Link>
			</div>
			<div className="px-6 pt-6 pb-5">
				<h3 className="text-sm font-medium text-gray-900">
					What&pos;s included
				</h3>
				<ul role="list" className="mt-6 space-y-4">
					{features.map((feature, i) => (
						<li key={i} className="flex space-x-3">
							<div className="flex justify-center items-center rounded-full bg-green-100 h-5 w-5">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 24 24"
									fill="currentColor"
									aria-hidden="true"
									className="h-3 w-3 flex-shrink-0 text-green-500"
								>
									<path
										fillRule="evenodd"
										d="M20.707 5.293a1 1 0 010 1.414l-11 11a1 1 0 01-1.414 0l-5-5a1 1 0 111.414-1.414L9 15.586 19.293 5.293a1 1 0 011.414 0z"
										clipRule="evenodd"
									></path>
								</svg>
							</div>
							<span className="text-sm text-gray-500">{feature}</span>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
};

export default PricingCard;
