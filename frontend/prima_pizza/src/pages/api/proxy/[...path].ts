import { NextApiRequest, NextApiResponse } from 'next';
import httpProxyMiddleware from 'next-http-proxy-middleware';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const target = 'http://localhost:5005';
  
  return httpProxyMiddleware(req, res, {
    target,
    changeOrigin: true,
    pathRewrite: [{
      patternStr: '^/api/proxy',
      replaceStr: ''
    }],
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': 'false'
    }
  });
}
