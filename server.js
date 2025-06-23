 const express = require('express');
const axios = require('axios');
const app = express();

const PORT = process.env.PORT || 3000;
const SERP_API_KEY = '1f97486f32421467619fa34ff931be824600f16e678014628b620bdf0d9f4411'; // ← Udskift med din egen nøgle

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.render('form');
});

app.post('/check', async (req, res) => {
  const { keyword, domain } = req.body;

  try {
    const response = await axios.get('https://serpapi.com/search', {
      params: {
        q: keyword,
        engine: 'google',
        api_key: SERP_API_KEY,
        num: 100,
        google_domain: 'google.com' // eller 'google.dk'
      }
    });

    const results = response.data.organic_results || [];

    const positions = results
      .map(r => ({ position: r.position, link: r.link }))
      .filter(r => r.link.includes(domain));

    const best = positions.length ? `#${positions[0].position}` : 'Ikke fundet';

    res.render('result', {
      keyword,
      domain,
      position: best
    });

  } catch (error) {
    console.error('Fejl:', error.message);
    res.status(500).send(`<h3>Der opstod en fejl:</h3><pre>${error.message}</pre>`);
  }
});

app.listen(PORT, () => console.log(`Server kører på port ${PORT}`));
