const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const cors = require("cors");

const app = express();
app.use(cors());

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.get("/fetchPrice", async (req, res) => {
  const url = req.query.url;
  const priceClassSelector = req.query.priceClassSelector;
  const priceClassSelectorAlt = req.query.priceClassSelectorAlt;
  const priceSymbol = req.query.priceSymbol;
  try {
    const response = await axios.get(url);
    const html = response.data;

    const $ = cheerio.load(html);
    const data = [];
    $(`${priceClassSelector}`).each((index, element) => {
      data.push({
      text: $(element).text()
      });
    });

    if (data.length === 0 && priceClassSelectorAlt) {
      $(`${priceClassSelectorAlt}`).each((index, element) => {
        data.push({
        text: $(element).text()
        });
      });
    }

    let price = data[0].text.replace(/,| /g, '')

    if (priceSymbol) {
      const priceSplit = price.split(priceSymbol);
      price = priceSplit[0]
      if (!price) {
        price = priceSplit[1];
      }
    }

    const hasPrice = !isNaN(price);
    
    res.status(200).json({ hasPrice: hasPrice, price: price });

  } catch (error) {
    res.status(500).json({ message: error });
  }
});
