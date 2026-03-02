/**
 * Formats a number string with dot thousands separators.
 * Strips non-numeric characters and leading zeros.
 * @param {string} value
 * @returns {string} e.g. "1234567" → "1.234.567"
 */
export const formatThousands = (value) => {
  if (!value) return "";
  const plain = String(value).replace(/[^0-9]/g, "").replace(/^0+/, "");
  return plain.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

/**
 * Parses a dot-formatted number string back to a float.
 * @param {string} formatted - e.g. "1.234.567"
 * @returns {number}
 */
export const parseFormattedNumber = (formatted) =>
  parseFloat(String(formatted).replaceAll(".", ""));
