import { DocRenderer } from "@cyntler/react-doc-viewer";

const DocxRenderer: DocRenderer = ({ mainState: { currentDocument } }) => {
	if (!currentDocument) return null;

	return (
		<iframe
			className="docx"
			width="100%"
			height="600"
			src={`https://docs.google.com/gview?url=${currentDocument.uri}&embedded=true`}
		></iframe>
	);
};

DocxRenderer.fileTypes = [
	"docx",
	"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
DocxRenderer.weight = 1;

export default DocxRenderer;
