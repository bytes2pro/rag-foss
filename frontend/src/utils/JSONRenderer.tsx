import { DocRenderer } from "@cyntler/react-doc-viewer";

const JSONRenderer: DocRenderer = ({ mainState: { currentDocument } }) => {
	if (!currentDocument) return null;

	return (
		<embed
			src={currentDocument.uri}
			type="application/json"
			className="w-full h-full"
		/>
	);
};

JSONRenderer.fileTypes = ["json", "application/json"];
JSONRenderer.weight = 1;

export default JSONRenderer;
