import { useEffect, useRef, useState } from "react";

export default function Home() {
  const containerRef = useRef(null);
  const [pdfDoc, setPdfDoc] = useState(null);

  const PDF_URL = "/ivenue.pdf"; // file dari /public/

  useEffect(() => {
    if (typeof window === "undefined") return;

    const loadPdf = async () => {
      const pdfjsLib = await import("pdfjs-dist/build/pdf");
      pdfjsLib.GlobalWorkerOptions.workerSrc =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js";

      try {
        const doc = await pdfjsLib.getDocument(PDF_URL).promise;
        setPdfDoc(doc);

        // render semua halaman
        for (let num = 1; num <= doc.numPages; num++) {
          const page = await doc.getPage(num);
          const viewport = page.getViewport({ scale: 1.4 });

          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          canvas.style.display = "block";
          canvas.style.margin = "0 auto 40px"; // jarak antar halaman
          await page.render({ canvasContext: context, viewport }).promise;

          containerRef.current.appendChild(canvas);
        }

        // Tambahkan margin bawah besar agar tidak mentok
        const spacer = document.createElement("div");
        spacer.style.height = "200px"; // margin bawah tambahan
        containerRef.current.appendChild(spacer);
      } catch (err) {
        console.error("Error loading PDF:", err);
      }
    };

    loadPdf();
  }, []);

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
          <button onClick={downloadPDF}>⬇️ Download</button>
        </div>
      </div>

      {/* PDF Container (scrollable) */}
      <div
        ref={containerRef}
        style={{
          height: "calc(100vh - 50px)",
          overflowY: "auto",
          background: "white",
          padding: "20px 0",
        }}
      ></div>
    </div>
  );
}
