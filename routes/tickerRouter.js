if (require.main === module) {
  require('dotenv').config()
}

const express = require('express')
const axios = require('axios')
const config = require('../config')

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const { data } = await axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest', {
      headers: {
        'X-CMC_PRO_API_KEY': config.COIN_MARKET_CAP_KEY,
      },
    })
    res.send({ tickers: data })
  } catch (err) {
    console.error(err)
  }
})

module.exports = {
  router
}
