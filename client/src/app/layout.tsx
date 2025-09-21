import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Image from "next/image";
import Provider from "@/components/provider/Provider";
import { Header } from "@/components/pages/layout/Header";
import { Sidebar } from "@/components/pages/layout/Sidebar";
import BackgroundImage from '@/components/BackgroundImage';
import GlobalDataFetcher from '@/components/GlobalDataFetcher';

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Lowo",
	description: "Save personal snippets!",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>	
				<Provider>
					<GlobalDataFetcher />
					<BackgroundImage src="https://static.wixstatic.com/media/c837a6_2119733e838e4a2f8813ebde736f99d5~mv2.jpg/v1/fill/w_2538,h_1950,al_b,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/c837a6_2119733e838e4a2f8813ebde736f99d5~mv2.jpg" />
					<Header />
					<div className="p-4">
						{children}
					</div>
				</Provider>
			</body>
		</html>
	);
}
