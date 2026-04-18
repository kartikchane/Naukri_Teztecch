/**
 * Utility function to get the correct URL for downloading/viewing files
 * @param {string} filePath - The file path (e.g., 'uploads/resume-xxx.pdf')
 * @returns {string} - The full URL for the file
 */
export const getFileUrl = (filePath) => {
  if (!filePath) return '';

  // If it's already a full URL, return as is
  if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
    return filePath;
  }

  // Get the base URL from API URL by removing /api suffix
  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';
  const baseUrl = apiUrl.replace('/api', '');

  // Return the full file URL
  return `${baseUrl}/${filePath}`;
};
