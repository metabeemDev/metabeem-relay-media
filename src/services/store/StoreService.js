import { RpcMessage } from "../../models/RpcMessage.js";
import {
	getDatabaseUrl,
	setDatabaseUrl,
	CommentService,
	ContactService,
	FavoriteService,
	FollowerService,
	LikeService,
	PostService,
	ProfileService,
	PortalService,
} from "denetwork-store";
import { ServiceUtil } from "denetwork-store";
import { TestUtil, TypeUtil } from "denetwork-utils";
import { MessageBody } from "../../models/MessageBody.js";

import 'deyml/config';


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
		if ( ! TestUtil.isTestEnv() )
		{
			console.log( `will setup database config ...` )
		}
		const databaseUrl = process.env.STORE_DATABASE_URL;
		if ( TypeUtil.isNotEmptyString( databaseUrl ) )
		{
			setDatabaseUrl( databaseUrl );
			if ( ! TestUtil.isTestEnv() )
			{
				console.log( `setup databaseUrl to: `, getDatabaseUrl() );
			}
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
				if ( ! TypeUtil.isNotEmptyString( rpcMessage.serviceName ) )
				{
					return reject( `invalid rpcMessage.serviceName` );
				}
				if ( ! ServiceUtil.getWeb3StoreMethodNames().includes( rpcMessage.serviceMethod ) )
				{
					return reject( `invalid rpcMessage.serviceMethod` );
				}
				if ( ! ( rpcMessage.body instanceof MessageBody ) )
				{
					return reject( `invalid rpcMessage.body` );
				}

				if ( ! TestUtil.isTestEnv() )
				{
					console.log( `execute rpcMessage :`, rpcMessage );
				}

				let serviceObj = null;
				switch ( rpcMessage.serviceName )
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
					case 'portal' :
						serviceObj = new PortalService();
						break;
				}
				if ( serviceObj )
				{
					const serviceResult = await serviceObj[ rpcMessage.serviceMethod ]
					(
						rpcMessage.body.wallet,
						rpcMessage.body.data,
						rpcMessage.body.sig
					);

					if ( ! TestUtil.isTestEnv() )
					{
						console.log( `execute serviceResult :`, serviceResult );
					}

					return resolve( serviceResult );
				}

				//	...
				resolve( null );
			}
			catch ( err )
			{
				if ( ! TestUtil.isTestEnv() )
				{
					console.log( `###### ${ this.constructor.name }.execute :`, err );
				}
				reject( err );
			}
		});
	}
}
