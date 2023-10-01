import { NetworkUtil } from "../../utils/NetworkUtil.js";
import { ControllerPromise } from "./ControllerPromise.js";

/**
 * 	@class BusinessControllers
 */
export class BusinessControllers
{
	static async all( serviceName, methodName, req, res )
	{
		try
		{
			const result = await ControllerPromise.process( serviceName, methodName, req, res );
			res.send( NetworkUtil.getResponseObject( result ) );
		}
		catch ( err )
		{
			res.status( 400 ).send( NetworkUtil.getResponseObject( null, { error : err } ) );
		}
	}
}
