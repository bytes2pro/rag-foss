"use client";

import RAGChatColumn from "@/components/RAGChatColumn";
import RAGFileUploadColumn from "@/components/RAGFileUploadColumn";
import { Toaster } from "react-hot-toast";

const Home = () => {
	return (
		<div className="flex-1 flex rounded-xl gap-2 overflow-y-auto mb-2 mx-1">
			<Toaster position="top-center" reverseOrder={false} />
			<RAGFileUploadColumn />
			<RAGChatColumn />
		</div>
	);
};

export default Home;
