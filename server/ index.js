const express = require('express')
const path = require('path')
const cors = require('cors')
const axios = require('axios')
const CoinMarketCap = require('coinmarketcap-api')

require('dotenv').config()


const app = express()
const port = process.env.PORT || 5000
// app.use(express.static(path.join(__dirname, 'build')))

// app.get('/', function(req, res) {
//   res(sendFile(path.join(__dirname, 'build', 'index.html')))
// })

app.get('/api/hello', cors(), (req, res) => {
  const message = 'hello'
  res.json(message)
})

app.get('/api/luna', cors(), async (req, res) => {
  // import cmc api.
  const apiKey = process.env.REACT_APP_CMC_API_KEY
  const client = new CoinMarketCap(apiKey)
  await client.getQuotes({
    symbol: ['LUNA']
  }).then(result => {
    let price = result.data.LUNA.quote.USD.price
    // this logs perfectly
    // res.status(200).send(price)
    console.log(price)
    res.json(price)
  })
  .catch(err => console.log(err))
})

// it listens on 3000 (react frontend) for requests
app.listen(port, () => `server running on port ${port}`)
