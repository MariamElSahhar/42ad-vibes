import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
	title: "42 Abu Dhabi Vibes",
	description: "Event management platform by Mariam ElSahhar",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body>
				<nav className="bg-blue-300 py-4">
					<div className="container mx-auto text-center">
						<h1 className="text-2xl font-semibold">42AD Vibes</h1>
					</div>
				</nav>
				<main className="vh-full">{children}</main>
				<footer className="bg-gray-100 text-center py-4 mt-8 text-sm text-gray-500">
					Created by Mariam ✨
				</footer>
			</body>
		</html>
	);
}
