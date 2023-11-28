import { ParamUtils } from "../../utils/ParamUtils.js";
import { ChPubService, ChSubService } from "denetwork-queue";
import _ from "lodash";

/**
 * 	@class
 */
export class HttpRequestPool
{
	requestPoolName = `http-request-pool`;
	chPub;
	chSub;

	constructor()
	{
	}

	/**
	 * 	@returns {boolean}
	 */
	init()
	{
		if ( this.chSub || this.chPub )
		{
			return true;
		}

		//
		//	create redis pool for received HTTP requests that been broadcast from other peers
		//
		const redisOptions = ParamUtils.getRedisOptions();
		console.log( `redisOptions :`, redisOptions );

		this.chPub = new ChPubService( redisOptions.port, redisOptions.host, {
			port : redisOptions.port,
			host : redisOptions.host,
			username : redisOptions.username,
			password : redisOptions.password,
			db : redisOptions.db
		} );
		this.chSub = new ChSubService( redisOptions.port, redisOptions.host, {
			port : redisOptions.port,
			host : redisOptions.host,
			username : redisOptions.username,
			password : redisOptions.password,
			db : redisOptions.db
		} );

		//
		//	process the HTTP request pool
		//
		this.chSub.subscribe( this.requestPoolName, ( channel, message ) =>
		{
			console.log( `))) received message from channel [${channel}] : `, message );

			//	TODO
			//	send http request to local http server

		}, { parseJSON : true } );

		//	...
		return true;
	}

	/**
	 *	@return {boolean}
	 */
	isInitialized()
	{
		return ( !! this.chPub ) && ( !! this.chSub );
	}

	/**
	 * 	push http request to redis pool
	 *	@param request	{ object | string }
	 *	@returns {Promise<boolean>}
	 */
	push( request )
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				if ( ! this.chPub )
				{
					return reject( `${ this.constructor.name }.pushRequest :: not initialized` );
				}
				if ( ! _.isObject( request ) || _.isEmpty( request ) )
				{
					return reject( `${ this.constructor.name }.pushRequest :: invalid request` );
				}

				const result = await this.chPub.publish( this.requestPoolName, request );
				resolve( result );
			}
			catch ( err )
			{
				reject( err );
			}
		});
	}
}
