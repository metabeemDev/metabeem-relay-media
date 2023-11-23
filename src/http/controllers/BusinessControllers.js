import { NetworkUtil } from "../../utils/NetworkUtil.js";
import { BusinessControllerPromises } from "./BusinessControllerPromises.js";
import { TestUtil } from "denetwork-utils";

/**
 * 	@class BusinessControllers
 */
export class BusinessControllers
{
	static async all( serviceName, methodName, req, res )
	{
		try
		{
			if ( ! TestUtil.isTestEnv() )
			{
				console.log( `BusinessControllers : [${ serviceName }].[${ methodName }]` );
			}

			const result = await BusinessControllerPromises.process( serviceName, methodName, req, res );
			res.send( NetworkUtil.getResponseObject( result ) );
		}
		catch ( err )
		{
			res.status( 400 ).send( NetworkUtil.getResponseObject( null, { error : err } ) );
		}
	}
}
