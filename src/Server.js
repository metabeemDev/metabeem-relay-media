import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from "socket.io";

import { appRoutes } from './http/httpRoutes.js';
import { TestUtil } from "denetwork-utils";
import { ParamUtils } from "./utils/ParamUtils.js";

//	...
const expressServer = express();
const httpServer = http.createServer( expressServer );
const socketServerOptions = {
	cors: {
		origin: "*",
		credentials: true
	}
};
const ioServer = new SocketIOServer( httpServer, socketServerOptions );


/**
 *	@returns {Promise<http.Server>}
 */
export function startServer()
{
	return new Promise( async ( resolve, reject ) =>
	{
		try
		{
			if ( ! TestUtil.isTestEnv() )
			{
				console.log( `process.env :`, process.env );
			}

			//	read port
			const port = ParamUtils.getHttpPort();

			/**
			 *	configurations
			 */
			expressServer.disable( 'x-powered-by' );
			expressServer.use( express.static( 'public' ) );	//	static files
			expressServer.use( express.json() );
			expressServer.use( express.urlencoded( { extended : true } ) );

			//	...
			appRoutes( expressServer );

			//	...
			const listenServer = httpServer.listen( port, () =>
			{
				if ( TestUtil.isTestEnv() )
				{
					return false;
				}

				/**
				 *	@typedef {import('net').AddressInfo} AddressInfo
				 *	@type {AddressInfo}
				 */
				const address = httpServer.address();
				//const host = address.address;
				const port = address.port;

				console.log( `))) Metabeem Server listening on port ${ port }` );
			} );

			//
			//	HTTP events
			//
			expressServer.on( 'error', ( appErr, appCtx ) =>
			{
				console.error( 'app error', appErr.stack );
				console.error( 'on url', appCtx.req.url );
				console.error( 'with headers', appCtx.req.headers );
			} );

			//
			//	WebSocket events
			//
			ioServer.on( 'connection', ( socket ) =>
			{
				console.log( 'Client connected to the WebSocket' );
				socket.emit( "hello", "Your are welcome!" );

				socket.on( 'disconnect', ( reason ) =>
				{
					console.log( `Client disconnected : ${ reason }` );
				} );
				socket.on( 'message', ( msg ) =>
				{
					console.log( `Received a chat message :`, msg );
					ioServer.emit( 'message', msg );
				} );
			} );

			//	...
			resolve( listenServer );
		}
		catch ( err )
		{
			reject( err );
		}
	} );
}

export const app = expressServer;
