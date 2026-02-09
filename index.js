const express = require("express");
const fetch = require("node-fetch");

const app = express();
const port = process.env.PORT || 8080;

// Homepage
app.get("/", function (req, res) {
  res.send(
    "<html>" +
      "<head><title>Smart Contract Verifier</title></head>" +
      "<body>" +
      "<h1>Smart Contract Verifier</h1>" +
      '<input id="contract" placeholder="Paste contract address" />' +
      '<button onclick="checkContract()">Check</button>' +
      '<p id="result"></p>' +
      "<script>" +
      "async function checkContract() {" +
      "  var address = document.getElementById('contract').value;" +
      "  var response = await fetch('/check?address=' + address);" +
      "  var data = await response.json();" +
      "  document.getElementById('result').innerText = data.result;" +
      "}" +
      "</script>" +
      "</body>" +
      "</html>"
  );
});

// API route
app.get("/check", async function (req, res) {
  try {
    var address = req.query.address;

    var response = await fetch(
      "https://api.bscscan.com/api?module=contract&action=getsourcecode&address=" +
        address +
        "&apikey=P9ENI2P3363E537WCRFRCF896D415YWDXV"
    );

    var data = await response.json();

    if (!data.result || !data.result[0]) {
      return res.json({ result: "Invalid Contract" });
    }

    var source = data.result[0].SourceCode || "";

    var risk = 0;

    if (source.includes("mint(")) risk += 30;
    if (source.includes("blacklist")) risk += 30;
    if (source.includes("owner")) risk += 20;

    var result = "Low Risk";
    if (risk >= 60) result = "High Risk";
    else if (risk >= 30) result = "Medium Risk";

    res.json({ result: result });
  } catch (error) {
    res.json({ result: "Error checking contract" });
  }
});

app.listen(port, function () {
  console.log("Server running on port " + port);
});
