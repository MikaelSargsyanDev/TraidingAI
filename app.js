const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

const ai = require('./ai');
const trader = require('./trading');

app.use(express.json());
app.use(express.static(__dirname + '/client'));
app.use(cors());

app.get('/', (req, res) => {
  res.send('Welcome to AI trader API !!!');
});

app.get('/getAccount', async (req, res) => {
  const account = await trader.getAccount();
  res.send({ account });
});

app.get('/getAIStocks/:twitterPage', async (req, res) => {
  const { phraseToComplete, data: aiResponse } = await ai.getAIResponse(
    req.params.twitterPage
  );
  const aiStocks = aiResponse.choices[0].text.match(/\b[A-Z]+\b/g);

  const assets = await trader.getAssets(aiStocks);

  res.send({ phraseToComplete, assets });
});

app.get('/buyStock/:symbol/:quantity', async (req, res) => {
  const { symbol, quantity } = req.params;
  const order = await trader.buyStock(symbol, quantity);

  res.send({ order });
});

const port = process.env.port || 3000;

app.listen(port, () => console.log('Listening on port ' + port));
