const express = require('express');
const app = express(),
  bodyParser = require("body-parser");
const port = process.env.PORT || 8082;
const axios = require('axios');

app.use(express.json());

app.disable("x-powered-by");

const validPaths = ['verifyjson', 'gatewayjson'];
app.post('/api/:path', async (req, res) => {
  console.log(req.body);
  if (validPaths.includes(req.params.path.toLowerCase())) {
    const gatewayResp = await axios.post('https://x1.cardknox.com/' + req.params.path, req.body);
    console.log(gatewayResp.data);
    res.json(gatewayResp.data);
  } else
    res.sendStatus(400);
});

app.listen(port, () => {
  console.log(`Server listening on the port::${port}`);
});