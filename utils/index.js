export function downloadBase64Pdf(base64Data, filename = "file.pdf") {
  const link = document.createElement("a");
  link.href = base64Data; // this is already in data URI format
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}