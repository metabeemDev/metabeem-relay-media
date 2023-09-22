import express from "express";
import { appRoutes } from './httpRoutes.js';

const http = express();
const port = process.env.HTTP_PORT;
let listenServer = null;

export function runHttpServer()
{
	/**
	 *	configurations
	 */
	http.disable( 'x-powered-by' );
	http.use( express.static( 'public' ) );	//	static files
	http.use( express.json() );
	http.use( express.urlencoded() );


	//	...
	appRoutes( http );

	//	...
	listenServer = http.listen( port, () => console.log( `))) Metabeem Relay listening on port ${ port }!` ) );


	//
	//	in case of an error
	//
	http.on( 'error', ( appErr, appCtx ) =>
	{
		console.error( 'app error', appErr.stack );
		console.error( 'on url', appCtx.req.url );
		console.error( 'with headers', appCtx.req.headers );
	});

	return listenServer;
}

export const app = http;
