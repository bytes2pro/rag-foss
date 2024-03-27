import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
	weight: ["400"],
	subsets: ["latin", "cyrillic"],
	display: "swap",
});

export const metadata: Metadata = {
	title: "RAGChat",
	description: "A powerful RAG AI chatbot powered by AutoLLM Framework",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body className={`${montserrat.className} bg-zinc-200`}>
				<main className="flex flex-col h-screen max-h-screen gap-2">
					<Navbar />
					{children}
				</main>
				<Footer />
			</body>
		</html>
	);
}
