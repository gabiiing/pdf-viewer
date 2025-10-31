import { useEffect, useRef, useState } from "react";

export default function Home() {
  const canvasRef = useRef(null);
  const [pdfDoc, setPdfDoc] = useState(null);
  const [pageNum, setPageNum] = useState(1);
  const [pageCount, setPageCount] = useState(0);

  const PDF_URL = "/ivenue.pdf"; // file dari /public/

  useEffect(() => {
    // ✅ Jalankan hanya di browser, bukan di server
    if (typeof window === "undefined") return;

    const loadPdf = async () => {
      // Lazy load pdfjs-dist hanya di browser
      const pdfjsLib = await import("pdfjs-dist/build/pdf");
      pdfjsLib.GlobalWorkerOptions.workerSrc =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js";

      try {
        const doc = await pdfjsLib.getDocument(PDF_URL).promise;
        setPdfDoc(doc);
        setPageCount(doc.numPages);
        renderPage(doc, pageNum);
      } catch (err) {
        console.error("Error loading PDF:", err);
      }
    };

    const renderPage = async (doc, num) => {
      const page = await doc.getPage(num);
      const viewport = page.getViewport({ scale: 1.4 });
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      await page.render({ canvasContext: context, viewport }).promise;
    };

    loadPdf();
  }, [pageNum]);

  const nextPage = () => {
    if (pdfDoc && pageNum < pageCount) setPageNum(pageNum + 1);
  };
  const prevPage = () => {
    if (pdfDoc && pageNum > 1) setPageNum(pageNum - 1);
  };

  const downloadPDF = () => {
    const link = document.createElement("a");
    link.href = PDF_URL;
    link.download = "ivenue.pdf";
    link.click();
  };

  return (
    <div style={{ background: "#f9fafb", height: "100vh", overflow: "hidden" }}>
      {/* Toolbar */}
      <div
        style={{
          background: "#e60000",
          color: "white",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 16px",
          height: "50px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div>📄 Dokumen iVenue - Pertamina</div>
        <div>
          <button onClick={prevPage}>⬅️ Prev</button>
          <button onClick={nextPage}>➡️ Next</button>
          <button onClick={downloadPDF}>⬇️ Download</button>
        </div>
      </div>

      {/* PDF Canvas */}
      <div
        style={{
          height: "calc(100vh - 50px)",
          overflow: "auto",
          background: "white",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          paddingTop: "10px",
        }}
      >
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
}
