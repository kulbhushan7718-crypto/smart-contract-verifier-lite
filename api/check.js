export default async function handler(req, res) {
  const { address } = req.query;

  const response = await fetch(
    `https://api.bscscan.com/api?module=contract&action=getsourcecode&address=${address}&apikey=P9ENI2P3363E537WCRFRCF896D415YWDXV`
  );

  const data = await response.json();
  const source = data.result[0].SourceCode;

  let risk = 0;

  if (source.includes("mint(")) risk += 30;
  if (source.includes("blacklist")) risk += 30;
  if (source.includes("owner")) risk += 20;

  let result = "Low Risk";

  if (risk >= 60) result = "High Risk";
  else if (risk >= 30) result = "Medium Risk";

  res.status(200).json({ result });
}
