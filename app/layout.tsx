import { Geist, Geist_Mono } from "next/font/google"
import { HeroUIProvider } from "@heroui/system"
import "./globals.css"
import type { Metadata } from "next"

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
})

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
})

export const metadata: Metadata = {
	title: "reREPont",
	description:
		"Nem tudod, hogy a 40 millió jelölésből melyik vonatkozik Magyarországra? Most megtudhatod.",
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<HeroUIProvider>
			<html lang="en" className="light">
				<body
					className={`${geistSans.variable} ${geistMono.variable} antialiased`}
				>
					{children}
				</body>
			</html>
		</HeroUIProvider>
	)
}
