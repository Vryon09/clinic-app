export const dataURLToFile = (dataUrl: string, fileName: string): File => {
  const [header, base64] = dataUrl.split(",");

  const mime = header.match(/:(.*?);/)?.[1] || "image/png";

  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  const blob = new Blob([bytes], { type: mime });

  return new File([blob], fileName, { type: mime });
};
