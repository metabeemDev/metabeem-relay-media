import { TypeUtil } from "chaintalk-utils";
import { NetworkUtil } from "../../utils/NetworkUtil.js";
import { TransferService } from "../../services/TransferService.js";
import { RpcMessage } from "../../models/RpcMessage.js";
import { MessageBody } from "../../models/MessageBody.js";
import { EtherWallet } from "web3id";

const transferService = new TransferService();


export class ContactController
{
	static async add( req, res )
	{
		try
		{
			const result = await ContactControllerPromise.add( req, res );
			res.send( NetworkUtil.getResponseObject( result ) );
		}
		catch ( err )
		{
			res.send( NetworkUtil.getResponseObject( null, { error : err } ) );
		}
	}
}

export class ContactControllerPromise
{
	static add( req, res )
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
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
				if ( ! EtherWallet.isValidSignatureString( req.body.sig ) )
				{
					return reject( `invalid sig` );
				}

				//	...
				const rpcMessage = RpcMessage.buildStore({
					version	: `1.0.0`,
					service	: `contact`,
					method : `add`,
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
