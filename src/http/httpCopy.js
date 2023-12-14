import { HttpUtil } from "denetwork-utils";
import denetwork_utils from "denetwork-utils";
import _ from "lodash";
const { HttpUtilOptions } = denetwork_utils;

/**
 *	http copy
 *
 *	@param	http 		{Express}
 *	@param	http.p2pRelay	{MediaP2pRelay}
 */
export function httpCopy( http )
{
	if ( ! http )
	{
		throw Error( `httpCopy :: invalid http` );
	}
	if ( ! http.p2pRelay )
	{
		throw Error( `httpCopy :: invalid http.p2pRelay` );
	}
	if ( ! http.p2pRelay.p2pMediaPackagePool )
	{
		throw Error( `httpCopy :: invalid http.p2pRelay.p2pMediaPackagePool` );
	}

	/**
	 * 	subscribe to broadcasts from the p2p network and
	 * 	resend to the http request locally
	 */
	http.p2pRelay.p2pMediaPackagePool.subscribe( async ( /** @type {string} **/ channel, /** @type {string} **/ message, /** @type {any} **/ options ) =>
	{
		console.log( `%%%%%% received a message from messageRequestPool :`, channel, message, options );
		if ( _.isObject( message ) &&
		     _.isObject( message.body ) &&
		     _.isObject( message.body.data ) )
		{
			console.log( `%%%%%% will resend the http request :`, message.body.data );

			/**
			 * 	@type {RpcMessage}
			 */
			const rpcMessage = message.body.data;

			/**
			 *	@type { HttpUtilOptions }
			 */
			const httpOptions = {
				url : `http://127.0.0.1${ rpcMessage.httpPath }`,
				method : rpcMessage.httpMethod,
				data : rpcMessage.body,
			}
			const response = await HttpUtil.request( httpOptions );
			console.log( `%%%%%% http.p2pRelay.p2pMediaPackagePool.subscribe response :`, response );
		}
		else
		{
			console.log( `%%%%%% message is not an object :`, message );
		}
	});
}
