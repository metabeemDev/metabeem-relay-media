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
		this._type	= undefined;
		this._version	= undefined;
		this._service	= undefined;
		this._method	= undefined;
		this._body	= undefined;

		this.type	= type;
		this.version	= version;
		this.service	= service;
		this.method	= method;
		this.body	= body;
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

	get type()
	{
		return this._type;
	}
	set type( type )
	{
		if ( ! Object.values( RpcMessageTypes ).includes( type ) )
		{
			return false;
		}

		this._type = type;
		return this;
	}

	get version()
	{
		return this._version;
	}
	set version( version )
	{
		this._version = version;
		return this;
	}

	get service()
	{
		return this._service;
	}
	set service( service )
	{
		this._service = service;
		return this;
	}

	get method()
	{
		return this._method;
	}
	set method( method )
	{
		this._method = method;
		return this;
	}

	get body()
	{
		return this._body;
	}
	set body( body )
	{
		if ( ! ( body instanceof MessageBody ) )
		{
			return false;
		}

		this._body = body;
		return this;
	}
}
