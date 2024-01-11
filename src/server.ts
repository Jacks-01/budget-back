//* Express imports
import express, {Express, Request, Response, NextFunction} from "express";
const cors = require("cors");
const bodyParser = require("body-parser");

//* Environment variables
require("dotenv").config();
const PORT = process.env.PORT || 8000;

//* Routers
import plaidRouter from "./routes/plaid";

const app: Express = express();
app.use(
  bodyParser.urlencoded({
    extended: false,
  }),
);
app.use(bodyParser.json());
app.use(cors());

app.get("/", (req: Request, res: Response): void => {
  res.send("Express + TypeScript Server");
});

app.use("/plaid", plaidRouter);

app.listen(PORT, () => {
  console.log(`🚀[server]: Server is running at http://localhost:${PORT}`);
});
