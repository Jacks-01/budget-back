import {auth} from "express-oauth2-jwt-bearer"
import "dotenv/config"

const jwtCheck = auth({
  audience: "http://localhost:8000", //TODO: Change to env variable
  issuerBaseURL: "https://dev-ceitl5-9.us.auth0.com/", //TODO: Change to env variable
  tokenSigningAlg: "RS256",
})

export default jwtCheck
