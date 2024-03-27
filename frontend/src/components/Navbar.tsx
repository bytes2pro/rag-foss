// src/app/components/Navbar.tsx
"use client";
import { Sriracha } from "next/font/google";
import Link from "next/link";
import { usePathname } from "next/navigation";

const sriracha = Sriracha({
	weight: ["400"],
	subsets: ["latin", "thai", "latin-ext"],
	display: "swap",
});

const Navbar: React.FC = () => {
	return (
		<div className="w-full flex flex-row p-2 justify-between items-center bg-white text-black rounded-b-xl font-semibold cursor-default">
			<Link href="/">
				<p className={`${sriracha.className} p-2 font-black text-3xl`}>
					RAGChat
				</p>
			</Link>
			<div className="flex gap-4">
				<NavLink href="/rag" label="RAG" />
			</div>
		</div>
	);
};

interface NavLinkProps {
	href: string;
	label: string;
}

const NavLink: React.FC<NavLinkProps> = ({ href, label }) => {
	const router = usePathname();
	const isActive = router === href;

	return (
		<Link href={href} passHref>
			<p
				className={`p-2 rounded-xl ${
					isActive
						? "bg-orange-700 text-white shadow-md shadow-orange-100"
						: "hover:bg-orange-500 hover:text-white"
				}`}
			>
				{label}
			</p>
		</Link>
	);
};

export default Navbar;
