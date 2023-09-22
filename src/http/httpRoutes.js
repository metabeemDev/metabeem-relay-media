import express from "express";
import cors from 'cors';
import { ContactController } from "./controllers/ContactController.js";
import { IndexController } from "./controllers/IndexController.js";

const g_arrCorsWhitelist	= [
	'http://127.0.0.1:3009',
	'http://longforbitcoin.com',
	'https://longforbitcoin.com',
	'http://www.longforbitcoin.com',
	'https://www.longforbitcoin.com',
];
const g_oCorsOptions		=
{
	credentials	: true,
	origin		: ( sOrigin, pfnCallback ) =>
	{
		if ( undefined === sOrigin ||
			-1 !== g_arrCorsWhitelist.indexOf( sOrigin ) )
		{
			pfnCallback( null, true );
		}
		else
		{
			pfnCallback( new Error( 'Not allowed by CORS' ) );
		}
	}
};



/**
 *	routes
 *
 *	@param	app 		{Express}
 *	@param	app.use		{function}
 *	@param	app.all		{function}
 */
export function appRoutes( app )
{
	//	enable CORS Pre-Flight for all routers
	app.options( '*', cors( g_oCorsOptions ) );	//	include before other routes
	app.use( cors( g_oCorsOptions ) );


	//
	//	index
	//
	app.all( '/', IndexController.index );


	//
	//	contact
	//
	app.all( '/v1/contact/add', ContactController.add );
}
