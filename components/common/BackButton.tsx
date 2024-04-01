"use client";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

const BackButton = () => {
	const router = useRouter();

	return (
		<Button
			variant="ghost"
			className="hover:text-brand"
			onClick={() => router.back()}
		>
			<ArrowLeft className="w-5 h-5" />
			<span className="ml-2">Back</span>
		</Button>
	);
};

export default BackButton;
