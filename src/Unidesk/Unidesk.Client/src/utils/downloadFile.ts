import { BlobWithName } from "@api-client/index";

export const downloadBlob = (blobWithName: BlobWithName) => {
  const href = URL.createObjectURL(blobWithName.data);
  // create "a" HTML element with href to file & click
  const link = document.createElement("a");
  link.href = href;
  link.setAttribute("download", blobWithName.name); //or any other extension
  document.body.appendChild(link);
  link.click();

  // clean up "a" element & remove ObjectURL
  document.body.removeChild(link);
  URL.revokeObjectURL(href);
};
