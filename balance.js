
const fetch = require("node-fetch");

module.exports = async (req, res) => {
  const { address, token } = req.query;
  if (!address) return res.status(400).json({ error: "Missing address" });

  const rpcUrl = "https://api.mainnet.abs.xyz";
  const usdtAddress = "0xdAC17F958D2ee523a2206206994597C13D831ec7";

  try {
    const payload = token === "usdt"
      ? {
          jsonrpc: "2.0",
          method: "eth_call",
          params: [{
            to: usdtAddress,
            data: "0x70a08231000000000000000000000000" + address.slice(2)
          }, "latest"],
          id: 1
        }
      : {
          jsonrpc: "2.0",
          method: "eth_getBalance",
          params: [address, "latest"],
          id: 1
        };

    const response = await fetch(rpcUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const json = await response.json();
    res.status(200).json({ balance: json.result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
