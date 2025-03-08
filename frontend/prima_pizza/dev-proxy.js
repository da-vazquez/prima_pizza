const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
const port = 3001;

// Enable CORS
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// Proxy all requests to the backend
app.use('/api', createProxyMiddleware({
  target: 'http://localhost:5005',
  changeOrigin: true,
  pathRewrite: {'^/api': '/api'},
  onProxyRes: (proxyRes, req, res) => {
    // Add CORS headers to the proxied response
    proxyRes.headers['Access-Control-Allow-Origin'] = 'http://localhost:3000';
    proxyRes.headers['Access-Control-Allow-Credentials'] = 'true';
  }
}));

app.listen(port, () => {
  console.log(`Dev proxy running at http://localhost:${port}`);
});