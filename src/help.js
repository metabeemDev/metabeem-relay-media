import chalk from 'chalk';

const usage = `
npm run <command> included in ${ chalk.bold( process.env.npm_package_name ) }:

Usage:

npm run ${ chalk.bold( 'help' ) }\t\t\t\t\t\t- this usage page
npm run ${ chalk.bold( 'start -- --p2p_port {port} --p2p_peer_id {filename} --p2p_swarm_key {filename}' ) }\t- run relay

examples:
1) run relay on port ${ chalk.bold( 9011 ) } with peerId ${ chalk.bold( `./peers/.relay1.peerId` ) }:
# npm run start -- --p2p_port 9011 --p2p_peer_id ./peers/.relay1.peerId
`
console.log( '%s', usage );
