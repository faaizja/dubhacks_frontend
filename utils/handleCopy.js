export const handleCopy = async (textToCopy, showAlert) => {
  try {
    await navigator.clipboard.writeText(textToCopy);
    showAlert("Copied to clipboard!", "success");
  } catch (err) {
    showAlert("Failed to copy: ", "error");
  }
};
