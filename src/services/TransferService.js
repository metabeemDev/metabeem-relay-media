import { RpcMessage } from "../models/RpcMessage.js";
import { StoreService } from "./store/StoreService.js";

/**
 * 	@class TransferService
 */
export class TransferService
{
	constructor()
	{
		this._storeService = new StoreService();
	}

	/**
	 *	@param rpcMessage	{RpcMessage}
	 *	@returns {Promise<any>}
	 */
	execute( rpcMessage )
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				if ( ! ( rpcMessage instanceof RpcMessage ) )
				{
					return reject( `invalid rpcMessage` );
				}
				switch ( rpcMessage.type )
				{
					case 'store':
						const result = await this._storeService.execute( rpcMessage );
						return resolve( result );
				}

				//	...
				resolve( null );
			}
			catch ( err )
			{
				reject( err );
			}
		});
	}
}
