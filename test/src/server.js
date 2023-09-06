const express = require('express');
const app = express();
const port = process.env.PORT || 8082;
const axios = require('axios');

app.use(express.json());

app.disable("x-powered-by");
const gatewayKey = "";
if (gatewayKey.length < 1)
  throw Error("Gateway key required");
const validPaths = ['verifyjson', 'gatewayjson'];
app.post('/api/:path', async (req, res) => {
  console.log(req.body);
  if (validPaths.includes(req.params.path.toLowerCase())) {
    const gatewayResp = await axios.post('https://x1.cardknox.com/' + req.params.path, { ...req.body, xKey: gatewayKey });
    console.log(gatewayResp.data);
    res.json(gatewayResp.data);
  } else
    res.sendStatus(400);
});

app.listen(port, () => {
  console.log(`Server listening on the port::${port}`);
});