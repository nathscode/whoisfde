import Image from "next/image";
import React from "react";

type Props = {};

const WeddingContent = (props: Props) => {
	return (
		<div className="flex flex-col w-full py-4">
			<h1 className="font-heading text-2xl mb-4">Wedding</h1>
			<div className="flex justify-center sm:items-center gap-1 flex-row sm:gap-2">
				<div className="flex flex-col gap-1 sm:gap-2">
					<Image
						src={"/davido.png"}
						className="aspect-[5/3.4125]"
						alt="artist"
						width={600}
						height={400}
					/>
					<Image
						src={"/under-davido.png"}
						className="aspect-[3/2.75]"
						alt="artist"
						width={600}
						height={400}
					/>
				</div>
				<div className="flex flex-col gap-1 sm:gap-2">
					<Image
						src={"/rock-n-roll.png"}
						className="aspect-[5/4.5]"
						alt="rock n roll"
						width={600}
						height={400}
					/>
					<Image
						src={"/under-rock.png"}
						className="aspect-[5/3.5]"
						alt="worship"
						width={600}
						height={400}
					/>
				</div>
			</div>
		</div>
	);
};

export default WeddingContent;
