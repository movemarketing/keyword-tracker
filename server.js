const express = require('express');
const axios = require('axios');
const app = express();

const PORT = process.env.PORT || 3000;
const API_KEY = 'fd36552b-4d6a-4f9b-9e38-9f130b2eba6c'; // direkte indsat API-nøgle

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.render('form');
});

app.post('/check', async (req, res) => {
  const { keyword, domain } = req.body;

  try {
    const response = await axios.post('https://api.scrapingrobot.com/', {
      url: `https://www.google.com/search?q=${encodeURIComponent(keyword)}`,
      module: 'GoogleSearch'
    }, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY
      }
    });

    console.log('API response received.');

    const html = response.data.result;
    if (!html) {
      throw new Error("Tomt HTML-resultat fra ScrapingRobot.");
    }

    const regex = new RegExp(`https?://(www\\.)?${domain.replace('.', '\\.')}`, 'gi');
    const matches = [...html.matchAll(regex)];

    const position = matches.length
      ? `#${html.substr(0, matches[0].index).split('://').length}`
      : 'Ikke fundet';

    res.render('result', { keyword, domain, position });

  } catch (error) {
    console.error('Fejl:', error.message);
    res.status(500).send(`<h3>Der opstod en fejl:</h3><pre>${error.message}</pre>`);
  }
});

app.listen(PORT, () => console.log(`Server kører på port ${PORT}`));
