import minimist from "minimist";
import _ from "lodash";

const argv = minimist( process.argv.slice( 2 ) );


export class ParamUtils
{
	static getHttpPort()
	{
		if ( this.isValidPortNumber( argv.port ) )
		{
			return argv.port;
		}
		if ( this.isValidPortNumber( process.env.PORT ) )
		{
			return process.env.PORT;
		}

		return this.getDefaultHttpPort();
	}

	static getDefaultHttpPort()
	{
		return 6612;
	}

	static isValidPortNumber( port )
	{
		return _.isInteger( port ) && port > 80 && port <= 65535;
	}


	static getPeers()
	{
		//	http://localhost:1212,http://localhost:1213,http://localhost:1214
		const peerArg = argv.peers || process.env.PEERS;
		if ( ! _.isString( peerArg ) || _.isEmpty( peerArg ) )
		{
			return [];
		}

		//	...
		let peers = [];
		const peerList = peerArg.split( ',' );
		for ( let peer of peerList )
		{
			if ( peer.endsWith( '/' ) )
			{
				peer = peer.slice( 0, -1 );
			}
			peer = peer.trim();
			if ( _.isEmpty( peer ) )
			{
				continue;
			}

			//	...
			peers.push( `${ peer }/gun` );
		}

		return peers;
	}
}
