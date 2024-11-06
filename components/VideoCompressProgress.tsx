import React from "react";
import { Loader } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { formatTimer } from "./util/convert";

export const VideoCondenseProgress = ({
	progress,
	seconds,
}: {
	progress: number;
	seconds: number;
}) => {
	return (
		<div className="flex justify-between items-center gap-2 p-0.5">
			<div className="flex-1">
				<div className="flex justify-between text-sm mb-2">
					<div className="flex gap-2 items-center">
						{progress ? <p>Condensing</p> : <p>Loading Video</p>}{" "}
						<Loader className="animate-spin w-4 h-4" />
					</div>
					<p className="text-sm">{formatTimer(seconds)}</p>
				</div>
				<Progress value={progress} />
			</div>
		</div>
	);
};
