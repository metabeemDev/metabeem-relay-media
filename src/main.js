import { startHttpServer } from "./http/http.js";
import { startP2pRelay } from "./relay/relay.js";

import 'deyml/config';


async function asyncMain()
{
	const p2pRelay = await startP2pRelay();
	await startHttpServer( p2pRelay );
}

asyncMain().then( res =>{} ).catch( err => { console.error( err ) } );
