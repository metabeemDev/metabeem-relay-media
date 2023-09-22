import { MessageBody } from "./MessageBody.js";

export const RpcMessageTypes = Object.freeze({
	store: 'store',
	queue: 'queue',
});
export const RpcHttpMethods = Object.freeze({
	get: 'get',
	post: 'post',
	put: 'put',
	delete: 'delete',
	patch: 'patch',
	head: 'head',
	options: 'options',
	trace: 'trace',
	connect: 'connect'
});


/**
 * 	@class RpcMessage
 */
export class RpcMessage
{
	constructor({
			type : type,
			version : version,
			service : service,
			method : method,
			body : body
	} = undefined )
	{
		this.type	= undefined;
		this.version	= undefined;
		this.service	= undefined;
		this.method	= undefined;
		this.body	= undefined;

		this.setType( type );
		this.setVersion( version );
		this.setService( service );
		this.setMethod( method );
		this.setBody( body );
	}

	static buildStore({
			   version : version,
			   service : service,
			   method : method,
			   body : body
		   })
	{
		return new RpcMessage({
			type : `store`,
			version	: version,
			service	: service,
			method : method,
			body : body
		});
	}

	getType()
	{
		return this.type;
	}
	setType( type )
	{
		if ( ! Object.values( RpcMessageTypes ).includes( type ) )
		{
			return false;
		}

		this.type = type;
		return this;
	}

	getVersion()
	{
		return this.version;
	}
	setVersion( version )
	{
		this.version = version;
		return this;
	}

	getService()
	{
		return this.service;
	}
	setService( service )
	{
		this.service = service;
		return this;
	}

	getMethod()
	{
		return this.method;
	}
	setMethod( method )
	{
		this.method = method;
		return this;
	}

	getBody()
	{
		return this.body;
	}
	setBody( body )
	{
		if ( ! ( body instanceof MessageBody ) )
		{
			return false;
		}

		this.body = body;
		return this;
	}
}
