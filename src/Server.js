import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from "socket.io";

import { appRoutes } from './http/httpRoutes.js';
import { TestUtil } from "denetwork-utils";
import { ParamUtils } from "./utils/ParamUtils.js";

import { ChatServer } from "denetwork-chat-server";

import { enable } from "@libp2p/logger";
enable( 'denetwork-chat-server:SendMessageHandler' );


//	...
const expressServer = express();
const httpServer = http.createServer( expressServer );
const socketServerOptions = {
	cors : {
		origin : "*",
		credentials : true
	}
};
const ioServer = new SocketIOServer( httpServer, socketServerOptions );

/**
 *	@type {ChatServer}
 */
let chatServer = null;



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
			const broadcastCallback = ( /** @type {string} */ serverId, /** @type {any} */ data, /** @type {any} */ options ) =>
			{
				console.log( `::broadcastCallback :`, serverId, data, options );
				return true;
			};
			chatServer = new ChatServer( ioServer, null, broadcastCallback );
			// ioServer.on( 'connection', ( socket ) =>
			// {
			// 	console.log( 'Client connected to the WebSocket' );
			// 	socket.emit( "hello", "Your are welcome!" );
			//
			// 	//	This event is similar to disconnect but is fired a bit earlier,
			// 	//	when the Socket#rooms set is not empty yet
			// 	socket.on( "disconnecting", ( reason ) =>
			// 	{
			// 		for ( const room of socket.rooms )
			// 		{
			// 			if ( room !== socket.id )
			// 			{
			// 				//	user has left
			// 				socket.to( room ).emit( "USER_LEFT", socket.id );
			// 			}
			// 		}
			// 	} );
			// 	socket.on( 'disconnect', ( reason ) =>
			// 	{
			// 		console.log( `Client disconnected : ${ reason }` );
			// 	} );
			// 	socket.on( 'message', ( msg ) =>
			// 	{
			// 		console.log( `Received a chat message :`, msg );
			// 		ioServer.emit( 'message', msg );
			// 	} );
			// } );

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
