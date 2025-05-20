import BackButton from "@/components/common/BackButton";

export default function NotFound() {
	return (
		<div className="flex flex-col items-center justify-center min-h-screen px-5 py-2">
			<div className="text-center">
				<h1 className="mb-4 text-6xl font-semibold text-black">404</h1>
				<p className="mb-4 text-lg text-gray-600">
					Oops! Looks like you're lost or the page you&apos;re looking for is
					not found.
				</p>
				<div className="animate-bounce">
					<svg
						className="mx-auto h-16 w-16 text-black"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
						></path>
					</svg>
				</div>
				<p className="mt-4 text-gray-600">Let&apos;s get you back.</p>
				<div className="mt-5">
					<BackButton />
				</div>
			</div>
		</div>
	);
}
