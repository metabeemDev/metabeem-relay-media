import _ from "lodash";

/**
 * 	@class NetworkUtil
 */
export class NetworkUtil
{
	/**
	 *	get response object
	 *
	 *	@param	data		{object}
	 *	@param	options		{object}
	 *	@return	{{version: number, data: *}}
	 */
	static getResponseObject( data, options = undefined )
	{
		let error = null;
		if ( _.isObject( options ) )
		{
			if ( _.isObject( options.error ) &&
				_.has( options.error, 'message' ) &&
				_.isString( options.error.message ) )
			{
				error = options.error.message;
			}
			else if ( _.isString( options.error ) )
			{
				error = options.error;
			}
			else
			{
				error = JSON.stringify( options.error );
			}
		}

		return {
			version	: 1.0,					//	version
			ts	: new Date().getTime(),			//	timestamp UTC
			tu	: ( options && options.tu ) ? options.tu : 0,		//	time used
			error	: error,	//	error description
			data	: data,				//	data
		};
	}
}
