import express, { Express, Request, Response, NextFunction } from 'express';
import {
	Configuration,
	LinkTokenCreateRequest,
	PlaidApi,
	PlaidEnvironments,
  Products,
  CountryCode
} from 'plaid';
require('dotenv').config();
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const util = require('util');
const axios = require('axios');

const CLIENT_ID: string = process.env.PLAID_CLIENT_ID || ''
const SECRET = process.env.PLAID_SECRET;
const PORT = process.env.PORT;
const BASE_URL = process.env.BASE_URL;

// PLAID_PRODUCTS is a comma-separated list of products to use when initializing
// Link. Note that this list must contain 'assets' in order for the app to be
// able to create and retrieve asset reports.
const PLAID_PRODUCTS = (
	process.env.PLAID_PRODUCTS || Products.Transactions
).split(',');

// PLAID_COUNTRY_CODES is a comma-separated list of countries for which users
// will be able to select institutions from.
const PLAID_COUNTRY_CODES = (process.env.PLAID_COUNTRY_CODES || 'US').split(
	','
);

// Parameters used for the OAuth redirect Link flow.
//
// Set PLAID_REDIRECT_URI to 'http://localhost:3000'
// The OAuth redirect flow requires an endpoint on the developer's website
// that the bank website should redirect to. You will need to configure
// this redirect URI for your client ID through the Plaid developer dashboard
// at https://dashboard.plaid.com/team/api.
const PLAID_REDIRECT_URI = process.env.PLAID_REDIRECT_URI || '';

// We store the access_token in memory - in production, store it in a secure
// persistent data store
let ACCESS_TOKEN: string | null = null;
let PUBLIC_TOKEN: string | null = null;
let ITEM_ID: string | null = null;

const configuration = new Configuration({
	basePath: PlaidEnvironments.development,
	baseOptions: {
		headers: {
			'PLAID-CLIENT-ID': CLIENT_ID,
			'PLAID-SECRET': SECRET
		}
	}
});

const app: Express = express();
app.use(
	bodyParser.urlencoded({
		extended: false
	})
);
app.use(bodyParser.json());
app.use(cors());

const client = new PlaidApi(configuration);

app.get('/', (req: Request, res: Response): void => {
	res.send('Express + TypeScript Server');
});

app.post(
	'/api/info',
	async (req: Request, res: Response, next: NextFunction) => {
		res.json({
			item_id: ITEM_ID,
			access_token: ACCESS_TOKEN,
			products: PLAID_PRODUCTS
		});
	}
);

app.get('/create_link_token', async function (req: Request, res: Response) {
  // Get the client_user_id by searching for the current user
	console.log(`GET REQUEST:`);
  const products: Products[] = [Products.Auth]
  const country_codes: CountryCode[] =  [CountryCode.Us]
  const request: LinkTokenCreateRequest = {
    user: {
      // This should correspond to a unique id for the current user.
      client_user_id: CLIENT_ID,
    },
    client_name: 'Jack Stubblefield',
    products: products,
    language: 'en',
    country_codes: country_codes,
  };
  try {
    const createTokenResponse = await client.linkTokenCreate(request);
    res.json(createTokenResponse.data);
    console.log(createTokenResponse)
  } catch (error) {
    // handle error
    res.send(error)
  }
});

// const prettyPrintResponse = (res) => {
//   console.log(util.inspect(res.data, { colors: true, depth: 4 }));
// };

app.listen(PORT, () => {
	console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});
