export const fetchBlueUsdRate = async (): Promise<number> => {
  const data = await fetch("https://api.bluelytics.com.ar/v2/latest").then(
    (r) => r.json()
  );
  return parseInt(data.blue.value_sell);
};

export const usdToArs = async (usdAmount: number): Promise<number> => {
  const rate = await fetchBlueUsdRate();
  return usdAmount * rate;
};
