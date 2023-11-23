import cors from 'cors';
import { BusinessControllers } from "./controllers/BusinessControllers.js";
import { IndexController } from "./controllers/IndexController.js";
import { PortalController } from "./controllers/PortalController.js";

const g_arrCorsWhitelist	= [
	'http://127.0.0.1:3009',
	'http://longforbitcoin.com',
	'https://longforbitcoin.com',
	'http://www.longforbitcoin.com',
	'https://www.longforbitcoin.com',
];
const g_oCorsOptions=
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
	//app.options( '*', cors( g_oCorsOptions ) );	//	include before other routes
	//app.use( cors( g_oCorsOptions ) );
	app.use( cors() );	//	allow all


	//
	//	index
	//
	app.get( '/', IndexController.index );
	app.post( '/', IndexController.index );

	// //
	// //	portal
	// //
	// const portalMethods = [ 'queryRecommendedPostList', 'queryFolloweePostList' ];
	// for ( const method of portalMethods )
	// {
	// 	const service = PortalController.serviceName;
	// 	app.post( `/v1/${ service }/${ method }`, BusinessControllers.all.bind(null, service, method ) );
	// }

	//
	//	businesses
	//
	const serviceNames = [ 'comment', 'contact', 'favorite', 'follower', 'like', 'post', 'profile', 'portal' ];
	const methodNames = [ 'add', 'update', 'updateFor', 'delete', 'queryOne', 'queryList' ];
	for ( const service of serviceNames )
	{
		for ( const method of methodNames )
		{
			app.post( `/v1/${ service }/${ method }`, BusinessControllers.all.bind(null, service, method ) );
		}
	}

	// //
	// //	comment
	// //
	// app.post( '/v1/comment/add', BusinessControllers.all.bind(null, 'comment', 'add' ) );
	// app.post( '/v1/comment/update', BusinessControllers.all.bind(null, 'comment', 'update' ) );
	// app.post( '/v1/comment/updateFor', BusinessControllers.all.bind(null, 'comment', 'updateFor' ) );
	// app.post( '/v1/comment/delete', BusinessControllers.all.bind(null, 'comment', 'delete' ) );
	// app.post( '/v1/comment/queryOne', BusinessControllers.all.bind(null, 'comment', 'queryOne' ) );
	// app.post( '/v1/comment/queryList', BusinessControllers.all.bind(null, 'comment', 'queryList' ) );
	//
	// //
	// //	contact
	// //
	// app.post( '/v1/contact/add', BusinessControllers.all.bind(null, 'contact', 'add' ) );
	// app.post( '/v1/contact/update', BusinessControllers.all.bind(null, 'contact', 'update' ) );
	// app.post( '/v1/contact/updateFor', BusinessControllers.all.bind(null, 'contact', 'updateFor' ) );
	// app.post( '/v1/contact/delete', BusinessControllers.all.bind(null, 'contact', 'delete' ) );
	// app.post( '/v1/contact/queryOne', BusinessControllers.all.bind(null, 'contact', 'queryOne' ) );
	// app.post( '/v1/contact/queryList', BusinessControllers.all.bind(null, 'contact', 'queryList' ) );
	//
	// //
	// //	favorite
	// //
	// app.post( '/v1/favorite/add', BusinessControllers.all.bind(null, 'favorite', 'add' ) );
	// app.post( '/v1/favorite/update', BusinessControllers.all.bind(null, 'favorite', 'update' ) );
	// app.post( '/v1/favorite/updateFor', BusinessControllers.all.bind(null, 'favorite', 'updateFor' ) );
	// app.post( '/v1/favorite/delete', BusinessControllers.all.bind(null, 'favorite', 'delete' ) );
	// app.post( '/v1/favorite/queryOne', BusinessControllers.all.bind(null, 'favorite', 'queryOne' ) );
	// app.post( '/v1/favorite/queryList', BusinessControllers.all.bind(null, 'favorite', 'queryList' ) );
	//
	// //
	// //	follower
	// //
	// app.post( '/v1/follower/add', BusinessControllers.all.bind(null, 'follower', 'add' ) );
	// app.post( '/v1/follower/update', BusinessControllers.all.bind(null, 'follower', 'update' ) );
	// app.post( '/v1/follower/updateFor', BusinessControllers.all.bind(null, 'follower', 'updateFor' ) );
	// app.post( '/v1/follower/delete', BusinessControllers.all.bind(null, 'follower', 'delete' ) );
	// app.post( '/v1/follower/queryOne', BusinessControllers.all.bind(null, 'follower', 'queryOne' ) );
	// app.post( '/v1/follower/queryList', BusinessControllers.all.bind(null, 'follower', 'queryList' ) );
	//
	// //
	// //	like
	// //
	// app.post( '/v1/like/add', BusinessControllers.all.bind(null, 'like', 'add' ) );
	// app.post( '/v1/like/update', BusinessControllers.all.bind(null, 'like', 'update' ) );
	// app.post( '/v1/like/updateFor', BusinessControllers.all.bind(null, 'like', 'updateFor' ) );
	// app.post( '/v1/like/delete', BusinessControllers.all.bind(null, 'like', 'delete' ) );
	// app.post( '/v1/like/queryOne', BusinessControllers.all.bind(null, 'like', 'queryOne' ) );
	// app.post( '/v1/like/queryList', BusinessControllers.all.bind(null, 'like', 'queryList' ) );
	//
	// //
	// //	post
	// //
	// app.post( '/v1/post/add', BusinessControllers.all.bind(null, 'post', 'add' ) );
	// app.post( '/v1/post/update', BusinessControllers.all.bind(null, 'post', 'update' ) );
	// app.post( '/v1/post/updateFor', BusinessControllers.all.bind(null, 'post', 'updateFor' ) );
	// app.post( '/v1/post/delete', BusinessControllers.all.bind(null, 'post', 'delete' ) );
	// app.post( '/v1/post/queryOne', BusinessControllers.all.bind(null, 'post', 'queryOne' ) );
	// app.post( '/v1/post/queryList', BusinessControllers.all.bind(null, 'post', 'queryList' ) );
	//
	// //
	// //	profile
	// //
	// app.post( '/v1/profile/add', BusinessControllers.all.bind(null, 'profile', 'add' ) );
	// app.post( '/v1/profile/update', BusinessControllers.all.bind(null, 'profile', 'update' ) );
	// app.post( '/v1/profile/updateFor', BusinessControllers.all.bind(null, 'profile', 'updateFor' ) );
	// app.post( '/v1/profile/delete', BusinessControllers.all.bind(null, 'profile', 'delete' ) );
	// app.post( '/v1/profile/queryOne', BusinessControllers.all.bind(null, 'profile', 'queryOne' ) );
	// app.post( '/v1/profile/queryList', BusinessControllers.all.bind(null, 'profile', 'queryList' ) );
}
