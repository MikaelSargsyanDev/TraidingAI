import { createApp } from 'https://unpkg.com/petite-vue?module';

createApp({
  url: '',
  assets: [],
  loading: false,
  account: {},
  phrase: '',
  lastOrder: null,

  getQuantity(asset) {
    return document.getElementById(`input-${asset.symbol}`).value;
  },
  resetQuantity(asset) {
    document.getElementById(`input-${asset.symbol}`).value = 0;
  },

  async getAccount() {
    const response = await fetch('getAccount');
    const { account } = await response.json();
    this.account = account;
  },

  async getAssets() {
    this.assets = [];
    this.phrase = '';
    this.loading = true;
    const twitterPage = this.url.split('/').at(-1);
    this.url = '';
    while (this.assets.length == 0) {
      const response = await fetch(`getAIStocks/${twitterPage}`);
      const data = await response.json();
      this.assets = data.assets ?? [];
      this.phrase = data.phraseToComplete;
    }
    this.loading = false;
  },

  async buyStocks(asset) {
    const quantity = this.getQuantity(asset);
    if (quantity <= 0) return;

    this.resetQuantity(asset);

    const response = await fetch(`buyStock/${asset.symbol}/${quantity}`);
    await this.getAccount();

    const data = await response.json();
    this.lastOrder = data.order;

    let orderNotification = document.getElementById('orderNotification');

    orderNotification.classList.remove('fade-out-text');
    orderNotification.classList.add('fade-in-text');

    setTimeout(() => {
      orderNotification.classList.replace('fade-in-text', 'fade-out-text');
    }, 8000);
    setTimeout(() => {
      this.lastOrder = null;
    }, 15000);
  },

  filters: {
    number: function (value) {
      return Math.round(+value);
    },
  },
}).mount();
