"use client";

import { useToast } from "@/components/ui/use-toast";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export const validateVideoFile = (file: File | null) => {
	if (!file) return "No file selected!";
	const allowedTypes = ["video/mp4", "video/webm", "video/ogg"];
	if (!allowedTypes.includes(file.type)) return "Invalid video format!";
	if (file.size > 500 * 1024 * 1024) return "File size exceeds 500MB limit!";
	return null;
};

export const useCreateVideo = () => {
	const { toast } = useToast();

	return useMutation({
		mutationFn: async (formData: FormData) => {
			const file = formData.get("files") as File;
			const error = validateVideoFile(file);
			if (error) throw new Error(error);

			try {
				const response = await axios.post(
					"/api/rooter/work/upload-chuck",
					formData,
					{
						headers: {
							"Content-Type": "multipart/form-data",
						},
					}
				);
				return response.data;
			} catch (error) {
				if (axios.isAxiosError(error)) {
					throw new Error(error.response?.data?.message || "Upload failed");
				} else {
					throw new Error("An unexpected error occurred");
				}
			}
		},
		onError: (error: any) => {
			const errMsg =
				error.response?.data?.message || error.message || "Upload failed";
			toast({
				title: "Upload Failed",
				description: errMsg,
				variant: "destructive",
			});
		},
		onSuccess: () => {
			toast({
				title: "Upload Successful",
				description: "Your video has been uploaded.",
			});
		},
	});
};
