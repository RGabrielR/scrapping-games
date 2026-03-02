/**
 * Fetches the current blue market USD → ARS sell rate from Bluelytics.
 * @returns {Promise<number>}
 */
export const fetchBlueUsdRate = async () => {
  const data = await fetch("https://api.bluelytics.com.ar/v2/latest").then(
    (r) => r.json()
  );
  return parseInt(data.blue.value_sell);
};

/**
 * Converts a USD amount to ARS using the current blue rate.
 * @param {number} usdAmount
 * @returns {Promise<number>}
 */
export const usdToArs = async (usdAmount) => {
  const rate = await fetchBlueUsdRate();
  return usdAmount * rate;
};
