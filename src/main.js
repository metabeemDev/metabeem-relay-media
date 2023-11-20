import minimist from "minimist";
const argv = minimist( process.argv.slice( 2 ) );
import { startHttpServer } from "./http/http.js";
import { startP2pRelay } from "./relay/relay.js";

import 'dotenv/config.js'


async function runHttpServer()
{
	await startHttpServer();
}

async function runRelay()
{
	await startP2pRelay();
}

runHttpServer().then();
runRelay().then();
