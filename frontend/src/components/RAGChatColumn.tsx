import { START_URL } from "@/utils/constant";
import { Chat } from "@/utils/types";
import { useCallback, useState } from "react";
import toast from "react-hot-toast";

const RAGChatColumn = () => {
	const [userMessage, setUserMessage] = useState<string>("");
	const [chatHistory, setChatHistory] = useState<Chat[]>([]);
	const [loading, setLoading] = useState<boolean>(false);

	function handleEnterKeyDown(
		event: React.KeyboardEvent<HTMLTextAreaElement>
	): void {
		if (event.key === "Enter" && !event.shiftKey) {
			event.preventDefault();
			if (!loading) handleSendMessage();
		}
	}

	const handleSendMessage = useCallback(async () => {
		if (!userMessage.trim()) {
			toast.error("User Message is Empty");
			return;
		}

		setLoading(true);
		const query = userMessage.trim();
		setUserMessage("");
		setChatHistory([...chatHistory, { role: "user", content: query }]);

		try {
			const response = await fetch(`${START_URL}/chat`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ prompt: query }),
			});

			if (!response.ok) {
				throw new Error("Server responded with an error.");
			}

			const botMessage = await response.json();
			console.log(botMessage);
			setChatHistory((prev) => [
				...prev,
				{ content: botMessage.response, role: "ai" },
			]);
		} catch (error) {
			console.error("Error sending message:", error);
			toast.error("Error sending message");
		} finally {
			setLoading(false);
		}
	}, [userMessage, chatHistory]);

	return (
		<div className="bg-white w-1/2 rounded-xl p-4 flex flex-col gap-2">
			<span className=" text-center font-semibold text-gray-800">
				Chat with Documents
			</span>
			<div className="h-full overflow-y-auto overflow-x-hidden p-2 bg-orange-50 rounded-xl border scrollbar-thumb-black scrollbar-track-orange-200 scrollbar-thin scrollbar-track-rounded-full scrollbar-thumb-rounded">
				{chatHistory.length === 0 && (
					<div className="flex justify-center items-center h-full">
						<p className="text-center">Chats will appear here</p>
					</div>
				)}
				{chatHistory.length !== 0 &&
					chatHistory.map((message, index) => (
						<div
							key={index}
							className={`${
								message.role === "user"
									? "bg-orange-200 text-orange-800"
									: "bg-amber-200 text-amber-800 text-wrap"
							} p-2 my-2 w-full rounded-md shadow-sm`}
						>
							<p className="whitespace-pre-wrap">
								{message.content!.trim()}
							</p>
						</div>
					))}
			</div>
			<div className="h-fit flex border rounded-xl">
				<textarea
					value={userMessage}
					readOnly={loading}
					onKeyDown={handleEnterKeyDown}
					onChange={(e) => setUserMessage(e.target.value)}
					placeholder="Type your message..."
					className="rounded-l-lg p-2 w-full bg-slate-100 focus:outline-none resize-none disabled:placeholder:text-gray-300 tracking-[0.000625em]"
				/>
				<button
					onClick={handleSendMessage}
					className="p-2 bg-orange-500 text-white rounded-r-lg disabled:cursor-not-allowed disabled:bg-gray-300"
					disabled={loading}
				>
					{loading ? (
						<div className="w-6 h-6 border-2 border-dashed rounded-full animate-spin border-gray-100 my-auto"></div>
					) : (
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={1.5}
							stroke="currentColor"
							className="w-6 h-6"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
							/>
						</svg>
					)}
				</button>
			</div>
		</div>
	);
};

export default RAGChatColumn;
