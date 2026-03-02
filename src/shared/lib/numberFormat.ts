export const formatThousands = (value: string): string => {
  if (!value) return "";
  const plain = String(value).replace(/[^0-9]/g, "").replace(/^0+/, "");
  return plain.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

export const parseFormattedNumber = (formatted: string): number =>
  parseFloat(String(formatted).replaceAll(".", ""));
