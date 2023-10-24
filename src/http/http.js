import express from "express";
import { appRoutes } from './httpRoutes.js';
import { TestUtil } from "chaintalk-utils";
import { ParamUtils } from "../utils/ParamUtils.js";

const http = express();
const port = ParamUtils.getHttpPort();
let listenServer = null;

export function runApp()
{
	console.log( `process.env :`, process.env );

	/**
	 *	configurations
	 */
	http.disable( 'x-powered-by' );
	http.use( express.static( 'public' ) );	//	static files
	http.use( express.json() );
	http.use( express.urlencoded( { extended : true } ) );

	//	...
	appRoutes( http );

	//	...
	listenServer = http.listen( port, () =>
	{
		if ( TestUtil.isTestEnv() )
		{
			return false;
		}
		console.log( `))) Metabeem Relay listening on port ${ port }!` );
	} );


	//
	//	in case of an error
	//
	http.on( 'error', ( appErr, appCtx ) =>
	{
		console.error( 'app error', appErr.stack );
		console.error( 'on url', appCtx.req.url );
		console.error( 'with headers', appCtx.req.headers );
	} );

	return listenServer;
}

export const app = http;
