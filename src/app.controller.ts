import { Controller, Get, Param, Res } from '@nestjs/common';
import { AiService } from './ai.service';
import { TradingService } from './trading.service';

@Controller()
export class AppController {
  constructor(
    private readonly aiService: AiService,
    private readonly trader: TradingService,
  ) {}

  @Get('getAccount')
  async getAccount(@Res() res) {
    const account = await this.trader.getAccount();
    res.send({ account });
  }

  @Get('getAIStocks/:twitterPage')
  async getAIStocks(@Res() res, @Param() params) {
    const { phraseToComplete, data: aiResponse } =
      await this.aiService.getAIResponse(params.twitterPage);
    const aiStocks = aiResponse.choices[0].text.match(/\b[A-Z]+\b/g);

    const assets = await this.trader.getAssets(aiStocks);

    res.send({ phraseToComplete, assets });
  }

  @Get('buyStock/:symbol/:quantity')
  async buyStock(@Res() res, @Param() params) {
    const { symbol, quantity } = params;
    const order = await this.trader.buyStock(symbol, quantity);

    res.send({ order });
  }
}
