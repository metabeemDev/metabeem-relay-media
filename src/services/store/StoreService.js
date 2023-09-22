import { RpcMessage } from "../../models/RpcMessage.js";
import {
	setDatabaseUrl,
	CommentService,
	ContactService,
	FavoriteService,
	FollowerService,
	LikeService,
	PostService, ProfileService
} from "chaintalk-store";
import { ServiceUtil } from "chaintalk-store";
import { TypeUtil } from "chaintalk-utils";
import { MessageBody } from "../../models/MessageBody.js";

import 'dotenv/config.js'


/**
 * 	@class StoreService
 */
export class StoreService
{
	constructor()
	{
		this.setup();
	}


	/**
	 * 	@returns {void}
	 */
	setup()
	{
		const databaseUrl = process.env.STORE_DATABASE_URL;
		if ( TypeUtil.isNotEmptyString( databaseUrl ) )
		{
			setDatabaseUrl( databaseUrl );
		}
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
				if ( 'store' !== rpcMessage.type )
				{
					return reject( `invalid rpcMessage.type, not store` );
				}
				if ( ! TypeUtil.isNotEmptyString( rpcMessage.service ) )
				{
					return reject( `invalid rpcMessage.service` );
				}
				if ( ! ServiceUtil.getWeb3StoreMethodNames().includes( rpcMessage.method ) )
				{
					return reject( `invalid rpcMessage.method` );
				}
				if ( ! ( rpcMessage.body instanceof MessageBody ) )
				{
					return reject( `invalid rpcMessage.body` );
				}

				let serviceObj = null;
				switch ( rpcMessage.service )
				{
					case 'comment' :
						serviceObj = new CommentService();
						break;
					case 'contact' :
						serviceObj = new ContactService();
						break;
					case 'favorite' :
						serviceObj = new FavoriteService();
						break;
					case 'follower' :
						serviceObj = new FollowerService();
						break;
					case 'like' :
						serviceObj = new LikeService();
						break;
					case 'post' :
						serviceObj = new PostService();
						break;
					case 'profile' :
						serviceObj = new ProfileService();
						break;
				}
				if ( serviceObj )
				{
					const serviceResult = await serviceObj[ rpcMessage.method ]
					(
						rpcMessage.body.wallet,
						rpcMessage.body.data,
						rpcMessage.body.sig
					);
					return resolve( serviceResult );
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
