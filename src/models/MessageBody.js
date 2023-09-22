import { EtherWallet } from "web3id";

export class MessageBody
{
	/**
	 *	@param wallet	{string}
	 *	@param data	{any}
	 *	@param sig	{string}
	 */
	constructor({
		     wallet : wallet,
		     data : data,
		     sig : sig
	} = undefined )
	{
		this._wallet	= undefined;
		this._data	= undefined;
		this._sig	= undefined;

		this.wallet	= wallet;
		this.data	= data;
		this.sig	= sig;
	}

	/**
	 *	@param wallet	{string}
	 *	@param data	{any}
	 *	@param sig	{string}
	 *	@returns {MessageBody}
	 */
	static build({
		     wallet : wallet,
		     data : data,
		     sig : sig
	})
	{
		return new MessageBody({
			wallet : wallet,
			data : data,
			sig : sig
		});
	}

	get wallet()
	{
		return this._wallet;
	}
	set wallet( wallet )
	{
		if ( ! EtherWallet.isValidAddress( wallet ) )
		{
			return false;
		}

		this._wallet = wallet;
		return this;
	}

	get data()
	{
		return this._data;
	}
	set data( data )
	{
		this._data = data;
		return this;
	}

	get sig()
	{
		return this._sig;
	}
	set sig( sig )
	{
		if ( ! EtherWallet.isValidSignatureString( sig ) )
		{
			return false;
		}

		this._sig = sig;
		return this;
	}
}
