import express, { Express, Request, Response, NextFunction } from 'express';
import {
	Configuration,
	LinkTokenCreateRequest,
	PlaidApi,
	PlaidEnvironments,
	Products,
	CountryCode,
	ItemPublicTokenExchangeRequest,
	Transaction,
	RemovedTransaction,
	TransactionsSyncRequest
} from 'plaid';
require('dotenv').config();
const cors = require('cors');
const bodyParser = require('body-parser');
// const { v4: uuidv4 } = require('uuid');
const util = require('util');

const CLIENT_ID = process.env.PLAID_CLIENT_ID;
const SECRET = process.env.PLAID_SECRET;
const PORT = process.env.PORT || 8000;
const BASE_URL = process.env.BASE_URL;


const PLAID_PRODUCTS = (
	process.env.PLAID_PRODUCTS || Products.Transactions
).split(',');
const PLAID_COUNTRY_CODES = (process.env.PLAID_COUNTRY_CODES || 'US').split(
	','
);
const PLAID_REDIRECT_URI = process.env.PLAID_REDIRECT_URI || '';

//TODO: Set the access token instead of hardcoding from .env
let ACCESS_TOKEN = process.env.ACCESS_TOKEN;
// let ACCESS_TOKEN = '';
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

const plaid = new PlaidApi(configuration);

app.get('/', (req: Request, res: Response): void => {
	res.send('Express + TypeScript Server');
});

app.get('/create_link_token', async function (req: Request, res: Response) {
	// Get the client_user_id by searching for the current user
	console.log(`/create_link_token GET REQUEST:`);
	const products: Products[] = [Products.Auth];
	const country_codes: CountryCode[] = [CountryCode.Us];
	const request: LinkTokenCreateRequest = {
		user: {
			// This should correspond to a unique id for the current user.
			client_user_id: CLIENT_ID
		},
		client_name: 'Jack Stubblefield',
		products: products,
		language: 'en',
		country_codes: country_codes
	};
	try {
		const createTokenResponse = await plaid.linkTokenCreate(request);
		prettyPrintResponse(createTokenResponse);
		res.json(createTokenResponse.data);
	} catch (error) {
		// handle error
		res.send(error);
	}
});

app.post('/token_exchange', async (req: Request, res: Response) => {
	console.log(` token exchange body: ${JSON.stringify(req.body)}`);

	try {
		const request: ItemPublicTokenExchangeRequest = {
			public_token: req.body.public_token
		};

		console.log(`/token_exchange request: ${JSON.stringify(request)}`);

		const response = await plaid.itemPublicTokenExchange(request);
		console.log('/token_exchange response:', response.data);
		ACCESS_TOKEN = response.data.access_token;
		ITEM_ID = response.data.item_id;
		console.log(`/token_exchange ACCESS_TOKEN: ${ACCESS_TOKEN}`);
		console.log(`/token_exchange ITEM_ID: ${ITEM_ID}`);
		res.status(200).send(
			`Access Token Obtained: ${ACCESS_TOKEN}, Item_ID: ${ITEM_ID}`
		);
	} catch (err) {
		// handle error
		console.error(err);
		res.status(400).send('/token_exchange ERROR');
	}
});

app.get('/transactions/get', async (req: Request, res: Response) => {
	console.log('request recieved for transactions');
	console.log('/transactions/get token check:', ACCESS_TOKEN);

	try {
	let added: Array<Transaction> = [];
	let modified: Array<Transaction> = [];

	let removed: Array<RemovedTransaction> = [];
	let hasMore = true;

	let counter = 0
	// Iterate through each page of new transaction updates for item
	while (counter < 5) {
		const request: TransactionsSyncRequest = {
			access_token: ACCESS_TOKEN,
			options: { include_personal_finance_category: true }
		};
		const response = await plaid.transactionsSync(request);

		const data = response.data;
		// Add this page of results
		added = added.concat(data.added);
		modified = modified.concat(data.modified);
		removed = removed.concat(data.removed);
		hasMore = data.has_more;

		counter++
		// Update cursor to the next cursor
		// cursor = data.next_cursor;
		}
		
	console.log('/transactions/get after sync: ', added[0]);
	res.json(added);

	}
	catch (error) {
		res.status(500).send(error)
	}

	
});

const prettyPrintResponse = (res) => {
	console.log(util.inspect(res.data, { colors: true, depth: 4 }));
};

app.listen(PORT, () => {
	console.log(`🚀[server]: Server is running at http://localhost:${PORT}`);
});
