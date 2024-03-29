"use client";
import { motion } from "framer-motion";
import { Sriracha } from "next/font/google";
import Link from "next/link";

// Assuming Sriracha font setup is correct
const sriracha = Sriracha({
	weight: ["400"],
	subsets: ["latin", "thai", "latin-ext"],
	display: "swap",
});

export default function Home() {
	return (
		<motion.div
			className="mb-2 mx-1 p-4 bg-[url('/images/hero.jpg')] text-black rounded-xl bg-cover bg-center bg-no-repeat h-full flex select-none"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{
				duration: 5,
				ease: "anticipate",
				type: "spring",
			}}
		>
			<div className="text-black flex justify-center items-center mx-auto w-2/3 flex-col">
				<motion.div className="flex flex-col text-8xl text-center gap-8 mt-4">
					<motion.span
						initial={{ opacity: 0, scale: 0.1 }}
						animate={{ opacity: 1, scale: 1.2 }}
						transition={{ duration: 2, delay: 0.8, type: "tween" }}
					>
						{" "}
						Introducting{" "}
					</motion.span>
					<motion.span
						className={`${sriracha.className} text-[10rem] text-orange-500 mt-4 shadow-green-600`}
						initial={{ opacity: 0, translateY: 50 }}
						animate={{ opacity: 1, translateY: 0 }}
						transition={{
							duration: 2,
							delay: 1.5,
							ease: "anticipate",
							type: "spring",
						}}
					>
						{" "}
						<Link href="/rag">RAGChat</Link>
					</motion.span>
				</motion.div>
				<motion.span
					className="text-white w-2/3 text-center text-xl mt-4 p-2"
					initial={{ opacity: 0, scale: 0.1 }}
					animate={{ opacity: 1, scale: 1.2 }}
					transition={{ duration: 1.5, delay: 1, type: "tween" }}
				>
					Powered by{" "}
					<Link
						rel="noopener noreferrer"
						target="_blank"
						href={
							"https://python.langchain.com/docs/get_started/introduction"
						}
						className="underline"
					>
						Langchain
					</Link>
				</motion.span>
			</div>
		</motion.div>
	);
}
