const express = require('express');
const app = express(),
  bodyParser = require("body-parser");
const port = process.env.PORT || 8082;
const axios = require('axios');

app.use(express.json());

app.post('/api/:path', async (req, res) => {
  console.log(req.body);
  const gatewayResp = await axios.post('https://x1.cardknox.com/' + req.params.path, req.body);
  console.log(gatewayResp.data);
  res.json(gatewayResp.data);
});

app.listen(port, () => {
  console.log(`Server listening on the port::${port}`);
});