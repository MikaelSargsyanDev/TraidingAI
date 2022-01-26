const puppeteer = require('puppeteer');

const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
  apiKey: process.env.AI_KEY,
});

async function getTweets(twitterPage) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(`https://twitter.com/${twitterPage}`, { waitUntil: 'networkidle2' });

  await page.waitForTimeout(3000);

  // await page.screenshot({ path: 'example.png' });

  const { username, tweets } = await page.evaluate(async () => {
    const username = document.querySelector(
      '#react-root > div > div > div.css-1dbjc4n.r-18u37iz.r-13qz1uu.r-417010 > main > div > div > div > div.css-1dbjc4n.r-14lw9ot.r-jxzhtn.r-1ljd8xs.r-13l2t4g.r-1phboty.r-1jgb5lz.r-11wrixw.r-61z16t.r-1ye8kvj.r-13qz1uu.r-184en5c > div > div:nth-child(2) > div > div > div:nth-child(1) > div > div.css-1dbjc4n.r-6gpygo.r-14gqq1x > div > div > div.css-1dbjc4n.r-1awozwy.r-18u37iz.r-dnmrzs > div > span:nth-child(1) > span'
    ).innerText;
    const tweets = document.body.innerText;
    return { username, tweets };
  });

  await browser.close();

  return { tweets, username };
}

async function getAIResponse(twitterPage) {
  const { tweets, username } = await getTweets(twitterPage);

  const openai = new OpenAIApi(configuration);

  const phraseToComplete = `${username} recommands buying the following stock tickers: `;

  const response = await openai.createCompletion('text-davinci-001', {
    prompt: `${tweets}. ${phraseToComplete}`,
    max_tokens: 32,
    temperature: 0.7,
  });

  return { phraseToComplete, data: response.data };
}

module.exports = { getAIResponse };
