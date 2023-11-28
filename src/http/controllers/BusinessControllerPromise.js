import { TestUtil, TypeUtil } from "denetwork-utils";
import { RpcMessage } from "../../models/RpcMessage.js";
import { MessageBody } from "../../models/MessageBody.js";
import { TransferService } from "../../services/TransferService.js";
import _ from "lodash";


const transferService = new TransferService();


/**
 * 	@class
 */
export class BusinessControllerPromise
{
	static getServiceNames()
	{
		return [ 'comment', 'contact', 'favorite', 'follower', 'like', 'post', 'profile', 'portal' ];
	}

	static getServiceMethods()
	{
		return [ 'add', 'update', 'updateFor', 'delete', 'queryOne', 'queryList' ];
	}

	static isUpdateMethod( serviceMethod )
	{
		return _.isString( serviceMethod ) &&
		       [ 'add', 'update', 'updateFor', 'delete' ].includes( serviceMethod );
	}

	static process( param, req, res )
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				if ( ! param )
				{
					return reject( `BusinessControllerPromise:process :: invalid param` );
				}
				if ( ! TypeUtil.isNotEmptyString( param.serviceName ) )
				{
					return reject( `BusinessControllerPromise:process :: invalid param.serviceName` );
				}
				if ( ! TypeUtil.isNotEmptyString( param.serviceMethod ) )
				{
					return reject( `BusinessControllerPromise:process :: invalid param.serviceMethod` );
				}
				if ( ! TypeUtil.isNotNullObjectWithKeys( req, [ 'body' ] ) )
				{
					return reject( `BusinessControllerPromise:process :: invalid body` );
				}
				if ( ! TypeUtil.isNotNullObjectWithKeys( req.body, [ 'wallet', 'data' ] ) )
				{
					return reject( `BusinessControllerPromise:process :: invalid parameters` );
				}
				// if ( ! EtherWallet.isValidAddress( req.body.wallet ) )
				// {
				// 	return reject( `BusinessControllerPromise:process :: invalid wallet` );
				// }

				//	...
				const rpcMessage = RpcMessage.buildStore({
					version : `1.0.0`,
					httpMethod : param.httpMethod,
					serviceName : param.serviceName,
					serviceMethod : param.serviceMethod,
					body : MessageBody.build( {
						wallet : req.body.wallet,
						data : req.body.data,
						sig : req.body.sig
					})
				});
				const result = await transferService.execute( rpcMessage );

				//
				//	broadcast user requests except for local requests
				//	to others Media-Relay over p2p network,
				//
				if ( ! TestUtil.isTestEnv() )
				{
					if ( this.isUpdateMethod( param.serviceMethod ) )
					{
						await param.app.p2pRelay.publish( rpcMessage );
					}
				}

				//	...
				resolve( result );
			}
			catch ( err )
			{
				reject( err );
			}
		});
	}
}
