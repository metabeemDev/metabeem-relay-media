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
	static getResponseObject( oData, oOptions = null )
	{
		return {
			version	: 1.0,					//	version
			ts	: new Date().getTime(),			//	timestamp UTC
			tu	: oOptions ? oOptions.tu : 0,		//	time used
			error	: oOptions ? oOptions.error : null,	//	error description
			data	: oData,				//	data
		};
	}
}
