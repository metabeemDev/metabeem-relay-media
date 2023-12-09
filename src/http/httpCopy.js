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
	http.p2pRelay.p2pMediaPackagePool.subscribe( ( /** @type {string} **/ channel, /** @type {string} **/ message, /** @type {any} **/ options ) =>
	{
		console.log( `%%%%%% received a message from messageRequestPool :`, channel, message, options );
		if ( _.isObject( message ) &&
		     _.isObject( message.body ) &&
		     _.isObject( message.body.data ) )
		{
			console.log( `%%%%%% will resend the http request :`, message.body.data );
			//chatServer.sendMessageToRoom( message.body.data );
			//	TODO
			//	resend the http package
		}
		else
		{
			console.log( `%%%%%% message is not an object :`, message );
		}
	});
}
