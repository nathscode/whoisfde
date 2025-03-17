"use client";
import BackButton from "../components/common/BackButton";

// Error boundaries must be Client Components

export default function GlobalError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	console.error(error);

	return (
		<html>
			<body>
				<div className="flex flex-col items-center justify-center min-h-screen px-5 py-2">
					<div className="text-center">
						<h1 className="text-4xl font-semibold text-red-500">
							Something went
						</h1>
						<p className="mt-2 text-lg text-gray-600">
							If it happens again, contact support
						</p>
						<div className="mt-5 flex justify-start items-center">
							<button className="button" onClick={() => reset()}>
								Try again
							</button>
							<div className="flex justify-start space-x-2 items-center">
								<BackButton />
								<span>Go back</span>
							</div>
						</div>
					</div>
				</div>
			</body>
		</html>
	);
}
