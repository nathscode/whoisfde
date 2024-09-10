import Image from "next/image";

export default function OrdinaryReview({
	name,
	body,
	image,
}: {
	image: string;
	name: string;
	body: string;
}) {
	return (
		<div className="flex gap-5">
			<div className="relative shrink-0 w-16  h-16 overflow-hidden  rounded-full">
				<Image
					src={image}
					fill
					className="
                            object-cover 
                            h-full 
                            w-full 
                            transition-all"
					alt="og"
				/>
			</div>
			<div>
				<div className="text-sm font-semibold">{name}</div>
				<div className="text-sm">{body}</div>
			</div>
		</div>
	);
}
