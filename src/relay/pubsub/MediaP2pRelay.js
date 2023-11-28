import { BaseP2pRelay } from "./BaseP2pRelay.js";
import _ from "lodash";

import "deyml/config";


/**
 * 	@class
 */
export class MediaP2pRelay extends BaseP2pRelay
{
	constructor()
	{
		super( `sync-http-media` );
	}

	async start()
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				//
				//	start p2p relay
				//
				await super.start( ( data ) =>
				{
					if ( _.isObject( data.body ) &&
					     _.has( data.body, 'heartbeat' ) )
					{
						//	ignore heartbeat
						return false;
					}

					//
					//	save broadcast package to pool
					//
					this.httpRequestPool.push( data );
				});

				//	...
				resolve( true );
			}
			catch ( err )
			{
				reject( err );
			}
		});
	}
}
