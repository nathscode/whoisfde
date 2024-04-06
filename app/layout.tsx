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
	metadataBase: new URL("https://whoisfde.vercel.app"),
	title: {
		template: "%s | whoisfde.vercel.app",
		default: "Whoisfde - Videographer & Photographer",
	},
	description: "Whoisfde Videographer & Photographer",
	other: {
		"theme-color": "#000000",
		"color-scheme": "light",
		"twitter:image": "/images/site_summary.png",
		"twitter:card": "summary_large_image",
		"og:url": "https://whoisfde.vercel.app",
		"og:image": "/images/site_summary.png",
		"og:type": "website",
	},
	openGraph: {
		title: "Whoisfde - Videographer & Photographer",
		description: "Whoisfde Videographer & Photographer",
		url: "https://whoisfde.vercel.app",
		siteName: "Whoisfde",
		images: [
			{
				url: "/images/site_summary.png",
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
