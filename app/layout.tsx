import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import { Toaster } from "@/components/ui/toaster";

const montserrat = Montserrat({
	weight: ["400", "500", "700"],
	style: ["normal", "italic"],
	subsets: ["latin"],
	display: "swap",
});

export const metadata: Metadata = {
	metadataBase: new URL("https://whoisfde.com"),
	title: {
		template: "%s | whoisfde.com",
		default: "Whoisfde - Videographer & Photographer",
	},
	description: "Whoisfde Videographer & Photographer",
	other: {
		"theme-color": "#000000",
		"color-scheme": "light",
		"twitter:image":
			"https://www.whoisfde.com/_next/image?url=%2Fimages%2Flogo%2Flogo-question.png",
		"twitter:card": "summary_large_image",
		"og:url": "https://whoisfde.com",
		"og:image":
			"https://www.whoisfde.com/_next/image?url=%2Fimages%2Flogo%2Flogo-question.png",
		"og:type": "website",
	},
	openGraph: {
		title: "Whoisfde - Videographer & Photographer",
		description: "Whoisfde Videographer & Photographer",
		url: "https://whoisfde.com",
		siteName: "Whoisfde",
		images: [
			{
				url: "https://www.whoisfde.com/_next/image?url=%2Fimages%2Flogo%2Flogo-question.png",
				width: 1200,
				height: 600,
			},
		],
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`${montserrat.className}`}>
				<Providers>
					{children}
					<Toaster />
				</Providers>
			</body>
		</html>
	);
}
