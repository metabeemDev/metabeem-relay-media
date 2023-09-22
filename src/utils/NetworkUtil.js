/**
 * 	@class NetworkUtil
 */
export class NetworkUtil
{
	/**
	 *	get response object
	 *
	 *	@param	{object}	oData
	 *	@param	{object}	oOptions
	 *	@return	{{version: number, data: *}}
	 */
	static getResponseObject( oData, oOptions = undefined )
	{
		return {
			version	: 1.0,					//	version
			ts	: new Date().getTime(),			//	timestamp UTC
			tu	: ( oOptions && oOptions.tu ) ? oOptions.tu : 0,		//	time used
			error	: ( oOptions && oOptions.error ) ? oOptions.error : null,	//	error description
			data	: oData,				//	data
		};
	}
}
