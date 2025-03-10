const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
const port = 3001;

// Enable CORS
app.use(cors({
  origin: '*',
  credentials: false
}));

// Proxy all requests to the backend
app.use('/api', createProxyMiddleware({
  target: 'http://localhost:5005',
  changeOrigin: true,
  pathRewrite: {'^/api': '/api'},
  onProxyRes: (proxyRes, req, res) => {
    proxyRes.headers['Access-Control-Allow-Origin'] = '*';
    proxyRes.headers['Access-Control-Allow-Credentials'] = 'false';
    console.log('Proxy response headers:', proxyRes.headers);
  }
}));

app.listen(port, () => {
  console.log(`Dev proxy running at http://localhost:${port}`);
});
