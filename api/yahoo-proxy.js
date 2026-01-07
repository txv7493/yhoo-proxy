export default async function handler(req, res) {
  const { symbol } = req.query;

  if (!symbol) {
    return res.status(400).json({ error: "Missing symbol parameter" });
  }

  const yahooUrl =
    "https://query1.finance.yahoo.com/v10/finance/quoteSummary/" +
    encodeURIComponent(symbol) +
    "?modules=financialData";

  try {
    const response = await fetch(yahooUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
          "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      }
    });

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: "Yahoo request failed", status: response.status });
    }

    const data = await response.json();

    // Optional: direkt nur das Kursziel zurückgeben
    let target = null;
    try {
      target =
        data.quoteSummary.result[0].financialData.targetMeanPrice.raw ?? null;
    } catch (e) {
      target = null;
    }

    return res.status(200).json({
      symbol,
      targetMeanPrice: target,
      raw: data
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Proxy error" });
  }
}
