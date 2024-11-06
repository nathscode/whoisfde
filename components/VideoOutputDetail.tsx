import { FileActions } from "@/types";
import { motion } from "framer-motion";
import { BadgeCheck } from "lucide-react";
import { bytesToSize, calculateBlobSize, reduceSize } from "./util/bytesToSize";
import { formatTimer } from "./util/convert";

export const VideoOutputDetails = ({
	videoFile,
	timeTaken,
}: {
	videoFile: FileActions;
	timeTaken?: number;
}) => {
	const outputFileSize = calculateBlobSize(videoFile.outputBlob);
	const { sizeReduced, percentage } = reduceSize(
		videoFile.fileSize,
		videoFile.outputBlob
	);

	return (
		<motion.div
			initial={{ scale: 0.8, opacity: 0 }}
			animate={{ scale: 1, opacity: 1 }}
			exit={{ scale: 0.8, opacity: 0 }}
			key={"output"}
			transition={{ type: "tween" }}
			className="rounded-2xl px-4 py-3 h-fit bg-gray-100 border border-gray-200"
		>
			<div className="text-sm">
				<div className="flex justify-between items-center border-b mb-2 pb-2">
					<div className="flex items-center gap-1">
						<p>Output file</p>
						<BadgeCheck className="text-white rounded-full" fill="#000000" />
					</div>
				</div>

				<div className="flex justify-between items-center border-b mb-2 pb-2">
					<p className="font-semibold">New file size</p>
					<p className="font-semibold">{outputFileSize}</p>
				</div>
				<div className="flex justify-between items-center border-b mb-2 pb-2">
					<p className="font-semibold">Size Reduced %</p>
					<p className="font-semibold">{percentage}</p>
				</div>
				<div className="flex justify-between items-center border-b mb-2 pb-2">
					<p>Original file size</p>
					<p>{bytesToSize(videoFile.fileSize)}</p>
				</div>
				<div className="flex justify-between items-center border-b mb-2 pb-2">
					<p>Size Reduced</p>
					<p>{sizeReduced}</p>
				</div>
				<div className="flex justify-between items-center">
					<p>Time taken</p>
					<p>{timeTaken ? formatTimer(timeTaken) : "-"}</p>
				</div>
			</div>
		</motion.div>
	);
};
