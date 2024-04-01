import TransitionProvider from "@/components/TranstionProvider";
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

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
		"twitter:image": "/images/logo/logo-opg.jpg",
		"twitter:card": "summary_large_image",
		"og:url": "https:Whoisfde.com",
		"og:image": "/images/logo/logo-opg.jpg",
		"og:type": "website",
	},
	openGraph: {
		title: "Whoisfde - Videographer & Photographer",
		description: "Whoisfde Videographer & Photographer",
		url: "https://whoisfde.vercel.app",
		siteName: "Whoisfde",
		images: [
			{
				url: "/images/logo/logo-opg.jpg",
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
			<body className={`${montserrat.className} overflow-x-hidden`}>
				<TransitionProvider>{children}</TransitionProvider>
			</body>
		</html>
	);
}
