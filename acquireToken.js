import fetch from "node-fetch";
import querystring from "querystring";

import dotenv from "dotenv"; //get env variables 
dotenv.config();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const TOKEN_URL = "https://api.ebay.com/identity/v1/oauth2/token";

export async function getEbayToken() {
  const basicAuth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");

  const body = querystring.stringify({
    grant_type: "client_credentials",
    scope: "https://api.ebay.com/oauth/api_scope"
  });

  const res = await fetch(TOKEN_URL, {  //res is the response object
    method: "POST",
    headers: {
      "Authorization": `Basic ${basicAuth}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body
  });

  if (!res.ok) throw new Error(`Token fetch failed: ${res.status}`);
  const data = await res.json();
  return data.access_token;
}