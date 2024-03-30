import JSONRenderer from "@/utils/JSONRenderer";
import MarkdownRenderer from "@/utils/MarkdownRenderer";
import { START_URL } from "@/utils/constant";
import DocViewer, {
	DocViewerRenderers,
	IDocument,
} from "@cyntler/react-doc-viewer";
import { ChangeEvent, useRef, useState } from "react";
import toast from "react-hot-toast";

const RAGFileUploadColumn = () => {
	const [ingesting, setIngesting] = useState<boolean>(false);
	const [files, setFiles] = useState<File[]>([]);
	const [fileURLs, setFileURLs] = useState<IDocument[]>([]);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
		let inputFiles: FileList;
		if (event.target.files !== null) {
			inputFiles = event.target.files;
		} else {
			return;
		}

		const validFiles: File[] = Array.from(inputFiles);

		if (validFiles) {
			// Display the PDF when a file is selected
			setFiles([...validFiles]);
			var inputFileURLs: IDocument[] = [];
			validFiles.forEach((validFile) => {
				var validFileType = validFile.name.split(".").slice(-1)[0];
				if (validFile.type.length === 0 && validFileType === "md") {
					validFileType = "text/markdown";
				} else {
					validFileType = validFile.type;
				}
				inputFileURLs.push({
					uri: URL.createObjectURL(validFile),
					fileName: validFile.name,
					fileType: validFileType,
				});
			});
			console.log(inputFileURLs);
			setFileURLs([...inputFileURLs]);
		} else {
			setFiles([]);
			setFileURLs([]);
		}
	};

	const handleUpload = async () => {
		setIngesting(true);
		try {
			const formData = new FormData();
			files.forEach((file) => formData.append("files", file));

			const response = await fetch(`${START_URL}/ingest`, {
				method: "POST",
				body: formData,
			});

			if (response.ok) {
				toast.success("Files uploaded successfully");
				setIngesting(false);
			} else {
				const errorData = await response.json();
				console.log(errorData);
				toast.error("Error uploading File:", errorData);
				setIngesting(false);
			}
		} catch (error) {
			toast.error("Error uploading File");
			setIngesting(false);
		}
	};

	const clearInputs = () => {
		setFileURLs([]);
		setFiles([]);
		fileInputRef.current!.value = "";
	};

	return (
		<div className="bg-white w-1/2 rounded-xl p-4 flex flex-col">
			<div className="flex justify-around">
				<label className="sr-only">Upload Files</label>
				<input
					multiple
					ref={fileInputRef}
					type="file"
					accept=".pdf, .md, .txt, .docx, .doc, .xls, .csv, .xlsx, .json, .epub"
					onChange={handleFileChange}
					className="border border-gray-200 shadow-sm rounded-lg text-sm focus:ring-none 
								disabled:opacity-50 disabled:pointer-events-none file:border-0 file:me-4 file:py-2 file:px-4 file:h-full 
								file:bg-orange-600 file:text-white  hover:file:bg-orange-700 disabled:bg-orange-950"
				/>
				<button
					className="bg-orange-500 py-2 px-4 rounded hover:bg-orange-600 focus:outline-none focus:shadow-outline-orange flex text-white"
					disabled={ingesting}
					onClick={handleUpload}
				>
					{!ingesting ? (
						<>
							<span>Upload File</span>
						</>
					) : (
						<>
							<div className="w-4 h-4 border-2 border-dashed rounded-full animate-spin border-white my-auto"></div>
							<span className="pl-2">Uploading</span>
						</>
					)}
				</button>
				{fileURLs.length > 0 && (
					<button onClick={clearInputs}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							x="0px"
							y="0px"
							width="40"
							height="40"
							viewBox="0 0 50 50"
							stroke="orange"
						>
							<path d="M 25 2 C 12.309534 2 2 12.309534 2 25 C 2 37.690466 12.309534 48 25 48 C 37.690466 48 48 37.690466 48 25 C 48 12.309534 37.690466 2 25 2 z M 25 4 C 36.609534 4 46 13.390466 46 25 C 46 36.609534 36.609534 46 25 46 C 13.390466 46 4 36.609534 4 25 C 4 13.390466 13.390466 4 25 4 z M 32.990234 15.986328 A 1.0001 1.0001 0 0 0 32.292969 16.292969 L 25 23.585938 L 17.707031 16.292969 A 1.0001 1.0001 0 0 0 16.990234 15.990234 A 1.0001 1.0001 0 0 0 16.292969 17.707031 L 23.585938 25 L 16.292969 32.292969 A 1.0001 1.0001 0 1 0 17.707031 33.707031 L 25 26.414062 L 32.292969 33.707031 A 1.0001 1.0001 0 1 0 33.707031 32.292969 L 26.414062 25 L 33.707031 17.707031 A 1.0001 1.0001 0 0 0 32.990234 15.986328 z"></path>
						</svg>
					</button>
				)}
			</div>
			<div className="h-full">
				{fileURLs.length === 0 ? (
					<div className="h-full bg-orange-50 rounded-xl my-2 border text-center flex">
						{" "}
						<span className="m-auto text-md">
							Only .pdf, .md, .json, .txt, .docx, .xlsx, .epub,
							and .csv are accepted
						</span>
					</div>
				) : (
					<div className="my-2 rounded-xl h-full">
						<DocViewer
							documents={fileURLs}
							initialActiveDocument={fileURLs[0]}
							pluginRenderers={[
								...DocViewerRenderers,
								MarkdownRenderer,
								JSONRenderer,
							]}
							config={{
								header: {
									disableHeader: false,
									disableFileName: false,
									retainURLParams: false,
								},
							}}
						/>
					</div>
				)}
			</div>
		</div>
	);
};

export default RAGFileUploadColumn;
