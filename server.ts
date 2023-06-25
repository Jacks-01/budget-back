import express, { Express, Request, Response, NextFunction } from 'express';
import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';

import dotenv from 'dotenv';

dotenv.config();

const configuration = new Configuration({
  basePath: PlaidEnvironments.development,
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
      'PLAID-SECRET': process.env.PLAID_SECRET,
    },
  },
});

const app: Express = express();
const port = process.env.PORT;
const client = new PlaidApi(configuration);

app.get('/', (req: Request, res: Response): void => {
  res.send('Express + TypeScript Server');
});

app.use('/get', (req: Request, res: Response): void => {
  const response = await plaidClient.itemPublicTokenExchange({ public_token });
  const access_token = response.data.access_token;
  const accounts_response = await plaidClient.accountsGet({ access_token });
  const accounts = accounts_response.data.accounts;
});


app.post('/api/create_link_token', async function (res: Response, req: Request ) {
  // Get the client_user_id by searching for the current user
  const user = await User.find(...);
  const clientUserId = user.id;
  const request = {
    user: {
      // This should correspond to a unique id for the current user.
      client_user_id: clientUserId,
    },
    client_name: 'Plaid Test App',
    products: ['auth'],
    language: 'en',
    webhook: 'https://webhook.example.com',
    redirect_uri: 'https://domainname.com/oauth-page.html',
    country_codes: ['US'],
  };
  try {
    const createTokenResponse = await client.linkTokenCreate(request);
    response.json(createTokenResponse.data);
  } catch (error) {
    // handle error
  }
});


app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});