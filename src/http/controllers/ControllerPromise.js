import { TypeUtil } from "denetwork-utils";
import { EtherWallet } from "web3id";
import { RpcMessage } from "../../models/RpcMessage.js";
import { MessageBody } from "../../models/MessageBody.js";
import { TransferService } from "../../services/TransferService.js";


const transferService = new TransferService();


export class ControllerPromise
{
	static process( serviceName, methodName, req, res )
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				if ( ! TypeUtil.isNotEmptyString( serviceName ) )
				{
					return reject( `invalid serviceName` );
				}
				if ( ! TypeUtil.isNotEmptyString( methodName ) )
				{
					return reject( `invalid methodName` );
				}
				if ( ! TypeUtil.isNotNullObjectWithKeys( req, [ 'body' ] ) )
				{
					return reject( `invalid body` );
				}
				if ( ! TypeUtil.isNotNullObjectWithKeys( req.body, [ 'wallet', 'data', 'sig' ] ) )
				{
					return reject( `invalid parameters` );
				}
				if ( ! EtherWallet.isValidAddress( req.body.wallet ) )
				{
					return reject( `invalid wallet` );
				}

				//	...
				const rpcMessage = RpcMessage.buildStore({
					version	: `1.0.0`,
					service	: serviceName,
					method : methodName,
					body : MessageBody.build({
						wallet : req.body.wallet,
						data : req.body.data,
						sig : req.body.sig
					})
				});
				const result = await transferService.execute( rpcMessage );
				resolve( result );
			}
			catch ( err )
			{
				reject( err );
			}
		});
	}
}
