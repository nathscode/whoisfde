"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

const ErrorPage = ({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) => {
	return (
		<main className="container pr-0 pl-0 md:pr-8 md:pl-8 mx-auto">
			<div className="flex flex-col w-full py-20">
				<div>
					<h1 className="text-3xl font-bold text-gray-700 py-10 px-4 bg-white text-center">
						{"Something Went Wrong"}
					</h1>
					<div className="flex justify-center my-4">
						<Button asChild>
							<Link href={"/"}>Try again</Link>
						</Button>
					</div>
				</div>
			</div>
		</main>
	);
};

export default ErrorPage;
