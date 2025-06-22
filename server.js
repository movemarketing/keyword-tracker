const express = require('express');
const axios = require('axios');
const app = express();

const PORT = process.env.PORT || 3000;
const API_KEY = process.env.SCRAPINGROBOT_KEY;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => res.render('form'));

app.post('/check', async (req, res) => {
  const { keyword, domain } = req.body;
  const response = await axios.post('https://api.scrapingrobot.com/', {
    url: `https://www.google.com/search?q=${encodeURIComponent(keyword)}`,
    module: 'GoogleSearch'
  }, {
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY
    }
  });
  const html = response.data.result;
  const regex = new RegExp(`https?://(www\.)?${domain.replace('.', '\.')}`, 'gi');
  const matches = [...html.matchAll(regex)];
  const position = matches.length ? `#${html.substr(0, matches[0].index).split('://').length}` : 'Ikke fundet';
  res.render('result', { keyword, domain, position });
});

app.listen(PORT, () => console.log(`Server kører på port ${PORT}`));
