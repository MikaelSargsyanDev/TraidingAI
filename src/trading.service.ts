import Alpaca from '@alpacahq/alpaca-trade-api';
import { Injectable } from '@nestjs/common';

const alpaca = new Alpaca({
  keyId: process.env.ALPACA_KEY,
  secretKey: process.env.ALPACA_SECRET,
  paper: true,
});

@Injectable()
export class TradingService {
  async getAccount() {
    return await alpaca.getAccount();
  }

  async getAssets(aiStocks) {
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

  async buyStock(symbol, quantity) {
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
}
