import express, { Express, Request, Response, NextFunction } from 'express';
import {
	Configuration,
	LinkTokenCreateRequest,
	PlaidApi,
	PlaidEnvironments,
	Products,
	CountryCode,
	ItemPublicTokenExchangeRequest
} from 'plaid';
require('dotenv').config();
const cors = require('cors');
const bodyParser = require('body-parser');
// const { v4: uuidv4 } = require('uuid');
// const util = require('util');
// const axios = require('axios');

const CLIENT_ID: string = process.env.PLAID_CLIENT_ID || '';
const SECRET = process.env.PLAID_SECRET;
const PORT = process.env.PORT;
const BASE_URL = process.env.BASE_URL;

// import { Prisma, PrismaClient } from '@prisma/client';
// const prisma = new PrismaClient();

const PLAID_PRODUCTS = (
	process.env.PLAID_PRODUCTS || Products.Transactions
).split(',');

// PLAID_COUNTRY_CODES is a comma-separated list of countries for which users
// will be able to select institutions from.
const PLAID_COUNTRY_CODES = (process.env.PLAID_COUNTRY_CODES || 'US').split(
	','
);

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
		const createTokenResponse = await client.linkTokenCreate(request);
		res.json(createTokenResponse.data);
		console.log(createTokenResponse);
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
		const response = await client.itemPublicTokenExchange(request);
		ACCESS_TOKEN = response.data.access_token;
		ITEM_ID = response.data.item_id;
		console.log(`ACCESS_TOKEN: ${ACCESS_TOKEN}`)
		console.log(`ITEM_ID: ${ITEM_ID}`)
		// res.status(200).send(`Access Token Obtained: ${ACCESS_TOKEN}`);
		res.send('noice');
	} catch (err) {
		// handle error
		console.error(err);
		res.status(400).send('/token_exchange ERROR');
	}
});

// const prettyPrintResponse = (res) => {
//   console.log(util.inspect(res.data, { colors: true, depth: 4 }));
// };

app.listen(PORT, () => {
	console.log(`🚀[server]: Server is running at http://localhost:${PORT}`);
});
