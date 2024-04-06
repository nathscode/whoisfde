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
			<div>
				<Image
					src={image}
					className="bg-slate-100 rounded-full"
					width={45}
					height={45}
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
