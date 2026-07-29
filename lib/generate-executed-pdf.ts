/** Client-side PDF capture from a hidden LegacyProposalPDF DOM node. */
export async function generateExecutedProposalPdf(
  elementId = "legacy-proposal-pdf"
): Promise<string | null> {
  const element = document.getElementById(elementId);
  if (!element) return null;

  const html2canvas = (await import("html2canvas")).default;
  const { jsPDF } = await import("jspdf");

  // Ensure logo/signature images are fully loaded before capturing,
  // otherwise html2canvas renders them blank.
  const images = Array.from(element.querySelectorAll("img"));
  await Promise.all(
    images.map((img) =>
      img.complete
        ? Promise.resolve()
        : new Promise<void>((resolve) => {
            img.onload = () => resolve();
            img.onerror = () => resolve();
          })
    )
  );

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: "#ffffff",
  });

  const imgData = canvas.toDataURL("image/jpeg", 0.92);
  const pdf = new jsPDF("p", "mm", "a4");
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const imgHeight = (canvas.height * pageWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position = 0;

  pdf.addImage(imgData, "JPEG", 0, position, pageWidth, imgHeight);
  heightLeft -= pageHeight;

  while (heightLeft > 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, "JPEG", 0, position, pageWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  return pdf.output("datauristring");
}
