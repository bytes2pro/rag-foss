import { DocRenderer } from "@cyntler/react-doc-viewer";

const MarkdownRenderer: DocRenderer = ({ mainState: { currentDocument } }) => {
	if (!currentDocument) return null;

	return (
		<embed
			src={currentDocument.uri}
			type="text/markdown"
			className="w-full h-full"
		/>
	);
};

MarkdownRenderer.fileTypes = ["md", "text/markdown"];
MarkdownRenderer.weight = 1;

export default MarkdownRenderer;
