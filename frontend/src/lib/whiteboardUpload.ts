import type { Editor } from "@tldraw/tldraw";
import { AssetRecordType, createShapeId } from "@tldraw/tldraw";

export async function pdfToImages(
  file: File
): Promise<{ dataUrl: string; width: number; height: number }[]> {
  const pdfjsLib = await import("pdfjs-dist");
  pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const pages: { dataUrl: string; width: number; height: number }[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 1.5 });
    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext("2d")!;
    await page.render({ canvasContext: ctx, viewport, canvas }).promise;
    pages.push({ dataUrl: canvas.toDataURL("image/png"), width: viewport.width, height: viewport.height });
  }
  return pages;
}

export async function insertImagesIntoTldraw(
  editor: Editor,
  images: { dataUrl: string; width: number; height: number }[]
) {
  const GAP = 24;
  let yOffset = 0;

  for (const { dataUrl, width, height } of images) {
    const assetId = AssetRecordType.createId();
    editor.createAssets([{
      id: assetId,
      type: "image",
      typeName: "asset",
      props: { src: dataUrl, name: "page", w: width, h: height, mimeType: "image/png", isAnimated: false },
      meta: {},
    }]);
    editor.createShape({
      id: createShapeId(),
      type: "image",
      x: 0,
      y: yOffset,
      props: { assetId, w: width, h: height },
    });
    yOffset += height + GAP;
  }

  editor.zoomToFit();
}
