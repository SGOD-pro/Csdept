import type { Metadata } from "next";
import { Ubuntu, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
const ubuntu = Ubuntu({ subsets: ["latin"], weight: ["400", "700"] });
import { ThemeProvider } from "@/components/theme-provider"
export const metadata: Metadata = {
	title: "Computer Science Society",
	description: "We write future through coding..",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={ubuntu.className}>
			<ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem	
            disableTransitionOnChange
          >
				<Toaster />
				{children}
				</ThemeProvider>
			</body>
		</html>
	);
}
