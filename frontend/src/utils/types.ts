import { IDocument } from "@cyntler/react-doc-viewer";
import {
	ChangeEventHandler,
	Dispatch,
	KeyboardEventHandler,
	MouseEventHandler,
	RefObject,
	SetStateAction,
} from "react";

export type Chat = {
	role: "user" | "ai";
	content: string;
};

export interface RAGFileUploadInterface {
	fileInputRef: RefObject<HTMLInputElement>;
	handleFileChange: ChangeEventHandler<HTMLInputElement>;
	ingesting: boolean;
	handleUpload: MouseEventHandler<HTMLButtonElement>;
	fileURLs: IDocument[];
}

export interface RAGChatColumnInterface {
	chatHistory: Chat[];
	userMessage: string;
	handleEnterKeyDown: KeyboardEventHandler<HTMLTextAreaElement>;
	setUserMessage: Dispatch<SetStateAction<string>>;
	handleSendMessage: MouseEventHandler<HTMLButtonElement>;
	loading: boolean;
}
