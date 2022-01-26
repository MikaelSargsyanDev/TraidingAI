const Alpaca = require('@alpacahq/alpaca-trade-api');

const alpaca = new Alpaca({
  keyId: process.env.ALPACA_KEY,
  secretKey: process.env.ALPACA_SECRET,
  paper: true,
});

async function getAccount() {
  return await alpaca.getAccount();
}

async function getAssets(aiStocks) {
  let assets = [];

  if (!aiStocks || aiStocks.length == 0) return null;

  for (let i = 0; i < aiStocks.length; i++) {
    try {
      const asset = await alpaca.getAsset(aiStocks[i]);
      assets.push(asset);
    } catch (error) {
      console.log(error);
    }
  }

  return assets;
}

async function buyStock(symbol, quantity) {
  let order;

  try {
    order = await alpaca.createOrder({
      symbol: symbol, // any valid ticker symbol
      qty: quantity,
      side: 'buy',
      type: 'market',
      time_in_force: 'day',
    });
  } catch (error) {
    console.log(error);
  }

  return order;
}

module.exports = { getAssets, buyStock, getAccount };
